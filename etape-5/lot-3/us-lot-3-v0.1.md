# Doc#11 : US du lot 3 (détection), v0.1

13 octobre 2026. Proposé par Claude, à valider par Mat. Lot 3 du découpage validé (DEC-075) : passage d'un texte brut au pivot, selon les règles D1 à D16 de `etape-2/regles-detection.md`, comparé aux spécimens de l'étape 2 (EX-001, EX-004). Toutes en priorité haute, version cible V1, statut « À faire ».

Ce que tu pourras essayer à la fin du lot : coller un texte brut (un message WhatsApp, par exemple) sur l'écran Écrire et voir l'email mis en forme sur l'écran Vérifier.

| ID proposé | Titre | Description | Exigences liées | Critère de fin |
|---|---|---|---|---|
| US-012 | Détecter les blocs d'un texte brut | En tant que rédacteur, je veux coller un texte sans aucune syntaxe et obtenir les blocs de la charte, afin de ne pas avoir à apprendre le format pivot. | EX-001, EX-004 | Les règles D1 à D15 ont chacune leur test ; pour les six textes bruts de l'étape 2 (spécimens 00 à 05), l'outil produit exactement le même pivot que l'outil de travail `detection.py` (fichiers `*.pivot-detecte.md` du dépôt) ; un texte vide ou bizarre ne bloque jamais la détection. |
| US-013 | Pastilles par mots-clés | En tant que rédacteur, je veux que chaque section reçoive une pastille qui correspond à son contenu, afin que l'email soit lisible d'un coup d'œil sans que je choisisse les émojis. | EX-004 | La règle D16 a son test pour chaque ligne de son tableau, l'ordre de priorité et l'émoji déjà utilisé évité ; une section sans surtitre qui contient une date reçoit cette date comme surtitre, sauf section de note ou de bloc Date et lieu ; la pastille ℹ️ ne reste que si aucun mot-clé n'est trouvé. |
| US-014 | Coller un texte brut ou un pivot | En tant que rédacteur, je veux coller indifféremment un texte brut ou un pivot, afin que l'outil choisisse seul la bonne lecture. | EX-001, EX-003 | Un texte qui contient `## `, `::: ` ou une ligne `> ` est lu comme un pivot, sans détection (principe 5) ; sinon il passe par la détection ; l'écran Vérifier dit en une ligne quelle lecture a été faite ; l'aperçu reste mis à jour à chaque modification ; le texte d'aide de l'écran Écrire mentionne les deux possibilités. |

## Questions pour Mat

Réponds par oui ou non à chaque numéro, ou « OK pour tout ».

1. **Les trois US** ci-dessus pour le lot 3 ? *Je préconise oui.* Les corrections d'un clic (type de bloc, pastille, surtitre) et l'affichage des anomalies restent au lot 4.
2. **Reproduire `detection.py` à l'identique**, y compris ses défauts connus de l'étape 2 (la pastille 🍽️ de la section programme de l'invitation, la pastille ℹ️ d'une section du remerciement), que le rédacteur corrigera au lot 4 ? *Je préconise oui : ce sont les règles que tu as validées à l'étape 2, et la comparaison exacte avec les spécimens prouve que la transcription est fidèle. Une amélioration des règles serait une décision à part, plus tard.*
3. **La détection produit un pivot**, ensuite lu par la lecture du lot 2, plutôt que de fabriquer l'email directement ? *Je préconise oui : c'est ce que fait `detection.py`, la comparaison avec les spécimens est alors exacte, et l'export du pivot du lot 5 sera immédiat.*
4. **Pastilles dans un pivot.** Appliquer aussi la règle D16 aux sections d'un pivot écrites sans émoji (`## Surtitre` ou `##` seul), à la place de la pastille ℹ️ par défaut posée au lot 2 (DEC-093) ? *Je préconise oui : la règle P3 du format pivot dit déjà « pastille choisie par l'outil ». Dans un pivot, seule la pastille serait choisie, jamais un surtitre de date, car le rédacteur a écrit ses surtitres lui-même.*
5. **Deux écarts entre `detection.py` et le texte des règles**, à garder et à inscrire dans les règles : la salutation reconnaît aussi « Cher », « Chère » et « Mesdames » (D4), et une adresse seule peut aussi être précédée de « -> » (D3) ? *Je préconise oui : ce sont de petits ajouts, qui rendent l'outil un peu plus tolérant. Correction du 13/10/2026 : aucun des six spécimens ne les utilise, la comparaison exacte tient donc avec ou sans eux.*

## Réponses de Mat (13/10/2026, 21 h 44)

« Aux questions 1 à 4 : ok pour tout » : US-012 à US-014 validées ; `detection.py` reproduit à l'identique, défauts connus compris ; la détection produit un pivot, lu comme au lot 2 ; la règle D16 s'applique aussi aux sections d'un pivot sans émoji (pastille seulement), à la place de la pastille ℹ️ par défaut de DEC-093.

Question 5 (13/10/2026, 21 h 44, carte de décision) : « Garder ». La salutation reconnaît aussi « Cher », « Chère » et « Mesdames » (D4), et une adresse seule peut être précédée de « -> » (D3) ; les règles D3 et D4 sont à compléter.

Écarts relevés en codant (13/10/2026, 22 h 01, carte de décision) : « Corriger ». Avec la règle D16, « maître » au singulier donne 🏫, et une pastille déjà utilisée est gardée plutôt que de devenir ℹ️ quand aucun autre mot-clé ne correspond. Les six spécimens restent identiques à `detection.py`.
