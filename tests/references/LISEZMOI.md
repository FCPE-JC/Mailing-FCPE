# Références de rendu (US-008, DEC-094)

Chaque fichier `.html` de ce dossier est le rendu produit par l'outil de travail de l'étape 2, `etape-2/outils-de-travail/rendu.py`, à partir d'un pivot du dépôt :
- `etape-2/specimens/<nom>.md` pour les spécimens de l'étape 2 ;
- `etape-3/T1-T2/email-test-15-blocs.pivot.md` pour l'email de test aux quinze blocs.

Le logo y est remplacé par la marque `LOGO` (fichier `logo.datauri` contenant ce seul mot), pour ne pas dupliquer l'image. Commande utilisée, depuis un dossier contenant une copie de `rendu.py` et ce `logo.datauri` :

```
python3 rendu.py chemin/vers/le-pivot.md sortie
```

`tests/rendu.test.js` compare le rendu de l'outil à ces fichiers, en admettant trois différences : l'en-tête (variante V1 depuis DEC-078), les espaces entre les balises et l'écriture de l'apostrophe. Ne pas modifier ces fichiers à la main : en cas de changement voulu de la charte, régénérer les références et le dire dans la demande de fusion.
