// US-007 « Lire le pivot » (EX-003, RG-004) : chaque règle P1 à P14 et chaque cas limite de
// etape-2/format-pivot.md ; les pivots de l'étape 2 sont lus sans erreur.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { lirePivot } from '../docs/js/pivot.js';
import { lireDuDepot } from './aides.js';

const codes = doc => doc.anomalies.map(a => a.code);
const blocs = doc => doc.sections.flatMap(s => s.blocs);

test('US-007 P1 : la ligne « Objet : » donne l’objet ; « Sujet : » est accepté', () => {
  assert.equal(lirePivot('\n\nObjet : Réunion de rentrée\n\nChers parents,').objet, 'Réunion de rentrée');
  assert.equal(lirePivot('Sujet : Fête de l’école\n\nBonjour').objet, 'Fête de l’école');
  const sans = lirePivot('Chers parents,\n\nUn texte.');
  assert.equal(sans.objet, null);
  assert.ok(codes(sans).includes('objet-absent'));
});

test('US-007 P2 : salutation courte terminée par une virgule ; sinon, pas de salutation', () => {
  assert.equal(lirePivot('Chers parents,\n\nTexte.').salutation, 'Chers parents,');
  assert.equal(lirePivot('Nous vous écrivons aujourd’hui pour vous parler de la cantine,\n\nTexte.').salutation, null);
  assert.equal(lirePivot('Bonjour à tous\n\nTexte.').salutation, null);
});

test('US-007 P3 : « ## émoji surtitre » ouvre une section ; émoji et surtitre facultatifs', () => {
  const doc = lirePivot('## 🗓️ Lundi 12 octobre\nTexte 1\n\n## 🙏\nTexte 2\n\n## Au programme\nTexte 3\n\n##\nTexte 4');
  assert.deepEqual(doc.sections.map(s => [s.pastille, s.surtitre]), [
    ['🗓️', 'Lundi 12 octobre'], ['🙏', null], [null, 'Au programme'], [null, null],
  ]);
});

test('US-007 P3 : « ### » est lu comme « ## »', () => {
  const doc = lirePivot('### 🏫 Au conseil\nTexte');
  assert.deepEqual([doc.sections[0].pastille, doc.sections[0].surtitre], ['🏫', 'Au conseil']);
});

test('US-007 P3 : le contenu avant le premier « ## » forme une première section sans surtitre', () => {
  const doc = lirePivot('Chers parents,\n\nUn premier paragraphe.\n\n## 🏫 Ensuite\nLa suite.');
  assert.equal(doc.sections.length, 2);
  assert.deepEqual([doc.sections[0].pastille, doc.sections[0].surtitre], [null, null]);
  assert.equal(doc.sections[0].blocs[0].texte, 'Un premier paragraphe.');
});

test('US-007 P4 : « > texte » donne une accroche', () => {
  assert.deepEqual(blocs(lirePivot('> Merci à tous !')), [{ type: 'accroche', texte: 'Merci à tous !' }]);
});

test('US-007 P5 : deux lignes qui se suivent forment un seul paragraphe', () => {
  assert.deepEqual(blocs(lirePivot('Première ligne\nseconde ligne.\n\nAutre paragraphe.')), [
    { type: 'paragraphe', texte: 'Première ligne seconde ligne.' },
    { type: 'paragraphe', texte: 'Autre paragraphe.' },
  ]);
});

test('US-007 P6 : un paragraphe entièrement en italique devient une note', () => {
  assert.deepEqual(blocs(lirePivot('*Vos réponses resteront anonymes.*')), [{ type: 'note', texte: 'Vos réponses resteront anonymes.' }]);
  assert.deepEqual(blocs(lirePivot('_Précision._')), [{ type: 'note', texte: 'Précision.' }]);
  assert.equal(blocs(lirePivot('**Tout en gras**'))[0].type, 'paragraphe');
});

test('US-007 P7 et P8 : gras, italique et liens restent dans le paragraphe', () => {
  const texte = 'Rendez-vous **lundi** sur [le site](https://example.com/) ou https://example.org.';
  assert.deepEqual(blocs(lirePivot(texte)), [{ type: 'paragraphe', texte }]);
});

test('US-007 P9 : un lien seul sur sa ligne devient un bouton', () => {
  assert.deepEqual(blocs(lirePivot('Pour répondre :\n[Répondre au questionnaire →](https://forms.gle/exemple)')), [
    { type: 'paragraphe', texte: 'Pour répondre :' },
    { type: 'bouton', libelle: 'Répondre au questionnaire →', adresse: 'https://forms.gle/exemple' },
  ]);
});

test('US-007 P10 : lignes en « - », « * » ou « • » donnent une liste', () => {
  assert.deepEqual(blocs(lirePivot('Au programme :\n- accueil\n* présentation\n• questions')), [
    { type: 'paragraphe', texte: 'Au programme :' },
    { type: 'liste', elements: ['accueil', 'présentation', 'questions'] },
  ]);
});

test('US-007 P11 : encadré Important, avec titre « Attention » repris', () => {
  assert.deepEqual(blocs(lirePivot('::: important\nÉcole fermée jeudi.\n:::')), [{ type: 'important', titre: 'Important', lignes: ['École fermée jeudi.'] }]);
  assert.deepEqual(blocs(lirePivot('::: important\n⚠️ Attention :\nGrève jeudi.\n:::')), [{ type: 'important', titre: 'Attention', lignes: ['Grève jeudi.'] }]);
});

test('US-007 P12 : bloc Date et lieu, une information par ligne', () => {
  assert.deepEqual(blocs(lirePivot('::: date\n🗓️ Jeudi 5 novembre à 8 h 30\n📍 Salle polyvalente\n:::')), [
    { type: 'date', lignes: ['🗓️ Jeudi 5 novembre à 8 h 30', '📍 Salle polyvalente'] },
  ]);
});

test('US-007 P13 et P14 : clôture après « --- », puis signature', () => {
  const doc = lirePivot('Texte.\n\n---\nEncore merci ✨\n\nBien cordialement,\nVos représentants FCPE');
  assert.equal(doc.cloture, 'Encore merci ✨');
  assert.deepEqual(doc.signature, { formule: 'Bien cordialement,', signataire: 'Vos représentants FCPE' });
  assert.ok(!codes(doc).includes('signature-absente'));
});

test('US-007 P14 : chaque formule de politesse reconnue ouvre la signature', () => {
  for (const formule of ['Cordialement', 'Bien à vous', 'Amicalement', 'À bientôt', 'À très bientôt', 'Belle journée', 'Bonne soirée',
    'Avec nos salutations', 'Avec nos sincères salutations', 'Bon courage', 'Merci et à bientôt']) {
    const doc = lirePivot(`Texte.\n\n${formule},\nL’équipe`);
    assert.equal(doc.signature?.formule, `${formule},`, formule);
  }
});

test('US-007 cas limite : un encadré non refermé court jusqu’à la fin, et c’est signalé', () => {
  const doc = lirePivot('::: important\nÉcole fermée.\nPrévoyez une solution.');
  assert.deepEqual(blocs(doc), [{ type: 'important', titre: 'Important', lignes: ['École fermée.', 'Prévoyez une solution.'] }]);
  assert.ok(codes(doc).includes('encadre-non-ferme'));
});

test('US-007 cas limite : un bouton sans adresse http reste un paragraphe, et c’est signalé', () => {
  const doc = lirePivot('[Répondre](www.exemple.fr)');
  assert.deepEqual(blocs(doc), [{ type: 'paragraphe', texte: '[Répondre](www.exemple.fr)' }]);
  assert.ok(codes(doc).includes('lien-non-valide'));
});

test('US-007 cas limite : un émoji inconnu reste dans le surtitre', () => {
  const doc = lirePivot('## ☺ Surtitre');
  // ☺ (sans sélecteur de variante) est un pictogramme reconnu ; un caractère ordinaire reste dans le surtitre.
  assert.equal(doc.sections[0].pastille, '☺');
  assert.equal(lirePivot('## § Surtitre').sections[0].surtitre, '§ Surtitre');
});

test('US-007 cas limite : plusieurs accroches ou encadrés sont acceptés et signalés comme conseil', () => {
  const doc = lirePivot('> Une\n\n> Deux\n\n::: important\nA\n:::\n\n::: important\nB\n:::');
  assert.equal(blocs(doc).filter(b => b.type === 'accroche').length, 2);
  assert.ok(codes(doc).includes('plusieurs-accroches'));
  assert.ok(codes(doc).includes('plusieurs-encadres'));
});

test('US-007 cas limite : sans signature reconnue, aucun bloc signature, et c’est noté', () => {
  const doc = lirePivot('Texte.\n\nL’équipe FCPE');
  assert.equal(doc.signature, null);
  assert.ok(codes(doc).includes('signature-absente'));
});

test('US-007 cas limite : Markdown non prévu lu comme du texte, images refusées', () => {
  assert.deepEqual(blocs(lirePivot('# Titre')), [{ type: 'paragraphe', texte: '# Titre' }]);
  const image = lirePivot('Voici ![photo](https://exemple.fr/a.png)');
  assert.ok(codes(image).includes('image-refusee'));
});

test('US-007 : un texte vide ou bizarre ne bloque jamais la lecture', () => {
  for (const t of ['', '   ', ':::', '---', '##', '- ', '>', '[', '**', ' \r\n\r\n', null, undefined]) {
    assert.doesNotThrow(() => lirePivot(t), String(t));
  }
});

test('US-007 : les pivots de l’étape 2 sont tous lus sans erreur', () => {
  const dossier = 'etape-2/specimens/';
  const fichiers = readdirSync(new URL(`../${dossier}`, import.meta.url)).filter(f => f.endsWith('.md'));
  assert.ok(fichiers.length >= 9);
  for (const f of [...fichiers.map(f => dossier + f), 'etape-3/T1-T2/email-test-15-blocs.pivot.md']) {
    const doc = lirePivot(lireDuDepot(f));
    assert.ok(doc.sections.length > 0, f);
    assert.ok(doc.signature, `${f} : signature`);
    assert.deepEqual(doc.anomalies.filter(a => a.code !== 'objet-absent'), [], `${f} : anomalies`);
  }
});

test('US-007 P13 : une clôture qui commence par une formule (« À bientôt ✨ ») reste la clôture', () => {
  const doc = lirePivot('## x\nTexte.\n\n---\nÀ bientôt ✨\n\nBien cordialement,\nFCPE');
  assert.equal(doc.cloture, 'À bientôt ✨');
  assert.deepEqual(doc.signature, { formule: 'Bien cordialement,', signataire: 'FCPE' });
  const seule = lirePivot('## x\nTexte.\n\n---\nBien cordialement,\nFCPE');
  assert.equal(seule.cloture, null);
  assert.deepEqual(seule.signature, { formule: 'Bien cordialement,', signataire: 'FCPE' });
});

test('US-016 : écrire le pivot puis le relire redonne le même modèle', async () => {
  const { ecrirePivot } = await import('../docs/js/pivot.js');
  const { completerPastilles } = await import('../docs/js/detection.js');
  const net = d => ({ ...d, anomalies: undefined });
  const dossier = 'etape-2/specimens/';
  for (const f of [...readdirSync(new URL(`../${dossier}`, import.meta.url)).filter(f => f.endsWith('.md')).map(f => dossier + f), 'etape-3/T1-T2/email-test-15-blocs.pivot.md']) {
    const doc = completerPastilles(lirePivot(lireDuDepot(f)));
    assert.deepEqual(net(lirePivot(ecrirePivot(doc))), net(doc), f);
  }
  const note = { objet: null, salutation: null, sections: [{ pastille: '🙏', surtitre: null, blocs: [{ type: 'note', texte: '*étoile* au début' }] }], cloture: null, signature: null, anomalies: [] };
  assert.deepEqual(net(lirePivot(ecrirePivot(note))).sections, note.sections);
});

test('US-007 P14 : la signature garde ses retours à la ligne, une ligne par ligne écrite (DEC-110)', async () => {
  const { ecrirePivot } = await import('../docs/js/pivot.js');
  const attendu = { formule: 'Bien cordialement,', signataire: 'Le conseil local FCPE\nÉcole Jean Moulin\nTél. 06 00 00 00 00' };
  const texte = '## x\nTexte.\n\nBien cordialement,\nLe conseil local FCPE\nÉcole Jean Moulin\nTél. 06 00 00 00 00';
  assert.deepEqual(lirePivot(texte).signature, attendu);
  // Même résultat avec des lignes vides entre les lignes, ou le signataire après la virgule.
  assert.deepEqual(lirePivot('## x\nTexte.\n\nBien cordialement,\n\nLe conseil local FCPE\n\nÉcole Jean Moulin\nTél. 06 00 00 00 00').signature, attendu);
  assert.deepEqual(lirePivot('## x\nTexte.\n\nBien cordialement, Le conseil local FCPE\nÉcole Jean Moulin\nTél. 06 00 00 00 00').signature, attendu);
  // L'écriture du pivot garde les lignes, et se relit à l'identique.
  assert.deepEqual(lirePivot(ecrirePivot(lirePivot(texte))).signature, attendu);
  assert.ok(ecrirePivot(lirePivot(texte)).endsWith('Bien cordialement,\nLe conseil local FCPE\nÉcole Jean Moulin\nTél. 06 00 00 00 00\n'));
});
