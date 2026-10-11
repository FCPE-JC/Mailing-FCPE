# Mailing-FCPE

Outil qui transforme un texte brut en email aux couleurs du conseil local FCPE de l'école élémentaire Joliot-Curie, prêt à coller dans Gmail, avec une version WhatsApp pour la relecture. Il fonctionnera sans IA ni installation, dans une page web, sans rien envoyer à un serveur ni rien conserver.

## État du projet

| Étape | Objet | État |
|---|---|---|
| 0. Cadrage | Fixer le besoin | Terminée |
| 1. Documents et cahier des charges | Exigences vérifiables | Terminée |
| 2. Charte et format pivot | Bibliothèque de blocs, règles de détection, prompt IA | Terminée |
| 3. Tests de faisabilité | Collage Gmail, mode sombre, image d'aperçu, smartphone | En cours |
| 4. Architecture | Choisir la solution | À venir |
| 5. Développement V1 | Construire | À venir |
| 6. Recette | Vérifier sur les vrais appareils | À venir |
| 7. Mise à disposition | Diffuser et mesurer | À venir |

L'outil lui-même n'existe pas encore : ce dépôt contient pour l'instant les spécifications et les outils de travail.

## Contenu

- `etape-2/` : livrables validés de l'étape 2.
  - `charte-blocs.md` : la charte et les quinze blocs de l'email.
  - `format-pivot.md` : le format pivot (Markdown enrichi).
  - `regles-detection.md` : les règles qui passent d'un texte brut aux blocs.
  - `prompt-ia.txt` : le prompt facultatif pour obtenir le pivot avec une IA.
  - `specimens/` : textes bruts fictifs et pivots attendus, plus le texte du mailing de référence d'octobre 2026.
  - `outils-de-travail/` : deux scripts Python de vérification (lire leur `LISEZMOI.md`). Ce ne sont pas des composants de l'outil.
- `etape-3/` : plan et pages des tests de faisabilité.

## Documents de référence

Les douze documents de référence du projet (note de cadrage, cahier des charges, registre des décisions, etc.) sont tenus dans Claude Docs, hors de ce dépôt.

## Règles du dépôt

- Aucune donnée réelle : spécimens fictifs seulement. Le `.gitignore` bloque PDF, images, scans, emails et tableurs.
- Toute modification passe par une demande de fusion (pull request) relue par Mat.
