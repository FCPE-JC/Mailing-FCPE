// Mailing-FCPE : les sorties de l'email (US-022 à US-026, US-028 ; EX-009 à EX-013, EX-028, EX-029).
//
// Versions WhatsApp et texte : transcription en JavaScript de sortie_texte() de
// etape-2/outils-de-travail/rendu.py (une ligne vide entre chaque bloc, DEC-057), avec la
// signature sur plusieurs lignes (DEC-110) et le titre de l'encadré tel qu'il est écrit.
// Copie : méthode du test T1 (presse-papier moderne, puis méthode ancienne). Image : méthode
// du test T3 (dessin de l'email dans une image SVG, puis dans un canevas), une seule image
// longue (DEC-056). Tout se fait dans la page : rien n'est envoyé ni enregistré (DEC-071).

import { CHARTE } from '../parametres/charte.js';

// Lettre, chiffre ou tiret bas, comme \w de Python.
const MOT = '[\\p{L}\\p{N}_]';
const LIEN = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g;

// Une ligne pour WhatsApp : lien en « libellé (adresse) », **gras** en *gras*, *italique* en _italique_.
export function ligneWhatsApp(t) {
  return t.replace(LIEN, '$1 ($2)')
    .replace(/\*\*(.+?)\*\*/g, '\x01$1\x01')
    .replace(new RegExp(`(?<!${MOT}|\\*)\\*(.+?)\\*(?!${MOT}|\\*)`, 'gu'), '_$1_')
    .replace(/\x01/g, '*');
}

// Une ligne de la version texte : lien en « libellé (adresse) », sans aucune marque.
export function ligneTexte(t) {
  return t.replace(LIEN, '$1 ($2)')
    .replace(new RegExp(`\\*\\*(.+?)\\*\\*|(?<!${MOT}|\\*)[*_](.+?)[*_](?!${MOT}|\\*)`, 'gu'), (tout, gras, autre) => gras ?? autre);
}

// Version WhatsApp (whatsapp vrai, EX-010) ou version texte (EX-013) du modèle interne.
export function versionTexte(doc, whatsapp) {
  const L = whatsapp ? ligneWhatsApp : ligneTexte;
  const gras = t => (whatsapp ? `*${t}*` : t);
  const o = [];
  if (doc.salutation) o.push(L(doc.salutation), '');
  for (const s of doc.sections) {
    if (s.surtitre) o.push(((whatsapp && s.pastille ? `${s.pastille} ` : '') + gras(s.surtitre.toUpperCase())).trim());
    for (const b of s.blocs) {
      if (b.type === 'paragraphe') o.push(L(b.texte));
      else if (b.type === 'accroche') o.push(gras(ligneTexte(b.texte)));
      else if (b.type === 'note') o.push(whatsapp ? `_${ligneTexte(b.texte)}_` : L(b.texte));
      else if (b.type === 'liste') o.push(...b.elements.map(e => (whatsapp ? '• ' : '- ') + L(e)));
      else if (b.type === 'bouton') o.push(`${whatsapp ? '👉 ' : ''}${b.libelle.replace(/[ →]+$/, '')} : ${b.adresse}`);
      else if (b.type === 'important') o.push(whatsapp ? `⚠️ *${b.titre.toUpperCase()}*` : b.titre.toUpperCase(), ...b.lignes.map(L));
      else if (b.type === 'date') o.push(...b.lignes.map(L));
      o.push(''); // une ligne vide entre chaque bloc (DEC-057)
    }
  }
  if (doc.cloture) o.push(L(doc.cloture), '');
  if (doc.signature) {
    o.push(doc.signature.formule);
    // Signataire : la première ligne en gras, les suivantes telles quelles (DEC-110).
    const [premiere, ...suite] = (doc.signature.signataire || '').split('\n').filter(Boolean);
    if (premiere) o.push(gras(premiere), ...suite);
  }
  return o.join('\n').trim() + '\n';
}

// Nom des fichiers téléchargés : « brouillon-mailing-2026-10-13.txt ».
export function nomDeFichier(base, extension, date = new Date()) {
  const deux = n => String(n).padStart(2, '0');
  return `${base}-${date.getFullYear()}-${deux(date.getMonth() + 1)}-${deux(date.getDate())}.${extension}`;
}

// Avertissement avant de recharger (EX-029) : un texte non vide qui a changé depuis la
// dernière copie pour Gmail ou le dernier export du brouillon.
export const aProteger = (texte, misAbri) => Boolean(String(texte ?? '').trim()) && texte !== misAbri;

// Copie d'un texte. Renvoie true si le texte est dans le presse-papier.
export async function copierTexte(fenetre, texte) {
  const nav = fenetre.navigator;
  try {
    if (nav.clipboard && typeof nav.clipboard.writeText === 'function') { await nav.clipboard.writeText(texte); return true; }
  } catch (e) { /* méthode ancienne ci-dessous */ }
  return copieAncienne(fenetre, { 'text/plain': texte });
}

// Copie de l'email mis en forme (EX-009), en HTML et en texte, comme au test T1.
// Renvoie true si l'email est dans le presse-papier.
export async function copierEmail(fenetre, html, texte) {
  const nav = fenetre.navigator;
  if (nav.clipboard && typeof nav.clipboard.write === 'function' && typeof fenetre.ClipboardItem === 'function') {
    try {
      await nav.clipboard.write([new fenetre.ClipboardItem({
        'text/html': new fenetre.Blob([html], { type: 'text/html' }),
        'text/plain': new fenetre.Blob([texte], { type: 'text/plain' }),
      })]);
      return true;
    } catch (e) { /* méthode ancienne ci-dessous */ }
  }
  return copieAncienne(fenetre, { 'text/html': html, 'text/plain': texte });
}

// Méthode ancienne : commande « copier » du navigateur, dont on remplace le contenu.
function copieAncienne(fenetre, contenus) {
  const doc = fenetre.document;
  let ecrit = false;
  const surCopie = ev => {
    for (const [type, valeur] of Object.entries(contenus)) ev.clipboardData.setData(type, valeur);
    ev.preventDefault();
    ecrit = true;
  };
  doc.addEventListener('copy', surCopie);
  let ok = false;
  try { ok = doc.execCommand('copy'); } catch (e) { ok = false; }
  doc.removeEventListener('copy', surCopie);
  return ok && ecrit;
}

// Sélectionne le contenu d'un élément, pour une copie à la main (Ctrl+C ou appui long).
export function selectionner(fenetre, element) {
  const selection = fenetre.getSelection();
  const plage = fenetre.document.createRange();
  plage.selectNodeContents(element);
  selection.removeAllRanges();
  selection.addRange(plage);
}

// Image de l'aperçu (EX-011), méthode du test T3 : largeur 560 pixels, densité 2.
export const IMAGE = Object.freeze({ largeur: 560, echelle: 2 });

// Code de l'image SVG qui contient l'email (XHTML dans un foreignObject).
export const svgDeLEmail = (xhtml, largeur, hauteur) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${largeur}" height="${hauteur}"><foreignObject x="0" y="0" width="100%" height="100%">${xhtml}</foreignObject></svg>`;

// Crée l'image PNG de l'email ; renvoie un Blob. L'email est mesuré hors écran, dans une
// racine fantôme qui ne reçoit pas les styles de la page, puis dessiné tel quel.
export async function creerImage(fenetre, html, charte = CHARTE) {
  const doc = fenetre.document;
  const { largeur, echelle } = IMAGE;
  const hote = doc.createElement('div');
  hote.style.cssText = 'position:fixed;left:-10000px;top:0;';
  const racine = hote.attachShadow({ mode: 'open' });
  racine.innerHTML = `<style>:host{all:initial}</style>${html}`;
  const email = racine.lastElementChild;
  email.style.width = `${largeur}px`;
  doc.body.append(hote);
  try {
    await Promise.all([...email.querySelectorAll('img')].map(i => (i.decode ? i.decode().catch(() => {}) : null)));
    const hauteur = Math.ceil(email.getBoundingClientRect().height);
    const svg = svgDeLEmail(new fenetre.XMLSerializer().serializeToString(email), largeur, hauteur);
    const dessin = await new Promise((ok, ko) => {
      const img = new fenetre.Image();
      img.onload = () => ok(img);
      img.onerror = () => ko(new Error("le navigateur n'a pas pu dessiner l'email"));
      img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    });
    const canevas = doc.createElement('canvas');
    canevas.width = largeur * echelle;
    canevas.height = hauteur * echelle;
    const ctx = canevas.getContext('2d');
    ctx.fillStyle = charte.couleurs.fondPage;
    ctx.fillRect(0, 0, canevas.width, canevas.height);
    ctx.drawImage(dessin, 0, 0, canevas.width, canevas.height);
    return await new Promise((ok, ko) => canevas.toBlob(b => (b ? ok(b) : ko(new Error('image vide'))), 'image/png'));
  } finally {
    hote.remove();
  }
}

// Téléchargement d'un fichier créé dans la page ; l'adresse temporaire est libérée ensuite.
export function telecharger(fenetre, blob, nom) {
  const doc = fenetre.document;
  const adresse = fenetre.URL.createObjectURL(blob);
  const lien = doc.createElement('a');
  lien.href = adresse;
  lien.download = nom;
  lien.hidden = true;
  doc.body.append(lien);
  lien.click();
  lien.remove();
  fenetre.setTimeout(() => fenetre.URL.revokeObjectURL(adresse), 60000);
}

// Partage d'un fichier par le menu du téléphone (DEC-080). Renvoie « partage », « annule »
// (le rédacteur a fermé le menu) ou « impossible ».
export async function partagerFichier(fenetre, blob, nom) {
  const nav = fenetre.navigator;
  try {
    const fichier = new fenetre.File([blob], nom, { type: blob.type });
    if (!(typeof nav.canShare === 'function' && nav.canShare({ files: [fichier] }))) return 'impossible';
    await nav.share({ files: [fichier] });
    return 'partage';
  } catch (e) {
    return e && e.name === 'AbortError' ? 'annule' : 'impossible';
  }
}
