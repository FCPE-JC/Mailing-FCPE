// Mailing-FCPE : collage du texte, aperçu continu et corrections (US-009, US-010, US-014 à
// US-020 ; EX-001, EX-003, EX-005, EX-006, EX-008, EX-019, EX-026, EX-027).
//
// L'écran Écrire reçoit le texte ; l'écran Vérifier affiche l'email rendu, mis à jour à
// chaque modification, avec l'étiquette du type de chaque bloc (US-015). Les étiquettes ne
// sont que dans l'aperçu : le code copié au lot 5 est celui de preparerApercu().html.
// Un texte qui contient la syntaxe pivot est lu tel quel ; un texte brut passe d'abord par
// la détection (principe 5 de regles-detection.md). Une correction réécrit le texte au
// format pivot dans la zone de l'écran Écrire (DEC du lot 4) ; « Annuler » revient en
// arrière correction par correction. Le texte ne vit que dans la page : rien n'est
// enregistré (DEC-071).

import { lirePivot, ecrirePivot } from './pivot.js';
import { rendreEmail } from './rendu.js';
import { CHARTE } from '../parametres/charte.js';
import { estPivot, detecterPivot, completerPastilles, PASTILLES } from './detection.js';
import { NOM_TYPE, choixPossibles, typeDe, lireRepere, retrouver, changerType, changerPastille, changerSurtitre, changerLibelle, changerObjet } from './corrections.js';
import { conseils, aideObjet, SEUILS } from './conseils.js';

// Phrase affichée sur l'écran Vérifier selon la lecture faite (US-014).
export const LECTURES = Object.freeze({
  pivot: 'Texte au format pivot, lu tel quel.',
  detection: 'Texte brut, mis en forme automatiquement.',
});

// Prépare l'aperçu d'un texte : rien si le texte est vide, sinon la lecture faite, le pivot,
// l'objet, le code de l'email (html, celui qui sera copié), l'aperçu étiqueté et les
// anomalies notées à la lecture.
export function preparerApercu(texte) {
  if (!String(texte ?? '').trim()) return { vide: true };
  const lecture = estPivot(texte) ? 'pivot' : 'detection';
  const pivot = lecture === 'pivot' ? String(texte) : detecterPivot(texte);
  // D16 : pastilles par mots-clés des sections écrites sans émoji (DEC-099).
  const doc = completerPastilles(lirePivot(pivot));
  return {
    vide: false, lecture, pivot, objet: doc.objet, doc, anomalies: doc.anomalies,
    html: rendreEmail(doc),
    htmlEtiquete: rendreEmail(doc, CHARTE, { etiquettes: NOM_TYPE }),
  };
}

// Suivi du texte et des corrections : le texte de la zone Écrire et, pour « Annuler », les
// textes d'avant chaque correction (US-020).
export const creerSuivi = (texte = '') => ({ texte, historique: [] });

// Le rédacteur tape ou colle : son texte devient la référence, il n'y a plus rien à annuler.
export const saisir = (suivi, texte) => ({ texte, historique: [] });

// Applique une correction (une fonction du modèle vers un nouveau modèle) et réécrit le texte
// au format pivot ; une correction qui ne change rien n'est pas retenue.
export function corriger(suivi, correction) {
  const apercu = preparerApercu(suivi.texte);
  if (apercu.vide) return suivi;
  const texte = ecrirePivot(correction(apercu.doc));
  if (texte === ecrirePivot(apercu.doc)) return suivi;
  return { texte, historique: [...suivi.historique, suivi.texte] };
}

export function annuler(suivi) {
  if (!suivi.historique.length) return suivi;
  return { texte: suivi.historique.at(-1), historique: suivi.historique.slice(0, -1) };
}

// Branche la zone de texte, l'aperçu et les corrections sur la page.
export function brancherApercu(fenetre) {
  const doc = fenetre.document;
  const $ = id => doc.getElementById(id);
  const zoneTexte = $('texte');
  const notePivot = $('note-pivot');
  const invitation = $('apercu-vide');
  const verification = $('verification');
  const ligneLecture = $('lecture');
  const champObjet = $('objet');
  const compteur = $('objet-compteur');
  const messagesObjet = $('objet-messages');
  const propositions = $('objet-propositions');
  const blocConseils = $('conseils');
  const titreConseils = $('conseils-titre');
  const listeConseils = $('conseils-liste');
  const boutonAnnuler = $('annuler');
  const zoneApercu = $('apercu');
  const panneau = $('panneau');

  let suivi = creerSuivi(zoneTexte.value);
  let apercu = preparerApercu(suivi.texte);
  let repereOuvert = null;

  const element = (balise, texte, classe) => {
    const e = doc.createElement(balise);
    if (texte !== undefined) e.textContent = texte;
    if (classe) e.className = classe;
    return e;
  };

  // Aide à l'objet en direct, sur la valeur du champ (US-019).
  function afficherAideObjet(valeur) {
    const aide = aideObjet(valeur, apercu.doc);
    compteur.textContent = aide.longueur ? `${aide.longueur}${aide.conseillee ? ' ✓' : ''}` : '';
    compteur.title = `${SEUILS.objetMin} à ${SEUILS.objetMax} caractères conseillés`;
    messagesObjet.replaceChildren(...aide.messages.map(m => element('li', m)));
    propositions.replaceChildren(...aide.propositions.map(p => {
      const b = element('button', `Proposition : ${p}`, 'proposition');
      b.type = 'button';
      b.addEventListener('click', () => appliquer(d => changerObjet(d, p)));
      return b;
    }));
  }

  // Anomalies et conseils (US-018) ; toucher un message mène au bloc concerné.
  function afficherConseils() {
    const liste = conseils(apercu.doc);
    blocConseils.hidden = !liste.length;
    titreConseils.textContent = `💡 ${liste.length} ${liste.length > 1 ? 'conseils' : 'conseil'}`;
    listeConseils.replaceChildren(...liste.map(c => {
      const li = element('li', undefined, c.niveau);
      if (c.cible) {
        const b = element('button', c.message, 'lien-conseil');
        b.type = 'button';
        b.addEventListener('click', () => ouvrirPanneau(c.cible));
        li.append(b);
      } else li.textContent = c.message;
      return li;
    }));
  }

  function mettreAJour() {
    apercu = preparerApercu(suivi.texte);
    invitation.hidden = !apercu.vide;
    verification.hidden = apercu.vide;
    notePivot.hidden = !suivi.historique.length;
    boutonAnnuler.disabled = !suivi.historique.length;
    if (apercu.vide) {
      zoneApercu.innerHTML = '';
      return;
    }
    ligneLecture.textContent = LECTURES[apercu.lecture];
    if (doc.activeElement !== champObjet) champObjet.value = apercu.objet || '';
    afficherAideObjet(champObjet.value);
    afficherConseils();
    // Code produit par rendreEmail : tout texte du rédacteur y est échappé (US-011).
    zoneApercu.innerHTML = apercu.htmlEtiquete;
    if (repereOuvert) remplirPanneau();
  }

  function appliquer(correction) {
    const avant = suivi;
    suivi = corriger(suivi, correction);
    if (suivi === avant) return;
    zoneTexte.value = suivi.texte;
    mettreAJour();
  }

  // Panneau « Ce bloc est… » (US-016, US-017).
  const typesPanneau = $('panneau-types');
  const raison = $('panneau-raison');
  const zoneSection = $('panneau-section');
  const pastillesPanneau = $('panneau-pastilles');
  const champSurtitre = $('panneau-surtitre');
  const conseilSurtitre = $('panneau-conseil-surtitre');
  const zoneLibelle = $('panneau-libelle-zone');
  const champLibelle = $('panneau-libelle');

  function remplirPanneau() {
    const d = apercu.doc;
    const r = lireRepere(repereOuvert);
    const existe = r.cloture ? Boolean(d.cloture) : Boolean(d.sections[r.s] && (r.titre ? d.sections[r.s].surtitre : d.sections[r.s].blocs[r.b]));
    if (!existe) { fermerPanneau(); return; }
    raison.textContent = '';
    typesPanneau.replaceChildren(...choixPossibles(d, repereOuvert).map(c => {
      const b = element('button', c.libelle, 'choix-type');
      b.type = 'button';
      b.setAttribute('aria-pressed', String(c.actuel));
      if (!c.possible) { b.setAttribute('aria-disabled', 'true'); b.title = c.raison; }
      b.addEventListener('click', () => {
        if (!c.possible) { raison.textContent = c.raison; return; }
        const avant = apercu.doc;
        const repere = repereOuvert;
        // Pendant la correction, le panneau ne se remplit pas sur l'ancien repère, qui peut
        // ne plus exister (un bloc devenu titre ouvre une nouvelle section).
        repereOuvert = null;
        appliquer(m => changerType(m, repere, c.type));
        // Le panneau suit le bloc changé ; s'il s'est fondu dans un autre, il se ferme.
        repereOuvert = retrouver(avant, apercu.doc, repere, c.type);
        if (repereOuvert) remplirPanneau(); else fermerPanneau();
      });
      return b;
    }));
    zoneLibelle.hidden = typeDe(d, repereOuvert) !== 'bouton';
    if (!zoneLibelle.hidden && doc.activeElement !== champLibelle) champLibelle.value = d.sections[r.s].blocs[r.b].libelle;
    zoneSection.hidden = Boolean(r.cloture);
    if (r.cloture) return;
    const section = d.sections[r.s];
    const choix = PASTILLES.includes(section.pastille) ? PASTILLES : [...PASTILLES, section.pastille];
    pastillesPanneau.replaceChildren(...choix.map(p => {
      const b = element('button', p, 'choix-pastille');
      b.type = 'button';
      b.setAttribute('aria-pressed', String(p === section.pastille));
      b.setAttribute('aria-label', `Pastille ${p}`);
      b.addEventListener('click', () => appliquer(m => changerPastille(m, r.s, p)));
      return b;
    }));
    if (doc.activeElement !== champSurtitre) champSurtitre.value = section.surtitre || '';
    conseilSurtitre.textContent = [...champSurtitre.value].length > SEUILS.surtitreMax ? `Conseil : ${SEUILS.surtitreMax} caractères au plus.` : '';
  }

  function ouvrirPanneau(repere) {
    repereOuvert = repere;
    remplirPanneau();
    if (!repereOuvert) return;
    if (typeof panneau.showModal === 'function') { if (!panneau.open) panneau.showModal(); } else panneau.setAttribute('open', '');
  }

  function fermerPanneau() {
    repereOuvert = null;
    if (panneau.open && typeof panneau.close === 'function') panneau.close(); else panneau.removeAttribute('open');
  }

  zoneApercu.addEventListener('click', evenement => {
    const cible = evenement.target.closest('[data-bloc]');
    if (!cible) return;
    evenement.preventDefault();
    ouvrirPanneau(cible.getAttribute('data-bloc'));
  });
  panneau.addEventListener('close', () => { repereOuvert = null; });
  $('panneau-fermer').addEventListener('click', fermerPanneau);
  champSurtitre.addEventListener('input', () => {
    conseilSurtitre.textContent = [...champSurtitre.value].length > SEUILS.surtitreMax ? `Conseil : ${SEUILS.surtitreMax} caractères au plus.` : '';
  });
  champSurtitre.addEventListener('change', () => {
    const s = lireRepere(repereOuvert).s;
    const valeur = champSurtitre.value;
    appliquer(m => changerSurtitre(m, s, valeur));
    if (repereOuvert) remplirPanneau();
  });
  champLibelle.addEventListener('change', () => appliquer(m => changerLibelle(m, repereOuvert, champLibelle.value)));

  champObjet.addEventListener('input', () => afficherAideObjet(champObjet.value));
  champObjet.addEventListener('change', () => appliquer(m => changerObjet(m, champObjet.value)));
  boutonAnnuler.addEventListener('click', () => {
    suivi = annuler(suivi);
    zoneTexte.value = suivi.texte;
    mettreAJour();
  });
  zoneTexte.addEventListener('input', () => {
    suivi = saisir(suivi, zoneTexte.value);
    mettreAJour();
  });
  mettreAJour();
}
