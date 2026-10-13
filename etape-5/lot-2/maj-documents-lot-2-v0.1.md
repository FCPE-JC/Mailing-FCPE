# Lot 2 : mises à jour des documents, v0.1

13 octobre 2026. Rédigé par le fil « Étape 5 : développement ». Demande de fusion n° 9 fusionnée par Mat le 13/10/2026 vers 21 h 02 ; essai de Mat conforme le 13/10/2026 vers 21 h 08 (essais 1 à 7, PC Windows et Android, fiche `etape-5/lot-2/fiche-essai-lot-2.md`).

## Doc#11

- US-007 à US-011 : « Terminé » (demande de fusion n° 9, essai de Mat du 13/10/2026).

## Doc#5, section 4 : composants et organisation du code (complément au texte du lot 1)

Remplacer « Lots suivants : `pivot.js`, `rendu.js`, `detection.js`, `sorties.js`. » par :

« Lot 2 : `pivot.js` (lecture du format pivot, règles P1 à P14 ; rend la structure de l'email et la liste des anomalies relevées, sans jamais bloquer), `rendu.js` (fabrication du code de l'email, styles en ligne seulement, toutes les valeurs venant de `parametres/charte.js` ; tout texte du rédacteur est échappé et seuls les liens https, http et mailto deviennent cliquables, US-011), `apercu.js` (collage du texte et aperçu mis à jour à chaque modification). Lots suivants : `detection.js`, `sorties.js`. »

Et ajouter :

« - `parametres/charte.js` contient aussi, depuis le lot 2, les dimensions du rendu (marges, rayons, pastilles, barre d'accroche) et la pastille par défaut ℹ️ (DEC-093).
- `tests/references/` : les rendus de l'outil de travail `rendu.py` (étape 2) pour les pivots de l'étape 2 et l'email de test aux quinze blocs, logo remplacé par « LOGO » ; le test d'US-008 compare l'outil à ces références, à l'en-tête V1 et aux espaces près (DEC-094). »

## Doc#6

- Aucun changement : la stratégie posée au lot 1 s'applique (double vérification, contrôle par injection d'erreur : retirer l'échappement, changer une marge ou retirer la limite de 40 caractères de la salutation fait échouer les tests).
