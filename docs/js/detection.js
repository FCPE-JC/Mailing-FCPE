// Mailing-FCPE : détection, du texte brut au pivot (US-012, US-013, US-014 ; EX-001, EX-004).
//
// Applique les règles D1 à D16 de etape-2/regles-detection.md à un texte sans syntaxe
// (un message WhatsApp, un email) et produit un texte au format pivot, que pivot.js lit
// ensuite comme un pivot écrit à la main. Dans le doute, un texte reste un paragraphe.
//
// Transcription fidèle de etape-2/outils-de-travail/detection.py, défauts connus compris
// (DEC-097), sauf deux écarts avec la règle D16 corrigés dans choisirPastille() : les
// tests comparent le résultat aux fichiers *.pivot-detecte.md des spécimens. Deux ajouts
// au texte des règles, gardés par Mat (DEC-100) : « Cher », « Chère » et « Mesdames » en
// salutation (D4), « -> » avant une adresse seule (D3).

// Frontière de mot au sens de Python (lettres et chiffres de toutes les langues) : le \b de
// JavaScript ne connaît que les lettres sans accent.
const B = '(?:(?<=[\\p{L}\\p{N}_])(?![\\p{L}\\p{N}_])|(?<![\\p{L}\\p{N}_])(?=[\\p{L}\\p{N}_]))';
const W = '[\\p{L}\\p{N}_]';
const motif = (source, drapeaux = 'iu') => new RegExp(source.replaceAll('\\b', B).replaceAll('\\w', W), drapeaux);

const EMOJI = '[\\u{1F000}-\\u{1FAFF}\\u2600-\\u27BF\\u2B00-\\u2BFF\\u2139\\u2190-\\u21FF\\u2300-\\u23FF\\u3030\\u303D\\u3297\\u3299][\\uFE0F\\u200D\\u{1F3FB}-\\u{1F3FF}\\u{1F000}-\\u{1FAFF}\\u2600-\\u27BF]*';
const JOURS = '(?:lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)';
const MOIS = '(?:janvier|février|fevrier|mars|avril|mai|juin|juillet|août|aout|septembre|octobre|novembre|décembre|decembre)';
const DATE_SOURCE = `\\b(?:${JOURS}\\s+)?(?:1er|\\d{1,2})\\s+${MOIS}(?:\\s+\\d{4})?\\b|\\b${JOURS}\\s+\\d{1,2}/\\d{1,2}(?:/\\d{2,4})?\\b|\\b\\d{1,2}/\\d{1,2}/\\d{2,4}\\b`;
const DATE = motif(DATE_SOURCE);
const DATES = motif(DATE_SOURCE, 'giu');
const HEURE = motif('\\b\\d{1,2}\\s?h\\s?(?:\\d{2})?\\b|\\b\\d{1,2}:\\d{2}\\b');
const URL = 'https?://[^\\s<>()]+';
const POLITESSE = motif('^(bien cordialement|cordialement|bien à vous|amicalement|à (très )?bientôt|belle (journée|soirée|semaine)|bonne (journée|soirée|semaine)|avec nos (sincères )?salutations|bon courage|merci et à bientôt)\\b');
const SALUT = motif('^(chers|chères|cher|chère|bonjour|bonsoir|madame|mesdames)\\b');
const IMPORTANT = motif(`^(?:${EMOJI}\\s*)?(important|attention|urgent|à retenir|a retenir|à noter|rappel)\\s*[:!]\\s*`);
const NOTE = motif('^(n\\.?\\s?b\\.?|p\\.?\\s?s\\.?)\\s*[:.-]?\\s*');
const PUCE = motif('^\\s*(?:[-*•–·]|\\d{1,2}[.)])\\s+');
const LIEN_SEUL = motif(`^(?:(?:👉|➡️|→|->)\\s*)?(?:(?:lien|formulaire|inscription)\\s*:\\s*)?(${URL})$`);
const LIEU = motif('\\b(salle|mairie|école|ecole|préau|preau|gymnase|cantine|médiathèque|adresse|lieu)\\b|📍');
const EMOJI_TETE = motif(`^(${EMOJI})\\s*(.*)$`, 'u');
const EMOJIS = motif(EMOJI, 'gu');
const COMMENCE_EMOJI = motif(`^${EMOJI}`, 'u');

// D16 : pastilles, dans l'ordre de priorité ; null pour la présence d'une date (D12), false
// pour une pastille proposée dans le panneau seulement. Sept pastilles ajoutées au lot 5
// (DEC-109), dont les mots-clés passent avant ceux de 🤝, plus vagues.
const PICTOS = [
  ['⚠️', '\\b(urgent|grève|greve|fermeture|annul\\w*|alerte)\\b'],
  ['🗓️', null],
  ['📅', false],
  ['🔒', '\\b(anonym\\w*|confidenti\\w*)\\b'],
  ['🍽️', '\\b(cantine|repas|restauration|menus?)\\b'],
  ['📝', '\\b(questionnaire|formulaire|sondage|témoignages?|avis)\\b'],
  ['🏫', '\\b(école|conseil d.école|classes?|enseignants?|maîtres?(se)?s?)\\b'],
  ['🎉', '\\b(fête|kermesse|carnaval|spectacle|goûter)\\b'],
  ['🙏', '\\b(merci|remerci\\w*)\\b'],
  ['🗳️', '\\b(élections?|vote[rsz]?|scrutin)\\b'],
  ['📢', '\\b(annonces?|actualités?|nouvelles?)\\b'],
  ['📚', '\\b(pédagogi\\w*|apprentissages?|devoirs|lecture|bibliothèques?)\\b'],
  ['👨‍👩‍👧‍👦', '\\b(communautés?)\\b'],
  ['🗣️', '\\b(consultations?|débats?|parole|exprimer)\\b'],
  ['♻️', '\\b(recyclage|collectes?|environnement|écologi\\w*|durables?)\\b'],
  ['🙋', '\\b(bénévoles?|volontaires?|besoin de vous|coup de main)\\b'],
  ['🤝', '\\b(écoute|lien|ensemble|contact\\w*|rencontr\\w*)\\b'],
  ['ℹ️', '.'],
].map(([emoji, source]) => [emoji, source ? motif(source, 'u') : source]);
const NEUTRE = 'ℹ️';

// Longueur en caractères affichés (comme Python), et non en unités UTF-16.
const longueur = s => [...s].length;
const majuscule = s => { const [c = '', ...reste] = s; return c.toUpperCase() + reste.join(''); };
const capitaliser = s => { const [c = '', ...reste] = s; return c.toUpperCase() + reste.join('').toLowerCase(); };
const enCapitales = s => /\p{Lu}/u.test(s) && !/[\p{Ll}\p{Lt}]/u.test(s);
const retirerDroite = (s, car) => { let f = s.length; while (f && car.includes(s[f - 1])) f--; return s.slice(0, f); };
const retirerBords = (s, car) => { let d = 0; while (d < s.length && car.includes(s[d])) d++; return retirerDroite(s.slice(d), car); };

// D9 : libellé du bouton selon l'adresse.
export function libelleBouton(adresse) {
  const u = adresse.toLowerCase();
  if (u.includes('forms.gle') || u.includes('docs.google.com/forms') || u.includes('framaforms')) return 'Répondre au questionnaire →';
  if (u.includes('doodle') || u.includes('framadate')) return 'Indiquer mes disponibilités →';
  if (u.split('?')[0].endsWith('.pdf')) return 'Lire le document →';
  if (u.includes('chat.whatsapp.com')) return 'Rejoindre le groupe →';
  return 'Ouvrir le lien →';
}

// D16 : première pastille dont un mot-clé figure dans le texte, en évitant une pastille déjà
// utilisée par une section précédente si un autre mot-clé correspond ; ℹ️ seulement sans
// aucun mot-clé. Deux corrections de detection.py, qui donnait ℹ️ à une pastille répétée et
// ne reconnaissait pas « maître » au singulier (DEC-101).
export function choisirPastille(texte, deja = []) {
  const t = texte.toLowerCase();
  const trouves = PICTOS.filter(([, m]) => m !== false && (m === null ? DATE.test(t) : m.test(t))).map(([e]) => e);
  return trouves.find(e => e !== NEUTRE && !deja.includes(e)) ?? trouves[0] ?? NEUTRE;
}

// D12 : découpe un paragraphe en lignes de bloc Date et lieu, à la virgule qui suit l'heure,
// au point ou au tiret ; la première ligne reçoit 🗓️, une ligne de lieu reçoit 📍.
export function decouperDateLieu(v) {
  const parts = v.split(/(?<=\d)\s*,\s+|[.;]\s+|\s+[-–]\s+/u).map(x => retirerBords(x, ' .')).filter(Boolean);
  return parts.map((x, q) => (q === 0 ? '🗓️ ' : (LIEU.test(x) ? '📍 ' : '')) + majuscule(x));
}

// Lignes d'un bloc Date et lieu déjà découpées (corrections, US-016) : 🗓️ sur la première
// ligne et 📍 sur une ligne de lieu, sauf si la ligne commence déjà par un émoji.
export function marquerDateLieu(lignes) {
  return lignes.map((x, q) => (COMMENCE_EMOJI.test(x) ? x
    : (q === 0 ? '🗓️ ' : (LIEU.test(x) ? '📍 ' : '')) + majuscule(x)));
}

// Pastilles proposées au rédacteur (US-017), dans l'ordre de la règle D16.
export const PASTILLES = Object.freeze(PICTOS.map(([e]) => e));

// Texte d'un bloc, pour la recherche des mots-clés et des dates.
const texteBloc = ([, v]) => (typeof v === 'string' ? v : v.join(' '));

// Principe 5 : un texte qui contient déjà la syntaxe pivot est lu comme un pivot.
// « ### » compte comme « ## », comme à la lecture du pivot (lot 2).
export function estPivot(texte) {
  return String(texte ?? '').split(/\r\n?|\n/).some(l => /^\s*#{2,}(\s|$)/.test(l) || /^\s*:::/.test(l) || /^\s*> /.test(l));
}

// Applique D1 à D16 et renvoie le modèle de détection (comme detecter() de detection.py).
export function detecter(brut) {
  // D1 : préparation.
  const t = String(brut ?? '').normalize('NFC').replaceAll('\r\n', '\n').replaceAll('\u00A0', ' ').replaceAll('\u202F', ' ');
  const lignes = t.split('\n').map(l => l.trimEnd());
  let objet = null;
  // D2 : objet.
  while (lignes.length && !lignes[0].trim()) lignes.shift();
  if (lignes.length && /^(objet|sujet)\s*:/i.test(lignes[0])) {
    const l = lignes.shift();
    objet = l.slice(l.indexOf(':') + 1).trim();
  }
  // D3 : paragraphes ; certaines lignes s'isolent d'elles-mêmes.
  const paras = [];
  let cur = [];
  for (const l of lignes) {
    const s = l.trim();
    if (!s) { if (cur.length) { paras.push(cur); cur = []; } continue; }
    if (LIEN_SEUL.test(s) || POLITESSE.test(s)) {
      if (cur.length) paras.push(cur);
      paras.push([s]); cur = []; continue;
    }
    if (PUCE.test(s) && cur.length && !PUCE.test(cur.at(-1))) { paras.push(cur); cur = []; }
    if (cur.length && PUCE.test(cur.at(-1)) && !PUCE.test(s)) { paras.push(cur); cur = []; }
    cur.push(s);
  }
  if (cur.length) paras.push(cur);
  // D10 : gras de WhatsApp vers le gras du pivot.
  const conv = s => s.replace(/(?<![\p{L}\p{N}_*])\*([^*\n]+?)\*(?![\p{L}\p{N}_*])/gu, '**$1**');
  let elems = [];
  for (const brutes of paras) {
    const p = brutes.map(conv);
    const m = p[0].match(LIEN_SEUL);
    if (m && p.length === 1) { elems.push(['lien', m[1]]); continue; }
    if (p.every(x => PUCE.test(x))) { elems.push(['liste', p.map(x => x.replace(PUCE, ''))]); continue; }
    elems.push(['para', p.join('\n')]);
  }
  const out = { objet, salutation: null, sections: [], cloture: null, signature: null };
  // D4 : salutation.
  if (elems.length && elems[0][0] === 'para' && longueur(elems[0][1]) <= 40 && (elems[0][1].endsWith(',') || SALUT.test(elems[0][1]))) {
    out.salutation = retirerDroite(elems.shift()[1], ',') + ',';
  }
  // D5 : signature.
  for (let k = 0; k < elems.length; k++) {
    const [ty, v] = elems[k];
    if (ty === 'para' && POLITESSE.test(v)) {
      const coupure = v.indexOf('\n');
      const premiere = coupure < 0 ? v : v.slice(0, coupure);
      const reste = (coupure < 0 ? '' : v.slice(coupure + 1)).replaceAll('\n', ' ').trim();
      const suite = elems.slice(k + 1).filter(x => x[0] === 'para').map(x => x[1]).join(' ');
      out.signature = [retirerDroite(premiere, ' ,') + ',', (reste + ' ' + suite).trim() || null];
      elems = elems.slice(0, k);
      break;
    }
  }
  // D6 : clôture.
  if (elems.length >= 2 && elems.at(-1)[0] === 'para' && longueur(elems.at(-1)[1]) <= 80) {
    out.cloture = elems.pop()[1].replaceAll('\n', ' ');
  }
  const uneLigne = elems.map(([ty, v]) => ty === 'para' && !v.includes('\n'));
  elems = elems.map(([ty, v]) => (ty === 'para' ? [ty, v.replaceAll('\n', ' ')] : [ty, v]));
  // D7 : titres.
  const estTitre = k => {
    const [ty, v] = elems[k];
    if (ty !== 'para' || k === elems.length - 1 || !uneLigne[k]) return false;
    const nu = v.replace(EMOJIS, '').trim();
    const toutGras = /^\*\*[^*]+\*\*$/.test(nu);
    return (toutGras && longueur(v) <= 60)
      || (longueur(v) <= 50 && !/[.,;:!?…]$/.test(nu) && !v.includes('**'))
      || (enCapitales(v) && longueur(v) <= 60);
  };
  // D11 encadré, D12 date et lieu, D13 note, D14 regroupement en sections.
  const sections = [];
  let sec = null;
  const aDesTitres = elems.some((_, k) => estTitre(k));
  elems.forEach(([ty, v], k) => {
    if (estTitre(k)) {
      const m = v.match(EMOJI_TETE);
      sec = { picto: m ? m[1] : null, surtitre: retirerDroite((m ? m[2] : v).trim().replaceAll('**', '').trim(), ' :'), blocs: [] };
      sections.push(sec);
      return;
    }
    if (ty === 'para') {
      const mi = v.match(IMPORTANT);
      const mn = NOTE.test(v);
      let bloc;
      if (mi) {
        const corps = majuscule(v.slice(mi[0].length).trim());
        const mot = mi[1].toLowerCase();
        bloc = ['important', [...(mot === 'important' ? [] : [capitaliser(mot)]), corps]];
      } else if (/^_[^_].*_$/.test(v)) bloc = ['note', v.slice(1, -1)];
      else if (mn) bloc = ['note', v];
      else bloc = ['para', v];
      const dateLieu = DATE.test(v) && HEURE.test(v) && LIEU.test(v) && longueur(v) <= 160;
      if (dateLieu && bloc[0] === 'para') {
        bloc = ['date', decouperDateLieu(v)];
      }
      const introLien = v.endsWith(':') && longueur(v) <= 80 && k + 1 < elems.length && elems[k + 1][0] === 'lien';
      const nouvelle = (!aDesTitres && !(introLien && sec !== null)) || sec === null;
      if (nouvelle) { sec = { picto: null, surtitre: null, blocs: [] }; sections.push(sec); }
      sec.blocs.push(bloc);
    } else {
      if (sec === null) { sec = { picto: null, surtitre: null, blocs: [] }; sections.push(sec); }
      sec.blocs.push(ty === 'lien' ? ['bouton', [libelleBouton(v), v]] : ['liste', v]);
    }
  });
  // D15 : accroche.
  const premiere = sections[0];
  if (premiere && !premiere.surtitre && premiere.blocs.length === 1 && premiere.blocs[0][0] === 'para' && longueur(premiere.blocs[0][1]) <= 300) {
    premiere.blocs[0] = ['accroche', premiere.blocs[0][1]];
  }
  // D16 : pastilles et surtitre de date.
  const deja = [];
  for (const s of sections) {
    const texte = s.blocs.map(texteBloc).join(' ');
    if (!s.picto) s.picto = choisirPastille((s.surtitre || '') + ' ' + texte, deja);
    deja.push(s.picto);
    if (!s.surtitre && !s.blocs.some(b => b[0] === 'date' || b[0] === 'note')) {
      const m = texte.match(DATE);
      if (m) s.surtitre = majuscule(m[0]);
    }
  }
  // D10 : dates mises en gras dans les paragraphes et l'accroche.
  for (const s of sections) {
    s.blocs = s.blocs.map(([ty, v]) => {
      if (ty !== 'para' && ty !== 'accroche') return [ty, v];
      return [ty, v.replace(DATES, d => (new RegExp('\\*\\*[^*]*' + d.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'u').test(v) ? d : `**${d}**`))];
    });
  }
  out.sections = sections;
  return out;
}

// Écrit le modèle de détection au format pivot (comme vers_pivot() de detection.py).
export function versPivot(o) {
  const L = [];
  if (o.objet) L.push(`Objet : ${o.objet}`, '');
  if (o.salutation) L.push(o.salutation, '');
  for (const s of o.sections) {
    L.push(('## ' + [s.picto, s.surtitre].filter(Boolean).join(' ')).trimEnd());
    s.blocs.forEach(([ty, v], j) => {
      if (ty === 'para') L.push(v);
      else if (ty === 'accroche') L.push('> ' + v);
      else if (ty === 'note') L.push('*' + v.replaceAll('**', '') + '*');
      else if (ty === 'bouton') L.push(`[${v[0]}](${v[1]})`);
      else if (ty === 'liste') L.push(...v.map(x => '- ' + x));
      else if (ty === 'important') L.push('::: important', ...v, ':::');
      else if (ty === 'date') L.push('::: date', ...v, ':::');
      if (!(j + 1 < s.blocs.length && s.blocs[j + 1][0] === 'bouton')) L.push('');
    });
    if (L.at(-1) !== '') L.push('');
  }
  if (o.cloture) L.push('---', o.cloture, '');
  if (o.signature) {
    L.push(o.signature[0]);
    if (o.signature[1]) L.push(o.signature[1]);
  }
  return L.join('\n').trimEnd() + '\n';
}

// Texte brut vers texte pivot.
export function detecterPivot(brut) {
  return versPivot(detecter(brut));
}

// D16 appliquée à un pivot lu (DEC-099) : une section sans émoji reçoit la pastille de
// ses mots-clés ; aucun surtitre n'est ajouté, le rédacteur a écrit les siens.
export function completerPastilles(doc) {
  const deja = [];
  for (const s of doc.sections) {
    if (!s.pastille) {
      const texte = s.blocs.map(b => [b.titre, b.texte, b.libelle, b.adresse, ...(b.elements || []), ...(b.lignes || [])].filter(Boolean).join(' ')).join(' ');
      s.pastille = choisirPastille((s.surtitre || '') + ' ' + texte, deja);
    }
    deja.push(s.pastille);
  }
  return doc;
}
