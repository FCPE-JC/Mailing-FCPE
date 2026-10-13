// US-004 « Paramètres séparés » (EX-007, EX-025, DEC-069, TEC-003) : la charte et les modèles types
// sont dans deux fichiers commentés, et aucun autre fichier ne contient de couleur de la charte.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CHARTE } from '../docs/parametres/charte.js';
import { MODELES } from '../docs/parametres/modeles.js';
import { fichiersDuSite, lireDuSite, lireDuDepot } from './aides.js';

// Couleurs relevées dans le tableau « 2. Palette » de etape-2/charte-blocs.md.
function couleursDeLaCharteValidee() {
  const md = lireDuDepot('etape-2/charte-blocs.md');
  const palette = md.slice(md.indexOf('## 2. Palette'), md.indexOf('## 3.'));
  return [...new Set((palette.match(/^\|[^|]*\|\s*(#[0-9a-f]{6})\s*\|/gim) || [])
    .map(ligne => ligne.match(/#[0-9a-f]{6}/i)[0].toLowerCase()))];
}

// Le blanc est une couleur neutre, utilisée aussi par l'outil : il n'est pas propre à la charte.
const NEUTRES = ['#ffffff', '#000000'];

test('US-004 : chaque couleur de la charte validée est dans le fichier de la charte', () => {
  const attendues = couleursDeLaCharteValidee();
  assert.ok(attendues.length >= 11, `palette lue : ${attendues.length} couleurs`);
  const presentes = Object.values(CHARTE.couleurs).map(c => c.toLowerCase());
  for (const c of attendues) assert.ok(presentes.includes(c), `couleur absente : ${c}`);
});

test('US-004 : les textes fixes de l’en-tête et de la signature sont dans le fichier de la charte', () => {
  assert.equal(CHARTE.entete.ligne1, 'Représentants des parents d’élèves');
  assert.equal(CHARTE.entete.ligne2, 'École élémentaire Joliot-Curie');
  assert.equal(CHARTE.textes.salutation, 'Chers parents,');
  assert.equal(CHARTE.textes.formuleSignature, 'Bien cordialement,');
  assert.equal(CHARTE.textes.signataire, 'Vos représentants FCPE');
});

test('US-004 : l’en-tête suit la variante V1 (DEC-078)', () => {
  assert.equal(CHARTE.entete.largeurLogo, 88);
  assert.equal(CHARTE.entete.largeurColonneLogo, 96);
});

test('US-004 : le logo est intégré en base64, jamais chargé depuis un serveur', () => {
  assert.match(CHARTE.logo, /^data:image\/png;base64,[A-Za-z0-9+/]+=*$/);
  assert.ok(CHARTE.logo.length > 1000, 'logo trop court');
});

test('US-004 : la charte ne peut pas être modifiée par le code de l’outil', () => {
  assert.ok(Object.isFrozen(CHARTE));
  assert.ok(Object.isFrozen(CHARTE.couleurs));
});

test('US-004 : le fichier des modèles types existe et contient une liste', () => {
  assert.ok(Array.isArray(MODELES));
});

test('US-004 : les deux fichiers de paramètres sont commentés', () => {
  for (const fichier of ['parametres/charte.js', 'parametres/modeles.js']) {
    const debut = lireDuSite(fichier).split('\n').slice(0, 5).join('\n');
    assert.match(debut, /^\/\/ Mailing-FCPE : /, `${fichier} : en-tête de commentaire absent`);
  }
});

test('US-004 : aucun autre fichier du site ne contient de couleur de la charte', () => {
  const couleurs = Object.values(CHARTE.couleurs).map(c => c.toLowerCase()).filter(c => !NEUTRES.includes(c));
  for (const fichier of fichiersDuSite(['.js', '.css', '.html'])) {
    if (fichier === 'parametres/charte.js') continue;
    const texte = lireDuSite(fichier).toLowerCase();
    for (const c of couleurs) assert.ok(!texte.includes(c), `${fichier} contient ${c}`);
  }
});
