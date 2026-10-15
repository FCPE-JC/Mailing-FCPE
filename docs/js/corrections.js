// Mailing-FCPE : corrections d'un clic (US-016, US-017, US-019, US-030, US-031 ; EX-005, EX-006, EX-027).
//
// Chaque correction prend le modèle interne (js/pivot.js) et rend un nouveau modèle, sans
// toucher l'ancien : l'écran le réécrit ensuite au format pivot (DEC-103). Le changement
// de type suit le tableau de conversion validé par Mat (DEC-105, etape-5/lot-4/us-lot-4-v0.1.md) :
// aucun texte n'est jamais perdu, et un choix impossible est grisé avec sa raison.
//
// Un bloc est désigné par un repère écrit en texte, celui que porte l'aperçu :
// « 2.0 » (section 2, bloc 0), « 2.titre » (surtitre de la section 2), « cloture » ou
// « signature ».

import { libelleBouton, decouperDateLieu, marquerDateLieu } from './detection.js?v=1.1.0';
import { signatureDe } from './pivot.js?v=1.1.0';

// Les neuf types de la maquette, dans son ordre, puis la signature (DEC-114).
export const TYPES = Object.freeze([
  ['paragraphe', 'Paragraphe'], ['accroche', 'Accroche'], ['note', 'Note'],
  ['titre', 'Titre de section'], ['liste', 'Liste'], ['bouton', 'Bouton'],
  ['important', '⚠️ Important'], ['date', '🗓️ Date et lieu'], ['cloture', 'Clôture'],
  ['signature', 'Signature'],
]);
export const NOM_TYPE = Object.freeze(Object.fromEntries(TYPES.map(([t, nom]) => [t, nom.replace(/^\S+ (?=[A-Z])/u, '')])));

export const LONGUEUR_TITRE_MAX = 100;
const ADRESSE = /https?:\/\/[^\s<>()[\]]+/;
const LIEN_MARQUE = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/;

const cloner = doc => JSON.parse(JSON.stringify(doc));
const sansMarques = t => t.replaceAll('**', '').replace(/[\s:]+$/u, '').trim();

// Lit un repère « s.b », « s.titre » ou « cloture ».
export function lireRepere(repere) {
  if (repere === 'cloture') return { cloture: true };
  if (repere === 'signature') return { signature: true };
  const [s, b] = String(repere).split('.');
  return b === 'titre' ? { s: Number(s), titre: true } : { s: Number(s), b: Number(b) };
}

export function typeDe(doc, repere) {
  const r = lireRepere(repere);
  if (r.cloture) return 'cloture';
  if (r.signature) return 'signature';
  if (r.titre) return 'titre';
  return doc.sections[r.s].blocs[r.b].type;
}

// Le texte d'un bloc, ligne par ligne, tel qu'il passera dans un autre type.
export function lignesDe(doc, repere) {
  const r = lireRepere(repere);
  if (r.cloture) return doc.cloture ? [doc.cloture] : [];
  if (r.signature) return doc.signature ? [doc.signature.formule, ...(doc.signature.signataire || '').split('\n')].filter(Boolean) : [];
  if (r.titre) return doc.sections[r.s]?.surtitre ? [doc.sections[r.s].surtitre] : [];
  const b = doc.sections[r.s].blocs[r.b];
  switch (b.type) {
    case 'liste': return [...b.elements];
    case 'bouton': return [`${b.libelle} : ${b.adresse}`];
    case 'important': return [...(b.titre && b.titre !== 'Important' ? [`${b.titre} :`] : []), ...b.lignes];
    case 'date': return [...b.lignes];
    default: return [b.texte];
  }
}

// Une phrase par ligne : une ligne sans ponctuation finale reçoit un point.
const joindre = lignes => (lignes.length <= 1 ? (lignes[0] ?? '') : lignes.map(l => (/[.!?…:;]$/u.test(l) ? l : `${l}.`)).join(' '));
const phrases = texte => texte.split(/(?<=[.!?…])\s+/u).filter(Boolean);

// Dernier bloc avant la signature : seul candidat à la clôture.
const estDernierBloc = (doc, r) => !r.titre && !r.cloture && !r.signature && r.s === doc.sections.length - 1 && r.b === doc.sections[r.s].blocs.length - 1;
// Seul candidat à la signature (DEC-114) : la clôture, ou le dernier bloc s'il n'y en a pas.
const estDernierElement = (doc, r) => (doc.cloture ? Boolean(r.cloture) : estDernierBloc(doc, r));

// Les choix du panneau « Ce bloc est… », avec ce qui est possible et pourquoi.
export function choixPossibles(doc, repere) {
  const r = lireRepere(repere);
  const actuel = typeDe(doc, repere);
  const texte = joindre(lignesDe(doc, repere));
  return TYPES.map(([type, libelle]) => {
    let raison = null;
    if (type === actuel) raison = null;
    else if (type === 'bouton' && !ADRESSE.test(texte)) raison = 'Il faut une adresse web (https://…) dans le bloc.';
    else if (type === 'titre' && [...sansMarques(texte)].length > LONGUEUR_TITRE_MAX) raison = `Trop long pour un titre (${LONGUEUR_TITRE_MAX} caractères au plus).`;
    else if (type === 'cloture' && !(estDernierBloc(doc, r) || (r.signature && !doc.cloture))) raison = 'Seul le dernier bloc avant la signature peut devenir la clôture.';
    else if (type === 'signature' && doc.signature) raison = 'L’email a déjà une signature.';
    else if (type === 'signature' && !estDernierElement(doc, r)) raison = 'Seul le dernier bloc de l’email peut devenir la signature.';
    return { type, libelle, actuel: type === actuel, possible: raison === null, raison };
  });
}

// Fabrique les blocs d'un type à partir de lignes de texte (tableau de conversion).
function construire(type, lignes) {
  const texte = joindre(lignes);
  switch (type) {
    case 'liste': return [{ type, elements: lignes.length > 1 ? lignes : phrases(texte) }];
    case 'important': return [{ type, titre: 'Important', lignes }];
    case 'date': return [{ type, lignes: lignes.length > 1 ? marquerDateLieu(lignes) : decouperDateLieu(texte) }];
    case 'bouton': {
      // Lien déjà écrit [libellé](adresse), ou « libellé : adresse » (un bouton redevenu texte).
      const lien = texte.match(LIEN_MARQUE);
      const forme = texte.match(/^(.+?) : (https?:\/\/\S+)$/u);
      let libelle, adresse, reste;
      if (lien) [reste, libelle, adresse] = [texte.replace(lien[0], ''), lien[1], lien[2]];
      else if (forme && !ADRESSE.test(forme[1])) [reste, libelle, adresse] = ['', forme[1], forme[2]];
      else {
        adresse = texte.match(ADRESSE)[0].replace(/[.,;:!?]+$/u, '');
        [reste, libelle] = [texte.replace(adresse, ''), libelleBouton(adresse)];
      }
      reste = reste.replace(/\s+/gu, ' ').replace(/[\s:👉→➡️-]+$/u, '').trim();
      return [...(reste ? [{ type: 'paragraphe', texte: reste }] : []), { type, libelle, adresse }];
    }
    default: return [{ type, texte }];
  }
}

// Surtitre que donnerait un bloc passé en titre de section.
export const surtitreDe = (doc, repere) => sansMarques(joindre(lignesDe(doc, repere)));

// Où se trouve, après un changement de type, le bloc qu'on vient de changer : son nouveau
// repère, ou null s'il s'est fondu dans un autre bloc.
export function retrouver(avant, apres, repere, type) {
  const r = lireRepere(repere);
  if (type === 'cloture') return apres.cloture ? 'cloture' : null;
  if (type === 'signature') return apres.signature ? 'signature' : null;
  if (type === 'titre') {
    const attendu = surtitreDe(avant, repere);
    const k = apres.sections.findIndex((s, i) => s.surtitre === attendu && !(avant.sections[i]?.surtitre === attendu));
    return k >= 0 ? `${k}.titre` : null;
  }
  if (r.titre) return null;
  const candidats = r.cloture || r.signature
    ? (apres.sections.length ? [`${apres.sections.length - 1}.${apres.sections.at(-1).blocs.length - 1}`] : [])
    : [`${r.s}.${r.b}`, `${r.s}.${r.b + 1}`];
  return candidats.find(c => { const q = lireRepere(c); return apres.sections[q.s]?.blocs[q.b]?.type === type; }) ?? null;
}

// Une section vide et sans surtitre disparaît.
const nettoyer = d => { d.sections = d.sections.filter(s => s.blocs.length || s.surtitre); return d; };
const sectionVide = () => ({ pastille: null, surtitre: null, blocs: [] });

// Change le type d'un bloc (US-016).
export function changerType(doc, repere, type) {
  const choix = choixPossibles(doc, repere).find(c => c.type === type);
  if (!choix || choix.actuel || !choix.possible) return doc;
  const d = cloner(doc);
  const r = lireRepere(repere);
  const lignes = lignesDe(d, repere);

  // 1. Retirer le bloc de sa place, en notant où le nouveau se posera.
  let place;
  if (r.cloture || r.signature) {
    if (r.cloture) d.cloture = null; else d.signature = null;
    if (!d.sections.length) d.sections.push(sectionVide());
    place = { s: d.sections.length - 1, b: d.sections.at(-1).blocs.length };
  } else if (r.titre) {
    // Un titre qui n'en est plus un : sa section rejoint la précédente.
    const sec = d.sections[r.s];
    sec.surtitre = null;
    if (r.s > 0) {
      const avant = d.sections[r.s - 1];
      place = { s: r.s - 1, b: avant.blocs.length };
      avant.blocs.push(...sec.blocs);
      d.sections.splice(r.s, 1);
    } else place = { s: 0, b: 0 };
  } else {
    d.sections[r.s].blocs.splice(r.b, 1);
    place = { s: r.s, b: r.b };
  }

  // 2. Poser le bloc sous son nouveau type.
  const sec = d.sections[place.s];
  if (type === 'titre') {
    const suite = sec.blocs.splice(place.b);
    const nouvelle = { pastille: null, surtitre: sansMarques(joindre(lignes)), blocs: suite };
    if (!sec.blocs.length && !sec.surtitre) { nouvelle.pastille = sec.pastille; d.sections.splice(place.s, 1, nouvelle); }
    else d.sections.splice(place.s + 1, 0, nouvelle);
  } else if (type === 'cloture') {
    if (d.cloture) sec.blocs.push({ type: 'paragraphe', texte: d.cloture });
    d.cloture = joindre(lignes);
  } else if (type === 'signature') {
    d.signature = signatureDe(lignes);
  } else {
    sec.blocs.splice(place.b, 0, ...construire(type, lignes));
  }
  return nettoyer(d);
}

// Les blocs dont le texte se modifie dans le panneau (US-030, DEC-111) ; le titre et le
// bouton ont déjà leurs champs (surtitre, libellé).
export const TEXTE_MODIFIABLE = Object.freeze(['paragraphe', 'accroche', 'note', 'liste', 'date', 'important', 'cloture', 'signature']);

// Texte d'un bloc dans le champ « Texte du bloc » : une ligne par élément, par ligne de
// date ou d'encadré, par ligne de signature ; null pour un bloc sans ce champ.
export function texteDuBloc(doc, repere) {
  const type = typeDe(doc, repere);
  if (!TEXTE_MODIFIABLE.includes(type)) return null;
  const r = lireRepere(repere);
  if (type === 'important') return doc.sections[r.s].blocs[r.b].lignes.join('\n');
  return lignesDe(doc, repere).join('\n');
}

// Remplace le texte d'un bloc (US-030) ; un texte vidé retire le bloc. Un paragraphe, une
// accroche, une note ou la clôture tiennent sur une ligne : les retours à la ligne y
// deviennent des espaces.
export function changerTexte(doc, repere, texte) {
  const type = typeDe(doc, repere);
  if (!TEXTE_MODIFIABLE.includes(type)) return doc;
  const lignes = String(texte ?? '').split(/\r\n?|\n/).map(x => x.replace(/\s+/gu, ' ').trim()).filter(Boolean);
  const d = cloner(doc);
  const r = lireRepere(repere);
  if (r.cloture) { d.cloture = lignes.join(' ') || null; return d; }
  if (r.signature) { d.signature = signatureDe(lignes); return d; }
  const sec = d.sections[r.s];
  if (!lignes.length) { sec.blocs.splice(r.b, 1); return nettoyer(d); }
  const b = sec.blocs[r.b];
  if (type === 'liste') b.elements = lignes;
  else if (type === 'date' || type === 'important') b.lignes = lignes;
  else b.texte = lignes.join(' ');
  return d;
}

// Change la pastille d'une section (US-017).
export function changerPastille(doc, s, pastille) {
  const d = cloner(doc);
  d.sections[s].pastille = pastille;
  return d;
}

// Ajoute, change ou retire (texte vide) le surtitre d'une section (US-017).
export function changerSurtitre(doc, s, surtitre) {
  const d = cloner(doc);
  d.sections[s].surtitre = String(surtitre ?? '').replace(/\s+/gu, ' ').trim() || null;
  return nettoyer(d);
}

// Change le libellé d'un bouton ; un libellé vide reprend celui de la règle D9.
export function changerLibelle(doc, repere, libelle) {
  const d = cloner(doc);
  const r = lireRepere(repere);
  const b = d.sections[r.s].blocs[r.b];
  b.libelle = String(libelle ?? '').trim() || libelleBouton(b.adresse);
  return d;
}

// Change l'objet de l'email (US-019) ; un objet vide est retiré.
export function changerObjet(doc, objet) {
  const d = cloner(doc);
  d.objet = String(objet ?? '').replace(/\s+/gu, ' ').trim() || null;
  return d;
}
