// US-021, US-026 à US-028 : écran Partager, reprise d'un brouillon, prompt IA et
// avertissement avant de recharger, sur une fausse page (EX-012, EX-014, EX-019, EX-029).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { brancherPartage, contenusPartage, MESSAGES, TAILLE_MAX_BROUILLON } from '../docs/js/partage.js';
import { brancherApercu, preparerApercu } from '../docs/js/apercu.js';
import { lirePivot } from '../docs/js/pivot.js';
import { PROMPT_IA } from '../docs/parametres/prompt-ia.js';
import { faussePage, lireDuDepot, lireDuSite } from './aides.js';

const IDS_APERCU = ['texte', 'note-pivot', 'apercu-vide', 'verification', 'lecture', 'objet', 'objet-compteur', 'objet-messages', 'objet-propositions',
  'conseils', 'conseils-titre', 'conseils-liste', 'annuler', 'apercu', 'panneau', 'panneau-types', 'panneau-raison', 'panneau-section',
  'panneau-pastilles', 'panneau-surtitre', 'panneau-conseil-surtitre', 'panneau-libelle-zone', 'panneau-libelle', 'panneau-fermer',
  'panneau-texte-zone', 'panneau-texte', 'panneau-autre', 'panneau-autre-message'];
const IDS_PARTAGE = ['partage-vide', 'partage', 'retour-partager', 'retour-ecrire', 'repli', 'repli-consigne', 'repli-contenu', 'copier-whatsapp',
  'enregistrer-image', 'partager-image', 'exporter', 'telecharger-brouillon', 'copier-gmail', 'copier-texte', 'copier-prompt', 'ouvrir-brouillon', 'prompt-repli'];

const TEXTE = 'Objet : Café des parents ☕\n\nChers parents,\n\n## 🎉 Au programme\nVenez **nombreux**.\n\nBien cordialement,\nVos représentants FCPE';

// Fausse page complète : aperçu et partage branchés, presse-papier qui accepte ou refuse.
function page({ texte = '', copie = true, partage = false } = {}) {
  const p = faussePage([...IDS_APERCU, ...IDS_PARTAGE]);
  const ecouteurs = {};
  const copies = [];
  const telechargements = [];
  class Blob { constructor(parties, options) { this.texte = parties.join(''); this.type = options.type; } }
  class ClipboardItem { constructor(contenus) { this.contenus = contenus; } }
  Object.assign(p.fenetre, {
    navigator: {
      clipboard: {
        writeText: async t => { if (!copie) throw new Error('refusé'); copies.push({ 'text/plain': t }); },
        write: async ([item]) => { if (!copie) throw new Error('refusé'); copies.push(Object.fromEntries(Object.entries(item.contenus).map(([k, b]) => [k, b.texte]))); },
      },
    },
    Blob, ClipboardItem, Event,
    URL: { createObjectURL: b => { telechargements.push(b); return 'blob:essai'; }, revokeObjectURL: () => {} },
    setTimeout: () => {},
    getSelection: () => ({ removeAllRanges() {}, addRange() {} }),
    addEventListener: (nom, f) => { (ecouteurs[nom] ??= []).push(f); },
  });
  Object.assign(p.document, {
    body: { append: e => { e.remove = () => {}; } },
    createRange: () => ({ selectNodeContents() {} }),
    addEventListener() {}, removeEventListener() {}, execCommand: () => false,
  });
  // Les éléments créés par la page (lien de téléchargement, zone de texte) savent se cliquer.
  const creer = p.document.createElement.bind(p.document);
  p.document.createElement = balise => Object.assign(creer(balise), { click() {}, remove() {}, select() {} });
  for (const e of Object.values(p.elements)) e.focus = () => {};
  p.elements.texte.value = texte;
  brancherApercu(p.fenetre);
  brancherPartage(p.fenetre, { copie: true, image: true, partage });
  const toucher = async id => { for (const f of p.elements[id].ecouteurs?.click ?? []) await f(); };
  const recharger = () => { const ev = { defaut: false, preventDefault() { this.defaut = true; } }; for (const f of ecouteurs.beforeunload) f(ev); return ev.defaut; };
  const changerEcran = () => { for (const f of ecouteurs.hashchange ?? []) f(); };
  const taper = valeur => { p.elements.texte.value = valeur; p.elements.texte.declencher('input'); };
  return { ...p, copies, telechargements, toucher, recharger, changerEcran, taper };
}

test('US-021 : sans texte, l’écran Partager invite à revenir à Écrire', () => {
  const p = page();
  assert.equal(p.elements['partage-vide'].hidden, false);
  assert.equal(p.elements.partage.hidden, true);
  p.taper(TEXTE);
  p.changerEcran();
  assert.equal(p.elements['partage-vide'].hidden, true);
  assert.equal(p.elements.partage.hidden, false);
});

test('US-021 : l’écran suit la maquette, relecture puis envoi, sans « Copier l’image » (DEC-059)', () => {
  const html = lireDuSite('index.html');
  const partager = html.slice(html.indexOf('data-ecran="partager"'));
  const ordre = ['Pour la relecture (téléphone)', 'Copier pour WhatsApp', "Enregistrer l'image", "Partager l'image", 'Exporter le brouillon',
    'Télécharger le brouillon', "Pour l'envoi (ordinateur)", "Copier l'email pour Gmail", 'Copier la version texte'];
  let position = -1;
  for (const libelle of ordre) {
    const i = partager.indexOf(libelle);
    assert.ok(i > position, `${libelle} absent ou mal placé`);
    position = i;
  }
  assert.ok(!/Copier l.image/i.test(html));
  assert.match(html, /ne quitte pas cet appareil/);
});

test('US-025 : « Partager l’image » n’apparaît que si le navigateur sait partager un fichier (DEC-080)', () => {
  assert.equal(page({ texte: TEXTE }).elements['partager-image'].hidden, true);
  assert.equal(page({ texte: TEXTE, partage: true }).elements['partager-image'].hidden, false);
});

test('US-022 : « Copier l’email pour Gmail » copie le code de l’email et la version texte, et le dit', async () => {
  const p = page({ texte: TEXTE });
  await p.toucher('copier-gmail');
  const c = contenusPartage(TEXTE);
  assert.deepEqual(p.copies, [{ 'text/html': c.html, 'text/plain': c.texte }]);
  assert.equal(p.elements['retour-partager'].textContent, MESSAGES.gmail);
  assert.equal(p.elements.repli.hidden, true);
});

test('US-022 : copie refusée, l’email est montré et sélectionné, avec une phrase qui le dit (DEC-118)', async () => {
  const p = page({ texte: TEXTE, copie: false });
  await p.toucher('copier-gmail');
  assert.equal(p.elements.repli.hidden, false);
  assert.equal(p.elements['repli-consigne'].textContent, MESSAGES.gmailRepli);
  assert.equal(p.elements['repli-contenu'].innerHTML, preparerApercu(TEXTE).html);
});

test('US-023 et US-024 : les versions WhatsApp et texte se copient, ou s’affichent sélectionnées', async () => {
  const p = page({ texte: TEXTE });
  await p.toucher('copier-whatsapp');
  await p.toucher('copier-texte');
  const c = contenusPartage(TEXTE);
  assert.deepEqual(p.copies.map(x => x['text/plain']), [c.whatsapp, c.texte]);
  assert.equal(p.elements['retour-partager'].textContent, MESSAGES.texte);
  const refus = page({ texte: TEXTE, copie: false });
  await refus.toucher('copier-whatsapp');
  assert.equal(refus.elements.repli.hidden, false);
  assert.equal(refus.elements['repli-contenu'].enfants[0].value, c.whatsapp);
});

test('US-026 : « Exporter » copie le brouillon au format pivot ; « Télécharger » en fait un fichier texte (DEC-117)', async () => {
  const p = page({ texte: TEXTE });
  await p.toucher('exporter');
  assert.equal(p.copies[0]['text/plain'], contenusPartage(TEXTE).pivot);
  assert.equal(p.elements['retour-partager'].textContent, MESSAGES.export);
  await p.toucher('telecharger-brouillon');
  assert.equal(p.telechargements[0].texte, contenusPartage(TEXTE).pivot);
  assert.match(p.telechargements[0].type, /^text\/plain/);
});

test('US-026 : « Reprendre un brouillon » lit le fichier dans la page et met l’aperçu à jour (DEC-117)', async () => {
  const p = page();
  const pivot = contenusPartage(TEXTE).pivot;
  p.elements['ouvrir-brouillon'].files = [{ size: pivot.length, text: async () => pivot }];
  for (const f of p.elements['ouvrir-brouillon'].ecouteurs.change) await f();
  assert.equal(p.elements.texte.value, pivot);
  assert.equal(p.elements.apercu.innerHTML, preparerApercu(pivot).htmlEtiquete);
  assert.equal(p.elements['retour-ecrire'].textContent, MESSAGES.repris);
});

test('US-026 : un fichier trop gros ou illisible est refusé avec un message, le texte reste', async () => {
  const p = page({ texte: TEXTE });
  const choix = p.elements['ouvrir-brouillon'];
  choix.files = [{ size: TAILLE_MAX_BROUILLON + 1, text: async () => 'x' }];
  for (const f of choix.ecouteurs.change) await f();
  assert.equal(p.elements['retour-ecrire'].textContent, MESSAGES.fichierTropGros);
  choix.files = [{ size: 10, text: async () => { throw new Error('illisible'); } }];
  for (const f of choix.ecouteurs.change) await f();
  assert.equal(p.elements['retour-ecrire'].textContent, MESSAGES.fichierIllisible);
  assert.equal(p.elements.texte.value, TEXTE);
});

test('US-027 : le prompt copié est celui de l’étape 2, avec le surtitre de 60 caractères (DEC-108, DEC-120)', async () => {
  assert.equal(PROMPT_IA, lireDuDepot('etape-2/prompt-ia.txt'));
  assert.match(PROMPT_IA, /Le surtitre fait 60 caractères au plus/);
  const p = page();
  await p.toucher('copier-prompt');
  assert.deepEqual(p.copies, [{ 'text/plain': PROMPT_IA }]);
  assert.equal(p.elements['retour-ecrire'].textContent, MESSAGES.prompt);
});

test('US-027 : l’exemple du prompt est lu par l’outil sans anomalie', () => {
  const exemple = PROMPT_IA.match(/```\n([\s\S]*?)```/)[1];
  const doc = lirePivot(exemple);
  assert.deepEqual(doc.anomalies, []);
  assert.equal(preparerApercu(exemple).lecture, 'pivot');
  for (const s of doc.sections) assert.ok([...(s.surtitre || '')].length <= 60);
});

test('US-028 : avertissement au rechargement tant que l’email n’est ni copié pour Gmail ni exporté (DEC-119)', async () => {
  const p = page();
  assert.equal(p.recharger(), false, 'texte vide');
  p.taper(TEXTE);
  assert.equal(p.recharger(), true, 'texte non copié');
  await p.toucher('copier-whatsapp');
  assert.equal(p.recharger(), true, 'une copie WhatsApp ne compte pas');
  await p.toucher('copier-gmail');
  assert.equal(p.recharger(), false, 'copié pour Gmail');
  p.taper(`${TEXTE}\nP.-S. : merci.`);
  assert.equal(p.recharger(), true, 'modifié après la copie');
  await p.toucher('exporter');
  assert.equal(p.recharger(), false, 'exporté');
  p.taper(TEXTE);
  await p.toucher('telecharger-brouillon');
  assert.equal(p.recharger(), false, 'téléchargé');
});

test('US-028 : une copie pour Gmail refusée ne compte pas comme mise à l’abri', async () => {
  const p = page({ texte: TEXTE, copie: false });
  await p.toucher('copier-gmail');
  assert.equal(p.recharger(), true);
});
