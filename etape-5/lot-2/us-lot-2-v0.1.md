# Doc#11 : US du lot 2 (pivot et rendu), v0.1

13 octobre 2026. Proposé par Claude, à valider par Mat. Lot 2 du découpage validé (DEC-075) : lecture du format pivot, modèle interne, rendu de l'email, aperçu continu (EX-003, EX-007, EX-008). Toutes en priorité haute, version cible V1, statut « À faire ».

Ce que tu pourras essayer à la fin du lot : coller un pivot sur l'écran Écrire et voir l'email sur l'écran Vérifier.

| ID proposé | Titre | Description | Exigences liées | Critère de fin |
|---|---|---|---|---|
| US-007 | Lire le pivot | En tant que rédacteur, je veux que l'outil lise un texte au format pivot sans jamais se bloquer, afin d'obtenir mon email même si une ligne est mal écrite. | EX-003, RG-004 | Chaque règle P1 à P14 et chaque cas limite de `format-pivot.md` (section 4) a son test ; les pivots de l'étape 2 (spécimens 00 à 05) sont lus sans erreur ; une ligne mal écrite devient un paragraphe, et l'anomalie est notée pour le lot 4 (EX-026), sans être encore affichée. |
| US-008 | Rendu selon la charte | En tant que rédacteur, je veux que l'email suive la charte sans aucun réglage de ma part, afin que chaque mailing ait la même apparence soignée. | EX-007, RG-003 | Les 15 blocs de `charte-blocs.md` sont rendus en styles en ligne, avec les seules valeurs de `parametres/charte.js` ; le rendu du pivot de référence (spécimen 00) est identique à celui de l'outil de travail `rendu.py` de l'étape 2, à l'en-tête V1 (DEC-078) et aux espaces près. |
| US-009 | Coller un pivot | En tant que rédacteur, je veux coller mon texte sur l'écran Écrire puis toucher « Mettre en forme », afin de passer à la vérification. | EX-003, EX-019 | Sur PC et téléphone, coller le pivot de référence puis toucher « Mettre en forme → » ouvre l'écran Vérifier avec l'email ; un texte vide affiche une invitation à coller un texte, pas un email vide. |
| US-010 | Aperçu continu | En tant que rédacteur, je veux voir l'email exactement tel qu'il sera collé dans Gmail, à jour à chaque modification, afin de juger le résultat sans surprise. | EX-008 | L'aperçu de l'écran Vérifier est le code exact qui sera copié au lot 5 ; il se met à jour après chaque modification du texte ; l'objet lu dans le pivot s'affiche au-dessus de l'aperçu. |
| US-011 | Texte jamais interprété comme du code | En tant que mainteneur, je veux que le texte du rédacteur soit toujours affiché comme du texte, afin qu'un texte collé ne puisse rien exécuter ni rien charger. | EX-017 | Un test vérifie qu'un texte contenant du code HTML ou un script s'affiche tel quel ; seuls les liens en `https://`, `http://` et `mailto:` deviennent cliquables ; un lien `javascript:` reste du texte et est signalé. |

## Questions pour Mat

Réponds par oui ou non à chaque numéro, ou « OK pour tout ».

1. **Les cinq US** ci-dessus pour le lot 2 ? *Je préconise oui.* US-011 n'a pas d'exigence propre : elle applique EX-017 au texte collé, en complément de la règle de sécurité du lot 1.
2. **Pastille par défaut.** Au lot 2, une section sans émoji reçoit la pastille ℹ️ (pastille par défaut de la charte) ; le choix de la pastille par mots-clés (règle D16) arrive avec la détection, au lot 3 ? *Je préconise oui : D16 appartient aux règles de détection, que le lot 3 transcrit en entier.*
3. **Référence du rendu.** Ajouter au dépôt, dans `tests/references/`, le rendu du spécimen 00 produit par `rendu.py`, le logo remplacé par une marque, pour que le test d'US-008 compare l'outil à l'outil de travail validé ? *Je préconise oui : le spécimen 00 est déjà dans le dépôt, le fichier n'ajoute aucune donnée.*
4. **Écrans sur ordinateur.** Garder les trois écrans l'un après l'autre sur PC aussi, sans afficher Écrire et l'aperçu côte à côte ? *Je préconise oui pour le lot 2, le téléphone d'abord (EX-019) ; le côte à côte pourra être proposé au lot 6.*
5. **Démarrage.** Coder le lot 2 dès maintenant, et n'ouvrir sa demande de fusion qu'après ton essai du lot 1 sur Android ? *Je préconise oui : le lot 2 ne touche pas à ce que l'essai Android vérifie, et une anomalie trouvée sur Android serait corrigée avant.*

## Réponses de Mat (13/10/2026, 20 h 37)

« ok pour tout » : US-007 à US-011 validées ; pastille ℹ️ par défaut au lot 2, D16 au lot 3 ; référence `rendu.py` ajoutée dans `tests/references/` ; trois écrans successifs sur PC ; lot 2 codé tout de suite (le lot 1 est clos depuis l'essai Android de 20 h 35, la demande de fusion du lot 2 peut donc s'ouvrir dès qu'elle est prête).
