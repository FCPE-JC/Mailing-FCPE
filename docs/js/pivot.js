// Mailing-FCPE : lecture et écriture du format pivot (US-007, US-016 ; EX-003, RG-004, EX-028).
//
// Transforme un texte au format pivot (etape-2/format-pivot.md, règles P1 à P14) en un
// modèle interne unique : objet, salutation, sections (pastille, surtitre, blocs), clôture,
// signature. La lecture ne s'arrête jamais sur une erreur : une ligne mal écrite devient un
// paragraphe, et l'anomalie est notée dans « anomalies » (affichées au lot 4, EX-026).
//
// Transcription en JavaScript de lire_pivot() de etape-2/outils-de-travail/rendu.py,
// complétée des règles de format-pivot.md que l'outil de travail ne couvrait pas
// (« Sujet : », « ### », « ## » seul, encadré non refermé, liens non valides).

// Émoji en tête de ligne : un pictogramme, suivi éventuellement d'un sélecteur de variante,
// d'une teinte de peau ou d'un pictogramme lié (émojis composés).
const EMOJI = /^(\p{Extended_Pictographic}(?:️|⃣|[\u{1F3FB}-\u{1F3FF}]|‍\p{Extended_Pictographic}️?)*)\s*/u;

// Formules de politesse reconnues (P14).
const POLITESSE = /^(bien cordialement|cordialement|bien à vous|amicalement|à (très )?bientôt|belle (journée|soirée|semaine)|bonne (journée|soirée|semaine)|avec nos (sincères )?salutations|bon courage|merci et à bientôt)(?![\p{L}\p{N}_])/iu;

// Lien seul sur sa ligne (P9) : [Libellé](adresse).
const LIEN_SEUL = /^\[([^\]]+)\]\(([^)\s]+)\)$/;

// Adresses acceptées pour un bouton (P9) et pour un lien dans une phrase (P8, US-011).
export const ADRESSE_BOUTON = /^https?:\/\/\S+$/i;
export const ADRESSE_LIEN = /^(?:https?:\/\/|mailto:)\S+$/i;

// Titres d'encadré Important reconnus (P11).
const TITRES_IMPORTANT = ['important', 'attention', 'urgent', 'à retenir', 'a retenir', 'à noter', 'a noter', 'rappel'];

export function retirerEmoji(texte) {
  return texte.replace(EMOJI, '');
}

// Lit un texte au format pivot et renvoie le modèle interne.
export function lirePivot(texte) {
  const anomalies = [];
  const noter = (code, message) => anomalies.push({ code, message });
  const lignes = String(texte ?? '').replace(/\r\n?/g, '\n').replace(/ /g, ' ').split('\n');
  const doc = { objet: null, salutation: null, sections: [], cloture: null, signature: null, anomalies };

  // P1 : objet, sur la première ligne non vide.
  let i = 0;
  while (i < lignes.length && !lignes[i].trim()) i++;
  const objet = i < lignes.length && lignes[i].match(/^\s*(?:objet|sujet)\s*:(.*)$/i);
  if (objet) {
    doc.objet = objet[1].trim() || null;
    i++;
  }

  // Paquets de lignes séparés par des lignes vides ; un encadré ::: forme un seul paquet.
  const paquets = [];
  let courant = [];
  let encadre = false;
  const fermer = () => { if (courant.length) paquets.push(courant); courant = []; };
  for (const brute of lignes.slice(i)) {
    const s = brute.trimEnd();
    if (s.trimStart().startsWith(':::')) {
      if (!encadre) { fermer(); courant = [s.trim()]; encadre = true; }
      else { courant.push(':::'); fermer(); encadre = false; }
      continue;
    }
    if (encadre) { courant.push(s); continue; }
    if (!s.trim()) { fermer(); continue; }
    if (/^#{2,}(\s|$)/.test(s.trim()) || s.trim() === '---') { fermer(); paquets.push([s.trim()]); continue; }
    courant.push(s);
  }
  if (encadre) {
    courant.push(':::');
    noter('encadre-non-ferme', 'Un encadré « ::: » n’est pas refermé : il court jusqu’à la fin du texte.');
  }
  fermer();

  // Paquets vers blocs.
  const blocs = [];
  for (const paquet of paquets) {
    const tete = paquet[0].trim();
    // P3 : section ; « ### » est lu comme « ## ».
    const section = tete.match(/^#{2,}(?:\s+(.*))?$/);
    if (section) {
      let reste = (section[1] || '').trim();
      let pastille = null;
      const m = reste.match(EMOJI);
      if (m) { pastille = m[1]; reste = reste.slice(m[0].length).trim(); }
      blocs.push({ type: 'section', pastille, surtitre: reste || null });
      continue;
    }
    if (tete === '---') { blocs.push({ type: 'separateur' }); continue; }
    // P11 et P12 : encadré Important et bloc Date et lieu.
    if (tete.startsWith(':::')) {
      const genre = tete.slice(3).trim().toLowerCase();
      const contenu = paquet.slice(1, -1).map(x => x.trim()).filter(Boolean);
      if (genre.startsWith('date')) {
        blocs.push({ type: 'date', lignes: contenu });
      } else {
        if (!genre.startsWith('important')) {
          noter('encadre-inconnu', `Encadré « ::: ${genre} » inconnu : il est rendu comme un encadré Important.`);
        }
        let titre = 'Important';
        let corps = contenu;
        if (contenu.length && TITRES_IMPORTANT.includes(retirerEmoji(contenu[0]).trim().replace(/[\s:]+$/, '').toLowerCase())) {
          titre = retirerEmoji(contenu[0]).trim().replace(/[\s:]+$/, '');
          corps = contenu.slice(1);
        }
        blocs.push({ type: 'important', titre, lignes: corps });
      }
      continue;
    }
    // Autres paquets : paragraphes, avec boutons, listes et accroches repérés ligne à ligne.
    let tampon = [];
    let liste = [];
    const viderTampon = () => { if (tampon.length) blocs.push({ type: 'paragraphe', texte: tampon.map(x => x.trim()).join(' ') }); tampon = []; };
    const viderListe = () => { if (liste.length) blocs.push({ type: 'liste', elements: liste }); liste = []; };
    for (const brute of paquet) {
      const s = brute.trim();
      const lien = s.match(LIEN_SEUL);
      if (lien) {
        viderTampon(); viderListe();
        if (ADRESSE_BOUTON.test(lien[2])) {
          blocs.push({ type: 'bouton', libelle: lien[1], adresse: lien[2] });
        } else {
          noter('lien-non-valide', `Lien non valide : « ${lien[2]} » ne commence pas par https:// ou http://.`);
          tampon.push(s);
        }
        continue;
      }
      if (/^[-*•] /.test(s)) { viderTampon(); liste.push(s.slice(2).trim()); continue; }
      viderListe();
      if (s.startsWith('> ')) { viderTampon(); blocs.push({ type: 'accroche', texte: s.slice(2).trim() }); continue; }
      tampon.push(s);
    }
    viderTampon();
    viderListe();
  }

  // P2 : salutation, premier paragraphe court terminé par une virgule.
  if (blocs.length && blocs[0].type === 'paragraphe' && blocs[0].texte.endsWith(',') && blocs[0].texte.length <= 40) {
    doc.salutation = blocs.shift().texte;
  }

  // P14 : signature, à partir de la formule de politesse. P13 : la phrase qui suit le dernier
  // « --- » est la clôture, même si elle commence par une formule (« À bientôt ✨ ») suivie
  // de la vraie signature.
  const estFormule = b => b.type === 'paragraphe' && POLITESSE.test(b.texte);
  let k = blocs.findIndex(estFormule);
  const separateur = blocs.map(b => b.type).lastIndexOf('separateur');
  if (k >= 0 && separateur >= 0 && k === separateur + 1) {
    const suivante = blocs.findIndex((b, i) => i > k && estFormule(b));
    if (suivante >= 0) k = suivante;
  }
  if (k >= 0) {
    const paragraphes = blocs.slice(k).filter(b => b.type === 'paragraphe').map(b => b.texte);
    const v = paragraphes[0];
    const virgule = v.indexOf(',');
    const formule = (virgule >= 0 ? v.slice(0, virgule) : v) + ',';
    const signataire = ((virgule >= 0 ? v.slice(virgule + 1).trim() : '') + ' ' + paragraphes.slice(1).join(' ')).trim();
    doc.signature = { formule, signataire: signataire || null };
    blocs.length = k;
  } else {
    noter('signature-absente', 'Aucune signature reconnue.');
  }

  // P13 : clôture, ce qui suit le dernier séparateur.
  const dernier = blocs.map(b => b.type).lastIndexOf('separateur');
  if (dernier >= 0) {
    const apres = blocs.slice(dernier + 1).filter(b => b.type === 'paragraphe').map(b => b.texte);
    if (apres.length) { doc.cloture = apres.join(' '); blocs.length = dernier; }
  }

  // Sections ; le contenu placé avant le premier « ## » forme une première section sans surtitre.
  let sec = null;
  for (const b of blocs) {
    if (b.type === 'section') {
      sec = { pastille: b.pastille, surtitre: b.surtitre, blocs: [] };
      doc.sections.push(sec);
      continue;
    }
    if (b.type === 'separateur') continue;
    if (!sec) { sec = { pastille: null, surtitre: null, blocs: [] }; doc.sections.push(sec); }
    // P6 : note, paragraphe entièrement entouré d'étoiles simples ou de tirets bas.
    if (b.type === 'paragraphe' && /^(?:_[^_].*_|\*[^*].*\*(?<!\*\*))$/.test(b.texte) && !b.texte.startsWith('**')) {
      sec.blocs.push({ type: 'note', texte: b.texte.slice(1, -1) });
      continue;
    }
    sec.blocs.push(b);
  }

  // Anomalies et conseils repérés à la lecture (affichés au lot 4).
  if (!doc.objet) noter('objet-absent', 'Aucune ligne « Objet : » en tête du texte.');
  const tous = doc.sections.flatMap(s => s.blocs);
  if (tous.filter(b => b.type === 'accroche').length > 1) noter('plusieurs-accroches', 'Plusieurs accroches : une seule est conseillée.');
  if (tous.filter(b => b.type === 'important').length > 1) noter('plusieurs-encadres', 'Plusieurs encadrés Important : un seul est conseillé.');
  const textes = [doc.salutation, doc.cloture, ...doc.sections.map(s => s.surtitre), ...tous.flatMap(b => [b.texte, ...(b.elements || []), ...(b.lignes || [])])];
  for (const t of textes.filter(Boolean)) {
    for (const m of t.matchAll(/\[[^\]]+\]\(([^)\s]*)\)/g)) {
      if (!ADRESSE_LIEN.test(m[1])) noter('lien-non-valide', `Lien non valide : « ${m[1]} » n’est pas une adresse web.`);
    }
    if (/!\[[^\]]*\]\([^)]*\)/.test(t)) noter('image-refusee', 'Les images ne sont pas acceptées dans le texte (RG-002).');
  }
  return doc;
}

// Écrit le modèle interne au format pivot (US-016 à US-020) : c'est la forme que prennent
// les corrections, et relire le texte écrit redonne le même modèle (EX-028).
export function ecrirePivot(doc) {
  const L = [];
  if (doc.objet) L.push(`Objet : ${doc.objet}`, '');
  if (doc.salutation) L.push(doc.salutation, '');
  for (const s of doc.sections) {
    L.push(('## ' + [s.pastille, s.surtitre].filter(Boolean).join(' ')).trimEnd());
    for (const b of s.blocs) {
      if (b.type === 'paragraphe') L.push(b.texte);
      else if (b.type === 'accroche') L.push(`> ${b.texte}`);
      // Note : étoiles simples, ou tirets bas si le texte commence ou finit par une étoile.
      else if (b.type === 'note') L.push(/^\*|\*$/.test(b.texte) ? `_${b.texte}_` : `*${b.texte}*`);
      else if (b.type === 'liste') L.push(...b.elements.map(e => `- ${e}`));
      else if (b.type === 'bouton') L.push(`[${b.libelle}](${b.adresse})`);
      else if (b.type === 'important') L.push('::: important', ...(b.titre && b.titre !== 'Important' ? [b.titre] : []), ...b.lignes, ':::');
      else if (b.type === 'date') L.push('::: date', ...b.lignes, ':::');
      L.push('');
    }
    if (L.at(-1) !== '') L.push('');
  }
  if (doc.cloture) L.push('---', doc.cloture, '');
  if (doc.signature) {
    L.push(doc.signature.formule);
    if (doc.signature.signataire) L.push(doc.signature.signataire);
  }
  return L.join('\n').trimEnd() + '\n';
}
