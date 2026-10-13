// US-011 « Texte jamais interprété comme du code » (EX-017) : le texte du rédacteur s'affiche tel
// quel ; seuls les liens https, http et mailto deviennent cliquables.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lirePivot } from '../docs/js/pivot.js';
import { rendreEmail, enLigne, echapper } from '../docs/js/rendu.js';

const rendre = texte => rendreEmail(lirePivot(texte));

test('US-011 : une balise HTML ou un script dans le texte s’affiche comme du texte', () => {
  const html = rendre('Chers parents,\n\n<script>alert(1)</script> et <img src=x onerror=alert(1)>\n\n> <b>gras</b>\n\n- <iframe>');
  assert.ok(!/<script/i.test(html));
  assert.ok(!/<img src=x/i.test(html));
  assert.ok(!/<iframe/i.test(html));
  assert.ok(!/<b>/.test(html));
  assert.ok(html.includes('&lt;script&gt;alert(1)&lt;/script&gt;'));
});

test('US-011 : partout où le rédacteur écrit, son texte est échappé', () => {
  const piege = '<u>x</u>';
  const pivot = `Objet : ${piege}\n\n${piege},\n\n## 🙏 ${piege}\n> ${piege}\n\n${piege}\n\n*${piege}*\n\n- ${piege}\n\n[${piege}](https://exemple.fr/)\n\n::: important\n${piege}\n:::\n\n::: date\n${piege}\n:::\n\n---\n${piege}\n\nBien cordialement,\n${piege}`;
  const html = rendre(pivot);
  assert.ok(!html.includes('<u>'));
  assert.ok((html.match(/&lt;u&gt;x&lt;\/u&gt;/g) || []).length >= 10);
});

test('US-011 : un guillemet ne peut pas sortir d’un attribut', () => {
  const html = rendre('[Voir](https://exemple.fr/"onmouseover="alert(1))');
  assert.ok(!/"onmouseover=/.test(html));
  assert.equal(echapper('"'), '&quot;');
});

test('US-011 : seuls les liens https, http et mailto deviennent cliquables', () => {
  assert.match(enLigne('[site](https://exemple.fr/)'), /<a href="https:\/\/exemple\.fr\/"/);
  assert.match(enLigne('[site](http://exemple.fr/)'), /<a href="http:\/\/exemple\.fr\/"/);
  assert.match(enLigne('[écrire](mailto:fcpe@exemple.fr)'), /<a href="mailto:fcpe@exemple\.fr"/);
  for (const adresse of ['javascript:alert(1)', 'data:text/html,x', 'vbscript:x', 'file:///etc/passwd', '//exemple.fr']) {
    assert.ok(!/<a /.test(enLigne(`[piège](${adresse})`)), adresse);
  }
});

test('US-011 : un lien javascript: reste du texte et est signalé', () => {
  const doc = lirePivot('Cliquez [ici](javascript:alert(1)) maintenant.');
  assert.ok(doc.anomalies.some(a => a.code === 'lien-non-valide'));
  assert.ok(!/<a href="javascript/i.test(rendreEmail(doc)));
  const bouton = lirePivot('[Cliquez](javascript:alert(1))');
  assert.ok(bouton.anomalies.some(a => a.code === 'lien-non-valide'));
  assert.ok(!/href="javascript/i.test(rendreEmail(bouton)));
});
