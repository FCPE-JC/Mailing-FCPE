// US-002 « Aucune requête réseau » (EX-017, DEC-070, TEC-004) : chaque page publiée porte la règle
// de sécurité, et aucun fichier du site ne charge quoi que ce soit d'un autre site.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fichiersDuSite, lireDuSite } from './aides.js';

const PAGES = fichiersDuSite(['.html']);
const CODE = fichiersDuSite(['.js', '.css', '.html']);

// La règle exigée, directive par directive.
const DIRECTIVES_EXIGEES = [
  "default-src 'none'",
  "script-src 'self'",
  "connect-src 'none'",
  "form-action 'none'",
  "base-uri 'none'",
];

function regleDeSecurite(html) {
  const balise = html.match(/<meta\s+http-equiv="Content-Security-Policy"\s+content="([^"]*)"\s*>/i);
  return balise ? { contenu: balise[1], position: balise.index } : null;
}

test('US-002 : le site publié contient au moins une page', () => {
  assert.ok(PAGES.length > 0);
});

for (const page of PAGES) {
  test(`US-002 : ${page} porte la règle de sécurité complète`, () => {
    const html = lireDuSite(page);
    const regle = regleDeSecurite(html);
    assert.ok(regle, 'règle de sécurité absente');
    const directives = regle.contenu.split(';').map(d => d.trim());
    for (const d of DIRECTIVES_EXIGEES) assert.ok(directives.includes(d), `directive manquante : ${d}`);
    assert.ok(!/(https?:|wss?:|\*)/.test(regle.contenu), 'la règle autorise un autre site');
  });

  test(`US-002 : dans ${page}, la règle de sécurité précède tout script et toute feuille de style`, () => {
    const html = lireDuSite(page);
    const regle = regleDeSecurite(html);
    assert.ok(regle, 'règle de sécurité absente');
    for (const balise of ['<script', '<link', '<style']) {
      const position = html.toLowerCase().indexOf(balise);
      if (position >= 0) assert.ok(regle.position < position, `${balise} placé avant la règle`);
    }
  });
}

for (const fichier of CODE) {
  test(`US-002 : ${fichier} ne charge rien depuis un autre site`, () => {
    const texte = lireDuSite(fichier);
    // Adresses externes dans les attributs src et href, les url() des styles et les imports.
    const motifs = [
      /\b(?:src|href)\s*=\s*["']\s*(?:https?:|\/\/)/i,
      /url\(\s*["']?\s*(?:https?:|\/\/)/i,
      /\bimport\s*(?:[^'"]*from\s*)?\(?\s*["']\s*(?:https?:|\/\/)/i,
      /@import/i,
    ];
    for (const motif of motifs) assert.ok(!motif.test(texte), `adresse externe trouvée (${motif})`);
  });

  test(`US-002 : ${fichier} n'utilise aucune fonction d'envoi réseau`, () => {
    const texte = lireDuSite(fichier);
    const fonctions = [/\bfetch\s*\(/, /XMLHttpRequest/, /\bWebSocket\b/, /\bEventSource\b/, /sendBeacon/, /RTCPeerConnection/];
    for (const motif of fonctions) assert.ok(!motif.test(texte), `fonction réseau trouvée (${motif})`);
  });
}
