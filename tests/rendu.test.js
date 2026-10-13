// US-008 « Rendu selon la charte » (EX-007, RG-003) : l'outil redonne le rendu de l'outil de
// travail validé à l'étape 2 (rendu.py), à l'en-tête V1 (DEC-078) et aux espaces près.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { lirePivot } from '../docs/js/pivot.js';
import { rendreEmail, styleConteneur } from '../docs/js/rendu.js';
import { CHARTE } from '../docs/parametres/charte.js';
import { lireDuDepot } from './aides.js';

// Sources des références : tests/references/LISEZMOI.md.
const SOURCES = {
  'email-test-15-blocs.pivot': 'etape-3/T1-T2/email-test-15-blocs.pivot.md',
};
const source = nom => SOURCES[nom] || `etape-2/specimens/${nom}.md`;

// Ce que rendu.py écrit dans <body>, mis sous la forme copiée dans Gmail (T1, T5).
function attendu(reference) {
  const m = reference.match(/<body style="([^"]*)">([\s\S]*)<\/body>/);
  return `<div style="${m[1]}">${m[2].trim()}</div>`;
}

// Différences admises : l'en-tête (V1 depuis DEC-078), le logo, les espaces entre balises,
// et l'écriture de l'apostrophe (&#x27; chez Python, ' ici : même caractère affiché).
function normaliser(html) {
  return html
    .replace(/<tr><td style="padding:[^"]*;background:#263f9d;[\s\S]*?<\/td><\/tr><tr><td style="height:4px/, 'EN-TETE<tr><td style="height:4px')
    .replace(/&#x27;/g, "'")
    .replace(/\s+/g, ' ')
    .replace(/> </g, '><');
}

const references = readdirSync(new URL('./references/', import.meta.url)).filter(f => f.endsWith('.html'));

test('US-008 : les références de rendu.py sont présentes', () => {
  assert.ok(references.length >= 10);
});

for (const fichier of references) {
  const nom = fichier.replace(/\.html$/, '');
  test(`US-008 : ${nom} est rendu comme par rendu.py`, () => {
    const obtenu = rendreEmail(lirePivot(lireDuDepot(source(nom))));
    assert.equal(normaliser(obtenu), normaliser(attendu(lireDuDepot(`tests/references/${fichier}`))));
  });
}

test('US-008 : l’email de test contient les blocs de la charte', () => {
  const html = rendreEmail(lirePivot(lireDuDepot(SOURCES['email-test-15-blocs.pivot'])));
  const marques = {
    'en-tête': CHARTE.entete.ligne2,
    salutation: '<h1 ',
    'pastille verte': CHARTE.couleurs.fondPastilleVerte,
    'pastille bleue': CHARTE.couleurs.fondPastilleBleue,
    surtitre: 'text-transform:uppercase',
    accroche: `width="${CHARTE.dimensions.barreAccroche}"`,
    note: CHARTE.couleurs.texteSecondaire,
    liste: '●',
    bouton: 'target="_blank"',
    'lien de secours': 'ou : <a',
    'encadré Important': '⚠️ Important',
    'date et lieu': `border-radius:${CHARTE.dimensions.rayonDate}px`,
    séparateur: 'border-top:1px solid',
    signature: CHARTE.textes.signataire,
  };
  for (const [bloc, marque] of Object.entries(marques)) assert.ok(html.includes(marque), `bloc absent : ${bloc}`);
});

test('US-008 : l’en-tête suit la variante V1 et le logo intégré (DEC-078)', () => {
  const html = rendreEmail(lirePivot('Texte.'));
  assert.ok(html.includes(`<td width="96" valign="middle"><img src="${CHARTE.logo}" alt="FCPE" width="88"`));
  assert.ok(html.includes('padding:20px 20px 18px;background:#263f9d'));
});

test('US-008 : styles en ligne seulement, sans bloc <style> ni classe', () => {
  const html = rendreEmail(lirePivot(lireDuDepot(SOURCES['email-test-15-blocs.pivot'])));
  assert.ok(!/<style/i.test(html));
  assert.ok(!/\sclass=/i.test(html));
  assert.ok(html.startsWith(`<div style="${styleConteneur()}">`));
});

test('US-008 : toutes les couleurs du rendu viennent de la charte', () => {
  const html = rendreEmail(lirePivot(lireDuDepot(SOURCES['email-test-15-blocs.pivot'])));
  const permises = Object.values(CHARTE.couleurs).map(c => c.toLowerCase());
  for (const couleur of html.match(/#[0-9a-f]{6}\b/gi)) assert.ok(permises.includes(couleur.toLowerCase()), couleur);
});

test('US-008 : changer une couleur de la charte change le rendu (aucune valeur écrite en dur)', () => {
  const autre = { ...CHARTE, couleurs: { ...CHARTE.couleurs, bleuTitre: '#123456' } };
  const html = rendreEmail(lirePivot('Chers parents,\n\nTexte **important**.'), autre);
  assert.ok(html.includes('#123456'));
  assert.ok(!html.includes(CHARTE.couleurs.bleuTitre));
});

test('US-008 : une section sans émoji reçoit la pastille par défaut ℹ️', () => {
  const html = rendreEmail(lirePivot('## Au programme\nTexte.'));
  assert.ok(html.includes(`>${CHARTE.textes.pastilleParDefaut}</td>`));
});
