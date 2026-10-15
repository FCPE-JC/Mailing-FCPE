// Version 1.1.0 « Installer l'outil comme une application » (décision de Mat du 15/10/2026) :
// manifeste du site, icônes et balises pour l'écran d'accueil du téléphone, sans service worker
// ni rien de gardé hors connexion.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { CHARTE } from '../docs/parametres/charte.js';
import { SITE, fichiersDuSite, lireDuSite } from './aides.js';

const MANIFESTE = JSON.parse(lireDuSite('manifest.webmanifest'));

// Largeur et hauteur d'une image PNG, lues dans son en-tête.
function taillePng(chemin) {
  const octets = readFileSync(join(SITE, chemin));
  assert.equal(octets.toString('latin1', 1, 4), 'PNG', `${chemin} n'est pas une image PNG`);
  return `${octets.readUInt32BE(16)}x${octets.readUInt32BE(20)}`;
}

test('Application : le manifeste donne le nom, la langue, l\'adresse de départ et le plein écran', () => {
  assert.equal(MANIFESTE.name, 'Mailing-FCPE');
  assert.equal(MANIFESTE.short_name, 'Mailing FCPE');
  assert.equal(MANIFESTE.lang, 'fr');
  assert.equal(MANIFESTE.start_url, './');
  assert.equal(MANIFESTE.scope, './');
  assert.equal(MANIFESTE.display, 'standalone');
});

test('Application : les couleurs du manifeste sont celles de charte.js', () => {
  assert.equal(MANIFESTE.theme_color, CHARTE.couleurs.bleuEntete);
  assert.equal(MANIFESTE.background_color, CHARTE.couleurs.fondPage);
});

test('Application : les icônes du manifeste existent aux tailles annoncées (192, 512, masquable)', () => {
  const tailles = MANIFESTE.icons.map(i => `${i.sizes} ${i.purpose}`);
  for (const attendu of ['192x192 any', '512x512 any', '512x512 maskable']) assert.ok(tailles.includes(attendu), attendu);
  for (const icone of MANIFESTE.icons) {
    assert.equal(icone.type, 'image/png');
    assert.ok(!/^(?:https?:|\/\/|\/)/.test(icone.src), `${icone.src} : adresse hors du site`);
    assert.equal(taillePng(icone.src), icone.sizes, icone.src);
  }
});

test('Application : la page annonce le manifeste et l\'icône pour iPhone', () => {
  const html = lireDuSite('index.html');
  assert.match(html, /<link rel="manifest" href="manifest\.webmanifest\?v=[^"]+">/);
  const icone = html.match(/<link rel="apple-touch-icon" href="([^"?]+)\?v=[^"]+">/);
  assert.ok(icone, 'apple-touch-icon absent');
  assert.equal(taillePng(icone[1]), '180x180');
  assert.match(html, /<meta name="apple-mobile-web-app-capable" content="yes">/);
  assert.match(html, /<meta name="apple-mobile-web-app-title" content="Mailing FCPE">/);
});

test('Application : aucun fichier du site n\'enregistre de service worker (rien hors connexion)', () => {
  for (const fichier of fichiersDuSite(['.js', '.html', '.webmanifest'])) {
    const texte = lireDuSite(fichier);
    assert.ok(!/serviceWorker|\bregister\s*\(|"serviceworker"/i.test(texte), `${fichier} : service worker`);
  }
});
