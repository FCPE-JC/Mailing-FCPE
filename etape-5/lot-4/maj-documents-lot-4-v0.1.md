# Lot 4 : mises à jour des documents, v0.1

13 octobre 2026. Rédigé par le fil « Étape 5 : développement ». Demande de fusion n° 11 fusionnée par Mat le 13/10/2026 à 22 h 37 ; essai de Mat le 13/10/2026 entre 22 h 46 et 23 h 20, satisfaisant après ajustements (fiche `etape-5/lot-4/fiche-essai-lot-4.md`). Les ajustements demandés pendant l'essai sont dans la demande de fusion n° 12 (DEC-108, DEC-110, DEC-112, DEC-113), à fusionner par Mat. La branche `etape-5-lot-4-cloture` porte la citation des DEC-103 à DEC-106 dans le code, la fiche remplie et corrigée (essai n° 6), et les notes du lot 5.

## Doc#11

- US-015 à US-020 : « Terminé » (demande de fusion n° 11, essai de Mat du 13/10/2026 ; ajustements de la demande n° 12).

## Doc#5, section 4 : composants et organisation du code (complément)

Remplacer « Lot suivant : `sorties.js`. » par :

« Lot 4 : `corrections.js` (changement de type d'un bloc selon le tableau de conversion, DEC-105 et DEC-108 ; pastille, surtitre, libellé de bouton et objet ; chaque correction rend un nouveau modèle sans toucher l'ancien), `conseils.js` (anomalies de la lecture, conseils de la charte et aide à l'objet, seuils gardés comme conseils, DEC-106). `pivot.js` sait aussi écrire le pivot (`ecrirePivot`) : une correction réécrit le texte de l'écran Écrire au format pivot, et relire ce texte redonne le même modèle (DEC-103). `rendu.js` ajoute, pour l'aperçu seulement, l'étiquette du type de chaque bloc ; le code copié n'en contient aucune (DEC-104). `apercu.js` branche le panneau « Ce bloc est… », le champ de l'objet, les conseils et « Annuler ». Lot suivant : `sorties.js`. »

## Doc#2 : défauts corrigés (sans DEC)

- P13 : une clôture qui commence par une formule (« À bientôt ✨ ») suivie de la vraie signature restait lue comme signature ; corrigé dans la demande n° 11, test « US-007 P13 » de `tests/pivot.test.js`.
- Panneau : après un passage en « Titre de section », le panneau se fermait sur une erreur (il se remplissait sur l'ancien repère) ; corrigé dans la demande n° 12, test « US-016 : sur la page, un bloc changé en titre garde le panneau ouvert » de `tests/corrections.test.js`.
- Fiche d'essai : l'essai n° 6 demandait une proposition d'objet impossible avec le texte d'essai ; fiche corrigée.

## Doc#6

- Aucun changement. Contrôle par injection d'erreur au lot 4 : étiquettes dans le code copié, marque d'une note perdue à l'écriture du pivot, annulation de tout d'un coup, seuil d'alerte de l'objet changé, élément de liste perdu dans une conversion, conseil « section sans surtitre » supprimé, correction de P13 retirée ; dans la demande n° 12 : seuils décalés d'un caractère (59, 61, 99, 101), signature recollée sur une ligne, lignes suivantes de la signature en gras, note remise à 15 px ou sans italique, fond des messages de l'objet retiré. Chacune fait échouer au moins un test. Comparaison complémentaire : l'écriture puis la relecture du pivot redonnent le même modèle sur 10 pivots et 1 500 textes tirés au hasard ; tous les changements de type possibles sur trois emails ne perdent aucun mot.

## Pour le lot 5

Décisions de Mat pendant l'essai, notées dans `etape-5/lot-5/` : pastilles complémentaires et bouton « Autre » (DEC-109, `pastilles-a-ajouter.md`), texte du bloc dans le panneau (DEC-111, `texte-du-bloc.md`), type « Signature » sans formule obligatoire (DEC-114, `type-signature.md`). Le prompt IA demande encore un surtitre de 40 caractères au plus (DEC-108).
