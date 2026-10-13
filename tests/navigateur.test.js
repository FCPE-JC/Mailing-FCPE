// US-003 « Navigateur vérifié au démarrage » (EX-018, DEC-072, TEC-006) : chaque fonction absente
// est nommée avec sa solution de repli ; rien ne s'affiche quand tout fonctionne.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { FONCTIONS, detecterFonctions, fonctionsAbsentes, afficherAvertissement } from '../docs/js/navigateur.js';
import { FauxDocument, lireDuSite } from './aides.js';

// Faux navigateur : « avec » liste les fonctions présentes.
function fauxNavigateur(avec) {
  const document = {
    createElement: () => (avec.includes('image')
      ? { getContext: () => ({}), toBlob: () => {} }
      : { getContext: () => null }),
  };
  const navigator = {};
  const fenetre = { document, navigator };
  if (avec.includes('copie')) {
    navigator.clipboard = { write: async () => {} };
    fenetre.ClipboardItem = function ClipboardItem() {};
  }
  if (avec.includes('image')) fenetre.XMLSerializer = function XMLSerializer() {};
  if (avec.includes('partage')) navigator.canShare = () => true;
  fenetre.File = function File() {};
  return fenetre;
}

test('US-003 : un navigateur complet ne déclenche aucun avertissement', () => {
  const resultat = detecterFonctions(fauxNavigateur(['copie', 'image', 'partage']));
  assert.deepEqual(resultat, { copie: true, image: true, partage: true });
  assert.deepEqual(fonctionsAbsentes(resultat), []);
});

test('US-003 : chaque fonction absente est détectée séparément', () => {
  for (const f of FONCTIONS) {
    const autres = FONCTIONS.filter(g => g !== f).map(g => g.identifiant);
    const absentes = fonctionsAbsentes(detecterFonctions(fauxNavigateur(autres)));
    assert.deepEqual(absentes.map(a => a.identifiant), [f.identifiant]);
  }
});

test('US-003 : un navigateur qui refuse le partage de fichier est bien signalé', () => {
  const fenetre = fauxNavigateur(['copie', 'image']);
  fenetre.navigator.canShare = () => false;
  assert.equal(detecterFonctions(fenetre).partage, false);
});

test('US-003 : une erreur pendant la vérification compte comme une fonction absente', () => {
  const fenetre = fauxNavigateur(['copie', 'image', 'partage']);
  fenetre.document.createElement = () => { throw new Error('refus'); };
  fenetre.navigator.canShare = () => { throw new Error('refus'); };
  const resultat = detecterFonctions(fenetre);
  assert.equal(resultat.image, false);
  assert.equal(resultat.partage, false);
});

test('US-003 : chaque fonction a un nom et une solution de repli en français', () => {
  assert.deepEqual(FONCTIONS.map(f => f.identifiant), ['copie', 'image', 'partage']);
  for (const f of FONCTIONS) {
    assert.ok(f.nom.length > 5);
    assert.ok(f.repli.length > 20);
  }
});

test('US-003 : l’avertissement reste caché quand tout fonctionne', () => {
  const doc = new FauxDocument();
  const zone = doc.createElement('div');
  zone.hidden = false;
  afficherAvertissement(zone, []);
  assert.equal(zone.hidden, true);
  assert.equal(zone.enfants.length, 0);
});

test('US-003 : l’avertissement nomme la fonction absente et sa solution de repli', () => {
  const doc = new FauxDocument();
  const zone = doc.createElement('div');
  zone.hidden = true;
  const absentes = FONCTIONS.filter(f => f.identifiant === 'partage');
  afficherAvertissement(zone, absentes);
  assert.equal(zone.hidden, false);
  assert.match(zone.texte, /une fonction/);
  assert.match(zone.texte, /Partager l'image/);
  assert.match(zone.texte, /Enregistrer l'image/);
});

test('US-003 : la page prévoit la zone d’avertissement et le message « navigateur trop ancien »', () => {
  const html = lireDuSite('index.html');
  assert.match(html, /id="avertissement-navigateur"[^>]*role="alert"[^>]*hidden/);
  assert.match(html, /id="navigateur-trop-ancien"/);
  assert.match(html, /<div id="application" hidden>/);
});
