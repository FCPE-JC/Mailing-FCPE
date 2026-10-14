// US-029 à US-031 et ajouts de l'essai du lot 5a : pastilles complémentaires et « Autre »
// (DEC-109), texte du bloc (DEC-111), type Signature (DEC-114), prompt IA (DEC-120, DEC-121),
// bloc de code ignoré (DEC-122) et numéro de version des fichiers du site.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { lirePivot, ecrirePivot, estEmojiSeul, signatureDe } from '../docs/js/pivot.js';
import { rendreEmail } from '../docs/js/rendu.js';
import { choisirPastille, PASTILLES, detecterPivot } from '../docs/js/detection.js';
import { preparerApercu, retirerBlocCode } from '../docs/js/apercu.js';
import { choixPossibles, changerType, changerTexte, texteDuBloc, TEXTE_MODIFIABLE } from '../docs/js/corrections.js';
import { versionTexte } from '../docs/js/sorties.js';
import { PROMPT_IA } from '../docs/parametres/prompt-ia.js';
import { CHARTE } from '../docs/parametres/charte.js';
import { pageBranchee, fichiersDuSite, lireDuSite, lireDuDepot } from './aides.js';

const SIG = 'Chers parents,\n\n## 🎉 Fête\nVenez nombreux.\n\n---\nÀ l’année prochaine !';

// --- US-029 : pastilles (DEC-109) ---

test('US-029 : les sept nouvelles pastilles sont proposées, dix-huit en tout (DEC-109)', () => {
  assert.equal(PASTILLES.length, 18);
  for (const p of ['📢', '📚', '📅', '👨‍👩‍👧‍👦', '🗣️', '♻️', '🙋']) assert.ok(PASTILLES.includes(p), p);
});

test('US-029 : D16 reconnaît les mots-clés des nouvelles pastilles (DEC-109)', () => {
  const cas = [
    ['Une annonce importante pour la rentrée', '📢'], ['Les devoirs à la maison', '📚'], ['La vie de notre communauté', '👨‍👩‍👧‍👦'],
    ['Une consultation sur les horaires', '🗣️'], ['La collecte de piles usagées', '♻️'], ['Nous cherchons des bénévoles', '🙋'],
    ['Un coup de main pour la buvette', '🙋'], ['Recyclage et environnement', '♻️'],
  ];
  for (const [texte, pastille] of cas) assert.equal(choisirPastille(texte), pastille, texte);
});

test('US-029 : les nouveaux mots-clés passent avant ceux de 🤝, et 📅 n’est jamais choisi par D16', () => {
  assert.equal(choisirPastille('Rencontre avec les bénévoles'), '🙋');
  assert.equal(choisirPastille('Rencontre pour un débat'), '🗣️');
  assert.equal(choisirPastille('Rencontre'), '🤝');
  assert.equal(choisirPastille('Jeudi 5 novembre à 8 h 30'), '🗓️');
  for (const t of ['agenda', 'calendrier', 'échéance', 'date']) assert.notEqual(choisirPastille(t), '📅');
});

test('US-029 : « Autre » accepte un seul émoji, y compris composé, et refuse un texte', () => {
  for (const e of ['☕', '👨‍👩‍👧‍👦', '🗣️', '👍🏽', ' 🎈 ', 'ℹ️']) assert.ok(estEmojiSeul(e), e);
  for (const t of ['', 'a', 'café', '☕ café', '☕☕', ':)', '12']) assert.ok(!estEmojiSeul(t), t);
});

test('US-029 : sur la page, « Autre » change la pastille ou affiche un message', () => {
  const p = pageBranchee('Chers parents,\n\n## 🎉 Fête\nVenez.\n\nBien cordialement,\nX');
  p.elements.apercu.declencher('click', { target: { closest: () => ({ getAttribute: () => '0.0' }) }, preventDefault() {} });
  p.elements['panneau-autre'].value = 'café';
  p.elements['panneau-autre'].declencher('change');
  assert.equal(p.elements['panneau-autre-message'].textContent, 'Mets un seul émoji, sans texte.');
  assert.match(p.elements.texte.value, /## 🎉 Fête/);
  p.elements['panneau-autre'].value = '☕';
  p.elements['panneau-autre'].declencher('change');
  assert.equal(p.elements['panneau-autre-message'].textContent, '');
  assert.match(p.elements.texte.value, /## ☕ Fête/);
});

// --- US-030 : texte du bloc (DEC-111) ---

const DOC = lirePivot(`Chers parents,

## 🎉 Fête
Venez **nombreux**.
- un goûter
- un jeu

::: date
🗓️ Samedi 4 juin
📍 Cour
:::

::: important
Attention
Pensez aux bottes.
:::

---
À bientôt !

Bien cordialement,
Vos représentants FCPE`);

test('US-030 : le champ « Texte du bloc » montre le texte, une ligne par élément (DEC-111)', () => {
  assert.equal(texteDuBloc(DOC, '0.0'), 'Venez **nombreux**.');
  assert.equal(texteDuBloc(DOC, '0.1'), 'un goûter\nun jeu');
  assert.equal(texteDuBloc(DOC, '0.2'), '🗓️ Samedi 4 juin\n📍 Cour');
  assert.equal(texteDuBloc(DOC, '0.3'), 'Pensez aux bottes.');
  assert.equal(texteDuBloc(DOC, 'cloture'), 'À bientôt !');
  assert.equal(texteDuBloc(DOC, 'signature'), 'Bien cordialement,\nVos représentants FCPE');
  assert.equal(texteDuBloc(DOC, '0.titre'), null);
  assert.deepEqual([...TEXTE_MODIFIABLE], ['paragraphe', 'accroche', 'note', 'liste', 'date', 'important', 'cloture', 'signature']);
});

test('US-030 : modifier le texte change le bloc sans changer son type', () => {
  assert.deepEqual(changerTexte(DOC, '0.0', 'Venez\ntrès nombreux.').sections[0].blocs[0], { type: 'paragraphe', texte: 'Venez très nombreux.' });
  assert.deepEqual(changerTexte(DOC, '0.1', 'un goûter\n\nun jeu\nune tombola').sections[0].blocs[1].elements, ['un goûter', 'un jeu', 'une tombola']);
  assert.deepEqual(changerTexte(DOC, '0.3', 'Pensez aux bottes et aux gants.').sections[0].blocs[3], { type: 'important', titre: 'Attention', lignes: ['Pensez aux bottes et aux gants.'] });
  assert.equal(changerTexte(DOC, 'cloture', 'À très bientôt !').cloture, 'À très bientôt !');
  assert.deepEqual(changerTexte(DOC, 'signature', 'Amicalement,\nL’équipe\nÉcole Joliot-Curie').signature, { formule: 'Amicalement,', signataire: 'L’équipe\nÉcole Joliot-Curie' });
  assert.equal(DOC.sections[0].blocs[0].texte, 'Venez **nombreux**.', 'le modèle de départ ne change pas');
});

test('US-030 : un texte vidé retire le bloc ; une section vidée disparaît', () => {
  const d = changerTexte(DOC, '0.1', '  \n ');
  assert.deepEqual(d.sections[0].blocs.map(b => b.type), ['paragraphe', 'date', 'important']);
  assert.equal(changerTexte(DOC, 'cloture', '').cloture, null);
  assert.equal(changerTexte(DOC, 'signature', '').signature, null);
  const seul = lirePivot('## Seul\nTexte.\n\n## Autre\nSuite.');
  assert.equal(changerTexte(changerTexte(seul, '0.0', ''), '0.titre', '').sections.length, 2, 'un titre n’a pas ce champ');
});

test('US-030 : sur la page, le texte modifié réécrit le pivot et « Annuler » le défait (DEC-103)', () => {
  const depart = 'Chers parents,\n\n## 🎉 Fête\nVenez nombreux.\n\nBien cordialement,\nX';
  const p = pageBranchee(depart);
  p.elements.apercu.declencher('click', { target: { closest: () => ({ getAttribute: () => '0.0' }) }, preventDefault() {} });
  assert.equal(p.elements['panneau-texte-zone'].hidden, false);
  assert.equal(p.elements['panneau-texte'].value, 'Venez nombreux.');
  p.elements['panneau-texte'].value = 'Venez très nombreux.';
  p.elements['panneau-texte'].declencher('change');
  assert.match(p.elements.texte.value, /Venez très nombreux\./);
  assert.equal(p.elements.annuler.disabled, false);
  p.elements.annuler.declencher('click');
  assert.equal(p.elements.texte.value, depart);
});

// --- US-031 : type Signature (DEC-114) ---

test('US-031 : « ::: signature » donne une signature sans formule, rendue première ligne en gras bleu (DEC-110)', () => {
  const doc = lirePivot(`${SIG}\n\n::: signature\nL’équipe FCPE\nÉcole Joliot-Curie\n:::`);
  assert.deepEqual(doc.signature, { formule: null, signataire: 'L’équipe FCPE\nÉcole Joliot-Curie' });
  assert.equal(doc.cloture, 'À l’année prochaine !');
  assert.ok(!doc.anomalies.some(a => a.code === 'signature-absente'));
  const html = rendreEmail(doc);
  assert.match(html, new RegExp(`><strong style="color:${CHARTE.couleurs.bleuTitre};">L’équipe FCPE</strong><br>École Joliot-Curie</p>`));
  assert.match(versionTexte(doc, true), /\*L’équipe FCPE\*\nÉcole Joliot-Curie\n$/);
});

test('US-031 : une formule écrite dans « ::: signature » reste une formule (P14 inchangée)', () => {
  const doc = lirePivot(`${SIG}\n\n::: signature\nBien cordialement,\nVos représentants FCPE\n:::`);
  assert.deepEqual(doc.signature, { formule: 'Bien cordialement,', signataire: 'Vos représentants FCPE' });
  assert.deepEqual(lirePivot('Texte.\n\nBien cordialement,\nX').signature, { formule: 'Bien cordialement,', signataire: 'X' });
  assert.deepEqual(signatureDe(['À l’année prochaine !']), { formule: null, signataire: 'À l’année prochaine !' });
});

test('US-031 : la signature sans formule s’écrit « ::: signature » et se relit à l’identique (EX-028)', () => {
  const doc = lirePivot(`${SIG}\n\n::: signature\nL’équipe FCPE\n:::`);
  const pivot = ecrirePivot(doc);
  assert.match(pivot, /\n::: signature\nL’équipe FCPE\n:::\n$/);
  assert.equal(rendreEmail(lirePivot(pivot)), rendreEmail(doc));
  assert.equal(ecrirePivot(lirePivot(pivot)), pivot);
});

test('US-031 : seule la dernière « ::: signature » compte ; une signature vide est signalée', () => {
  const doc = lirePivot('Texte.\n\n::: signature\nA\n:::\n\n::: signature\nB\n:::');
  assert.deepEqual(doc.signature, { formule: null, signataire: 'B' });
  assert.ok(doc.anomalies.some(a => a.code === 'plusieurs-signatures'));
  assert.ok(doc.sections[0].blocs.some(b => b.texte === 'A'));
  assert.ok(lirePivot('Texte.\n\n::: signature\n:::').anomalies.some(a => a.code === 'signature-absente'));
});

test('US-031 : « Signature » est proposé pour la clôture, ou le dernier bloc sans clôture, et sans signature existante', () => {
  const sansSignature = lirePivot(SIG);
  const choix = repere => choixPossibles(sansSignature, repere).find(c => c.type === 'signature');
  assert.equal(choix('cloture').possible, true);
  assert.equal(choix('0.0').possible, false);
  const sansCloture = lirePivot('## 🎉 Fête\nVenez.\n\nL’équipe FCPE');
  assert.equal(choixPossibles(sansCloture, '0.1').find(c => c.type === 'signature').possible, true);
  assert.equal(choixPossibles(sansCloture, '0.0').find(c => c.type === 'signature').possible, false);
  const avec = lirePivot(`${SIG}\n\nBien cordialement,\nX`);
  assert.equal(choixPossibles(avec, 'cloture').find(c => c.type === 'signature').raison, 'L’email a déjà une signature.');
});

test('US-031 : le cas de l’essai du lot 4 — la clôture « À l’année prochaine ! » devient la signature', () => {
  const doc = changerType(lirePivot(SIG), 'cloture', 'signature');
  assert.equal(doc.cloture, null);
  assert.deepEqual(doc.signature, { formule: null, signataire: 'À l’année prochaine !' });
  assert.match(ecrirePivot(doc), /::: signature\nÀ l’année prochaine !\n:::\n$/);
});

test('US-031 : la signature peut redevenir un paragraphe ou la clôture, sans perte de texte', () => {
  const doc = lirePivot('## 🎉 Fête\nVenez.\n\n::: signature\nL’équipe FCPE\nÉcole\n:::');
  const para = changerType(doc, 'signature', 'paragraphe');
  assert.equal(para.signature, null);
  assert.deepEqual(para.sections[0].blocs.at(-1), { type: 'paragraphe', texte: 'L’équipe FCPE. École.' });
  const cloture = changerType(doc, 'signature', 'cloture');
  assert.equal(cloture.cloture, 'L’équipe FCPE. École.');
});

test('US-031 : sur la page, la signature porte une étiquette et ouvre le panneau, sans pastille', () => {
  const p = pageBranchee(`${SIG}\n\n::: signature\nL’équipe FCPE\n:::`);
  assert.match(p.elements.apercu.innerHTML, /data-bloc="signature"><button type="button" class="etiquette-bloc">Signature ▾/);
  p.elements.apercu.declencher('click', { target: { closest: () => ({ getAttribute: () => 'signature' }) }, preventDefault() {} });
  assert.equal(p.elements['panneau-section'].hidden, true);
  assert.equal(p.elements['panneau-texte'].value, 'L’équipe FCPE');
});

// --- DEC-120 à DEC-122 : prompt IA et bloc de code ---

test('US-027 : le prompt rappelle le bloc de code juste avant « MON TEXTE BRUT » (DEC-121)', () => {
  assert.equal(PROMPT_IA, lireDuDepot('etape-2/prompt-ia.txt'));
  assert.match(PROMPT_IA, /RAPPEL : réponds uniquement par le résultat, dans un seul bloc de code, sans commentaire avant ni après\.\n\nMON TEXTE BRUT\n/);
});

test('US-027 : le prompt cite les nouvelles pastilles et la signature sans formule (DEC-120)', () => {
  for (const p of ['📢', '📚', '🗣️', '♻️', '🙋']) assert.ok(PROMPT_IA.includes(p), p);
  assert.match(PROMPT_IA, /« ::: signature »/);
});

test('US-014 : les lignes ``` qui encadrent le texte collé sont ignorées (DEC-122)', () => {
  const pivot = lireDuDepot('etape-2/specimens/02-invitation.pivot-ia.md');
  for (const avec of ['```\n' + pivot + '\n```', '```text\n' + pivot + '```\n', '  ```markdown\n' + pivot + '\n```  \n']) {
    assert.equal(preparerApercu(avec).html, preparerApercu(pivot).html);
  }
  const brut = lireDuDepot('etape-2/specimens/02-invitation.brut.txt');
  assert.equal(preparerApercu('```\n' + brut + '\n```').html, preparerApercu(brut).html);
  // Un bloc de code au milieu du texte, ou non refermé, n'est pas touché.
  assert.equal(retirerBlocCode('Avant\n```\nx\n```'), 'Avant\n```\nx\n```');
  assert.equal(retirerBlocCode('```\nx'), '```\nx');
});

// --- Numéro de version des fichiers (essai du lot 5a) ---

const VERSION = JSON.parse(lireDuDepot('package.json')).version;

test('Version : chaque adresse de fichier du site porte le numéro de version de package.json', () => {
  assert.match(VERSION, /^\d+\.\d+\.\d+$/);
  const html = lireDuSite('index.html');
  assert.ok(html.includes(`href="style.css?v=${VERSION}"`));
  assert.ok(html.includes(`src="js/demarrage.js?v=${VERSION}"`));
  assert.ok(html.includes(`Version ${VERSION}`));
  for (const fichier of fichiersDuSite(['.js'])) {
    for (const [, chemin] of lireDuSite(fichier).matchAll(/from '(\.{1,2}\/[^']+)'/g)) {
      assert.ok(chemin.endsWith(`.js?v=${VERSION}`), `${fichier} : ${chemin}`);
    }
  }
});

test('Version : aucune autre version que celle de package.json dans le site', () => {
  for (const fichier of fichiersDuSite(['.js', '.html'])) {
    for (const [, v] of lireDuSite(fichier).matchAll(/\?v=([^'"]+)/g)) assert.equal(v, VERSION, fichier);
  }
});

test('US-029 : les spécimens bruts gardent la même détection avec les nouveaux mots-clés', () => {
  for (const f of readdirSync(new URL('../etape-2/specimens/', import.meta.url)).filter(n => n.endsWith('.brut.txt'))) {
    const attendu = lireDuDepot(`etape-2/specimens/${f.replace('.brut.txt', '.pivot-detecte.md')}`);
    assert.equal(detecterPivot(lireDuDepot(`etape-2/specimens/${f}`)), attendu, f);
  }
});
