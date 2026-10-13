# Mailing-FCPE

Outil qui transforme un texte brut en email aux couleurs du conseil local FCPE de l'école élémentaire Joliot-Curie, prêt à coller dans Gmail, avec une version WhatsApp pour la relecture. Il fonctionnera sans IA ni installation, dans une page web, sans rien envoyer à un serveur ni rien conserver.

## État du projet

| Étape | Objet | État |
|---|---|---|
| 0. Cadrage | Fixer le besoin | Terminée |
| 1. Documents et cahier des charges | Exigences vérifiables | Terminée |
| 2. Charte et format pivot | Bibliothèque de blocs, règles de détection, prompt IA | Terminée |
| 3. Tests de faisabilité | Collage Gmail, mode sombre, image d'aperçu, smartphone | Terminée |
| 4. Architecture | Choisir la solution | Terminée |
| 5. Développement V1 | Construire, en six lots | En cours (lot 1 : socle) |
| 6. Recette | Vérifier sur les vrais appareils | À venir |
| 7. Mise à disposition | Diffuser et mesurer | À venir |

L'outil est en construction : la page publiée affiche « Version en construction, ne pas utiliser pour un vrai mailing » jusqu'à la mise à disposition (étape 7). Il est publié par GitHub Pages depuis le dossier `docs/` (DEC-068) : https://mat130718.github.io/Mailing-FCPE/

## Contenu

- `etape-2/` : livrables validés de l'étape 2.
  - `charte-blocs.md` : la charte et les quinze blocs de l'email.
  - `format-pivot.md` : le format pivot (Markdown enrichi).
  - `regles-detection.md` : les règles qui passent d'un texte brut aux blocs.
  - `prompt-ia.txt` : le prompt facultatif pour obtenir le pivot avec une IA.
  - `specimens/` : textes bruts fictifs et pivots attendus, plus le texte du mailing de référence d'octobre 2026.
  - `outils-de-travail/` : deux scripts Python de vérification (lire leur `LISEZMOI.md`). Ce ne sont pas des composants de l'outil.
- `etape-3/` : plan et pages des tests de faisabilité.
- `etape-4/` : plan, note comparative, brouillons des documents, US du lot 1, test T5 (sources et résultats) et synthèse de l'étape 4 (architecture). La page du test T5 n'est plus publiée ; ses sources restent ici.
- `etape-5/` : plan de l'étape 5 (développement) et documents de chaque lot.
- `docs/` : **l'outil**, publié tel quel par GitHub Pages, sans étape de construction.
  - `index.html` : la page, avec la règle de sécurité ; `style.css` : la mise en page de l'outil.
  - `parametres/charte.js` : couleurs, tailles, textes fixes et logo de l'email. Seul fichier à modifier pour changer la charte.
  - `parametres/modeles.js` : les modèles types au format pivot.
  - `js/` : un module JavaScript par fonction (`ecrans.js`, `navigateur.js`, `demarrage.js` ; les suivants arrivent avec les lots).
- `tests/` : les tests automatiques, un fichier par user story (US).
- `.github/workflows/tests.yml` : la vérification qui relance les tests chez GitHub à chaque demande de fusion.

## Lancer les tests

Il faut seulement Node.js (version 22 ou plus récente), sans aucune installation de paquet. Depuis le dossier du dépôt :

```
node --test
```

La dernière ligne `# fail 0` signifie que tous les tests passent. Les mêmes tests sont relancés par GitHub à chaque demande de fusion (onglet « Checks » de la demande).

## Conventions de code

- Noms de fichiers, de fonctions et de variables en français, sans accents (`detecterFonctions`, `couleurTitre`) ; commentaires en français.
- Chaque fichier commence par un commentaire qui dit son rôle et les exigences ou US qu'il couvre.
- Chaque test est nommé d'après l'US ou l'exigence qu'il vérifie (« US-002 : … »).
- Aucune bibliothèque, aucune dépendance, aucune étape de construction (DEC-067).

## Documents de référence

Les douze documents de référence du projet (note de cadrage, cahier des charges, registre des décisions, etc.) sont tenus dans Claude Docs, hors de ce dépôt.

## Règles du dépôt

- Le dépôt est public (DEC-068) : aucune donnée personnelle, spécimens fictifs seulement. Le `.gitignore` bloque PDF, images, scans, emails et tableurs.
- Les pages publiées interdisent toute requête réseau par une règle de sécurité (CSP, DEC-070) : aucun texte ne quitte le navigateur.
- Aucun stockage dans le navigateur : ni cookie, ni stockage local (DEC-071).
- Toute modification passe par une demande de fusion (pull request) relue par Mat, avec les tests au vert.
