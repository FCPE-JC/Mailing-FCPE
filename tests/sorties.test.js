// US-022 à US-026, US-028 : versions WhatsApp et texte, copie, image, export et
// avertissement (EX-009 à EX-013, EX-028, EX-029). Les versions WhatsApp et texte redonnent
// celles de l'outil de travail validé à l'étape 2 (rendu.py, tests/references/LISEZMOI.md).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { lirePivot } from '../docs/js/pivot.js';
import { preparerApercu } from '../docs/js/apercu.js';
import { contenusPartage } from '../docs/js/partage.js';
import {
  versionTexte, ligneWhatsApp, ligneTexte, nomDeFichier, aProteger, copierEmail, copierTexte, svgDeLEmail, IMAGE,
} from '../docs/js/sorties.js';
import { lireDuDepot } from './aides.js';

const SOURCES = { 'email-test-15-blocs.pivot': 'etape-3/T1-T2/email-test-15-blocs.pivot.md' };
const source = nom => SOURCES[nom] || `etape-2/specimens/${nom}.md`;
const references = readdirSync(new URL('./references/', import.meta.url)).filter(f => f.endsWith('-whatsapp.txt') || f.endsWith('-texte.txt'));

// Différence admise : rendu.py écrit toujours « IMPORTANT » ; l'outil garde le titre de
// l'encadré, comme dans l'email (« ATTENTION », « RAPPEL »…).
function attendu(reference, doc) {
  const titres = doc.sections.flatMap(s => s.blocs).filter(b => b.type === 'important').map(b => b.titre.toUpperCase());
  let i = 0;
  return reference.replace(/^(⚠️ \*)?IMPORTANT(\*)?$/gm, (tout, a = '', b = '') => `${a}${titres[i++] ?? 'IMPORTANT'}${b}`);
}

test('US-023 : les références WhatsApp et texte de rendu.py sont présentes', () => {
  assert.ok(references.filter(f => f.endsWith('-whatsapp.txt')).length >= 10);
  assert.equal(references.filter(f => f.endsWith('-whatsapp.txt')).length, references.filter(f => f.endsWith('-texte.txt')).length);
});

for (const fichier of references) {
  const whatsapp = fichier.endsWith('-whatsapp.txt');
  const nom = fichier.replace(/-(whatsapp|texte)\.txt$/, '');
  test(`${whatsapp ? 'US-023' : 'US-024'} : version ${whatsapp ? 'WhatsApp' : 'texte'} de ${nom} identique à rendu.py`, () => {
    const doc = lirePivot(lireDuDepot(source(nom)));
    assert.equal(versionTexte(doc, whatsapp), attendu(lireDuDepot(`tests/references/${fichier}`), doc));
  });
}

test('US-023 : marques WhatsApp (gras, italique, lien, puces, bouton, encadré, surtitre)', () => {
  const doc = lirePivot(`Chers parents,

## 🎉 Au programme
Venez **nombreux** à la *fête*, voir [le site](https://exemple.fr).
- un goûter
[Je m'inscris →](https://exemple.fr/inscription)
*Entrée libre.*

::: important
Pensez aux bottes.
:::

::: date
🗓️ Samedi 4 juin à 10 h
📍 Cour de l'école
:::

---
À bientôt !

Bien cordialement,
Vos représentants FCPE`);
  assert.equal(versionTexte(doc, true), `Chers parents,

🎉 *AU PROGRAMME*
Venez *nombreux* à la _fête_, voir le site (https://exemple.fr).

• un goûter

👉 Je m'inscris : https://exemple.fr/inscription

_Entrée libre._

⚠️ *IMPORTANT*
Pensez aux bottes.

🗓️ Samedi 4 juin à 10 h
📍 Cour de l'école

À bientôt !

Bien cordialement,
*Vos représentants FCPE*
`);
});

test('US-024 : la version texte n’a aucune marque ni émoji de structure', () => {
  const doc = lirePivot(lireDuDepot(SOURCES['email-test-15-blocs.pivot']));
  const texte = versionTexte(doc, false);
  assert.ok(!/\*|(?<![\p{L}\p{N}])_|👉|⚠️|•/u.test(texte), texte);
  assert.ok(texte.includes('- '));
  assert.equal(ligneTexte('Un **mot** en *italique* et _autre_, [lien](https://a.fr).'), 'Un mot en italique et autre, lien (https://a.fr).');
  assert.equal(ligneWhatsApp('Un **mot** en *italique* et _autre_.'), 'Un *mot* en _italique_ et _autre_.');
});

test('US-023 : une ligne vide sépare chaque bloc, y compris dans une même section (DEC-057)', () => {
  const doc = lirePivot('Chers parents,\n\n## 📝 Ordre du jour\nPremier paragraphe.\n\nSecond paragraphe.\n- un\n- deux\n\nBien cordialement,\nVos représentants FCPE');
  assert.match(versionTexte(doc, true), /Premier paragraphe\.\n\nSecond paragraphe\.\n\n• un\n• deux\n\nBien/);
});

test('US-023 : la signature garde ses lignes, seule la première en gras (DEC-110)', () => {
  const doc = lirePivot('Texte.\n\nBien cordialement,\nL’équipe FCPE\nÉcole Joliot-Curie');
  assert.match(versionTexte(doc, true), /Bien cordialement,\n\*L’équipe FCPE\*\nÉcole Joliot-Curie\n$/);
  assert.match(versionTexte(doc, false), /Bien cordialement,\nL’équipe FCPE\nÉcole Joliot-Curie\n$/);
});

test('US-023 : la version WhatsApp montre la pastille choisie par l’outil (D16), comme l’email', () => {
  const c = contenusPartage('Chers parents,\n\n## Cantine\nLe menu change.\n\nBien cordialement,\nVos représentants FCPE');
  const pastille = preparerApercu('Chers parents,\n\n## Cantine\nLe menu change.\n\nBien cordialement,\nVos représentants FCPE').doc.sections[0].pastille;
  assert.ok(pastille);
  assert.ok(c.whatsapp.includes(`${pastille} *CANTINE*`));
});

test('US-022 : le contenu copié pour Gmail est exactement le code de l’aperçu, sans étiquettes (DEC-104)', () => {
  const texte = lireDuDepot('etape-2/specimens/02-invitation.brut.txt');
  const c = contenusPartage(texte);
  const apercu = preparerApercu(texte);
  assert.equal(c.html, apercu.html);
  assert.notEqual(c.html, apercu.htmlEtiquete);
  assert.ok(!/data-bloc|class=/.test(c.html));
  assert.equal(c.texte, versionTexte(apercu.doc, false));
});

test('US-021 : un texte vide n’a rien à partager', () => {
  assert.equal(contenusPartage(''), null);
  assert.equal(contenusPartage('  \n '), null);
});

// Faux presse-papier : garde ce qui est écrit, ou refuse.
function fenetreCopie({ moderne = true, refuse = false, ancienne = true } = {}) {
  const ecrit = {};
  let ecouteur = null;
  class ClipboardItem { constructor(contenus) { this.contenus = contenus; } }
  class Blob { constructor(parties, options) { this.texte = parties.join(''); this.type = options.type; } }
  const document = {
    addEventListener: (nom, f) => { ecouteur = f; },
    removeEventListener: () => { ecouteur = null; },
    execCommand: () => {
      if (!ancienne) return false;
      ecouteur?.({ clipboardData: { setData: (type, valeur) => { ecrit[type] = valeur; } }, preventDefault() {} });
      return true;
    },
  };
  const navigator = moderne ? {
    clipboard: {
      write: async ([item]) => { if (refuse) throw new Error('refusé'); for (const [t, b] of Object.entries(item.contenus)) ecrit[t] = b.texte; },
      writeText: async t => { if (refuse) throw new Error('refusé'); ecrit['text/plain'] = t; },
    },
  } : {};
  return { fenetre: { document, navigator, ClipboardItem, Blob }, ecrit };
}

test('US-022 : la copie pour Gmail met l’email en HTML et en texte dans le presse-papier', async () => {
  const { fenetre, ecrit } = fenetreCopie();
  assert.equal(await copierEmail(fenetre, '<div>email</div>', 'email'), true);
  assert.deepEqual(ecrit, { 'text/html': '<div>email</div>', 'text/plain': 'email' });
});

test('US-022 : si la méthode moderne est refusée ou absente, la méthode ancienne prend le relais (T1)', async () => {
  for (const options of [{ refuse: true }, { moderne: false }]) {
    const { fenetre, ecrit } = fenetreCopie(options);
    assert.equal(await copierEmail(fenetre, '<div>email</div>', 'email'), true);
    assert.deepEqual(ecrit, { 'text/html': '<div>email</div>', 'text/plain': 'email' });
  }
});

test('US-022 : si aucune méthode ne marche, la copie le dit (pas d’échec silencieux)', async () => {
  const { fenetre } = fenetreCopie({ refuse: true, ancienne: false });
  assert.equal(await copierEmail(fenetre, '<div>email</div>', 'email'), false);
  assert.equal(await copierTexte(fenetre, 'texte'), false);
});

test('US-023 : la copie d’un texte passe par le presse-papier, ou par la méthode ancienne', async () => {
  const a = fenetreCopie();
  assert.equal(await copierTexte(a.fenetre, 'bonjour'), true);
  assert.equal(a.ecrit['text/plain'], 'bonjour');
  const b = fenetreCopie({ moderne: false });
  assert.equal(await copierTexte(b.fenetre, 'bonjour'), true);
  assert.equal(b.ecrit['text/plain'], 'bonjour');
});

test('US-025 : l’image est une seule image longue, à la largeur et à la densité du test T3', () => {
  assert.deepEqual({ ...IMAGE }, { largeur: 560, echelle: 2 });
  const svg = svgDeLEmail('<div xmlns="http://www.w3.org/1999/xhtml">email</div>', 560, 1234);
  assert.match(svg, /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" width="560" height="1234"><foreignObject [^>]*>/);
  assert.ok(svg.endsWith('</foreignObject></svg>'));
});

test('US-026 : le fichier téléchargé porte la date du jour', () => {
  assert.equal(nomDeFichier('brouillon-mailing', 'txt', new Date(2026, 9, 3)), 'brouillon-mailing-2026-10-03.txt');
});

// Emails tirés au hasard (graine fixe) : objet, salutation, corps fait de morceaux de toutes
// sortes, bruts ou pivot, puis clôture et signature, chacun présent ou non.
function* textesAuHasard(nombre) {
  let graine = 20261013;
  const hasard = n => { graine = (graine * 1103515245 + 12345) % 2147483648; return graine % n; };
  const un = liste => liste[hasard(liste.length)];
  const corps = [
    '## 🍽️ Cantine', '## Au programme', '##', '### 📝 Ordre du jour', 'Le **jeudi 5 novembre**, nous vous attendons.',
    '> Merci pour votre confiance.', '*Vos réponses sont anonymes.*', '- un goûter\n- un jeu', '[Répondre au questionnaire →](https://forms.gle/exemple)',
    '::: important\nAttention\nGrève jeudi.\n:::', '::: date\n🗓️ Jeudi 5 novembre à 8 h 30\n📍 Salle polyvalente\n:::',
    'Voir https://exemple.fr ou [le site](https://a.fr).', 'Une phrase _en italique_ au milieu.', 'Merci de répondre avant le 12 octobre.',
    '📢 Réunion ce soir à 18 h !', '1. premier point\n2. second point', 'Pensez à apporter un gâteau, une boisson ou un jeu.',
  ];
  for (let n = 0; n < nombre; n++) {
    const parties = [];
    if (hasard(2)) parties.push('Objet : Fête de l’école 🎉');
    if (hasard(3)) parties.push(un(['Chers parents,', 'Bonjour à tous,']));
    for (let k = 1 + hasard(7); k > 0; k--) parties.push(un(corps));
    if (hasard(2)) parties.push('---', un(['À bientôt ✨', 'Au plaisir de vous voir !']));
    if (hasard(4)) parties.push(un(['Bien cordialement,\nVos représentants FCPE', 'Amicalement,\nL’équipe\nÉcole Joliot-Curie', 'Cordialement']));
    yield parties.join(hasard(3) ? '\n\n' : '\n');
  }
}

test('US-026 : un brouillon exporté puis repris redonne exactement le même email (EX-028)', () => {
  const textes = [
    ...readdirSync(new URL('../etape-2/specimens/', import.meta.url)).map(f => lireDuDepot(`etape-2/specimens/${f}`)),
    lireDuDepot(SOURCES['email-test-15-blocs.pivot']),
    ...textesAuHasard(300),
  ];
  for (const texte of textes) {
    const avant = contenusPartage(texte);
    const apres = contenusPartage(avant.pivot);
    assert.equal(apres.html, avant.html, texte);
    assert.equal(apres.whatsapp, avant.whatsapp, texte);
    assert.equal(preparerApercu(avant.pivot).objet, preparerApercu(texte).objet, texte);
    // Reprendre une seconde fois ne change plus rien.
    assert.equal(apres.pivot, avant.pivot, texte);
  }
});

test('US-028 : avertir seulement si le texte n’est pas vide et a changé depuis la copie Gmail ou l’export', () => {
  assert.equal(aProteger('', null), false);
  assert.equal(aProteger('  \n', null), false);
  assert.equal(aProteger('Texte', null), true);
  assert.equal(aProteger('Texte', 'Texte'), false);
  assert.equal(aProteger('Texte modifié', 'Texte'), true);
});
