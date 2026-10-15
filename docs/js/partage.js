// Mailing-FCPE : écran Partager, reprise d'un brouillon, prompt IA et avertissement avant de
// recharger (US-021 à US-028 ; EX-009 à EX-014, EX-028, EX-029 ; lot 5a, DEC-116).
// Étape 6 : « Copier l'objet », pour ne pas ressaisir l'objet dans Gmail (EX-009).
//
// L'écran Partager suit la maquette de l'étape 2 : d'abord ce qui sert à la relecture sur
// téléphone, puis ce qui sert à l'envoi depuis l'ordinateur. Chaque bouton dit en une ligne
// ce qu'il a fait ; quand le navigateur refuse une copie, le contenu est sélectionné pour une
// copie à la main (DEC-118 pour l'email). Le texte est toujours celui de la zone de l'écran Écrire : les corrections
// de l'écran Vérifier y sont déjà écrites (DEC-103).

import { preparerApercu } from './apercu.js?v=1.0.0';
import { ecrirePivot } from './pivot.js?v=1.0.0';
import { PROMPT_IA } from '../parametres/prompt-ia.js?v=1.0.0';
import {
  versionTexte, nomDeFichier, aProteger, copierTexte, copierEmail, selectionner,
  creerImage, telecharger, partagerFichier,
} from './sorties.js?v=1.0.0';

// Messages affichés après chaque geste.
export const MESSAGES = Object.freeze({
  whatsapp: '✓ Version WhatsApp copiée : colle-la dans une conversation WhatsApp.',
  texte: '✓ Version texte copiée : colle-la dans ton message.',
  objet: '✓ Objet copié : colle-le dans le champ « Objet » de Gmail.',
  objetAbsent: "Pas encore d'objet : ajoute-le sur l'écran Vérifier.",
  gmail: '✓ Email copié : colle-le dans un nouveau message Gmail (Ctrl+V, ou ⌘+V sur Mac).',
  gmailRepli: "Ton navigateur n'a pas permis la copie : l'email est sélectionné ci-dessous. Fais Ctrl+C (⌘+C sur Mac), puis colle-le dans Gmail.",
  texteRepli: "Ton navigateur n'a pas permis la copie : le texte est sélectionné ci-dessous. Copie-le à la main (Ctrl+C, ou appui long puis « Copier »).",
  export: '✓ Brouillon copié : garde-le dans une note ou envoie-le-toi sur WhatsApp. Pour le reprendre, colle-le sur l’écran Écrire.',
  telechargement: '✓ Brouillon téléchargé : pour le reprendre, ouvre ce fichier avec « Reprendre un brouillon » sur l’écran Écrire.',
  imageEnCours: 'Création de l’image…',
  image: '✓ Image enregistrée : tu la trouveras dans tes téléchargements ou ta galerie.',
  imagePartagee: '✓ Image partagée.',
  imageAnnulee: 'Partage annulé.',
  imageImpossible: "L'image n'a pas pu être créée sur ce navigateur : fais une capture d'écran de l'aperçu.",
  partageImpossible: "Le partage n'a pas abouti : utilise « Enregistrer l'image », puis envoie-la depuis ta galerie.",
  prompt: '✓ Prompt copié : colle-le dans ton IA, ajoute ton texte à la fin, puis colle sa réponse ici.',
  promptRepli: "Ton navigateur n'a pas permis la copie : le prompt est sélectionné ci-dessous. Copie-le à la main.",
  repris: '✓ Brouillon repris : vérifie-le sur l’écran Vérifier.',
  fichierTropGros: 'Ce fichier est trop gros pour un brouillon : choisis le fichier exporté par l’outil (.txt).',
  fichierIllisible: 'Ce fichier n’a pas pu être lu : choisis le fichier exporté par l’outil (.txt).',
});

// Taille maximale d'un brouillon à reprendre : bien au-delà d'un email (quelques kilo-octets).
export const TAILLE_MAX_BROUILLON = 200 * 1024;

// Les contenus de l'écran Partager, pour un texte donné ; null si le texte est vide.
export function contenusPartage(texte) {
  const apercu = preparerApercu(texte);
  if (apercu.vide) return null;
  return {
    objet: apercu.objet || '',
    html: apercu.html,
    whatsapp: versionTexte(apercu.doc, true),
    texte: versionTexte(apercu.doc, false),
    // Le brouillon exporté (copié ou téléchargé, DEC-117) est le texte relu au format pivot :
    // le reprendre redonne le même email (EX-028).
    pivot: ecrirePivot(apercu.doc),
  };
}

// Branche l'écran Partager, la reprise d'un brouillon, le prompt IA et l'avertissement.
// « fonctions » est le résultat de detecterFonctions (navigateur.js).
export function brancherPartage(fenetre, fonctions) {
  const doc = fenetre.document;
  const $ = id => doc.getElementById(id);
  const zoneTexte = $('texte');
  const vide = $('partage-vide');
  const partage = $('partage');
  const retour = $('retour-partager');
  const retourEcrire = $('retour-ecrire');
  const repli = $('repli');
  const consigneRepli = $('repli-consigne');
  const contenuRepli = $('repli-contenu');
  const boutonPartagerImage = $('partager-image');
  const objetPartage = $('objet-partage');
  const boutonObjet = $('copier-objet');

  // Texte au moment de la dernière copie pour Gmail ou du dernier export (EX-029, DEC-119).
  let misAbri = null;
  // Dernière image créée, gardée pour que « Partager » parte tout de suite (DEC-080).
  let image = null;

  const contenus = () => contenusPartage(zoneTexte.value);

  function dire(message, element = retour) {
    element.textContent = message;
  }

  function cacherRepli() {
    repli.hidden = true;
    contenuRepli.replaceChildren();
  }

  // Copie à la main : le contenu est montré et sélectionné.
  function montrerRepli(consigne, html, texte) {
    consigneRepli.textContent = consigne;
    if (html !== undefined) {
      // Code produit par rendreEmail : tout texte du rédacteur y est échappé (US-011).
      contenuRepli.innerHTML = html;
    } else {
      const zone = doc.createElement('textarea');
      zone.readOnly = true;
      zone.rows = 8;
      zone.setAttribute('aria-label', 'Texte à copier'); // US-037 : un champ a toujours un nom
      zone.value = texte;
      contenuRepli.replaceChildren(zone);
    }
    repli.hidden = false;
    const cible = contenuRepli.firstElementChild;
    if (cible && cible.select) { cible.focus(); cible.select(); } else selectionner(fenetre, contenuRepli);
  }

  // Écran Partager : invitation si le texte est vide ; l'ancienne image ne sert plus.
  function mettreAJour() {
    const c = contenus();
    vide.hidden = Boolean(c);
    partage.hidden = !c;
    dire('');
    cacherRepli();
    boutonPartagerImage.hidden = !fonctions.partage;
    // L'objet est rappelé au-dessus de son bouton ; sans objet, le bouton est grisé.
    const objet = c ? c.objet : '';
    objetPartage.textContent = objet ? `Objet : ${objet}` : MESSAGES.objetAbsent;
    boutonObjet.disabled = !objet;
    if (image && (!c || image.html !== c.html)) image = null;
  }

  async function copierVersion(cle) {
    const c = contenus();
    if (!c) return;
    cacherRepli();
    if (await copierTexte(fenetre, c[cle])) dire(MESSAGES[cle]);
    else { dire(''); montrerRepli(MESSAGES.texteRepli, undefined, c[cle]); }
  }

  $('copier-whatsapp').addEventListener('click', () => copierVersion('whatsapp'));
  $('copier-texte').addEventListener('click', () => copierVersion('texte'));
  // Copier l'objet seul ne met pas l'email à l'abri : l'avertissement reste (EX-029).
  boutonObjet.addEventListener('click', () => {
    const c = contenus();
    if (c && c.objet) copierVersion('objet');
  });

  $('copier-gmail').addEventListener('click', async () => {
    const c = contenus();
    if (!c) return;
    cacherRepli();
    if (await copierEmail(fenetre, c.html, c.texte)) { misAbri = zoneTexte.value; dire(MESSAGES.gmail); }
    else { dire(''); montrerRepli(MESSAGES.gmailRepli, c.html); }
  });

  $('exporter').addEventListener('click', async () => {
    const c = contenus();
    if (!c) return;
    cacherRepli();
    if (await copierTexte(fenetre, c.pivot)) { misAbri = zoneTexte.value; dire(MESSAGES.export); }
    else { dire(''); montrerRepli(MESSAGES.texteRepli, undefined, c.pivot); }
  });

  $('telecharger-brouillon').addEventListener('click', () => {
    const c = contenus();
    if (!c) return;
    cacherRepli();
    telecharger(fenetre, new fenetre.Blob([c.pivot], { type: 'text/plain;charset=utf-8' }), nomDeFichier('brouillon-mailing', 'txt'));
    misAbri = zoneTexte.value;
    dire(MESSAGES.telechargement);
  });

  // Image de l'aperçu, créée à la demande et gardée tant que l'email ne change pas.
  async function imageActuelle() {
    const c = contenus();
    if (!c) return null;
    if (!image || image.html !== c.html) image = { html: c.html, blob: await creerImage(fenetre, c.html) };
    return image.blob;
  }

  $('enregistrer-image').addEventListener('click', async () => {
    cacherRepli();
    dire(MESSAGES.imageEnCours);
    try {
      const blob = await imageActuelle();
      if (!blob) return;
      telecharger(fenetre, blob, nomDeFichier('apercu-mailing', 'png'));
      dire(MESSAGES.image);
    } catch (e) {
      dire(MESSAGES.imageImpossible);
    }
  });

  boutonPartagerImage.addEventListener('click', async () => {
    cacherRepli();
    let blob;
    try {
      if (!image) dire(MESSAGES.imageEnCours);
      blob = await imageActuelle();
    } catch (e) {
      dire(MESSAGES.imageImpossible);
      return;
    }
    if (!blob) return;
    const resultat = await partagerFichier(fenetre, blob, nomDeFichier('apercu-mailing', 'png'));
    dire({ partage: MESSAGES.imagePartagee, annule: MESSAGES.imageAnnulee, impossible: MESSAGES.partageImpossible }[resultat]);
  });

  // Écran Écrire : prompt IA (US-027, DEC-120) et reprise d'un brouillon, collé ou ouvert en
  // fichier (US-026, DEC-117).
  $('copier-prompt').addEventListener('click', async () => {
    if (await copierTexte(fenetre, PROMPT_IA)) dire(MESSAGES.prompt, retourEcrire);
    else {
      dire(MESSAGES.promptRepli, retourEcrire);
      const zone = $('prompt-repli');
      zone.value = PROMPT_IA;
      zone.hidden = false;
      zone.focus();
      zone.select();
    }
  });

  const choixFichier = $('ouvrir-brouillon');
  choixFichier.addEventListener('change', async () => {
    const fichier = choixFichier.files && choixFichier.files[0];
    choixFichier.value = '';
    if (!fichier) return;
    if (fichier.size > TAILLE_MAX_BROUILLON) { dire(MESSAGES.fichierTropGros, retourEcrire); return; }
    let texte;
    try { texte = await fichier.text(); } catch (e) { dire(MESSAGES.fichierIllisible, retourEcrire); return; }
    zoneTexte.value = texte;
    // Même chemin qu'une saisie : l'aperçu se met à jour, « Annuler » repart de ce texte.
    zoneTexte.dispatchEvent(new fenetre.Event('input'));
    dire(MESSAGES.repris, retourEcrire);
  });
  zoneTexte.addEventListener('input', () => dire('', retourEcrire));

  // Avertissement avant de recharger (US-028, EX-029) : rien n'est enregistré (DEC-071).
  fenetre.addEventListener('beforeunload', evenement => {
    if (!aProteger(zoneTexte.value, misAbri)) return;
    evenement.preventDefault();
    evenement.returnValue = '';
  });

  fenetre.addEventListener('hashchange', mettreAJour);
  mettreAJour();
}
