"""Construit la page du test T5 (étape 4) dans docs/test-T5/, dossier publié par GitHub Pages.

Usage : python3 construire-page-T5.py email-test.html
où email-test.html est produit par etape-2/outils-de-travail/rendu.py à partir de
etape-3/T1-T2/email-test-15-blocs.pivot.md (le logo, logo.datauri, est placé à la main à côté de rendu.py).
La page construite contient le logo intégré ; elle est versionnée, puisque le dépôt est public (DEC-068)
et que le logo est autorisé pour les mailings officiels (DEC-013).
"""
import os, re, shutil, sys

ici = os.path.dirname(os.path.abspath(__file__))
racine = os.path.dirname(os.path.dirname(ici))
sortie = os.path.join(racine, 'docs', 'test-T5')
email = open(sys.argv[1], encoding='utf-8').read()
corps = re.search(r'<body style="([^"]*)">(.*)</body>', email, re.S)
style_body, contenu = corps.group(1), corps.group(2).strip()

# En-tête actuel (variante 0), tel que le produit rendu.py.
debut = contenu.index('<tr><td style="padding:24px 32px 22px;background:#263f9d;')
fin = contenu.index('</td></tr>', contenu.index('background:#7ab850;', debut)) + len('</td></tr>')
entete = contenu[debut:fin]
logo = re.search(r'src="(data:image/[^"]+)"', entete).group(1)
F = 'font-family:Arial,Helvetica,sans-serif;'
TEXTE = 'Représentants des parents d’élèves<br><strong style="color:#ffffff;font-size:16px;">École élémentaire Joliot-Curie</strong>'
TABLE = '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">'
FILET = '<tr><td style="height:4px;line-height:4px;font-size:4px;background:#7ab850;">&nbsp;</td></tr>'

def bandeau(padding, interieur):
    return (f'<tr><td style="padding:{padding};background:#263f9d;border-radius:20px 20px 0 0;">'
            f'{TABLE}{interieur}</table></td></tr>{FILET}')

variantes = [
    ('Variante 0 : en-tête actuel (colonne du logo fixe à 150 pixels)', entete),
    ('Variante 1 : logo réduit (colonne de 96 pixels, marges réduites)', bandeau('20px 20px 18px',
        f'<tr><td width="96" valign="middle"><img src="{logo}" alt="FCPE" width="88" style="display:block;width:88px;height:auto;border:0;margin:0;"></td>'
        f'<td valign="middle" align="right" style="{F}font-size:14px;line-height:1.4;color:#ffffff;">{TEXTE}</td></tr>')),
    ('Variante 2 : logo au-dessus du texte, centré', bandeau('22px 20px 20px',
        f'<tr><td align="center"><img src="{logo}" alt="FCPE" width="120" style="display:block;width:120px;height:auto;border:0;margin:0 auto;"></td></tr>'
        f'<tr><td align="center" style="{F}font-size:14px;line-height:1.4;color:#ffffff;padding-top:12px;">{TEXTE}</td></tr>')),
    ('Variante 3 : colonnes proportionnelles (logo sur 32 % de la largeur, 134 pixels au plus)', bandeau('24px 24px 22px',
        f'<tr><td width="32%" valign="middle"><img src="{logo}" alt="FCPE" width="134" style="display:block;width:100%;max-width:134px;height:auto;border:0;margin:0;"></td>'
        f'<td width="68%" valign="middle" align="right" style="{F}font-size:14px;line-height:1.4;color:#ffffff;padding-left:12px;">{TEXTE}</td></tr>')),
]
blocs = []
for titre, ent in variantes:
    blocs.append(
        f'<p style="{F}font-size:15px;font-weight:bold;color:#2a2a3a;margin:24px 8px 8px;">{titre}</p>'
        f'{TABLE.replace(">", " style=\"max-width:640px;background:#ffffff;border-radius:20px;\">", 1)}{ent}'
        f'<tr><td style="padding:16px 24px 20px;{F}font-size:15px;line-height:1.5;color:#2a2a3a;">Chers parents, ceci est un test d’en-tête.</td></tr></table>')
entetes = (f'<p style="{F}font-size:15px;color:#2a2a3a;margin:8px;">[Test T5] Quatre variantes de l’en-tête. '
           'Merci de ne pas répondre à ce message.</p>' + ''.join(blocs))

page = open(os.path.join(ici, 'gabarit-page-T5.html'), encoding='utf-8').read()
for cle, valeur in {'__STYLE_BODY__': style_body, '__EMAIL__': contenu, '__ENTETES__': entetes}.items():
    assert cle in page, cle
    page = page.replace(cle, valeur)
os.makedirs(sortie, exist_ok=True)
open(os.path.join(sortie, 'index.html'), 'w', encoding='utf-8').write(page)
shutil.copy(os.path.join(ici, 'page-T5.js'), os.path.join(sortie, 'page-T5.js'))
print('docs/test-T5/index.html :', len(page), 'octets')
