// US-009 « Coller un pivot », US-010 « Aperçu continu » et US-014 « Coller un texte brut ou un
// pivot » (EX-001, EX-003, EX-008, EX-019).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { preparerApercu, brancherApercu, LECTURES } from '../docs/js/apercu.js';
import { estPivot, detecterPivot, completerPastilles } from '../docs/js/detection.js';
import { rendreEmail } from '../docs/js/rendu.js';
import { lirePivot } from '../docs/js/pivot.js';
import { lireDuSite, lireDuDepot, pageBranchee } from './aides.js';

const REFERENCE = lireDuDepot('etape-2/specimens/00-reference-merci-elections.pivot.md');

test('US-009 : l’écran Écrire a une zone de texte et le bouton « Mettre en forme → » vers Vérifier', () => {
  const html = lireDuSite('index.html');
  const debut = html.indexOf('data-ecran="ecrire"');
  const ecran = html.slice(debut, html.indexOf('</section>', debut));
  assert.match(ecran, /<textarea id="texte"[^>]*autocomplete="off"/);
  assert.match(ecran, /<label for="texte"/);
  assert.match(ecran, /class="bouton" href="#verifier">Mettre en forme →</);
});

test('US-009 : un texte vide donne une invitation, pas un email vide', () => {
  assert.deepEqual(preparerApercu(''), { vide: true });
  assert.deepEqual(preparerApercu('  \n\n '), { vide: true });
  assert.match(lireDuSite('index.html'), /id="apercu-vide"[^>]*>Colle d'abord un texte/);
});

test('US-010 : l’aperçu est exactement le code de l’email qui sera copié', () => {
  const apercu = preparerApercu(REFERENCE);
  assert.equal(apercu.vide, false);
  assert.equal(apercu.html, rendreEmail(lirePivot(REFERENCE)));
  assert.equal(apercu.objet, 'Merci pour votre confiance 🗳️');
});

test('US-010 : l’aperçu se met à jour à chaque modification du texte', () => {
  const { elements, taper } = pageBranchee();
  assert.equal(elements['apercu-vide'].hidden, false);
  assert.equal(elements.verification.hidden, true);

  taper(REFERENCE);
  assert.equal(elements['apercu-vide'].hidden, true);
  assert.equal(elements.verification.hidden, false);
  assert.equal(elements.apercu.innerHTML, preparerApercu(REFERENCE).htmlEtiquete);
  assert.equal(elements.objet.value, 'Merci pour votre confiance 🗳️');

  taper(REFERENCE.replace('Merci pour votre confiance', 'Nouvel objet'));
  assert.equal(elements.objet.value, 'Nouvel objet 🗳️');

  taper('');
  assert.equal(elements.verification.hidden, true);
  assert.equal(elements.apercu.innerHTML, '');
});

test('US-010 : sans ligne Objet, le champ de l’objet est vide et l’aide le dit (US-019)', () => {
  const { elements, taper } = pageBranchee();
  taper('Chers parents,\n\nTexte.');
  assert.equal(elements.objet.value, '');
  assert.match(elements['objet-messages'].texte, /Ajoute un objet/);
});

const BRUT = lireDuDepot('etape-2/specimens/00-reference-merci-elections.brut.txt');

test('US-014 : la syntaxe pivot (## , ::: ou une ligne > ) fait lire le texte comme un pivot', () => {
  for (const t of ['## 🙏\nMerci.', 'Texte.\n### Titre\nSuite.', 'Texte.\n##\nSuite.', '::: important\nA\n:::', 'Intro.\n> Accroche', '  > Accroche']) {
    assert.equal(estPivot(t), true, t);
  }
  for (const t of [BRUT, 'Texte.\n#hashtag', 'Note : 3 > 2', '>Collé', 'Bonjour ::', '']) {
    assert.equal(estPivot(t), false, t);
  }
});

test('US-014 : un pivot est lu tel quel, sans détection', () => {
  const apercu = preparerApercu(REFERENCE);
  assert.equal(apercu.lecture, 'pivot');
  assert.equal(apercu.pivot, REFERENCE);
  assert.equal(apercu.html, rendreEmail(lirePivot(REFERENCE)));
});

test('US-014 : un texte brut passe par la détection, puis par la lecture du pivot', () => {
  const apercu = preparerApercu(BRUT);
  assert.equal(apercu.lecture, 'detection');
  assert.equal(apercu.pivot, lireDuDepot('etape-2/specimens/00-reference-merci-elections.pivot-detecte.md'));
  assert.equal(apercu.html, rendreEmail(completerPastilles(lirePivot(detecterPivot(BRUT)))));
  assert.ok(apercu.html.includes('Répondre au questionnaire →'));
});

test('US-014 : l’écran Vérifier dit quelle lecture a été faite, à chaque modification', () => {
  const { elements, taper } = pageBranchee();
  assert.equal(elements.verification.hidden, true);
  taper(BRUT);
  assert.equal(elements.verification.hidden, false);
  assert.equal(elements.lecture.textContent, LECTURES.detection);
  taper(REFERENCE);
  assert.equal(elements.lecture.textContent, LECTURES.pivot);
  taper('');
  assert.equal(elements.verification.hidden, true);
  assert.match(lireDuSite('index.html'), /<div id="verification"[^>]*hidden>\s*<p id="lecture"/);
});

test('US-014 : le texte d’aide de l’écran Écrire mentionne le texte brut et le pivot', () => {
  const html = lireDuSite('index.html');
  const debut = html.indexOf('data-ecran="ecrire"');
  const ecran = html.slice(debut, html.indexOf('</section>', debut));
  assert.match(ecran, /mis en forme automatiquement/);
  assert.match(ecran, /format pivot est lu tel quel/);
});
