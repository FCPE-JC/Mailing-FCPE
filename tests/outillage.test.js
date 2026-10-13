// US-005 « Tests en une commande » (EX-025, EX-028, DEC-067) : une seule commande documentée,
// Node.js pour seul outil, aucune installation de paquet.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lireDuDepot } from './aides.js';

test('US-005 : le dépôt ne déclare aucune dépendance', () => {
  const paquet = JSON.parse(lireDuDepot('package.json'));
  for (const champ of ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies', 'bundledDependencies']) {
    assert.ok(!(champ in paquet), `champ ${champ} présent`);
  }
  assert.equal(paquet.scripts.test, 'node --test');
});

test('US-005 : le README documente la commande des tests', () => {
  assert.match(lireDuDepot('README.md'), /node --test/);
});

test('US-005 : la vérification GitHub lance la même commande', () => {
  const verification = lireDuDepot('.github/workflows/tests.yml');
  assert.match(verification, /run: node --test/);
  assert.ok(!/npm (install|ci)/.test(verification), 'installation de paquets dans la vérification');
});
