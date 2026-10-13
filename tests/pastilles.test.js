// US-013 « Pastilles par mots-clés » (EX-004) : règle D16 de etape-2/regles-detection.md,
// pour un texte brut et pour les sections d'un pivot écrites sans émoji (DEC-099).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { choisirPastille, detecter, completerPastilles } from '../docs/js/detection.js';
import { lirePivot } from '../docs/js/pivot.js';
import { CHARTE } from '../docs/parametres/charte.js';
import { preparerApercu } from '../docs/js/apercu.js';

test('US-013 : chaque ligne du tableau D16 donne sa pastille', () => {
  const lignes = [
    ['⚠️', ['urgent', 'grève', 'fermeture', 'annulé', 'annulation', 'alerte']],
    ['🗓️', ['le 12 octobre', 'lundi 12/10', '12/10/2026', '1er mars']],
    ['🔒', ['anonyme', 'confidentiel']],
    ['🍽️', ['cantine', 'repas', 'restauration', 'menu']],
    ['📝', ['questionnaire', 'formulaire', 'sondage', 'témoignage', 'avis']],
    // « maître » au singulier : DEC-101.
    ['🏫', ['école', 'conseil d’école', 'classe', 'enseignant', 'maître', 'maîtresse']],
    ['🎉', ['fête', 'kermesse', 'carnaval', 'spectacle', 'goûter']],
    ['🙏', ['merci', 'remercions']],
    ['🗳️', ['élection', 'vote', 'scrutin']],
    ['🤝', ['écoute', 'lien', 'ensemble', 'contact', 'rencontre']],
  ];
  for (const [pastille, mots] of lignes) {
    for (const mot of mots) assert.equal(choisirPastille(`Un texte avec ${mot} dedans.`), pastille, mot);
  }
});

test('US-013 : sans mot-clé, la pastille neutre ℹ️ de la charte', () => {
  assert.equal(choisirPastille('Un texte sans rien de particulier.'), 'ℹ️');
  assert.equal(choisirPastille('Un texte sans rien de particulier.'), CHARTE.textes.pastilleParDefaut);
});

test('US-013 : les mots-clés sont cherchés en mots entiers, majuscules comprises', () => {
  assert.equal(choisirPastille('MERCI à tous'), '🙏');
  assert.equal(choisirPastille('Les écoliers'), 'ℹ️');
  assert.equal(choisirPastille('Un menuisier'), 'ℹ️');
});

test('US-013 : l’ordre de priorité du tableau départage chaque paire de mots-clés', () => {
  const ordre = [['⚠️', 'grève'], ['🗓️', '12 octobre'], ['🔒', 'anonyme'], ['🍽️', 'cantine'], ['📝', 'sondage'], ['🏫', 'classe'],
    ['🎉', 'kermesse'], ['🙏', 'merci'], ['🗳️', 'vote'], ['🤝', 'ensemble']];
  for (let i = 0; i < ordre.length; i++) {
    for (let j = i + 1; j < ordre.length; j++) {
      assert.equal(choisirPastille(`${ordre[j][1]} puis ${ordre[i][1]}`), ordre[i][0], `${ordre[i][1]} avant ${ordre[j][1]}`);
    }
  }
});

test('US-013 : exemples de priorité', () => {
  assert.equal(choisirPastille('Merci : la cantine est fermée par la grève'), '⚠️');
  assert.equal(choisirPastille('Merci pour la fête de l’école'), '🏫');
  assert.equal(choisirPastille('Réunion le 12 octobre à la cantine'), '🗓️');
});

test('US-013 : un émoji déjà utilisé est évité si une autre correspondance existe, sinon il est gardé (DEC-101)', () => {
  assert.equal(choisirPastille('Merci pour la fête', ['🎉']), '🙏');
  // Sans autre mot-clé, la pastille répétée est gardée : ℹ️ ne vaut que sans aucun mot-clé.
  assert.equal(choisirPastille('Merci', ['🙏']), '🙏');
  const o = detecter('Merci pour la fête.\n\nEncore merci pour la fête et la kermesse.\n\nSuite.\n\nFin.');
  assert.deepEqual(o.sections.slice(0, 2).map(s => s.picto), ['🎉', '🙏']);
});

test('US-013 : une section sans surtitre qui contient une date reçoit cette date comme surtitre', () => {
  const o = detecter('Intro.\n\nNous rencontrerons la mairie le lundi 12 octobre pour en parler.\n\nFin.');
  assert.deepEqual([o.sections[1].picto, o.sections[1].surtitre], ['🗓️', 'Lundi 12 octobre']);
});

test('US-013 : jamais de surtitre de date sur une note ni sur un bloc Date et lieu', () => {
  const note = detecter('Intro.\n\nPS : rendez-vous le 12 octobre.\n\nFin.');
  assert.equal(note.sections[1].surtitre, null);
  const date = detecter('Intro.\n\nRéunion le 12 octobre à 18h, salle B.\n\nFin.');
  assert.equal(date.sections[1].blocs[0][0], 'date');
  assert.equal(date.sections[1].surtitre, null);
});

test('US-013 : un émoji écrit par le rédacteur est gardé', () => {
  assert.equal(detecter('Intro.\n\n🎈 *Kermesse*\n\nDétail.\n\nFin.').sections[1].picto, '🎈');
});

test('US-013 : dans un pivot, une section sans émoji reçoit la pastille de ses mots-clés, sans surtitre ajouté', () => {
  const doc = completerPastilles(lirePivot('## 🙏\nMerci.\n\n## Au programme\nLa fête de la cantine le 12 octobre.\n\n##\nMerci encore.\n\n## 🎈 Libre\nTexte.'));
  assert.deepEqual(doc.sections.map(s => [s.pastille, s.surtitre]), [
    ['🙏', null], ['🗓️', 'Au programme'], ['🙏', null], ['🎈', 'Libre'],
  ]);
  assert.equal(completerPastilles(lirePivot('##\nUn texte neutre.')).sections[0].pastille, 'ℹ️');
});

test('US-013 : l’aperçu d’un pivot montre la pastille choisie par mots-clés', () => {
  const apercu = preparerApercu('Chers parents,\n\n## Au programme\nMerci à tous.\n\nBien cordialement,\nFCPE');
  assert.equal(apercu.lecture, 'pivot');
  assert.ok(apercu.html.includes('>🙏</td>'));
  assert.ok(!apercu.html.includes(`>${CHARTE.textes.pastilleParDefaut}</td>`));
});
