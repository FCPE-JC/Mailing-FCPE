"""Outil de travail de l'étape 2 (pas le produit) : pivot -> blocs -> HTML / WhatsApp / texte.
Sert à vérifier que la charte et le format pivot sont complets et sans ambiguïté."""
import re, html, sys, json, os

C = dict(fond="#f4f4f8", carte="#ffffff", entete="#263f9d", vert="#7ab850", vert_fonce="#467d1e",
         bleu="#383288", texte="#2a2a3a", texte2="#55607a", secours="#5f6f8c", trait="#e2e0ee",
         pastille_verte="#e6f3dc", pastille_bleue="#ebe9f7")
F = "font-family:Arial,Helvetica,sans-serif;"
EMOJI = re.compile(r'^([\U0001F000-\U0001FAFF☀-➿⬀-⯿ℹ←-⇿⌀-⏿〰〽㊗㊙][️‍\U0001F3FB-\U0001F3FF\U0001F000-\U0001FAFF☀-➿]*)\s*')
POLITESSE = re.compile(r'^(bien cordialement|cordialement|bien à vous|amicalement|à (très )?bientôt|belle (journée|soirée|semaine)|bonne (journée|soirée|semaine)|avec nos (sincères )?salutations|bon courage|merci et à bientôt)\b', re.I)
LIEN_SEUL = re.compile(r'^\[([^\]]+)\]\((https?://[^)\s]+)\)$')

# ---------- lecture du pivot ----------
def lire_pivot(t):
    t = t.replace('\r\n', '\n').replace(' ', ' ')
    lignes = t.split('\n')
    doc = dict(objet=None, salutation=None, sections=[], cloture=None, signature=None)
    i = 0
    while i < len(lignes) and not lignes[i].strip(): i += 1
    if i < len(lignes) and re.match(r'^objet\s*:', lignes[i], re.I):
        doc['objet'] = lignes[i].split(':', 1)[1].strip(); i += 1
    # paquets séparés par lignes vides, en gardant les ::: groupés
    paquets, cur, dans_bloc = [], [], False
    for l in lignes[i:]:
        s = l.rstrip()
        if s.startswith(':::'):
            if not dans_bloc:
                if cur: paquets.append(cur); cur = []
                cur = [s]; dans_bloc = True
            else:
                cur.append(s); paquets.append(cur); cur = []; dans_bloc = False
            continue
        if dans_bloc: cur.append(s); continue
        if not s.strip():
            if cur: paquets.append(cur); cur = []
            continue
        if s.startswith('## ') or s.strip() == '---':
            if cur: paquets.append(cur); cur = []
            paquets.append([s]); continue
        cur.append(s)
    if cur: paquets.append(cur)
    # paquet -> blocs
    blocs = []
    for p in paquets:
        p0 = p[0].strip()
        if p0.startswith('## '):
            reste = p0[3:].strip(); m = EMOJI.match(reste); picto = None
            if m: picto = m.group(1); reste = reste[m.end():].strip()
            blocs.append(('section', dict(picto=picto, surtitre=reste or None))); continue
        if p0 == '---': blocs.append(('separateur', None)); continue
        if p0.startswith(':::'):
            genre = p0[3:].strip().lower()
            contenu = [x for x in p[1:-1] if x.strip()]
            blocs.append(('important' if genre.startswith('important') else 'date', contenu)); continue
        # paragraphes contenant éventuellement liens seuls ou listes : découper ligne à ligne
        tampon = []
        def vider():
            if tampon: blocs.append(('para', ' '.join(x.strip() for x in tampon))); tampon.clear()
        liste = []
        for l in p:
            s = l.strip()
            if LIEN_SEUL.match(s): vider(); blocs.append(('bouton', LIEN_SEUL.match(s).groups())); continue
            if re.match(r'^[-*•] ', s):
                vider(); liste.append(s[2:].strip()); continue
            if liste: blocs.append(('liste', liste)); liste = []
            if s.startswith('> '):
                vider(); blocs.append(('accroche', s[2:].strip())); continue
            tampon.append(s)
        vider()
        if liste: blocs.append(('liste', liste))
    # salutation : premier paragraphe court terminé par une virgule
    if blocs and blocs[0][0] == 'para' and blocs[0][1].endswith(',') and len(blocs[0][1]) <= 40:
        doc['salutation'] = blocs.pop(0)[1]
    # signature : à partir de la formule de politesse
    for k, (ty, v) in enumerate(blocs):
        if ty == 'para' and POLITESSE.match(v):
            # la formule et les lignes qui suivent
            reste = [b[1] for b in blocs[k:] if b[0] == 'para']
            formule, _, signataire = v.partition(',')
            formule += ','
            signataire = (signataire.strip() + ' ' + ' '.join(reste[1:])).strip()
            doc['signature'] = (formule, signataire or None); blocs = blocs[:k]; break
    # clôture : ce qui suit le dernier ---
    if ('separateur', None) in blocs:
        k = len(blocs) - 1 - blocs[::-1].index(('separateur', None))
        apres = [b[1] for b in blocs[k+1:] if b[0] == 'para']
        if apres: doc['cloture'] = ' '.join(apres); blocs = blocs[:k]
    # sections
    sec = None
    for ty, v in blocs:
        if ty == 'section':
            sec = dict(picto=v['picto'], surtitre=v['surtitre'], blocs=[]); doc['sections'].append(sec); continue
        if sec is None:
            sec = dict(picto=None, surtitre=None, blocs=[]); doc['sections'].append(sec)
        if ty == 'para' and re.fullmatch(r'_[^_].*_|\*[^*].*\*(?<!\*\*)', v) and not v.startswith('**'):
            ty, v = 'note', v[1:-1]
        sec['blocs'].append((ty, v))
    return doc

# ---------- en ligne ----------
def en_ligne(t, couleur_gras=C['bleu']):
    t = html.escape(t, quote=False)
    t = re.sub(r'\[([^\]]+)\]\((https?://[^)\s]+)\)', lambda m: f'<a href="{m.group(2)}" style="color:{C["bleu"]};">{m.group(1)}</a>', t)
    t = re.sub(r'(?<![">])(https?://[^\s<]+)', lambda m: f'<a href="{m.group(1)}" style="color:{C["bleu"]};word-break:break-word;">{m.group(1)}</a>', t)
    t = re.sub(r'\*\*(.+?)\*\*', rf'<strong style="color:{couleur_gras};">\1</strong>', t)
    t = re.sub(r'(?<![\w*])_(.+?)_(?!\w)', r'<em>\1</em>', t)
    t = re.sub(r'(?<![\w*])\*(.+?)\*(?![\w*])', r'<em>\1</em>', t)
    return t

def tbl(attrs=''):
    return f'<table role="presentation" {attrs} cellpadding="0" cellspacing="0" border="0"'

# ---------- HTML ----------
def html_email(doc, logo):
    out = []
    a = out.append
    a(f'<!DOCTYPE html>\n<html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>{html.escape(doc["objet"] or "Email FCPE")}</title></head>')
    a(f'<body style="margin:0;padding:0;background:{C["fond"]};{F}color:{C["texte"]};">')
    a(f'{tbl("width=\"100%\"")} style="background:{C["fond"]};"><tr><td align="center" style="padding:24px 8px;">')
    a(f'{tbl("width=\"100%\"")} style="max-width:640px;background:{C["carte"]};border-radius:20px;">')
    a(f'<tr><td style="padding:24px 32px 22px;background:{C["entete"]};border-radius:20px 20px 0 0;">{tbl("width=\"100%\"")}><tr>'
      f'<td width="150" valign="middle"><img src="{logo}" alt="FCPE" width="134" style="display:block;width:134px;height:auto;border:0;margin:0;"></td>'
      f'<td valign="middle" align="right" style="{F}font-size:14px;line-height:1.5;color:#ffffff;">Représentants des parents d’élèves<br><strong style="color:#ffffff;font-size:16px;">École élémentaire Joliot-Curie</strong></td>'
      f'</tr></table></td></tr><tr><td style="height:4px;line-height:4px;font-size:4px;background:{C["vert"]};">&nbsp;</td></tr>')
    a('<tr><td style="padding:28px 32px 32px;">')
    if doc['salutation']:
        a(f'<h1 style="{F}font-size:25px;line-height:1.25;margin:0 0 20px;color:{C["bleu"]};">{en_ligne(doc["salutation"])}</h1>')
    n = len(doc['sections'])
    for k, s in enumerate(doc['sections']):
        verte = k % 2 == 0
        fond, bord = (C['pastille_verte'], C['vert']) if verte else (C['pastille_bleue'], C['bleu'])
        coul_sur = C['bleu'] if verte else C['vert_fonce']
        trait = (f'background-image:linear-gradient({C["trait"]},{C["trait"]});background-repeat:no-repeat;'
                 f'background-position:21px 0;background-size:2px 100%;') if k < n - 1 else ''
        a(f'{tbl("width=\"100%\"")}><tr>\n<td width="46" valign="top" style="{trait}">{tbl()}><tr><td width="40" height="40" align="center" valign="middle" '
          f'style="width:40px;height:40px;background:{fond};border:2px solid {bord};border-radius:22px;font-size:18px;line-height:40px;">{s["picto"] or "ℹ️"}</td></tr></table></td>')
        a('<td valign="top" style="padding:8px 0 24px 14px;">')
        if s['surtitre']:
            a(f'<p style="{F}font-size:12px;letter-spacing:1.5px;text-transform:uppercase;font-weight:800;color:{coul_sur};margin:0 0 10px;">{en_ligne(s["surtitre"])}</p>')
        bl = s['blocs']
        for j, (ty, v) in enumerate(bl):
            der = j == len(bl) - 1
            mb = '0' if der else '16px'
            if ty == 'accroche':
                a(f'{tbl("width=\"100%\"")} style="margin:0 0 {"0" if der else "16px"};"><tr><td width="5" style="background:{C["vert"]};border-radius:2px;"></td>'
                  f'<td style="padding:2px 0 2px 18px;"><p style="{F}font-size:18px;line-height:1.6;margin:0;color:{C["bleu"]};font-weight:700;">{en_ligne(v)}</p></td></tr></table>')
            elif ty == 'para':
                a(f'<p style="{F}font-size:16px;line-height:1.6;margin:0 0 {mb};color:{C["texte"]};">{en_ligne(v)}</p>')
            elif ty == 'note':
                a(f'<p style="{F}font-size:15px;line-height:1.6;margin:0 0 {mb};color:{C["texte2"]};">{en_ligne(v, C["texte2"])}</p>')
            elif ty == 'liste':
                a(f'{tbl("width=\"100%\"")} style="margin:0 0 {mb};">')
                for it in v:
                    a(f'<tr><td width="22" valign="top" style="{F}font-size:16px;line-height:1.6;color:{C["vert"]};font-weight:700;">●</td>'
                      f'<td valign="top" style="{F}font-size:16px;line-height:1.6;color:{C["texte"]};padding:0 0 6px;">{en_ligne(it)}</td></tr>')
                a('</table>')
            elif ty == 'bouton':
                lib, url = v
                a(f'{tbl()} style="margin:4px 0 8px;"><tr><td style="background:{C["bleu"]};border-radius:22px;"><a href="{url}" target="_blank" '
                  f'style="display:inline-block;padding:12px 22px;{F}font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:22px;">{html.escape(lib)}</a></td></tr></table>')
                a(f'<p style="{F}font-size:12px;line-height:1.4;margin:0 0 {mb};color:{C["secours"]};word-break:break-word;">ou : <a href="{url}" style="color:{C["bleu"]};">{url}</a></p>')
            elif ty == 'important':
                titre, corps = 'Important', v
                if v and EMOJI.sub('', v[0]).strip().lower().rstrip(' :') in ('important', 'attention', 'urgent', 'à retenir', 'a retenir', 'à noter', 'rappel'):
                    titre = EMOJI.sub('', v[0]).strip().rstrip(' :'); corps = v[1:]
                a(f'{tbl("width=\"100%\"")} style="margin:0 0 {mb};"><tr><td style="background:{C["pastille_bleue"]};border-left:5px solid {C["bleu"]};border-radius:6px;padding:14px 18px;">'
                  f'<p style="{F}font-size:12px;letter-spacing:1.5px;text-transform:uppercase;font-weight:800;color:{C["bleu"]};margin:0 0 6px;">⚠️ {html.escape(titre)}</p>'
                  + ''.join(f'<p style="{F}font-size:16px;line-height:1.6;margin:0;color:{C["texte"]};font-weight:700;">{en_ligne(x)}</p>' for x in corps)
                  + '</td></tr></table>')
            elif ty == 'date':
                a(f'{tbl("width=\"100%\"")} style="margin:0 0 {mb};"><tr><td style="border:2px solid {C["trait"]};border-radius:14px;padding:14px 18px;">')
                for q, x in enumerate(v):
                    taille, poids, coul = ('18px', '800', C['bleu']) if q == 0 else ('15px', '400', C['texte'])
                    a(f'<p style="{F}font-size:{taille};line-height:1.5;margin:0 0 {"6px" if q < len(v)-1 else "0"};color:{coul};font-weight:{poids};">{en_ligne(x)}</p>')
                a('</td></tr></table>')
        a('</td></tr></table>')
    if doc['cloture']:
        a(f'<div style="border-top:1px solid {C["trait"]};margin:4px 0 24px;height:1px;line-height:1px;font-size:1px;">&nbsp;</div>')
        a(f'<p style="{F}font-size:20px;line-height:1.4;margin:0 0 14px;color:{C["bleu"]};font-weight:800;">{en_ligne(doc["cloture"])}</p>')
    if doc['signature']:
        f_, s_ = doc['signature']
        a(f'<p style="{F}font-size:15px;line-height:1.6;margin:0;color:{C["texte"]};">{html.escape(f_)}' + (f'<br><strong style="color:{C["bleu"]};">{html.escape(s_)}</strong>' if s_ else '') + '</p>')
    a('</td></tr>\n</table></td></tr></table></body></html>')
    return '\n'.join(out)

# ---------- WhatsApp et texte de secours ----------
def wa_ligne(t):
    t = re.sub(r'\[([^\]]+)\]\((https?://[^)\s]+)\)', r'\1 (\2)', t)
    t = re.sub(r'\*\*(.+?)\*\*', lambda m: '\x01' + m.group(1) + '\x01', t)
    t = re.sub(r'(?<![\w*])\*(.+?)\*(?![\w*])', r'_\1_', t)
    return t.replace('\x01', '*')

def txt_ligne(t):
    t = re.sub(r'\[([^\]]+)\]\((https?://[^)\s]+)\)', r'\1 (\2)', t)
    return re.sub(r'\*\*(.+?)\*\*|(?<![\w*])[*_](.+?)[*_](?![\w*])', lambda m: m.group(1) or m.group(2), t)

def sortie_texte(doc, wa):
    L = wa_ligne if wa else txt_ligne
    o = []
    if doc['salutation']: o += [L(doc['salutation']), '']
    for s in doc['sections']:
        if s['surtitre']:
            tete = ((s['picto'] + ' ') if wa and s['picto'] else '') + (('*' + s['surtitre'].upper() + '*') if wa and s['surtitre'] else (s['surtitre'] or '').upper())
            o.append(tete.strip())
        for ty, v in s['blocs']:
            if ty in ('para',): o.append(L(v))
            elif ty == 'accroche': o.append(('*' + txt_ligne(v) + '*') if wa else L(v))
            elif ty == 'note': o.append(('_' + txt_ligne(v) + '_') if wa else L(v))
            elif ty == 'liste': o += [('• ' if wa else '- ') + L(x) for x in v]
            elif ty == 'bouton': o.append((f'👉 {v[0].rstrip(" →")} : {v[1]}') if wa else f'{v[0].rstrip(" →")} : {v[1]}')
            elif ty == 'important':
                corps = v[1:] if v and EMOJI.sub('', v[0]).strip().lower().rstrip(' :') in ('important', 'attention', 'urgent', 'à retenir', 'a retenir', 'à noter', 'rappel') else v
                o.append(('⚠️ *IMPORTANT*' if wa else 'IMPORTANT'))
                o += [L(x) for x in corps]
            elif ty == 'date': o += [L(x) for x in v]
        o.append('')
    if doc['cloture']: o += [L(doc['cloture']), '']
    if doc['signature']:
        o.append(doc['signature'][0])
        if doc['signature'][1]: o.append(('*' + doc['signature'][1] + '*') if wa else doc['signature'][1])
    return '\n'.join(o).strip() + '\n'

if __name__ == '__main__':
    src, base = sys.argv[1], sys.argv[2]
    doc = lire_pivot(open(src, encoding='utf-8').read())
    logo = open(os.path.join(os.path.dirname(__file__), 'logo.datauri')).read()
    open(base + '.html', 'w').write(html_email(doc, logo))
    open(base + '-whatsapp.txt', 'w').write(sortie_texte(doc, True))
    open(base + '-texte.txt', 'w').write(sortie_texte(doc, False))
    print(json.dumps(doc, ensure_ascii=False, indent=1)[:3000])
