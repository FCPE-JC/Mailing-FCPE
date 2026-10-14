// Lot 6 : modèles types (US-032, US-033), passages à compléter (US-034), police de la date
// et de la clôture (US-035), accessibilité de l'email (US-036) et de l'outil (US-037) ;
// EX-002, EX-019 à EX-021, EX-024, EX-025.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MODELES } from '../docs/parametres/modeles.js';
import { CHARTE } from '../docs/parametres/charte.js';
import { brancherModeles, MESSAGES_MODELE } from '../docs/js/depart.js';
import { preparerApercu } from '../docs/js/apercu.js';
import { conseils, passagesACompleter } from '../docs/js/conseils.js';
import { lirePivot, ecrirePivot } from '../docs/js/pivot.js';
import { rendreEmail } from '../docs/js/rendu.js';
import { faussePage, lireDuSite, lireDuDepot } from './aides.js';

// --- US-033 : les cinq modèles ---

test('US-033 : les cinq modèles types d’EX-002, chacun avec son objet type', () => {
  assert.deepEqual(MODELES.map(m => m.identifiant), ['remerciement', 'invitation', 'conseil-ecole', 'temoignages', 'information-urgente']);
  assert.deepEqual(MODELES.map(m => m.nom), ['Remerciement', 'Invitation', "Préparation du conseil d'école", 'Appel à témoignages', 'Information urgente']);
  const objets = [/^Merci pour /, /^Invitation : .+ le /, /^Conseil d'école du .+ : vos questions$/, /^Votre avis sur /, /^⚠️ .+ : information importante$/];
  MODELES.forEach((m, k) => assert.match(lirePivot(m.pivot).objet, objets[k], m.identifiant));
});

test('US-033 : chaque modèle est lu au format pivot, sans autre anomalie que ses passages à compléter', () => {
  for (const m of MODELES) {
    const apercu = preparerApercu(m.pivot);
    assert.equal(apercu.lecture, 'pivot', m.identifiant);
    assert.deepEqual(apercu.anomalies, [], m.identifiant);
    const anomalies = conseils(apercu.doc).filter(c => c.niveau === 'anomalie');
    assert.deepEqual(anomalies.map(c => c.code), ['a-completer'], m.identifiant);
    assert.ok(apercu.doc.salutation && apercu.doc.cloture && apercu.doc.signature, m.identifiant);
    assert.ok(apercu.doc.sections.every(s => s.pastille), m.identifiant);
  }
});

test('US-033 : un modèle exporté puis repris redonne le même email (EX-028)', () => {
  for (const m of MODELES) {
    const doc = lirePivot(m.pivot);
    assert.equal(rendreEmail(lirePivot(ecrirePivot(doc))), rendreEmail(doc), m.identifiant);
  }
});

test('US-033 : un modèle complété n’a plus aucune anomalie', () => {
  for (const m of MODELES) {
    const complete = m.pivot.replace(/\[([^[\]\n]+)\](?!\()/g, 'X');
    const apercu = preparerApercu(complete);
    assert.deepEqual(apercu.anomalies, [], m.identifiant);
    assert.deepEqual(conseils(apercu.doc).filter(c => c.niveau === 'anomalie'), [], m.identifiant);
  }
});

// --- US-034 : passages à compléter ---

test('US-034 : les passages entre crochets sont repérés, pas les liens, sans doublon', () => {
  assert.deepEqual(passagesACompleter('Le [date] à [heure], voir [le site](https://a.fr), encore le [date].'), ['[date]', '[heure]']);
  assert.deepEqual(passagesACompleter('[Indiquer ma venue →](https://[adresse])'), ['[adresse]']);
  assert.deepEqual(passagesACompleter('Rien à compléter, ni [ici](https://a.fr).'), []);
});

test('US-034 : l’anomalie cite les passages et mène au premier bloc concerné', () => {
  const doc = preparerApercu('Chers parents,\n\n## 🏫 Réunion\nRendez-vous le [date].\n\nÀ [lieu] et le [date].\n\nBien cordialement,\nMoi').doc;
  const a = conseils(doc).find(c => c.code === 'a-completer');
  assert.equal(a.niveau, 'anomalie');
  assert.equal(a.message, 'Il reste à compléter : [date], [lieu].');
  assert.equal(a.cible, '0.0');
});

test('US-034 : au-delà de six passages, le message s’arrête sur « … »', () => {
  const doc = preparerApercu('Chers parents,\n\n## Test\n[a] [b] [c] [d] [e] [f] [g]\n\nBien cordialement,\nMoi').doc;
  assert.equal(conseils(doc).find(c => c.code === 'a-completer').message, 'Il reste à compléter : [a], [b], [c], [d], [e], [f]…');
});

test('US-034 : un passage dans l’objet ou la signature compte aussi', () => {
  const doc = preparerApercu('Objet : Merci pour [l’événement]\n\nChers parents,\n\n## Merci\nMerci.\n\nBien cordialement,\n[Ton nom]').doc;
  assert.equal(conseils(doc).find(c => c.code === 'a-completer').message, 'Il reste à compléter : [l’événement], [Ton nom].');
});

// --- US-032 : partir d'un modèle ---

function page({ texte = '', accepte = true } = {}) {
  const p = faussePage(['modele', 'texte', 'retour-ecrire']);
  const questions = [];
  Object.assign(p.fenetre, { Event, confirm: q => { questions.push(q); return accepte; } });
  p.elements.texte.value = texte;
  const saisies = [];
  p.elements.texte.addEventListener('input', () => saisies.push(p.elements.texte.value));
  brancherModeles(p.fenetre);
  const choisir = valeur => { p.elements.modele.value = valeur; p.elements.modele.declencher('change'); };
  return { ...p, questions, saisies, choisir };
}

test('US-032 : la liste propose les cinq modèles après « Choisir un modèle… »', () => {
  const p = page();
  assert.deepEqual(p.elements.modele.enfants.map(o => [o.value, o.textContent]), MODELES.map(m => [m.identifiant, m.nom]));
  assert.match(lireDuSite('index.html'), /<label for="modele"[^>]*>Partir d'un modèle<\/label>\s*<select id="modele">\s*<option value="">Choisir un modèle…<\/option>/);
});

test('US-032 : sur une zone vide, le modèle remplit le texte comme une saisie, sans question', () => {
  const p = page();
  p.choisir('invitation');
  const modele = MODELES.find(m => m.identifiant === 'invitation');
  assert.equal(p.elements.texte.value, modele.pivot);
  assert.deepEqual(p.saisies, [modele.pivot]);
  assert.deepEqual(p.questions, []);
  assert.equal(p.elements['retour-ecrire'].textContent, MESSAGES_MODELE.choisi('Invitation'));
  assert.equal(p.elements.modele.value, '', 'la liste revient sur « Choisir un modèle… »');
});

test('US-032 : un texte déjà écrit n’est remplacé qu’après confirmation (DEC-071)', () => {
  const refus = page({ texte: 'Mon texte', accepte: false });
  refus.choisir('remerciement');
  assert.deepEqual(refus.questions, [MESSAGES_MODELE.confirmation]);
  assert.equal(refus.elements.texte.value, 'Mon texte');
  assert.deepEqual(refus.saisies, []);
  const accord = page({ texte: 'Mon texte', accepte: true });
  accord.choisir('remerciement');
  assert.equal(accord.elements.texte.value, MODELES[0].pivot);
});

// --- US-035 : police de la date et de la clôture ---

test('US-035 : titre de la date et clôture en gras 700, surtitre inchangé en 800', () => {
  const ty = CHARTE.typographie;
  assert.equal(ty.cloture.graisse, 700);
  assert.equal(ty.titreDate.graisse, 700);
  assert.equal(ty.surtitre.graisse, 800);
  const html = preparerApercu(MODELES.find(m => m.identifiant === 'invitation').pivot.replace('[Jour et date]', 'Jeudi 5 novembre')).html;
  assert.match(html, /font-size:18px;line-height:1\.5;[^"]*font-weight:700;">🗓️ Jeudi 5 novembre/);
  assert.match(html, /font-size:20px;line-height:1\.4;[^"]*font-weight:700;">Au plaisir/);
  assert.doesNotMatch(lireDuDepot('etape-2/charte-blocs.md'), /Clôture \| 20 px \| 1,4 \| 800/);
});

// --- US-036 : accessibilité de l'email ---

// Contraste WCAG entre deux couleurs #rrggbb.
function contraste(a, b) {
  const lum = h => {
    const [r, g, v] = [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255).map(c => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * v;
  };
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
}

test('US-036 : chaque couleur de texte a un contraste suffisant sur son fond (EX-021)', () => {
  const c = CHARTE.couleurs;
  // [texte, fond, seuil, où] : 3 pour 1 pour les grands textes (18 px gras et plus, 24 px et plus).
  const paires = [
    [c.texte, c.carte, 4.5, 'texte courant'], [c.bleuTitre, c.carte, 4.5, 'accroche, liens, signature'],
    [c.vertFonce, c.carte, 4.5, 'surtitre des sections bleues'], [c.texteSecondaire, c.carte, 4.5, 'note'],
    [c.lienSecours, c.carte, 4.5, 'adresse sous un bouton'], [c.blanc, c.bleuEntete, 4.5, 'en-tête'],
    [c.blanc, c.bleuTitre, 4.5, 'bouton'], [c.texte, c.fondPastilleBleue, 4.5, 'encadré Important'],
    [c.bleuTitre, c.fondPastilleBleue, 4.5, 'titre de l’encadré'], [c.bleuTitre, c.carte, 3, 'salutation et clôture'],
  ];
  for (const [t, f, seuil, ou] of paires) assert.ok(contraste(t, f) >= seuil, `${ou} : ${contraste(t, f).toFixed(2)} pour 1`);
});

test('US-036 : l’email indique le français, garde le texte du logo et ne fait pas lire les puces', () => {
  const html = preparerApercu('Chers parents,\n\n## Liste\n- un\n- deux\n\nBien cordialement,\nMoi').html;
  assert.match(html, /^<div lang="fr" /);
  assert.ok(CHARTE.textes.texteAlternatifLogo.trim());
  assert.match(html, new RegExp(`alt="${CHARTE.textes.texteAlternatifLogo}"`));
  assert.equal((html.match(/●/g) || []).length, 2);
  assert.equal((html.match(/aria-hidden="true"[^>]*>●/g) || []).length, 2);
  assert.ok((html.match(/<table/g) || []).length === (html.match(/<table role="presentation"/g) || []).length);
});

test('US-036 : la lecture suit l’ordre de l’aperçu (salutation, sections, clôture, signature)', () => {
  const html = preparerApercu(MODELES[1].pivot).html;
  const ordre = ['Chers parents', 'Nous avons le plaisir', 'Rendez-vous', 'Au programme', 'Votre venue', 'Au plaisir', 'Vos représentants FCPE'];
  let position = -1;
  for (const t of ordre) {
    const i = html.indexOf(t, position + 1);
    assert.ok(i > position, `${t} absent ou mal placé`);
    position = i;
  }
});

// --- US-037 : accessibilité de l'outil ---

test('US-037 : chaque champ de la page a une étiquette', () => {
  const html = lireDuSite('index.html');
  const champs = [...html.matchAll(/<(input|select|textarea)\b[^>]*>/g)].map(m => m[0]);
  assert.ok(champs.length >= 8);
  for (const champ of champs) {
    const id = (champ.match(/id="([^"]+)"/) || [])[1];
    const etiquette = /aria-label="[^"]+"/.test(champ) || (id && html.includes(`<label for="${id}"`));
    assert.ok(etiquette, `champ sans étiquette : ${champ}`);
  }
  assert.match(lireDuSite('js/partage.js'), /setAttribute\('aria-label'/);
});

test('US-037 : contour visible au clavier et cibles d’au moins 44 pixels', () => {
  const css = lireDuSite('style.css');
  assert.match(css, /a:focus-visible, button:focus-visible, select:focus-visible, summary:focus-visible \{ outline: 3px/);
  for (const regle of [/^\.bouton \{[^}]*min-height: 44px/m, /^select \{[^}]*min-height: 44px/m, /^input\[type="text"\] \{[^}]*min-height: 44px/m, /\.conseils summary \{[^}]*min-height: 44px/]) {
    assert.match(css, regle);
  }
  assert.match(css, /\.etiquette-bloc \{[^}]*min-height: 24px/);
});

test('US-037 : les messages de retour sont annoncés par la synthèse vocale', () => {
  const html = lireDuSite('index.html');
  for (const id of ['retour-ecrire', 'retour-partager']) assert.match(html, new RegExp(`id="${id}"[^>]*role="status" aria-live="polite"`));
});
