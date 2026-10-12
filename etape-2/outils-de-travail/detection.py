"""Outil de travail de l'étape 2 : applique à la lettre les règles de regles-detection.md (D1 à D16)
à un texte brut et produit le pivot. Sert à vérifier que les règles sont complètes et non ambiguës."""
import re, sys, unicodedata

EMOJI = r'[\U0001F000-\U0001FAFF☀-➿⬀-⯿ℹ←-⇿⌀-⏿〰〽㊗㊙][️‍\U0001F3FB-\U0001F3FF\U0001F000-\U0001FAFF☀-➿]*'
JOURS = r'(?:lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)'
MOIS = r'(?:janvier|février|fevrier|mars|avril|mai|juin|juillet|août|aout|septembre|octobre|novembre|décembre|decembre)'
DATE = re.compile(rf'\b(?:{JOURS}\s+)?(?:1er|\d{{1,2}})\s+{MOIS}(?:\s+\d{{4}})?\b|\b{JOURS}\s+\d{{1,2}}/\d{{1,2}}(?:/\d{{2,4}})?\b|\b\d{{1,2}}/\d{{1,2}}/\d{{2,4}}\b', re.I)
HEURE = re.compile(r'\b\d{1,2}\s?h\s?(?:\d{2})?\b|\b\d{1,2}:\d{2}\b', re.I)
URL = r'https?://[^\s<>()]+'
POLITESSE = re.compile(r'^(bien cordialement|cordialement|bien à vous|amicalement|à (très )?bientôt|belle (journée|soirée|semaine)|bonne (journée|soirée|semaine)|avec nos (sincères )?salutations|bon courage|merci et à bientôt)\b', re.I)
SALUT = re.compile(r'^(chers|chères|cher|chère|bonjour|bonsoir|madame|mesdames)\b', re.I)
IMPORTANT = re.compile(rf'^(?:{EMOJI}\s*)?(important|attention|urgent|à retenir|a retenir|à noter|rappel)\s*[:!]\s*', re.I)
NOTE = re.compile(r'^(n\.?\s?b\.?|p\.?\s?s\.?)\s*[:.-]?\s*', re.I)
PUCE = re.compile(r'^\s*(?:[-*•–·]|\d{1,2}[.)])\s+')
LIEN_SEUL = re.compile(rf'^(?:(?:👉|➡️|→|->)\s*)?(?:(?:lien|formulaire|inscription)\s*:\s*)?({URL})$', re.I)
LIEU = re.compile(r'\b(salle|mairie|école|ecole|préau|preau|gymnase|cantine|médiathèque|adresse|lieu)\b|📍', re.I)

# D15 : dictionnaire des pastilles, dans l'ordre de priorité
PICTOS = [
    ('⚠️', r'\b(urgent|grève|greve|fermeture|annul\w*|alerte)\b'),
    ('🗓️', None),  # présence d'une date (D9)
    ('🔒', r'\b(anonym\w*|confidenti\w*)\b'),
    ('🍽️', r'\b(cantine|repas|restauration|menus?)\b'),
    ('📝', r'\b(questionnaire|formulaire|sondage|témoignages?|avis)\b'),
    ('🏫', r'\b(école|conseil d.école|classes?|enseignants?|maîtres(se)?s?)\b'),
    ('🎉', r'\b(fête|kermesse|carnaval|spectacle|goûter)\b'),
    ('🙏', r'\b(merci|remerci\w*)\b'),
    ('🗳️', r'\b(élections?|vote[rsz]?|scrutin)\b'),
    ('🤝', r'\b(écoute|lien|ensemble|contact\w*|rencontr\w*)\b'),
    ('ℹ️', r'.'),  # picto neutre
]

def libelle_bouton(url):  # D7
    u = url.lower()
    if 'forms.gle' in u or 'docs.google.com/forms' in u or 'framaforms' in u: return 'Répondre au questionnaire →'
    if 'doodle' in u or 'framadate' in u: return 'Indiquer mes disponibilités →'
    if u.split('?')[0].endswith('.pdf'): return 'Lire le document →'
    if 'chat.whatsapp.com' in u: return 'Rejoindre le groupe →'
    return 'Ouvrir le lien →'

def picto(texte, deja):  # D15
    t = texte.lower(); trouves = []
    for e, motif in PICTOS:
        if (motif is None and DATE.search(t)) or (motif and re.search(motif, t)): trouves.append(e)
    for e in trouves:
        if e not in deja: return e
    return trouves[0]

def detecter(brut):
    t = unicodedata.normalize('NFC', brut).replace('\r\n', '\n').replace(' ', ' ').replace(' ', ' ')
    lignes = [l.rstrip() for l in t.split('\n')]
    objet = None
    # D2 objet
    while lignes and not lignes[0].strip(): lignes.pop(0)
    if lignes and re.match(r'^(objet|sujet)\s*:', lignes[0], re.I):
        objet = lignes.pop(0).split(':', 1)[1].strip()
    # D1 paragraphes : ligne vide = séparation ; certaines lignes isolent d'elles-mêmes
    paras, cur = [], []
    for l in lignes:
        s = l.strip()
        if not s:
            if cur: paras.append(cur); cur = []
            continue
        if LIEN_SEUL.match(s) or POLITESSE.match(s):
            if cur: paras.append(cur)
            paras.append([s]); cur = []; continue
        if PUCE.match(s) and cur and not PUCE.match(cur[-1]):
            paras.append(cur); cur = []
        if cur and PUCE.match(cur[-1]) and not PUCE.match(s):
            paras.append(cur); cur = []
        cur.append(s)
    if cur: paras.append(cur)
    # D10 mise en valeur WhatsApp -> Markdown
    def conv(s):
        s = re.sub(r'(?<![\w*])\*([^*\n]+?)\*(?![\w*])', r'**\1**', s)
        return s
    elems = []  # (type, valeur)
    for p in paras:
        p = [conv(x) for x in p]
        s0 = p[0]
        m = LIEN_SEUL.match(s0)
        if m and len(p) == 1: elems.append(('lien', m.group(1))); continue
        if all(PUCE.match(x) for x in p): elems.append(('liste', [PUCE.sub('', x) for x in p])); continue
        elems.append(('para', '\n'.join(p)))
    out = {'objet': objet, 'salutation': None, 'sections': [], 'cloture': None, 'signature': None}
    # D3 salutation
    if elems and elems[0][0] == 'para' and len(elems[0][1]) <= 40 and (elems[0][1].endswith(',') or SALUT.match(elems[0][1])):
        out['salutation'] = elems.pop(0)[1].rstrip(',') + ','
    # D4 signature
    for k, (ty, v) in enumerate(elems):
        if ty == 'para' and POLITESSE.match(v):
            m = POLITESSE.match(v)
            premiere, _, reste = v.partition('\n')
            formule = premiere.rstrip(' ,') + ','
            reste = reste.replace('\n', ' ').strip()
            suite = ' '.join(x[1] for x in elems[k+1:] if x[0] == 'para')
            out['signature'] = (formule, (reste + ' ' + suite).strip() or None)
            elems = elems[:k]; break
    # D5 clôture
    if elems and elems[-1][0] == 'para' and len(elems[-1][1]) <= 80 and len(elems) >= 2:
        out['cloture'] = elems.pop()[1].replace('\n', ' ')
    une_ligne = [ty == 'para' and '\n' not in v for ty, v in elems]
    elems = [(ty, v.replace('\n', ' ')) if ty == 'para' else (ty, v) for ty, v in elems]
    # D6 titres, D11 encadré, D12 note, D13 accroche, D14 regroupement
    def est_titre(k):
        ty, v = elems[k]
        if ty != 'para' or k == len(elems) - 1 or not une_ligne[k]: return False
        nu = re.sub(EMOJI, '', v).strip()
        tout_gras = re.fullmatch(r'\*\*[^*]+\*\*', nu) is not None
        return ((tout_gras and len(v) <= 60)
                or (len(v) <= 50 and not re.search(r'[.,;:!?…]$', nu) and '**' not in v)
                or (v.isupper() and len(v) <= 60))
    sections, sec = [], None
    a_des_titres = any(est_titre(k) for k in range(len(elems)))
    for k, (ty, v) in enumerate(elems):
        if est_titre(k):
            m = re.match(rf'^({EMOJI})\s*(.*)$', v)
            sec = {'picto': m.group(1) if m else None, 'surtitre': (m.group(2) if m else v).strip().replace('**', '').strip().rstrip(' :'), 'blocs': [], 'auto': not m}
            sections.append(sec); continue
        if ty == 'para':
            mi, mn = IMPORTANT.match(v), NOTE.match(v)
            if mi:
                corps = v[mi.end():].strip(); corps = corps[:1].upper() + corps[1:]
                mot = mi.group(1).lower()
                bloc = ('important', ([] if mot == 'important' else [mot.capitalize()]) + [corps])
            elif re.fullmatch(r'_[^_].*_', v): bloc = ('note', v[1:-1])
            elif mn: bloc = ('note', v)
            else: bloc = ('para', v)
            date_lieu = (DATE.search(v) and HEURE.search(v) and LIEU.search(v) and len(v) <= 160)
            if date_lieu and bloc[0] == 'para':
                parts = [x.strip(' .') for x in re.split(r'(?<=\d)\s*,\s+|[.;]\s+|\s+[-–]\s+', v) if x.strip(' .')]
                parts = [('🗓️ ' if q == 0 else ('📍 ' if LIEU.search(x) else '')) + x[:1].upper() + x[1:] for q, x in enumerate(parts)]
                bloc = ('date', parts)
            intro_lien = v.endswith(':') and len(v) <= 80 and k + 1 < len(elems) and elems[k+1][0] == 'lien'
            nouvelle = ((not a_des_titres) and not (intro_lien and sec is not None)) or sec is None
            # D14 : en l'absence de titres, chaque paragraphe ouvre une section, sauf note qui suit ... (non)
            if nouvelle:
                sec = {'picto': None, 'surtitre': None, 'blocs': [], 'auto': True}; sections.append(sec)
            sec['blocs'].append(bloc)
        elif ty in ('lien', 'liste'):
            if sec is None:
                sec = {'picto': None, 'surtitre': None, 'blocs': [], 'auto': True}; sections.append(sec)
            if ty == 'lien': sec['blocs'].append(('bouton', (libelle_bouton(v), v)))
            else: sec['blocs'].append(('liste', v))
    # D13 accroche : premier paragraphe du premier bloc, s'il est seul dans sa section et <= 300 caractères
    if sections and not sections[0]['surtitre'] and len(sections[0]['blocs']) == 1 and sections[0]['blocs'][0][0] == 'para' and len(sections[0]['blocs'][0][1]) <= 300:
        sections[0]['blocs'][0] = ('accroche', sections[0]['blocs'][0][1])
    # D9 / D15 pastilles et surtitre de date
    deja = []
    for s in sections:
        texte = ' '.join(x if isinstance(x, str) else ' '.join(x) if isinstance(x, list) else ' '.join(x) for _, x in s['blocs'])
        if not s['picto']:
            s['picto'] = picto((s['surtitre'] or '') + ' ' + texte, deja)
        deja.append(s['picto'])
        if not s['surtitre'] and not any(b[0] in ('date', 'note') for b in s['blocs']):
            m = DATE.search(texte)
            if m: s['surtitre'] = m.group(0)[0].upper() + m.group(0)[1:]
    # D9 b : dates en gras
    for s in sections:
        nb = []
        for ty, v in s['blocs']:
            if ty in ('para', 'accroche'):
                v = DATE.sub(lambda m: m.group(0) if re.search(r'\*\*[^*]*' + re.escape(m.group(0)), v) else f'**{m.group(0)}**', v)
            nb.append((ty, v))
        s['blocs'] = nb
    out['sections'] = sections
    return out

def vers_pivot(o):
    L = []
    if o['objet']: L += [f"Objet : {o['objet']}", '']
    if o['salutation']: L += [o['salutation'], '']
    for s in o['sections']:
        L.append(('## ' + ' '.join(x for x in (s['picto'], s['surtitre']) if x)).rstrip())
        for j, (ty, v) in enumerate(s['blocs']):
            if ty == 'para': L.append(v)
            elif ty == 'accroche': L.append('> ' + v)
            elif ty == 'note': L.append('*' + re.sub(r'\*\*', '', v) + '*')
            elif ty == 'bouton': L.append(f'[{v[0]}]({v[1]})')
            elif ty == 'liste': L += ['- ' + x for x in v]
            elif ty == 'important': L += ['::: important'] + v + [':::']
            elif ty == 'date': L += ['::: date'] + v + [':::']
            if not (j + 1 < len(s['blocs']) and s['blocs'][j+1][0] == 'bouton'): L.append('')
        if L[-1] != '': L.append('')
    if o['cloture']: L += ['---', o['cloture'], '']
    if o['signature']:
        L.append(o['signature'][0])
        if o['signature'][1]: L.append(o['signature'][1])
    return '\n'.join(L).rstrip() + '\n'

if __name__ == '__main__':
    print(vers_pivot(detecter(open(sys.argv[1], encoding='utf-8').read())), end='')
