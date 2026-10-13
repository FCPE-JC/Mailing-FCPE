// US-018 « Anomalies et conseils » (EX-026) et US-019 « Aide à l'objet » (EX-006) : l'outil
// signale sans corriger ; seuils de etape-2/charte-blocs.md et de la section 5 de
// etape-2/regles-detection.md, gardés tels quels comme conseils (DEC-106).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lirePivot } from '../docs/js/pivot.js';
import { conseils, aideObjet, SEUILS } from '../docs/js/conseils.js';
import { preparerApercu } from '../docs/js/apercu.js';
import { lireDuDepot, pageBranchee } from './aides.js';

const codes = texte => conseils(lirePivot(texte)).map(c => c.code);
const FIN = '\n\nBien cordialement,\nFCPE';

test('US-018 : chaque anomalie de la lecture a son message, sans rien corriger', () => {
  const cas = {
    'encadre-non-ferme': '## x\n::: important\nÉcole fermée.' + FIN,
    'lien-non-valide': '## x\n[Répondre](www.exemple.fr)' + FIN,
    'image-refusee': '## x\nVoici ![photo](https://exemple.fr/a.png)' + FIN,
    'signature-absente': '## x\nTexte.',
    'encadre-inconnu': '## x\n::: bizarre\nTexte.\n:::' + FIN,
  };
  for (const [code, texte] of Object.entries(cas)) {
    const c = conseils(lirePivot(texte)).find(x => x.code === code);
    assert.ok(c, code);
    assert.equal(c.niveau, 'anomalie');
    assert.ok(c.message.length > 10, code);
  }
  assert.equal(conseils(lirePivot('## x\n[Répondre](www.exemple.fr)' + FIN)).find(c => c.code === 'lien-non-valide').cible, '0.0');
});

test('US-018 : l’objet absent est traité par l’aide à l’objet, pas en double dans les conseils', () => {
  assert.ok(!codes('## x\nTexte.' + FIN).includes('objet-absent'));
});

test('US-018 : conseils de la charte, chacun avec le bloc concerné', () => {
  const sections = Array.from({ length: 8 }, (_, k) => `## 🙏 S${k}\nTexte ${k}.`).join('\n\n');
  assert.ok(codes(sections + FIN).includes('trop-de-sections'));
  assert.ok(!codes(Array.from({ length: 7 }, (_, k) => `## 🙏 S${k}\nTexte.`).join('\n\n') + FIN).includes('trop-de-sections'));

  const doc = lirePivot(`## 🙏\n> Une\n\n## 🏫\n> Deux\n\n::: important\nA\n:::\n\n::: important\nB\n:::\n\n## 🎉 ${'x'.repeat(41)}\n[${'y'.repeat(31)}](https://exemple.fr/)\n\n${Array.from({ length: 8 }, (_, k) => `- e${k}`).join('\n')}\n\n---\n${'z'.repeat(81)}${FIN}`);
  const liste = conseils(doc);
  const cible = code => liste.find(c => c.code === code)?.cible;
  assert.equal(cible('section-sans-surtitre'), '1.0');
  assert.equal(cible('plusieurs-accroches'), '1.0');
  assert.equal(cible('plusieurs-encadres'), '1.2');
  assert.equal(cible('surtitre-long'), '2.titre');
  assert.equal(cible('libelle-long'), '2.0');
  assert.equal(cible('liste-longue'), '2.1');
  assert.equal(cible('cloture-longue'), 'cloture');
  assert.ok(liste.every(c => c.niveau === 'conseil'));
  // La première section, qui porte souvent l'accroche, n'a pas besoin de surtitre.
  assert.ok(!liste.some(c => c.code === 'section-sans-surtitre' && c.cible === '0.0'));
});

test('US-018 : seuils de la charte', () => {
  assert.deepEqual([SEUILS.sectionsMax, SEUILS.surtitreMax, SEUILS.libelleMax, SEUILS.clotureMax, SEUILS.listeMax], [7, 40, 30, 80, 7]);
});

test('US-018 : sur la page, la ligne « 💡 N conseils » s’ouvre sur la liste et mène au bloc', () => {
  const { elements, taper } = pageBranchee();
  taper(lireDuDepot('etape-2/specimens/01-remerciement.brut.txt'));
  const n = conseils(preparerApercu(elements.texte.value).doc).length;
  assert.ok(n > 0);
  assert.equal(elements.conseils.hidden, false);
  assert.equal(elements['conseils-titre'].textContent, `💡 ${n} ${n > 1 ? 'conseils' : 'conseil'}`);
  const lien = elements['conseils-liste'].enfants.flatMap(li => li.enfants).find(b => b.className === 'lien-conseil');
  lien.declencher('click');
  assert.equal(elements.panneau.getAttribute('open'), '');
  taper('## 🙏 Merci\nTexte.' + FIN);
  assert.equal(elements.conseils.hidden, true);
});

test('US-019 : présence de l’objet', () => {
  assert.match(aideObjet('', null).messages[0], /Ajoute un objet/);
  assert.deepEqual(aideObjet('Café des parents jeudi 5 novembre', null).messages, []);
});

test('US-019 : longueur, 30 à 50 caractères conseillés, alerte au-delà de 60', () => {
  assert.equal(aideObjet('Café des parents jeudi 5 novembre').longueur, 33);
  assert.equal(aideObjet('Café des parents jeudi 5 novembre').conseillee, true);
  assert.equal(aideObjet('Café').conseillee, false);
  assert.deepEqual(aideObjet('x'.repeat(60)).messages, []);
  assert.match(aideObjet('x'.repeat(61)).messages[0], /coupé sur téléphone/);
  assert.equal(aideObjet('🗳️ Merci').longueur, 7, 'un émoji compte pour un caractère');
});

test('US-019 : un émoji au plus, en tête ou en fin', () => {
  assert.deepEqual(aideObjet('🗳️ Merci pour votre confiance').messages, []);
  assert.deepEqual(aideObjet('Merci pour votre confiance 🗳️').messages, []);
  assert.match(aideObjet('🗳️ Merci pour votre confiance 🙏').messages[0], /Un seul émoji/);
  assert.match(aideObjet('Merci 🗳️ pour votre confiance').messages[0], /Un seul émoji/);
});

test('US-019 : capitales, ponctuation forte et mots à risque', () => {
  assert.match(aideObjet('RÉUNION IMPORTANTE jeudi').messages.join(), /capitales/);
  assert.deepEqual(aideObjet('Réunion IMPORTANTE jeudi soir à l’école').messages, []);
  for (const o of ['Venez !!', 'Vraiment ?!', 'Quoi ???']) assert.match(aideObjet(o).messages.join(), /ponctuation forte/, o);
  for (const o of ['Atelier gratuit', 'Urgent!!!', 'Cliquez ici']) assert.match(aideObjet(o).messages.join(), /indésirables/, o);
});

test('US-019 : sans objet, l’outil propose le surtitre de la première section, sinon le début de l’accroche', () => {
  assert.deepEqual(aideObjet('', lirePivot('## 🎉 Fête de l’école\nTexte.')).propositions, ['Fête de l’école']);
  const accroche = lirePivot('## 🙏\n> Nous tenions à vous remercier **sincèrement** pour votre participation aux élections');
  assert.deepEqual(aideObjet('', accroche).propositions, ['Nous tenions à vous remercier sincèrement pour…']);
  assert.ok([...aideObjet('', accroche).propositions[0]].length <= SEUILS.debutAccroche + 1);
  assert.deepEqual(aideObjet('', lirePivot('## 🙏\nTexte.')).propositions, []);
});

test('US-019 : sur la page, l’objet se corrige dans son champ, avec compteur, messages et proposition', () => {
  const { elements, taper } = pageBranchee();
  taper('## 🎉 Fête de l’école\nTexte.' + FIN);
  assert.equal(elements.objet.value, '');
  const proposition = elements['objet-propositions'].enfants[0];
  assert.equal(proposition.textContent, 'Proposition : Fête de l’école');
  proposition.declencher('click');
  assert.ok(elements.texte.value.startsWith('Objet : Fête de l’école\n'));
  assert.equal(elements.objet.value, 'Fête de l’école');
  assert.equal(elements['objet-compteur'].textContent, '15');
  elements.objet.value = 'FÊTE GRATUITE !!';
  elements.objet.declencher('input');
  assert.equal(elements['objet-messages'].enfants.length, 3);
  elements.objet.declencher('change');
  assert.ok(elements.texte.value.startsWith('Objet : FÊTE GRATUITE !!\n'));
  assert.equal(elements.annuler.disabled, false);
});
