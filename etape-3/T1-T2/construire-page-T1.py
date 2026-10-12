"""Construit la page du test T1 (étape 3) à partir du gabarit et de l'email de test.

Usage : python3 construire-page-T1.py email-test.html email-test-texte.txt
où email-test.html et email-test-texte.txt sont produits par etape-2/outils-de-travail/rendu.py
à partir de email-test-15-blocs.pivot.md (le logo, logo.datauri, reste hors du dépôt).
Écrit page-test-T1.html (à publier sur claude.ai) et page-test-T1-fichier.html (à ouvrir directement).
"""
import json, os, re, sys

ici = os.path.dirname(os.path.abspath(__file__))
email = open(sys.argv[1], encoding='utf-8').read()
texte = open(sys.argv[2], encoding='utf-8').read()
corps = re.search(r'<body style="([^"]*)">(.*)</body>', email, re.S)
gabarit = open(os.path.join(ici, 'gabarit-page-T1.html'), encoding='utf-8').read()
page = (gabarit.replace('__STYLE_BODY__', corps.group(1))
        .replace('__EMAIL__', corps.group(2).strip())
        .replace('__TEXTE__', json.dumps(texte, ensure_ascii=False).replace('</', '<\\/')))
open(os.path.join(ici, 'page-test-T1.html'), 'w', encoding='utf-8').write(page)
complet = ('<!DOCTYPE html>\n<html lang="fr"><head><meta charset="UTF-8">'
           '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n'
           + page.replace('<main', '</head><body>\n<main', 1) + '\n</body></html>\n')
open(os.path.join(ici, 'page-test-T1-fichier.html'), 'w', encoding='utf-8').write(complet)
