# Étape 4 : test T5 sur GitHub Pages, plan v0.1

12 octobre 2026. Rédigé par Claude. Test ajouté par DEC-065 ; hébergeur choisi par DEC-068, règle de sécurité par DEC-070.

## Ce que le test doit établir

1. **Hébergement** : la page s'ouvre depuis l'adresse GitHub Pages sur ordinateur et sur téléphone.
2. **Règle de sécurité (DEC-070)** : elle bloque toute requête lancée par la page, sans gêner la copie, l'image ni le partage.
3. **Copie vers Gmail depuis l'adresse définitive** : même geste et même résultat que T1.
4. **Bouton Partager (QO-013)** : l'image d'aperçu part directement vers WhatsApp, sans passer par la galerie.
5. **En-tête sur téléphone (DEC-060)** : laquelle des quatre variantes reste lisible dans Gmail, collée depuis un ordinateur puis lue sur Android et iPhone, en clair et en sombre.
6. **Avertissement avant de quitter (EX-029)** : le navigateur demande confirmation avant de fermer ou recharger la page. Risque connu, déduit et non vérifié : Safari sur iPhone pourrait ignorer cette demande ; ce serait un résultat, et une solution de repli serait proposée.

## La page

`docs/test-T5/index.html`, construite par `construire-page-T5.py` à partir de l'email de test aux quinze blocs (le même qu'en T1 à T4). Le dossier `docs/` est le dossier publié par GitHub Pages : il ne contient que des pages web, et accueillera l'outil à l'étape 5. La page contient le logo intégré (DEC-013, DEC-068).

Les variantes d'en-tête :
- 0 : en-tête actuel, colonne du logo fixe à 150 pixels (référence) ;
- 1 : logo réduit à 88 pixels dans une colonne de 96, marges réduites ;
- 2 : logo centré au-dessus du texte ;
- 3 : colonnes proportionnelles, logo sur 32 % de la largeur et 134 pixels au plus.

Vérifié par Claude dans Chromium (390 pixels de large, comme un téléphone) : la règle de sécurité bloque la requête d'essai, la copie fonctionne, l'image se crée (403 Ko), aucune requête ne part après le chargement. Non vérifié : Safari, Gmail, WhatsApp, le bouton Partager (absent de ce navigateur de test).

## Ce que fait Mat

Sur ordinateur : sections 1, 2 et 4 de la page. Sur téléphone Android et iPhone : sections 1, 3 et 4, puis lecture des deux emails de la section 2 en clair et en sombre. Résultats dans `fiche-resultats-T5.md`.
