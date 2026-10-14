// US-016 « Changer le type d'un bloc », US-017 « Pastille et surtitre d'une section » et
// US-020 « Annuler une correction » (EX-005, EX-027) : tableau de conversion validé par Mat
// (DEC-105, etape-5/lot-4/us-lot-4-v0.1.md), corrections réécrites au format pivot (DEC-103).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lirePivot, ecrirePivot } from '../docs/js/pivot.js';
import { PASTILLES } from '../docs/js/detection.js';
import { TYPES, choixPossibles, changerType, changerPastille, changerSurtitre, changerLibelle, changerObjet, lignesDe, retrouver } from '../docs/js/corrections.js';
import { preparerApercu, creerSuivi, corriger, annuler, saisir } from '../docs/js/apercu.js';
import { lireDuDepot, lireDuSite, pageBranchee } from './aides.js';

const PIVOT = [
  'Objet : Café des parents', '', 'Chers parents,', '',
  '## 🙏', '> Merci à tous.', '',
  '## 🍽️ Au programme', 'Nous vous attendons. Venez avec vos enfants.', '',
  '- accueil', '- discours', '',
  '[Répondre →](https://forms.gle/x)', '',
  '::: important', 'Attention', 'École fermée jeudi.', ':::', '',
  '::: date', '🗓️ Jeudi 5 novembre à 8 h 30', '📍 Salle polyvalente', ':::', '',
  '*Petite note.*', '',
  'Voir https://exemple.fr/doc.pdf pour tout savoir', '',
  '---', 'Encore merci ✨', '', 'Bien cordialement,', 'Vos représentants FCPE',
].join('\n');
const DOC = lirePivot(PIVOT);
const blocs = d => d.sections.flatMap(s => s.blocs);
const mots = d => ecrirePivot(d).toLowerCase().match(/[\p{L}\p{N}]+/gu).filter(m => !['important', 'date'].includes(m));

test('US-016 et US-031 : le panneau propose les neuf types de la maquette, puis Signature (DEC-114)', () => {
  assert.deepEqual(TYPES.map(([, nom]) => nom), ['Paragraphe', 'Accroche', 'Note', 'Titre de section', 'Liste', 'Bouton', '⚠️ Important', '🗓️ Date et lieu', 'Clôture', 'Signature']);
  const choix = choixPossibles(DOC, '1.0');
  assert.equal(choix.length, 10);
  assert.deepEqual(choix.filter(c => c.actuel).map(c => c.type), ['paragraphe']);
});

test('US-016 : vers Paragraphe, Accroche ou Note, le texte reste ; seul l’habillage change', () => {
  assert.deepEqual(changerType(DOC, '1.0', 'note').sections[1].blocs[0], { type: 'note', texte: 'Nous vous attendons. Venez avec vos enfants.' });
  assert.deepEqual(changerType(DOC, '0.0', 'paragraphe').sections[0].blocs[0], { type: 'paragraphe', texte: 'Merci à tous.' });
  assert.deepEqual(changerType(DOC, '1.1', 'paragraphe').sections[1].blocs[1], { type: 'paragraphe', texte: 'accueil. discours.' });
  assert.deepEqual(changerType(DOC, '1.2', 'paragraphe').sections[1].blocs[2], { type: 'paragraphe', texte: 'Répondre → : https://forms.gle/x' });
  assert.deepEqual(changerType(DOC, '1.4', 'accroche').sections[1].blocs[4], { type: 'accroche', texte: '🗓️ Jeudi 5 novembre à 8 h 30. 📍 Salle polyvalente.' });
  assert.deepEqual(changerType(DOC, '1.3', 'paragraphe').sections[1].blocs[3], { type: 'paragraphe', texte: 'Attention : École fermée jeudi.' });
});

test('US-016 : vers Liste, une ligne ou une phrase par élément', () => {
  assert.deepEqual(changerType(DOC, '1.0', 'liste').sections[1].blocs[0], { type: 'liste', elements: ['Nous vous attendons.', 'Venez avec vos enfants.'] });
  assert.deepEqual(changerType(DOC, '1.4', 'liste').sections[1].blocs[4].elements, ['🗓️ Jeudi 5 novembre à 8 h 30', '📍 Salle polyvalente']);
});

test('US-016 : vers Bouton, seulement avec une adresse web ; le libellé suit D9 et le reste du texte est gardé', () => {
  const d = changerType(DOC, '1.6', 'bouton');
  assert.deepEqual(d.sections[1].blocs.slice(6, 8), [{ type: 'paragraphe', texte: 'Voir pour tout savoir' }, { type: 'bouton', libelle: 'Lire le document →', adresse: 'https://exemple.fr/doc.pdf' }]);
  const sans = choixPossibles(DOC, '1.0').find(c => c.type === 'bouton');
  assert.equal(sans.possible, false);
  assert.match(sans.raison, /adresse web/);
  assert.equal(changerType(DOC, '1.0', 'bouton'), DOC);
  // Un bouton redevenu paragraphe redevient le même bouton.
  const retour = changerType(changerType(DOC, '1.2', 'paragraphe'), '1.2', 'bouton');
  assert.deepEqual(retour.sections[1].blocs[2], DOC.sections[1].blocs[2]);
});

test('US-016 : vers Important, le texte entre dans l’encadré, titre « Important »', () => {
  assert.deepEqual(changerType(DOC, '1.5', 'important').sections[1].blocs[5], { type: 'important', titre: 'Important', lignes: ['Petite note.'] });
});

test('US-016 : vers Date et lieu, découpé comme à D12, avec 🗓️ et 📍', () => {
  const d = lirePivot('## x\nRéunion le jeudi 5 novembre à 18h30, salle B. Venez nombreux.\n\nTexte.');
  assert.deepEqual(changerType(d, '0.0', 'date').sections[0].blocs[0].lignes, ['🗓️ Réunion le jeudi 5 novembre à 18h30', '📍 Salle B', 'Venez nombreux']);
  const liste = lirePivot('## x\n- jeudi 5 novembre\n- salle B');
  assert.deepEqual(changerType(liste, '0.0', 'date').sections[0].blocs[0].lignes, ['🗓️ Jeudi 5 novembre', '📍 Salle B']);
});

test('US-016 : vers Titre de section, une nouvelle section commence ici ; un titre redevenu paragraphe fond sa section', () => {
  const d = changerType(DOC, '1.5', 'titre');
  assert.deepEqual(d.sections.map(s => s.surtitre), [null, 'Au programme', 'Petite note.']);
  assert.deepEqual(d.sections[2].blocs.map(b => b.type), ['paragraphe']);
  const f = changerType(DOC, '1.titre', 'paragraphe');
  assert.equal(f.sections.length, 1);
  assert.deepEqual(f.sections[0].blocs.slice(0, 3).map(b => b.texte ?? b.type), ['Merci à tous.', 'Au programme', 'Nous vous attendons. Venez avec vos enfants.']);
  // Titre de 100 caractères au plus (DEC-108, 60 auparavant).
  const titre = n => choixPossibles(lirePivot(`## x\n${'x'.repeat(n)}\n\nTexte.`), '0.0').find(c => c.type === 'titre');
  assert.equal(titre(100).possible, true);
  const choix = titre(101);
  assert.equal(choix.possible, false);
  assert.match(choix.raison, /100 caractères/);
});

test('US-016 : vers Clôture, seulement le dernier bloc ; l’ancienne clôture redevient un paragraphe', () => {
  const d = changerType(DOC, '1.6', 'cloture');
  assert.equal(d.cloture, 'Voir https://exemple.fr/doc.pdf pour tout savoir');
  assert.deepEqual(blocs(d).at(-1), { type: 'paragraphe', texte: 'Encore merci ✨' });
  assert.equal(choixPossibles(DOC, '1.0').find(c => c.type === 'cloture').possible, false);
  const p = changerType(DOC, 'cloture', 'paragraphe');
  assert.equal(p.cloture, null);
  assert.deepEqual(blocs(p).at(-1), { type: 'paragraphe', texte: 'Encore merci ✨' });
});

test('US-016 : aucun changement de type ne perd de texte, et tout se relit à l’identique', () => {
  const docs = [DOC, preparerApercu(lireDuDepot('etape-2/specimens/02-invitation.brut.txt')).doc, lirePivot(lireDuDepot('etape-3/T1-T2/email-test-15-blocs.pivot.md'))];
  for (const d of docs) {
    const reperes = [...d.sections.flatMap((s, k) => [...(s.surtitre ? [`${k}.titre`] : []), ...s.blocs.map((_, j) => `${k}.${j}`)]), ...(d.cloture ? ['cloture'] : [])];
    const avant = new Set(mots(d));
    for (const r of reperes) {
      for (const c of choixPossibles(d, r).filter(x => x.possible && !x.actuel)) {
        const apres = changerType(d, r, c.type);
        const restant = new Set(mots(apres));
        for (const m of avant) assert.ok(restant.has(m), `${r} vers ${c.type} : « ${m} » perdu`);
        const relu = lirePivot(ecrirePivot(apres));
        assert.equal(ecrirePivot(relu), ecrirePivot(apres), `${r} vers ${c.type} : relecture`);
      }
    }
  }
});

test('US-016 : après un changement, le panneau retrouve le bloc changé', () => {
  assert.equal(retrouver(DOC, changerType(DOC, '1.0', 'liste'), '1.0', 'liste'), '1.0');
  assert.equal(retrouver(DOC, changerType(DOC, '1.6', 'bouton'), '1.6', 'bouton'), '1.7');
  assert.equal(retrouver(DOC, changerType(DOC, '1.5', 'titre'), '1.5', 'titre'), '2.titre');
  assert.equal(retrouver(DOC, changerType(DOC, '1.6', 'cloture'), '1.6', 'cloture'), 'cloture');
  assert.equal(retrouver(DOC, changerType(DOC, '1.titre', 'paragraphe'), '1.titre', 'paragraphe'), null);
  assert.deepEqual(lignesDe(DOC, 'cloture'), ['Encore merci ✨']);
});

test('US-017 et US-029 : les dix-sept pastilles sont proposées (DEC-109) ; changer la pastille ou le surtitre', () => {
  assert.deepEqual(PASTILLES, ['⚠️', '🗓️', '🔒', '🍽️', '📝', '🏫', '🎉', '🙏', '🗳️', '📢', '📚', '👨‍👩‍👧‍👦', '🗣️', '♻️', '🙋', '🤝', 'ℹ️']);
  assert.equal(changerPastille(DOC, 1, '☕').sections[1].pastille, '☕');
  assert.equal(changerSurtitre(DOC, 0, '  Merci  ').sections[0].surtitre, 'Merci');
  assert.equal(changerSurtitre(DOC, 1, '').sections[1].surtitre, null);
  // Un surtitre long est accepté : c'est un conseil, pas un refus.
  const long = 'Un surtitre qui dépasse largement les quarante caractères';
  assert.equal(changerSurtitre(DOC, 1, long).sections[1].surtitre, long);
  assert.equal(changerLibelle(DOC, '1.2', 'Je réponds →').sections[1].blocs[2].libelle, 'Je réponds →');
  assert.equal(changerLibelle(DOC, '1.2', ' ').sections[1].blocs[2].libelle, 'Répondre au questionnaire →');
  assert.equal(changerObjet(DOC, '  Nouvel objet ').objet, 'Nouvel objet');
  assert.equal(DOC.sections[1].pastille, '🍽️', 'le modèle de départ n’est jamais modifié');
});

test('US-020 : chaque correction réécrit le pivot ; Annuler revient en arrière une à une, jusqu’au texte collé', () => {
  const brut = lireDuDepot('etape-2/specimens/02-invitation.brut.txt');
  let s = creerSuivi(brut);
  s = corriger(s, d => changerPastille(d, 1, '📝'));
  assert.match(s.texte, /^## 📝/m);
  const une = s.texte;
  s = corriger(s, d => changerSurtitre(d, 1, 'Notre café'));
  assert.equal(s.historique.length, 2);
  assert.equal(corriger(s, d => d), s, 'une correction sans effet n’est pas retenue');
  s = annuler(s);
  assert.equal(s.texte, une);
  s = annuler(s);
  assert.equal(s.texte, brut);
  assert.equal(annuler(s), s);
  assert.deepEqual(saisir(corriger(s, d => changerPastille(d, 1, '📝')), 'autre'), { texte: 'autre', historique: [] });
});

test('US-016 et US-020 : sur la page, toucher un bloc ouvre le panneau, choisir un type corrige, Annuler défait', () => {
  const brut = lireDuDepot('etape-2/specimens/02-invitation.brut.txt');
  const { elements, taper } = pageBranchee();
  taper(brut);
  assert.equal(elements.annuler.disabled, true);
  assert.equal(elements['note-pivot'].hidden, true);
  elements.apercu.declencher('click', { target: { closest: () => ({ getAttribute: () => '1.0' }) }, preventDefault() {} });
  assert.equal(elements.panneau.getAttribute('open'), '');
  assert.equal(elements['panneau-types'].enfants.length, 10);
  assert.equal(elements['panneau-pastilles'].enfants.length >= 11, true);
  const note = elements['panneau-types'].enfants.find(b => b.textContent === 'Note');
  note.declencher('click');
  assert.ok(elements.texte.value.startsWith('Objet : '), 'l’écran Écrire montre le pivot');
  assert.equal(preparerApercu(elements.texte.value).doc.sections[1].blocs[0].type, 'note');
  assert.equal(elements['note-pivot'].hidden, false);
  assert.equal(elements.annuler.disabled, false);
  // Un choix impossible ne fait rien et dit pourquoi.
  const bouton = elements['panneau-types'].enfants.find(b => b.textContent === 'Bouton');
  const avant = elements.texte.value;
  bouton.declencher('click');
  assert.equal(elements.texte.value, avant);
  assert.match(elements['panneau-raison'].textContent, /adresse web/);
  elements.annuler.declencher('click');
  assert.equal(elements.texte.value, brut);
  assert.equal(elements.annuler.disabled, true);
});

test('US-016 et US-020 : la page a le panneau « Ce bloc est… », le bouton Annuler et la note sur le pivot', () => {
  const html = lireDuSite('index.html');
  assert.match(html, /<dialog id="panneau"[^>]*aria-labelledby="panneau-titre">\s*<h3 id="panneau-titre">Ce bloc est…<\/h3>/);
  assert.match(html, /<button id="annuler" type="button" class="bouton bouton-second" disabled>↶ Annuler<\/button>/);
  assert.match(html, /<button id="panneau-fermer" type="button"/);
  assert.match(html, /<label for="panneau-surtitre"/);
  assert.match(html, /<p id="note-pivot"[^>]*hidden>/);
});

test('US-016 : sur la page, un bloc changé en titre garde le panneau ouvert, sur la nouvelle section', () => {
  // Le repère de départ (0.1) n'existe plus après le changement : le panneau ne doit ni
  // planter ni se fermer, mais suivre le surtitre créé (1.titre).
  const { elements, taper } = pageBranchee();
  taper('## 🙏\nIntro.\n\nAu programme de la soirée\n\nTexte.\n\nBien cordialement,\nFCPE');
  elements.apercu.declencher('click', { target: { closest: () => ({ getAttribute: () => '0.1' }) }, preventDefault() {} });
  elements['panneau-types'].enfants.find(b => b.textContent === 'Titre de section').declencher('click');
  assert.deepEqual(preparerApercu(elements.texte.value).doc.sections.map(s => s.surtitre), [null, 'Au programme de la soirée']);
  assert.equal(elements.panneau.getAttribute('open'), '');
  assert.equal(elements['panneau-surtitre'].value, 'Au programme de la soirée');
  assert.equal(elements['panneau-types'].enfants.find(b => b.getAttribute('aria-pressed') === 'true').textContent, 'Titre de section');
});
