# Lot 3 : mises à jour des documents, v0.1

13 octobre 2026. Rédigé par le fil « Étape 5 : développement ». Demande de fusion n° 10 fusionnée par Mat le 13/10/2026 vers 22 h 00 ; essai de Mat concluant le 13/10/2026 vers 22 h 05 (fiche `etape-5/lot-3/fiche-essai-lot-3.md`). La branche `etape-5-lot-3-cloture` porte la citation de DEC-101, les règles D3, D4 et D16 complétées, et la fiche remplie.

## Doc#11

- US-012 à US-014 : « Terminé » (demande de fusion n° 10, essai de Mat du 13/10/2026).

## Doc#5, section 4 : composants et organisation du code (complément)

Remplacer « Lots suivants : `detection.js`, `sorties.js`. » par :

« Lot 3 : `detection.js` (passage d'un texte brut au pivot, règles D1 à D16 de `etape-2/regles-detection.md` ; transcription de l'outil de travail `detection.py`, DEC-097 à DEC-101 ; choix de la pastille par mots-clés, appliqué aussi aux sections d'un pivot sans émoji, DEC-099). `apercu.js` choisit la lecture : un texte qui contient la syntaxe pivot (`##`, `:::` ou une ligne `> `) est lu tel quel, sinon il passe par la détection. Lot suivant : `sorties.js`. »

Et ajouter :

« - Les tests d'US-012 comparent la détection, caractère pour caractère, aux fichiers `etape-2/specimens/*.pivot-detecte.md` produits par `detection.py`. »

## Doc#6

- Aucun changement. Contrôle par injection d'erreur au lot 3 : longueurs comptées en unités UTF-16, ordre des pastilles modifié, détection supprimée, espaces insécables oubliés, frontière de mot sans accents, pastilles d'un pivot non complétées ; chacune fait échouer au moins un test. Comparaison complémentaire : 6 000 textes tirés au hasard donnent le même pivot que `detection.py` complété des deux corrections de DEC-101.
