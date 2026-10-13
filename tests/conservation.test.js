// US-006 « Rien de conservé » (EX-017, DEC-071, TEC-005) : le code n'utilise ni cookie,
// ni stockage local, ni base locale, ni mise en cache hors ligne.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fichiersDuSite, lireDuSite } from './aides.js';

const STOCKAGES = [
  [/document\s*\.\s*cookie/, 'cookie'],
  [/\blocalStorage\b/, 'stockage local'],
  [/\bsessionStorage\b/, 'stockage de session'],
  [/\bindexedDB\b/, 'base locale IndexedDB'],
  [/\bopenDatabase\b/, 'base locale WebSQL'],
  [/\bcaches\s*\./, 'cache du navigateur'],
  [/\bserviceWorker\b/, 'service hors ligne (service worker)'],
  [/\bstorage\s*\.\s*(?:getDirectory|persist)\b/, 'stockage de fichiers du navigateur'],
];

for (const fichier of fichiersDuSite(['.js', '.html'])) {
  test(`US-006 : ${fichier} ne conserve rien dans le navigateur`, () => {
    const texte = lireDuSite(fichier);
    for (const [motif, nom] of STOCKAGES) assert.ok(!motif.test(texte), `${nom} utilisé`);
  });
}
