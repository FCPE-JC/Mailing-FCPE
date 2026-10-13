# Doc#11 : US du lot 1 (socle), v0.1

13 octobre 2026. Proposé par Claude, à valider par Mat. Lot 1 du découpage validé le 13/10/2026 (six lots, US rédigées lot par lot). Toutes en priorité haute, version cible V1, statut « À faire ».

| ID proposé | Titre | Description | Exigences liées | Critère de fin |
|---|---|---|---|---|
| US-001 | Trois écrans | En tant que rédacteur, je veux passer des écrans Écrire à Vérifier puis Partager, et revenir en arrière, sur téléphone comme sur ordinateur, afin de suivre le parcours sans me perdre. | EX-018, EX-019 | Les trois écrans des maquettes de l'étape 2 s'affichent et s'enchaînent sur Android, iPhone et PC, sans défilement horizontal ; contenu encore vide. |
| US-002 | Aucune requête réseau | En tant que mainteneur, je veux que chaque page publiée interdise toute requête réseau, afin de prouver qu'aucun texte ne sort du navigateur. | EX-017 (DEC-070) | La règle de sécurité figure dans chaque page publiée ; un test automatique échoue si une page n'a pas la règle ou charge un fichier d'un autre site. |
| US-003 | Navigateur vérifié au démarrage | En tant que rédacteur, je veux être prévenu dès l'ouverture si mon navigateur ne sait pas copier l'email, créer l'image ou la partager, afin de savoir tout de suite quelle solution de repli utiliser. | EX-018 (DEC-072) | Un message clair, en français, nomme la fonction absente et la solution de repli ; rien ne s'affiche quand tout fonctionne. |
| US-004 | Paramètres séparés | En tant que référent, je veux trouver la charte et les modèles types dans deux fichiers commentés, afin de les modifier sans toucher au reste du code. | EX-007, EX-025 (DEC-069) | Les couleurs, textes fixes et le logo de `charte-blocs.md` sont dans le fichier de la charte ; un fichier des modèles existe, encore vide ; aucun autre fichier ne contient de couleur de la charte. |
| US-005 | Tests en une commande | En tant que mainteneur, je veux lancer tous les tests par une seule commande, avec Node.js pour seul outil, afin de vérifier chaque modification avant de la proposer. | EX-025, EX-028 (DEC-067) | Une commande documentée dans le README lance les tests et affiche le résultat ; aucune installation de paquet n'est nécessaire. |
| US-006 | Rien de conservé | En tant que rédacteur, je veux que rien ne reste dans mon navigateur après la fermeture de la page, afin qu'aucun email ne soit conservé. | EX-017 (DEC-071) | Un test automatique échoue si le code utilise un cookie, le stockage local ou une base locale. |

Question pour Mat : valider ces six US pour le lot 1 ?
