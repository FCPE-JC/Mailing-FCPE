// Mailing-FCPE : anomalies, conseils de rédaction et aide à l'objet (US-018, US-019, US-034 ;
// EX-002, EX-006, EX-026).
//
// L'outil signale, il ne corrige jamais en silence. Les anomalies viennent de la lecture du
// pivot (js/pivot.js) ; les conseils viennent de la charte (etape-2/charte-blocs.md) ; l'aide
// à l'objet suit la section 5 de etape-2/regles-detection.md, seuils gardés tels quels comme
// conseils pour la V1 (DEC-106).

const LETTRE = /\p{L}/gu;
const MAJUSCULE = /\p{Lu}/gu;
const EMOJI = /\p{Extended_Pictographic}(?:️|‍\p{Extended_Pictographic}️?|[\u{1F3FB}-\u{1F3FF}])*/gu;
// Longueur en caractères affichés : un émoji, même composé, compte pour un.
const longueur = s => [...s.replace(/[\uFE0F\u{1F3FB}-\u{1F3FF}]|\u200D\p{Extended_Pictographic}/gu, '')].length;

export const SEUILS = Object.freeze({
  sectionsMax: 7, surtitreMax: 60, libelleMax: 30, clotureMax: 80, listeMax: 7,
  objetMin: 30, objetMax: 50, objetAlerte: 60, debutAccroche: 50,
});

// Messages des anomalies relevées par la lecture du pivot.
const ANOMALIES = {
  'encadre-non-ferme': 'Un encadré « ::: » n’est pas refermé : il court jusqu’à la fin du texte.',
  'encadre-inconnu': null,
  'lien-non-valide': null,
  'image-refusee': null,
  'signature-absente': 'Aucune signature reconnue : termine par une formule (« Bien cordialement, ») suivie de ton nom.',
};

// Passages à compléter des modèles types (US-034, DEC-128) : texte entre crochets, sauf le libellé
// d'un lien « [libellé](adresse) ». Au plus six sont cités dans le message.
const A_COMPLETER = /\[([^[\]\n]+)\](?!\()/gu;
const A_COMPLETER_CITES = 6;

// Passages à compléter d'un texte, dans l'ordre, sans doublon.
// Toutes les chaînes d'une valeur (un bloc, la signature), mises bout à bout.
const chaines = v => (typeof v === 'string' ? v : v && typeof v === 'object' ? Object.values(v).map(chaines).join('\n') : '');

export const passagesACompleter = texte => [...new Set([...String(texte ?? '').matchAll(A_COMPLETER)].map(m => m[0]))];

// Anomalies et conseils, chacun avec son message et, quand il y en a un, le repère du bloc
// concerné (même repère que l'aperçu : « s.b », « s.titre » ou « cloture »).
export function conseils(doc) {
  const liste = [];
  const ajouter = (niveau, code, message, cible = null) => liste.push({ niveau, code, message, cible });

  for (const a of doc.anomalies || []) {
    if (!(a.code in ANOMALIES)) continue;
    let cible = null;
    if (a.code === 'lien-non-valide') {
      const adresse = (a.message.match(/« (.*?) »/) || [])[1];
      doc.sections.forEach((s, k) => s.blocs.forEach((b, j) => {
        if (!cible && adresse && JSON.stringify(b).includes(adresse)) cible = `${k}.${j}`;
      }));
    }
    ajouter('anomalie', a.code, ANOMALIES[a.code] || a.message, cible);
  }

  // Passages à compléter, avec le premier bloc qui en contient un (l'objet n'a pas de repère).
  const textes = [[doc.objet, null], [doc.salutation, null]];
  doc.sections.forEach((s, k) => {
    textes.push([s.surtitre, `${k}.titre`]);
    s.blocs.forEach((b, j) => textes.push([chaines(b), `${k}.${j}`]));
  });
  textes.push([doc.cloture, 'cloture'], [chaines(doc.signature), 'signature']);
  const passages = [...new Set(textes.flatMap(([t]) => passagesACompleter(t)))];
  if (passages.length) {
    const cible = (textes.find(([t, c]) => c && passagesACompleter(t).length) || [])[1] ?? null;
    const cites = passages.slice(0, A_COMPLETER_CITES).join(', ') + (passages.length > A_COMPLETER_CITES ? '…' : '.');
    ajouter('anomalie', 'a-completer', `Il reste à compléter : ${cites}`, cible);
  }

  const n = doc.sections.length;
  if (n > SEUILS.sectionsMax) ajouter('conseil', 'trop-de-sections', `${n} sections : au-delà de ${SEUILS.sectionsMax}, l’email devient long à lire.`);
  let accroches = 0, encadres = 0;
  doc.sections.forEach((s, k) => {
    // La première section porte souvent l'accroche, sans surtitre : pas de conseil pour elle.
    if (!s.surtitre && k > 0) ajouter('conseil', 'section-sans-surtitre', `La section ${k + 1} n’a pas de surtitre.`, `${k}.0`);
    if (s.surtitre && longueur(s.surtitre) > SEUILS.surtitreMax) {
      ajouter('conseil', 'surtitre-long', `Le surtitre de la section ${k + 1} dépasse ${SEUILS.surtitreMax} caractères.`, `${k}.titre`);
    }
    s.blocs.forEach((b, j) => {
      const ici = `${k}.${j}`;
      if (b.type === 'accroche' && ++accroches === 2) ajouter('conseil', 'plusieurs-accroches', 'Plusieurs accroches : une seule est conseillée.', ici);
      if (b.type === 'important' && ++encadres === 2) ajouter('conseil', 'plusieurs-encadres', 'Plusieurs encadrés Important : un seul est conseillé, placé le plus haut possible.', ici);
      if (b.type === 'bouton' && longueur(b.libelle) > SEUILS.libelleMax) ajouter('conseil', 'libelle-long', `Le libellé du bouton dépasse ${SEUILS.libelleMax} caractères.`, ici);
      if (b.type === 'liste' && b.elements.length > SEUILS.listeMax) ajouter('conseil', 'liste-longue', `Une liste de ${b.elements.length} éléments : ${SEUILS.listeMax} au plus sont conseillés.`, ici);
    });
  });
  if (doc.cloture && longueur(doc.cloture) > SEUILS.clotureMax) ajouter('conseil', 'cloture-longue', `La clôture dépasse ${SEUILS.clotureMax} caractères.`, 'cloture');
  return liste;
}

// Texte sans les marques du pivot (gras, italique, liens).
const texteSimple = t => t.replace(/\[([^\]]+)\]\([^)]*\)/gu, '$1').replace(/\*\*|[*_]/gu, '').replace(/\s+/gu, ' ').trim();

// Coupe un texte à n caractères au plus, au dernier espace, avec « … ».
function couper(texte, n) {
  const c = [...texte];
  if (c.length <= n) return texte;
  const debut = c.slice(0, n).join('');
  const espace = debut.lastIndexOf(' ');
  return `${(espace > 0 ? debut.slice(0, espace) : debut).replace(/[\s,;:.]+$/u, '')}…`;
}

// Aide à l'objet (EX-006) : longueur, messages des six contrôles et, sans objet, propositions.
export function aideObjet(objet, doc) {
  const o = String(objet ?? '').trim();
  const n = longueur(o);
  const messages = [];
  const propositions = [];
  if (!o) {
    messages.push('Ajoute un objet : sans objet, beaucoup de parents n’ouvriront pas l’email.');
    const surtitre = doc?.sections[0]?.surtitre;
    const accroche = doc?.sections.flatMap(s => s.blocs).find(b => b.type === 'accroche');
    if (surtitre) propositions.push(texteSimple(surtitre));
    else if (accroche) propositions.push(couper(texteSimple(accroche.texte), SEUILS.debutAccroche));
    return { longueur: 0, conseillee: false, messages, propositions };
  }
  if (n > SEUILS.objetAlerte) messages.push('Ton objet sera coupé sur téléphone (environ 35 à 40 caractères visibles). Mets l’essentiel au début.');
  const emojis = [...o.matchAll(EMOJI)];
  const auBord = e => e.index === 0 || e.index + e[0].length === o.length;
  if (emojis.length > 1 || (emojis.length === 1 && !auBord(emojis[0]))) messages.push('Un seul émoji suffit, en tête ou en fin d’objet.');
  const lettres = (o.match(LETTRE) || []).length;
  if (lettres && (o.match(MAJUSCULE) || []).length > lettres / 2) messages.push('Évite les capitales : elles se lisent comme un cri et attirent les filtres anti-spam.');
  if (/[!?]{2,}/u.test(o)) messages.push('Une seule ponctuation forte suffit.');
  if (/(?<![\p{L}\p{N}])gratuit|urgent\s*!!!|cliquez ici/iu.test(o)) messages.push('Ce mot peut envoyer l’email dans les indésirables.');
  return { longueur: n, conseillee: n >= SEUILS.objetMin && n <= SEUILS.objetMax, messages, propositions };
}
