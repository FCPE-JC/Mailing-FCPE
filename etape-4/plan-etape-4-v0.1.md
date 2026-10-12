# Étape 4 : architecture, plan v0.1

12 octobre 2026. Rédigé par Claude, à valider par Mat. Rien n'est produit avant ton feu vert.

## Ce que j'ai lu

- **Doc#1 v1.5, déroulé** : l'étape 4 doit « choisir la solution » ; Claude rédige une note comparative, Mat arbitre ; documents touchés Doc#5 et Doc#9 ; condition de sortie « choix validé » ; faisable sur smartphone.
- **Doc#5 v0.5** : sections 1 (tests) et 5 (chaîne de traitement) validées. Restent pour l'étape 4 : section 2 (comparaison et choix, dont l'hébergeur, QO-004), section 3 (schéma des flux, qui doit démontrer EX-017), section 6 (fichiers temporaires) et section 7 (paramètres partagés : charte, modèles types). Les sections 4 et 8 (organisation du code, conventions) sont prévues à l'étape 5.
- **Doc#3 v2.1** : les exigences qui pèsent sur l'architecture sont EX-015 (aucune IA), EX-016 et EX-017 (aucun texte envoyé à un serveur, rien de conservé), EX-018 (sans installation sur PC, Mac, Android, iPhone), EX-019 (téléphone d'abord), EX-023 (gratuit), EX-025 (reprise par un bénévole) et EX-028 (le pivot réimporté redonne le même email).
- **Doc#12 v0.7** : QO-004 (hébergeur) est la seule question attendue à cette étape. QO-013 (bouton Partager du téléphone) est renvoyée à l'étape 6, mais ne peut se tester que sur l'outil hébergé.
- **Synthèse de l'étape 3** : ce qui marche est établi (copie en HTML par le presse-papier, image par SVG et canevas, sans bibliothèque) ; deux points restent pour les étapes 4 et 5 : l'en-tête trop étroit sur téléphone (DEC-060) et la police de la date et de la clôture.
- **Dépôt** `Mat130718/Mailing-FCPE`, privé (DEC-047), trois demandes de fusion fusionnées.

## Ce que l'étape doit trancher

| N° | Choix | Options étudiées dans la note | Document |
|---|---|---|---|
| A | Forme de l'outil | Fichier HTML unique ; quelques fichiers en JavaScript sans outil de construction ; application avec un cadriciel (« framework ») et une étape de construction ; variante installable hors ligne (PWA, application web progressive) | Doc#5 §2, TEC |
| B | Hébergeur gratuit (QO-004) | GitHub Pages ; Cloudflare Pages ; Netlify ; fichier ouvert depuis l'appareil, sans hébergeur | Doc#5 §2, TEC |
| C | Charte et modèles types (paramètres partagés) | Écrits dans le code ; fichiers de données séparés dans le dépôt | Doc#5 §7, TEC |
| D | Preuve de l'absence de flux | Règle de sécurité de la page qui interdit tout envoi (CSP, politique de sécurité du contenu), contrôle dans l'onglet Réseau du navigateur, absence de dépendance externe | Doc#5 §3, Doc#9 |
| E | Fichiers temporaires | Image, pivot exporté et presse-papier : où ils vivent et combien de temps | Doc#5 §6, Doc#10 |
| F | Navigateurs cibles | Versions minimales de Chrome, Edge, Safari (iPhone et Mac), Firefox | Doc#5 §2, Doc#6 |

Deux points méritent d'être signalés dès maintenant, car ils peuvent orienter ton arbitrage :
- **GitHub Pages et dépôt privé** : à ma connaissance, GitHub Pages n'est gratuit que pour un dépôt public ; pour un dépôt privé, il faut un abonnement payant. C'est déduit de la documentation de GitHub telle que je la connais, non vérifié ; la note le vérifiera. Si c'est confirmé, choisir GitHub Pages revient à rendre le dépôt public (après contrôle qu'il ne contient aucune donnée personnelle), ce qui remplacerait DEC-047. Les autres hébergeurs publient depuis un dépôt privé, au prix d'un compte de plus.
- **Le logo** reste intégré à l'email en base64, comme aujourd'hui : un logo hébergé obligerait les messageries des parents à le télécharger chez l'hébergeur, donc créerait un flux. Je le confirmerai dans la note sans en faire un choix ouvert, sauf si tu le souhaites.

## Critères de comparaison

Tirés des contraintes et des décisions en vigueur ; chaque option est notée sur chacun :
1. Gratuité durable (DEC-011, EX-023).
2. Sans installation, sur les quatre appareils (DEC-010, EX-018).
3. Aucun texte ne quitte le navigateur, et c'est démontrable (EX-017).
4. Reprise par un bénévole : peu de technique à connaître, aucune dépendance à mettre à jour (DEC-012, EX-025).
5. Auditabilité : nombre de dépendances tierces, à inscrire dans Doc#9.
6. Réemploi de ce que l'étape 3 a prouvé (copie, image).
7. Facilité des tests automatiques de la détection et du rendu (EX-028, spécimens de l'étape 2).
8. Ce que tu dois faire toi-même (comptes à créer, réglages).

## Test complémentaire proposé (T5)

Une fois l'hébergeur choisi, je publie chez lui une page de test, sans données réelles, qui vérifie trois choses que les pages claude.ai ne permettaient pas :
- la copie vers Gmail depuis l'adresse définitive (même geste que T1) ;
- le bouton Partager du téléphone vers WhatsApp, avec l'image (QO-013, avancée de l'étape 6 à l'étape 4) ;
- deux ou trois variantes de l'en-tête sur téléphone (DEC-060), collées dans Gmail puis lues sur Android et iPhone.

Il demande un ordinateur et un téléphone, et une manipulation de ta part pour activer l'hébergement (je te donnerai les étapes, à valider avant).

## Partage des tâches

| Action | Claude | Mat | Smartphone |
|---|---|---|---|
| Note comparative (A à F) | Rédige, vérifie les conditions des hébergeurs | Lit, arbitre sur carte de décision | Oui |
| Mise en place de l'hébergement | Prépare la demande de fusion et les étapes | Fusionne, active l'hébergement | Non |
| Test T5 | Écrit la page et la fiche de résultats | Teste sur PC et téléphone | En partie |
| Textes de Doc#5, Doc#9, Doc#10, Doc#8 | Rédige, envoie au fil Documents de référence | Valide | Oui |
| Découpage en lots (Doc#11) | Propose les lots et leurs US | Valide | Oui |

## Documents touchés

Mises à jour envoyées au fil Documents de référence, seul autorisé à écrire :
- Doc#5 : sections 2, 3, 6 et 7 ; premiers TEC.
- Doc#9 : présentation, inventaire des dépendances (aucune, si l'option préconisée est retenue), cartographie des flux et méthode de vérification.
- Doc#10 : durée de vie des données (texte, image, pivot exporté), journaux de l'hébergeur (adresses IP des rédacteurs).
- Doc#8 : revue de fin d'étape, risques nouveaux éventuels (hébergeur qui change ses conditions, dépôt public).
- Doc#12 : QO-004 répondue ; QO-013 répondue ou renvoyée.
- Doc#11 : premiers lots et US, si tu valides la question 4.
- Doc#4, Doc#1, Doc#2 : tes arbitrages, le statut de l'étape, la synthèse de fin d'étape.

## Livrables

Sous `etape-4/` : ce plan, la note comparative, le plan et la page du test T5, la fiche de résultats, la synthèse de l'étape. Le code de la page T5 passe par une demande de fusion du dépôt.

## Questions à trancher

Réponds par oui ou non à chaque numéro, ou « OK pour tout ».

1. **Périmètre.** L'étape 4 tranche les choix A à F ; l'organisation détaillée du code et les conventions (Doc#5, sections 4 et 8) restent à l'étape 5, comme prévu ? *Je préconise oui : c'est le partage déjà inscrit dans Doc#5.*
2. **Critères.** Les huit critères ci-dessus te conviennent-ils pour la note comparative ? *Je préconise oui ; dis-moi si l'un compte plus que les autres pour toi.*
3. **Test T5 sur l'hébergeur.** Ajouter ce test à l'étape 4, ce qui avance QO-013 et prépare la correction de l'en-tête ? *Je préconise oui : il valide l'hébergeur en vrai avant d'y construire l'outil, et il coûte une séance sur PC et téléphone.*
4. **Découpage en lots.** Préparer dans Doc#11 le découpage du développement en lots, en fin d'étape 4, pour démarrer l'étape 5 sans délai ? *Je préconise oui : Doc#11 est vide et l'architecture choisie conditionne les lots.*
5. **Statut.** Inscrire « étape 4 en cours » dans Doc#1 et faire de ce fil le fil de l'étape 4 ? *Je préconise oui.*

## Ordre de travail

1. Après ton feu vert : la note comparative, puis une carte de décision par choix ouvert (A, B, et C si besoin).
2. Mise en place de l'hébergement et test T5.
3. Rédaction des textes pour Doc#5, Doc#9, Doc#10 et Doc#8, puis découpage en lots.
4. Synthèse et clôture.

## Condition de sortie de l'étape

Choix A à F arbitrés et inscrits dans Doc#4 (DEC) et Doc#5 (TEC) ; Doc#5 sections 2, 3, 6 et 7 remplies ; Doc#9 rempli dans sa version allégée ; QO-004 répondue ; test T5 consigné si tu le retiens ; Doc#8 revu ; clôture par une décision inscrite dans Doc#4. Faisable sur smartphone : oui, sauf le test T5.

## Réponses de Mat (12/10/2026, 21:28)

1 oui, 3 oui, 4 oui, 5 oui. Question 2 : précision demandée, reformulée le 12/10 à 21:30 (critères 1 à 3 éliminatoires, 4 à 8 pour départager).

Mat rappelle que GitHub est gratuit pour cet usage. Vérifié le 12/10/2026 dans la documentation de GitHub (« What is GitHub Pages? ») : « GitHub Pages is available in public repositories with GitHub Free […], and in public and private repositories with GitHub Pro, GitHub Team […] ». Avec le compte gratuit, GitHub Pages impose donc un dépôt public ; le point est repris dans la note comparative.
