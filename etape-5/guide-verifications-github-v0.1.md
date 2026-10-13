# Guide : lire les vérifications GitHub d'une demande de fusion, v0.1

13 octobre 2026. Rédigé par Claude pour Mat, qui n'a jamais utilisé GitHub Actions (décision de lancement de l'étape 5, question 4).

## Ce que c'est

À chaque demande de fusion, GitHub lance tout seul les tests de l'outil sur ses propres machines, avec la commande `node --test`. C'est la **vérification GitHub Actions**, décrite dans le fichier `.github/workflows/tests.yml`. Elle ne touche pas à la page des rédacteurs et ne coûte rien pour un dépôt public.

Avant d'ouvrir la demande de fusion, je lance moi-même les mêmes tests, et je colle leur résultat dans la description de la demande, rubrique « Mes tests avant la demande ». Tu as donc deux résultats, qui doivent être tous les deux au vert.

Tu n'as rien à installer ni à lancer.

## Sur ordinateur

1. Ouvre le lien de la demande de fusion que je t'envoie (de la forme `github.com/Mat130718/Mailing-FCPE/pull/8`).
2. Dans la description, lis la rubrique **« Mes tests avant la demande »** : la ligne `# fail 0` dit qu'aucun test n'a échoué chez moi.
3. Descends en bas de l'onglet **Conversation**, juste au-dessus du bouton vert de fusion. Un encadré montre la vérification :
   - pastille jaune ou ronde qui tourne, « Some checks haven't completed yet » : les tests tournent, attends une à deux minutes et recharge la page ;
   - coche verte, **« All checks have passed »** : tous les tests passent chez GitHub ;
   - croix rouge, « Some checks were not successful » ou « All checks have failed » : au moins un test a échoué. **Ne fusionne pas** et dis-le-moi : je reçois aussi l'alerte et je corrige.
4. Pour voir le détail, clique sur **Details** à droite de la ligne « Tests / Tests automatiques », ou ouvre l'onglet **Checks** en haut de la demande. Tu verras les étapes « Récupérer le code », « Installer Node.js 22 » et « Lancer les tests » ; dans la dernière, la fin du texte affiche `# pass` (tests réussis) et `# fail` (tests échoués).
5. Si les deux résultats sont au vert et que la relecture te convient, fusionne avec le bouton vert **Merge pull request**, puis **Confirm merge**.

## Sur téléphone (application GitHub)

1. Ouvre la demande de fusion depuis le lien, ou depuis l'application : dépôt Mailing-FCPE, **Pull requests**.
2. Sous la description, la ligne **Checks** affiche une coche verte, une croix rouge ou une pastille jaune, avec le même sens que sur ordinateur. Touche-la pour voir le détail.
3. Le bouton **Merge pull request** est en bas de la page.

## Après la fusion

La fusion relance la vérification sur la branche `main`, puis GitHub Pages publie le site en une à deux minutes. Une coche verte apparaît aussi à côté du dernier changement, sur la page d'accueil du dépôt. C'est seulement ensuite que tu essaies la page sur https://mat130718.github.io/Mailing-FCPE/ avec la fiche d'essai du lot.

## Si quelque chose ne va pas

| Ce que tu vois | Ce que ça veut dire | Ce que tu fais |
|---|---|---|
| Croix rouge | Un test échoue chez GitHub | Ne fusionne pas ; je corrige et je pousse une nouvelle version, la vérification se relance seule |
| Aucun encadré de vérification | GitHub Actions n'est pas activé sur le dépôt | Dis-le-moi : je te donnerai le réglage (onglet **Settings**, puis **Actions**, **General**) |
| Pastille jaune pendant plus de dix minutes | La vérification est bloquée chez GitHub | Dis-le-moi ; ne fusionne pas en attendant |
| Mes tests verts, GitHub rouge (ou l'inverse) | Différence entre les deux machines | Ne fusionne pas ; je cherche la cause avant toute fusion |

## Réglage facultatif, à décider plus tard

GitHub peut **interdire la fusion tant que la vérification n'est pas verte** (règle de protection de la branche `main`). Ce n'est pas nécessaire au lot 1 : je te le proposerai par une question, une fois que tu auras vu une première vérification fonctionner.
