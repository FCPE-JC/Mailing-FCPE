# Outils de travail de l'étape 2

Ces deux scripts Python ont servi à **vérifier** la charte, le format pivot et les règles de détection en les appliquant à des textes réels et fictifs. Ce ne sont **pas** le futur outil Mailing-FCPE : son architecture sera choisie à l'étape 4. Ils pourront servir de référence au développement (étape 5).

- `detection.py texte-brut.txt` : affiche le pivot détecté (règles D1 à D16 de `regles-detection.md`).
- `rendu.py fichier.pivot.md sortie` : écrit `sortie.html` (email selon `charte-blocs.md`), `sortie-whatsapp.txt` et `sortie-texte.txt`. Il attend le logo en adresse de données dans un fichier `logo.datauri` à côté du script (extrait du modèle de référence, non recopié ici).

Python 3, sans bibliothèque supplémentaire.
