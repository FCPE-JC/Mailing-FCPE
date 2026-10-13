// Mailing-FCPE : vérification du navigateur au démarrage (US-003 ; EX-018, DEC-072, TEC-006).
//
// L'outil vise les navigateurs des deux dernières années, sans numéro de version :
// il vérifie plutôt, à l'ouverture, les trois fonctions dont il a besoin. Pour chaque
// fonction absente, il nomme la fonction et la solution de repli ; rien ne s'affiche
// quand tout fonctionne. Aucun échec silencieux (même esprit que EX-026).

export const FONCTIONS = Object.freeze([
  Object.freeze({
    identifiant: 'copie',
    nom: "Copier l'email mis en forme",
    repli: "sélectionne l'aperçu de l'email à la main, copie-le (Ctrl+C ou appui long), puis colle-le dans Gmail.",
  }),
  Object.freeze({
    identifiant: 'image',
    nom: "Créer l'image de l'aperçu",
    repli: "fais une capture d'écran de l'aperçu pour la relecture sur WhatsApp.",
  }),
  Object.freeze({
    identifiant: 'partage',
    nom: "Partager l'image",
    repli: "utilise « Enregistrer l'image », puis envoie-la depuis ta galerie ou ton dossier de téléchargements.",
  }),
]);

// Indique, pour chaque fonction, si le navigateur la propose.
// « fenetre » est l'objet window du navigateur (ou un faux objet dans les tests).
export function detecterFonctions(fenetre) {
  const nav = fenetre.navigator || {};
  const doc = fenetre.document;

  const copie = !!(nav.clipboard && typeof nav.clipboard.write === 'function' && typeof fenetre.ClipboardItem === 'function');

  let image = false;
  try {
    const canevas = doc.createElement('canvas');
    image = !!(canevas.getContext && canevas.getContext('2d') && typeof canevas.toBlob === 'function'
      && typeof fenetre.XMLSerializer === 'function');
  } catch (e) {
    image = false;
  }

  let partage = false;
  try {
    if (typeof nav.canShare === 'function' && typeof fenetre.File === 'function') {
      const essai = new fenetre.File([''], 'essai.png', { type: 'image/png' });
      partage = nav.canShare({ files: [essai] }) === true;
    }
  } catch (e) {
    partage = false;
  }

  return { copie, image, partage };
}

// Liste des fonctions absentes, avec leur solution de repli.
export function fonctionsAbsentes(resultat) {
  return FONCTIONS.filter(f => !resultat[f.identifiant]);
}

// Affiche l'avertissement dans l'élément prévu, ou le laisse caché si tout fonctionne.
export function afficherAvertissement(element, absentes) {
  element.replaceChildren();
  if (absentes.length === 0) {
    element.hidden = true;
    return;
  }
  const doc = element.ownerDocument;
  const titre = doc.createElement('p');
  titre.className = 'avertissement-titre';
  titre.textContent = absentes.length === 1
    ? 'Ton navigateur ne propose pas une fonction de l’outil :'
    : 'Ton navigateur ne propose pas certaines fonctions de l’outil :';
  const liste = doc.createElement('ul');
  for (const f of absentes) {
    const li = doc.createElement('li');
    const nom = doc.createElement('strong');
    nom.textContent = f.nom;
    li.append(nom, ' : ' + f.repli);
    liste.append(li);
  }
  element.append(titre, liste);
  element.hidden = false;
}
