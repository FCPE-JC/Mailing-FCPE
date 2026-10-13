// US-015 « Voir le type de chaque bloc » (EX-005, EX-008) : chaque bloc de l'aperçu porte
// l'étiquette de son type ; les étiquettes ne sont jamais dans le code copié (DEC du lot 4).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { preparerApercu } from '../docs/js/apercu.js';
import { NOM_TYPE } from '../docs/js/corrections.js';
import { lireDuDepot, lireDuSite } from './aides.js';

const QUINZE = lireDuDepot('etape-3/T1-T2/email-test-15-blocs.pivot.md');
const BRUT = lireDuDepot('etape-2/specimens/02-invitation.brut.txt');

// Retire de l'aperçu les repères et les étiquettes : il doit rester le code copié.
const sansEtiquettes = html => html
  .replace(/<div class="repere" data-bloc="[^"]*"><button type="button" class="etiquette-bloc">[^<]*<\/button>\n/g, '')
  .replace(/\n<\/div>/g, '')
  .replace(/ class="repere-pastille" data-bloc="[^"]*"/g, '');

test('US-015 : chaque bloc, surtitre et clôture de l’aperçu porte l’étiquette de son type', () => {
  const { doc, htmlEtiquete } = preparerApercu(QUINZE);
  doc.sections.forEach((s, k) => {
    if (s.surtitre) assert.ok(htmlEtiquete.includes(`data-bloc="${k}.titre"><button type="button" class="etiquette-bloc">Titre de section ▾`), `${k}.titre`);
    s.blocs.forEach((b, j) => {
      assert.ok(htmlEtiquete.includes(`data-bloc="${k}.${j}"><button type="button" class="etiquette-bloc">${NOM_TYPE[b.type]} ▾`), `${k}.${j}`);
    });
  });
  assert.ok(htmlEtiquete.includes('data-bloc="cloture"><button type="button" class="etiquette-bloc">Clôture ▾'));
});

test('US-015 : les noms des étiquettes sont ceux de la maquette', () => {
  assert.deepEqual(NOM_TYPE, {
    paragraphe: 'Paragraphe', accroche: 'Accroche', note: 'Note', titre: 'Titre de section', liste: 'Liste',
    bouton: 'Bouton', important: 'Important', date: 'Date et lieu', cloture: 'Clôture',
  });
});

test('US-015 : le code copié ne contient aucune étiquette ni aucun repère', () => {
  for (const texte of [QUINZE, BRUT]) {
    const { html } = preparerApercu(texte);
    assert.ok(!/etiquette-bloc|data-bloc|class="repere/.test(html));
    assert.ok(!/\sclass=/.test(html));
  }
});

test('US-015 : l’aperçu est le code copié, plus les étiquettes', () => {
  for (const texte of [QUINZE, BRUT]) {
    const { html, htmlEtiquete } = preparerApercu(texte);
    assert.notEqual(htmlEtiquete, html);
    assert.equal(sansEtiquettes(htmlEtiquete), html);
  }
});

test('US-015 : un texte du rédacteur ne peut pas imiter une étiquette (US-011)', () => {
  const { htmlEtiquete } = preparerApercu('## 🙏\n<button class="etiquette-bloc">x</button>\n\nBien cordialement,\nFCPE');
  assert.ok(!htmlEtiquete.includes('<button class="etiquette-bloc">x'));
});

test('US-015 : les étiquettes restent lisibles à 320 pixels (petite taille fixe, pas de débordement)', () => {
  const css = lireDuSite('style.css');
  assert.match(css, /\.etiquette-bloc \{[^}]*font: 600 11px/);
  assert.match(css, /\.apercu \{ margin: 0 -16px; overflow-x: auto; \}/);
});
