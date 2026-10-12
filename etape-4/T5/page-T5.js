// Test T5 (étape 4) : copie vers Gmail, image d'aperçu, bouton Partager et avertissement avant de quitter,
// depuis l'adresse GitHub Pages. Aucune bibliothèque ; aucune requête réseau (règle de sécurité de la page).
'use strict';

const LARGEUR = 560;   // largeur de l'email dans l'image, en pixels CSS (comme T3)
const ECHELLE = 2;     // densité de l'image : 2 pixels par pixel CSS
const NOM_IMAGE = 'apercu-test-T5.png';
let image = null;      // dernière image créée (Blob PNG)

const $ = id => document.getElementById(id);

function afficher(id, ok, texte) {
  const r = $(id);
  r.className = 'resultat ' + (ok === null ? '' : ok ? 'ok' : 'ko');
  r.textContent = texte;
}

function navigateur() {
  const ua = navigator.userAgent;
  const nav = /Edg\//.test(ua) ? 'Edge' : /Firefox\//.test(ua) ? 'Firefox' : /CriOS|Chrome\//.test(ua) ? 'Chrome' : /Safari\//.test(ua) ? 'Safari' : 'autre';
  const sys = /Windows/.test(ua) ? 'Windows' : /iPhone|iPad/.test(ua) ? 'iPhone/iPad' : /Android/.test(ua) ? 'Android' : /Mac OS X/.test(ua) ? 'Mac' : 'autre';
  return 'Navigateur : ' + nav + ' · Système : ' + sys + ' · Écran : ' + window.innerWidth + ' px';
}

// 1. Vérification des fonctions au démarrage (prototype de DEC-072).
function verifier() {
  const fichierTest = (() => { try { return new File([''], 'test.png', { type: 'image/png' }); } catch (e) { return null; } })();
  const lignes = [
    ['Copier en HTML', !!(navigator.clipboard && navigator.clipboard.write && window.ClipboardItem)],
    ["Dessiner l'image", !!document.createElement('canvas').getContext && !!window.XMLSerializer],
    ['Partager un fichier', !!(navigator.canShare && fichierTest && navigator.canShare({ files: [fichierTest] }))],
  ];
  $('verifs').innerHTML = '';
  lignes.forEach(([nom, ok]) => {
    const li = document.createElement('li');
    li.textContent = (ok ? '✅ ' : '❌ ') + nom + (ok ? ' : oui' : ' : non');
    $('verifs').appendChild(li);
  });
  $('env').textContent = navigateur();
}

// La règle de sécurité signale chaque blocage par cet évènement : c'est la preuve qu'elle est active.
document.addEventListener('securitypolicyviolation', e => {
  if (e.violatedDirective.startsWith('connect-src')) {
    afficher('res-reseau', true, 'Requête bloquée par la règle de sécurité (' + e.violatedDirective + '). La page ne peut rien envoyer.');
  }
});

$('essai-reseau').addEventListener('click', async () => {
  afficher('res-reseau', null, 'Essai en cours…');
  try {
    await fetch(location.href, { cache: 'no-store' });
    afficher('res-reseau', false, 'La requête est partie : la règle de sécurité ne fonctionne pas dans ce navigateur. Recopie ce message dans la fiche.');
  } catch (e) {
    // L'évènement securitypolicyviolation précise la cause ; sans lui, on affiche l'erreur brute.
    setTimeout(() => {
      if (!$('res-reseau').classList.contains('ok')) afficher('res-reseau', true, 'Requête refusée par le navigateur (' + (e.name || 'erreur') + ').');
    }, 300);
  }
});

// 2. Copie vers Gmail : HTML et texte brut, comme T1.
async function copier(id, libelle) {
  const source = $(id);
  const html = '<div style="' + source.getAttribute('style') + '">' + source.innerHTML + '</div>';
  try {
    await navigator.clipboard.write([new ClipboardItem({
      'text/html': new Blob([html], { type: 'text/html' }),
      'text/plain': new Blob([source.innerText], { type: 'text/plain' }),
    })]);
    afficher('res-copie', true, libelle + ' copié. Colle-le dans Gmail.');
  } catch (e) {
    afficher('res-copie', false, 'Copie refusée : ' + (e.name || 'erreur') + (e.message ? ' : ' + e.message : '') + '. Recopie ce message dans la fiche.');
  }
}
$('copier-email').addEventListener('click', () => copier('email', "L'email de test"));
$('copier-entetes').addEventListener('click', () => copier('entetes', "L'email des variantes d'en-tête"));

// 3. Image d'aperçu : technique de T3 (SVG foreignObject, puis canevas), image longue seule (DEC-056).
function chargerImage(src) {
  return new Promise((ok, ko) => {
    const img = new Image();
    img.onload = () => ok(img);
    img.onerror = () => ko(new Error("le navigateur n'a pas pu lire le dessin de l'email"));
    img.src = src;
  });
}

async function creerImage() {
  const email = $('email');
  const copie = document.createElement('div');
  copie.setAttribute('style', email.getAttribute('style') + 'width:' + LARGEUR + 'px;');
  copie.innerHTML = email.innerHTML;
  const hote = document.createElement('div');
  hote.style.cssText = 'position:fixed;left:-10000px;top:0;';
  hote.appendChild(copie);
  document.body.appendChild(hote);
  try {
    await Promise.all([...copie.querySelectorAll('img')].map(i => i.decode ? i.decode().catch(() => {}) : null));
    const hauteur = Math.ceil(copie.getBoundingClientRect().height);
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + LARGEUR + '" height="' + hauteur + '">' +
      '<foreignObject x="0" y="0" width="100%" height="100%">' + new XMLSerializer().serializeToString(copie) + '</foreignObject></svg>';
    const dessin = await chargerImage('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg));
    const canevas = document.createElement('canvas');
    canevas.width = LARGEUR * ECHELLE;
    canevas.height = hauteur * ECHELLE;
    const ctx = canevas.getContext('2d');
    ctx.fillStyle = '#f4f4f8';
    ctx.fillRect(0, 0, canevas.width, canevas.height);
    ctx.drawImage(dessin, 0, 0, canevas.width, canevas.height);
    return await new Promise((ok, ko) => canevas.toBlob(b => b ? ok(b) : ko(new Error('image vide')), 'image/png'));
  } finally {
    hote.remove();
  }
}

$('creer').addEventListener('click', async () => {
  $('creer').disabled = true;
  afficher('res-image', null, "Création en cours…");
  try {
    image = await creerImage();
    const apercu = $('apercu');
    apercu.innerHTML = '';
    const img = document.createElement('img');
    img.src = URL.createObjectURL(image);
    img.alt = "Image d'aperçu de l'email de test";
    apercu.appendChild(img);
    $('partager').disabled = !navigator.canShare;
    $('enregistrer').disabled = false;
    afficher('res-image', true, 'Image créée : ' + Math.round(image.size / 1024) + ' Ko.' + (navigator.canShare ? '' : ' Ce navigateur ne propose pas le bouton Partager.'));
  } catch (e) {
    afficher('res-image', false, 'Création impossible : ' + (e.name ? e.name + ' : ' : '') + (e.message || String(e)) + '. Recopie ce message dans la fiche.');
  } finally {
    $('creer').disabled = false;
  }
});

$('partager').addEventListener('click', async () => {
  const fichier = new File([image], NOM_IMAGE, { type: 'image/png' });
  if (!navigator.canShare({ files: [fichier] })) {
    afficher('res-image', false, "Ce navigateur refuse de partager l'image (canShare : non).");
    return;
  }
  try {
    await navigator.share({ files: [fichier] });
    afficher('res-image', true, 'Partage terminé. Vérifie dans WhatsApp que l’image est arrivée.');
  } catch (e) {
    afficher('res-image', e.name === 'AbortError' ? null : false, e.name === 'AbortError' ? 'Partage annulé.' : 'Partage impossible : ' + e.name + (e.message ? ' : ' + e.message : '') + '.');
  }
});

$('enregistrer').addEventListener('click', () => {
  const lien = document.createElement('a');
  lien.href = URL.createObjectURL(image);
  lien.download = NOM_IMAGE;
  document.body.appendChild(lien);
  lien.click();
  lien.remove();
  afficher('res-image', true, "Enregistrement demandé : vérifie la galerie ou les téléchargements.");
});

// 4. Avertissement avant de quitter (EX-029) : le navigateur affiche son propre message, s'il le permet.
function avertir(e) {
  e.preventDefault();
  e.returnValue = '';
}
$('non-exporte').addEventListener('change', e => {
  if (e.target.checked) window.addEventListener('beforeunload', avertir);
  else window.removeEventListener('beforeunload', avertir);
});

verifier();
