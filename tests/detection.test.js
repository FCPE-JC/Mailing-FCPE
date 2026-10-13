// US-012 « Détecter les blocs d'un texte brut » (EX-001, EX-004) : chaque règle D1 à D15 de
// etape-2/regles-detection.md ; les six textes bruts de l'étape 2 donnent exactement le pivot
// de l'outil de travail detection.py (fichiers *.pivot-detecte.md, DEC du lot 3).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { detecter, detecterPivot, libelleBouton } from '../docs/js/detection.js';
import { lirePivot } from '../docs/js/pivot.js';
import { lireDuDepot } from './aides.js';

const DOSSIER = 'etape-2/specimens/';
const bruts = readdirSync(new URL(`../${DOSSIER}`, import.meta.url)).filter(f => f.endsWith('.brut.txt'));
const blocs = o => o.sections.flatMap(s => s.blocs);
const types = o => blocs(o).map(b => b[0]);

test('US-012 : les six textes bruts de l’étape 2 sont présents', () => {
  assert.equal(bruts.length, 6);
});

for (const f of bruts) {
  const nom = f.replace('.brut.txt', '');
  test(`US-012 : ${nom} donne exactement le pivot de detection.py`, () => {
    assert.equal(detecterPivot(lireDuDepot(DOSSIER + f)), lireDuDepot(`${DOSSIER}${nom}.pivot-detecte.md`));
  });
}

test('US-012 : le pivot détecté se lit sans anomalie', () => {
  for (const f of bruts) {
    const doc = lirePivot(detecterPivot(lireDuDepot(DOSSIER + f)));
    assert.deepEqual(doc.anomalies.filter(a => a.code !== 'objet-absent'), [], f);
  }
});

test('US-012 D1 : espaces insécables, fins de ligne Windows et espaces de fin sont préparés', () => {
  const o = detecter('Bonjour\u00A0à\u202Ftous,  \r\n\r\nUn texte.   \r\n\r\nDeux textes.\r\n\r\nCordialement,\r\nL’équipe');
  assert.equal(o.salutation, 'Bonjour à tous,');
  assert.deepEqual(blocs(o)[0], ['accroche', 'Un texte.']);
  assert.deepEqual(o.signature, ['Cordialement,', 'L’équipe']);
});

test('US-012 D2 : « Objet : » ou « Sujet : » en première ligne donne l’objet', () => {
  assert.equal(detecter('\n\nObjet : Fête de l’école\n\nTexte.').objet, 'Fête de l’école');
  assert.equal(detecter('Sujet: Réunion\n\nTexte.').objet, 'Réunion');
  assert.equal(detecter('Texte.\n\nObjet : trop tard').objet, null);
});

test('US-012 D3 : une adresse seule, une formule de politesse ou une liste s’isolent sans ligne vide', () => {
  const o = detecter('Intro.\n\nRépondez ici\n👉 https://forms.gle/abc\nMerci à tous pour votre aide.\n\nAutre.\n\nBien cordialement,\nL’équipe');
  assert.deepEqual(blocs(o).find(b => b[0] === 'bouton'), ['bouton', ['Répondre au questionnaire →', 'https://forms.gle/abc']]);
  assert.ok(o.signature);
  for (const prefixe of ['', '👉 ', '➡️ ', '→ ', '-> ', 'Lien : ', 'Formulaire : ', 'Inscription : ']) {
    const doc = detecter(`Intro.\n\nTexte\n${prefixe}https://exemple.fr/a\nSuite.\n\nFin.`);
    assert.ok(types(doc).includes('bouton'), prefixe);
  }
  assert.deepEqual(types(detecter('Intro.\n\nVoici :\n- un\n- deux\nAprès.\n\nFin.')), ['accroche', 'para', 'liste', 'para']);
});

test('US-012 D4 : salutation de 40 caractères au plus, finie par une virgule ou ouverte par un mot d’accueil', () => {
  for (const s of ['Chers parents,', 'Bonjour à tous', 'Bonsoir', 'Madame, Monsieur', 'Cher parent', 'Chère famille', 'Mesdames et messieurs', 'Coucou les parents,']) {
    assert.equal(detecter(`${s}\n\nTexte.\n\nAutre.`).salutation, s.replace(/,$/, '') + ',', s);
  }
  assert.equal(detecter('Bonjour à toutes et à tous, parents de la classe,\n\nTexte.').salutation, null);
  assert.equal(detecter('Un texte ordinaire\n\nTexte.').salutation, null);
  // Les longueurs se comptent en caractères affichés : un émoji compte pour un.
  const emojis = `Bonjour à tous ${'👋'.repeat(20)},`;
  assert.equal(detecter(`${emojis}\n\nTexte.\n\nAutre.`).salutation, emojis);
});

test('US-012 D5 : la formule de politesse ouvre la signature ; la suite forme le signataire', () => {
  const o = detecter('Texte.\n\nAutre.\n\nBien cordialement,\n\nVos représentants FCPE\nÉcole Jules-Ferry');
  assert.deepEqual(o.signature, ['Bien cordialement,', 'Vos représentants FCPE\nÉcole Jules-Ferry']);
  for (const f of ['Cordialement', 'Bien à vous', 'Amicalement', 'À bientôt', 'À très bientôt', 'Belle journée', 'Bonne soirée', 'Bonne semaine',
    'Avec nos salutations', 'Avec nos sincères salutations', 'Bon courage à tous', 'Merci et à bientôt']) {
    assert.equal(detecter(`Texte.\n\n${f},\nL’équipe`).signature?.[0], `${f},`, f);
  }
  assert.equal(detecter('Texte.\n\nCordialité de mise.').signature, null);
});

test('US-012 D6 : le dernier paragraphe court avant la signature devient la clôture', () => {
  assert.equal(detecter('Texte.\n\nAutre texte.\n\nEncore merci ✨\n\nCordialement,\nFCPE').cloture, 'Encore merci ✨');
  assert.equal(detecter('Seul texte.\n\nCordialement,\nFCPE').cloture, null);
  assert.equal(detecter(`Texte.\n\n${'x'.repeat(81)}\n\nCordialement,\nFCPE`).cloture, null);
});

test('US-012 D7 : une ligne entièrement en gras, courte sans ponctuation finale, ou en capitales devient un titre', () => {
  const o = detecter('Intro.\n\n*Au programme :*\n\nLe détail.\n\nLa suite du mois\n\nDétail 2.\n\nAVIS AUX PARENTS.\n\nDétail 3.\n\nFin.\n\nCordialement,\nFCPE');
  assert.deepEqual(o.sections.map(s => s.surtitre).slice(1), ['Au programme', 'La suite du mois', 'AVIS AUX PARENTS.']);
  // Gras partiel : une mise en valeur, pas un titre ; une ligne en gras suivie d'autres lignes reste un paragraphe.
  assert.equal(detecter('Avec *10 sièges sur 17* au conseil\n\nTexte.').sections[0].surtitre, null);
  assert.equal(detecter('*Au programme*\nla suite.\n\nTexte.').sections[0].surtitre, null);
  // Le dernier paragraphe n'est jamais un titre ; un émoji en tête devient la pastille.
  assert.equal(detecter('Petit mot').sections[0].surtitre, null);
  const e = detecter('Intro.\n\n🎉 *Kermesse*\n\nDétail.\n\nFin.');
  assert.deepEqual([e.sections[1].picto, e.sections[1].surtitre], ['🎉', 'Kermesse']);
});

test('US-012 D8 : puces « - * • – · » et numéros « 1. » ou « 2) » forment une liste', () => {
  const o = detecter('Intro.\n\nAu programme :\n- un\n* deux\n• trois\n– quatre\n· cinq\n1. six\n2) sept\n\nFin.');
  assert.deepEqual(blocs(o).find(b => b[0] === 'liste'), ['liste', ['un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept']]);
});

test('US-012 D9 : une adresse seule devient un bouton, au libellé choisi selon l’adresse', () => {
  assert.equal(libelleBouton('https://forms.gle/x'), 'Répondre au questionnaire →');
  assert.equal(libelleBouton('https://docs.google.com/forms/d/x'), 'Répondre au questionnaire →');
  assert.equal(libelleBouton('https://framaforms.org/x'), 'Répondre au questionnaire →');
  assert.equal(libelleBouton('https://doodle.com/x'), 'Indiquer mes disponibilités →');
  assert.equal(libelleBouton('https://framadate.org/x'), 'Indiquer mes disponibilités →');
  assert.equal(libelleBouton('https://mairie.fr/doc.PDF?v=2'), 'Lire le document →');
  assert.equal(libelleBouton('https://chat.whatsapp.com/x'), 'Rejoindre le groupe →');
  assert.equal(libelleBouton('https://exemple.fr/'), 'Ouvrir le lien →');
  // Une adresse au milieu d'une phrase reste un lien simple.
  assert.ok(!types(detecter('Voir https://exemple.fr/ pour la suite.\n\nFin.')).includes('bouton'));
});

test('US-012 D10 : *gras* de WhatsApp converti ; dates mises en gras', () => {
  const o = detecter('Intro avec *mot* et 2*3*4.\n\nNous serons là le lundi 12 octobre et le **mardi 13 octobre**.\n\nFin.');
  assert.equal(blocs(o)[0][1], 'Intro avec **mot** et 2*3*4.');
  assert.equal(blocs(o)[1][1], 'Nous serons là le **lundi 12 octobre** et le **mardi 13 octobre**.');
});

test('US-012 D11 : Important, Attention, Urgent, À retenir, À noter, Rappel ouvrent un encadré', () => {
  assert.deepEqual(blocs(detecter('Intro.\n\nImportant : école fermée jeudi.\n\nFin.'))[1], ['important', ['École fermée jeudi.']]);
  for (const [mot, titre] of [['Attention !', 'Attention'], ['⚠️ Urgent :', 'Urgent'], ['À retenir :', 'À retenir'], ['À noter :', 'À noter'], ['Rappel !', 'Rappel']]) {
    assert.deepEqual(blocs(detecter(`Intro.\n\n${mot} sortie annulée.\n\nFin.`))[1], ['important', [titre, 'Sortie annulée.']], mot);
  }
  assert.equal(blocs(detecter('Intro.\n\nAttention à la marche.\n\nFin.'))[1][0], 'para');
});

test('US-012 D12 : date, heure et lieu dans un paragraphe court donnent un bloc Date et lieu', () => {
  const o = detecter('Intro.\n\nRendez-vous le samedi 14 mars à 18h30, salle des fêtes. Venez nombreux.\n\nFin.');
  assert.deepEqual(blocs(o)[1], ['date', ['🗓️ Rendez-vous le samedi 14 mars à 18h30', '📍 Salle des fêtes', 'Venez nombreux']]);
  for (const v of ['le 1er mars à 8 h 30 au préau', 'lundi 12/10 à 18:30 à la mairie', 'le 12/10/2026 à 18h 📍 gymnase']) {
    assert.equal(blocs(detecter(`Intro.\n\nRéunion ${v}.\n\nFin.`))[1][0], 'date', v);
  }
  // Sans lieu, ou trop long, le paragraphe reste un paragraphe.
  assert.equal(blocs(detecter('Intro.\n\nRéunion le 12 mars à 18h.\n\nFin.'))[1][0], 'para');
  assert.equal(blocs(detecter(`Intro.\n\nRéunion le 12 mars à 18h en salle B. ${'x'.repeat(130)}\n\nFin.`))[1][0], 'para');
});

test('US-012 D13 : italique entier, PS, P.S., NB et N.B. donnent une note', () => {
  for (const v of ['_Vos réponses restent anonymes._', 'PS : pensez au goûter.', 'P.S. pensez au goûter.', 'NB : apportez un stylo.', 'N.B. apportez un stylo.']) {
    assert.equal(blocs(detecter(`Intro.\n\n${v}\n\nFin.`))[1][0], 'note', v);
  }
});

test('US-012 D14 : sans titre, chaque paragraphe ouvre une section ; bouton, liste et introduction de lien rejoignent la précédente', () => {
  const o = detecter('Un.\n\nDeux.\n\nVoici le lien :\nhttps://exemple.fr/\n\nTrois :\n- a\n- b\n\nQuatre.\n\nFin.');
  assert.deepEqual(o.sections.map(s => s.blocs.map(b => b[0])), [['accroche'], ['para', 'para', 'bouton'], ['para', 'liste'], ['para']]);
  const t = detecter('Avant.\n\n*Titre*\n\nTexte a.\n\nTexte b.\n\nFin.');
  assert.deepEqual(t.sections.map(s => s.blocs.length), [1, 2]);
});

test('US-012 D15 : une première section d’un seul paragraphe court devient l’accroche', () => {
  assert.equal(blocs(detecter('Merci à tous !\n\nSuite.'))[0][0], 'accroche');
  assert.equal(blocs(detecter(`${'Long. '.repeat(60)}\n\nSuite.`))[0][0], 'para');
});

test('US-012 : un texte vide ou bizarre ne bloque jamais la détection', () => {
  for (const t of ['', '   ', '\n\n', '*', '**', '_', '- ', '1.', 'Objet :', 'Cordialement', 'https://', '👉', '⚠️', 'Attention !', '\r\n\r\n', null, undefined, '🗓️ 12/10 18h salle'.repeat(30)]) {
    assert.doesNotThrow(() => lirePivot(detecterPivot(t)), String(t));
  }
});
