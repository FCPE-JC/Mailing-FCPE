# Étape 5 : développement V1, plan v0.1

13 octobre 2026. Rédigé par Claude, à valider par Mat. Rien n'est codé avant ton feu vert.

## Ce que j'ai lu

- **Doc#1 v1.7, déroulé** : l'étape 5 doit « construire » ; Claude code par lots, Mat relit et teste ; documents touchés Doc#11 et Doc#5 ; condition de sortie « V1 livrée » ; non faisable sur smartphone (les tests demandent un ordinateur, mais chaque lot s'essaie aussi sur téléphone).
- **Synthèse de l'étape 4** : page web en fichiers JavaScript simples, sans bibliothèque ni construction (DEC-067) ; GitHub Pages depuis `docs/` de la branche `main`, dépôt public (DEC-068) ; charte et modèles dans deux fichiers commentés, logo intégré (DEC-069) ; aucune requête réseau (DEC-070) ; aucun stockage dans le navigateur, avertissement au rechargement (DEC-071, DEC-079) ; vérification du navigateur au démarrage (DEC-072) ; en-tête V1 (DEC-078) ; « Partager l'image » quand le navigateur le permet, « Enregistrer l'image » toujours.
- **Doc#11 v0.4** : six lots validés (DEC-075), US-001 à US-006 du lot 1 validées (DEC-077), US des lots suivants à écrire lot par lot.
- **Doc#5 v0.8** : restent la section 4 (composants et organisation du code) et la section 8 (conventions de code et de commentaires), prévues à l'étape 5.
- **Dépôt** `Mat130718/Mailing-FCPE`, public, sept demandes de fusion fusionnées. `docs/` ne contient qu'une page d'accueil provisoire et la page du test T5. Node.js 22 est disponible de mon côté pour les tests.
- **Points laissés à l'étape 5** : police du titre de date et de la clôture (synthèse de l'étape 3, lot 6) ; scripts Python de l'étape 2 à transcrire en JavaScript (détection, rendu), qui servent de référence.

## Les six lots (rappel de Doc#11)

| Lot | Contenu | Ce que tu peux essayer à la fin |
|---|---|---|
| 1. Socle | Trois écrans, règle de sécurité, vérification du navigateur, fichiers de paramètres, tests (US-001 à US-006) | Naviguer entre les trois écrans vides |
| 2. Pivot et rendu | Lecture du pivot, rendu de l'email, aperçu continu | Coller un pivot et voir l'email |
| 3. Détection | Texte brut vers pivot (règles D1 à D16), comparé aux spécimens | Coller un texte brut |
| 4. Corrections et conseils | Type de bloc, pastille, surtitre, anomalies, aide à l'objet | Corriger un email mal détecté |
| 5. Sorties | Copie Gmail, WhatsApp, texte, image, partage, export et réimport du pivot, prompt IA, avertissement | Faire tout le parcours jusqu'à Gmail |
| 6. Modèles et finitions | Cinq modèles types, en-tête V1, accessibilité, police de la date et de la clôture | Préparer un vrai email de test en moins de 15 minutes |

## Déroulement d'un lot

1. **Démarrage** : je propose les US du lot (sauf le lot 1, déjà validé) et tu donnes le feu vert, puisque le démarrage d'un lot est une action structurante.
2. **Code et tests** : je code sur une branche, avec les tests automatiques ; je ne propose rien dont les tests échouent.
3. **Demande de fusion** : je l'ouvre avec, pour chaque US, le critère de fin et la façon dont je l'ai vérifié. Tu la relis et tu la fusionnes.
4. **Essai** : la fusion publie la page sur https://mat130718.github.io/Mailing-FCPE/ ; tu l'essaies sur PC et téléphone avec une courte fiche de résultats, comme aux tests T1 à T5.
5. **Clôture du lot** : les US passent à « Terminé » dans Doc#11 (par le fil Documents de référence) ; une anomalie trouvée à l'essai donne une correction dans une nouvelle demande de fusion avant le lot suivant.

## Organisation du code proposée (Doc#5, section 4)

```
docs/                      le site publié = l'outil
  index.html               la page, avec la règle de sécurité
  style.css                mise en page de l'outil (pas celle de l'email)
  parametres/
    charte.js              couleurs, tailles, textes fixes, logo en base64
    modeles.js             les cinq modèles types au format pivot (vide au lot 1)
  js/
    ecrans.js              passage entre Écrire, Vérifier, Partager
    navigateur.js          vérification des fonctions au démarrage
    pivot.js               lecture et écriture du pivot (lot 2)
    rendu.js               pivot vers email HTML (lot 2)
    detection.js           texte brut vers pivot (lot 3)
    sorties.js             copie, WhatsApp, texte, image, partage (lot 5)
tests/                     tests automatiques, lancés par « node --test »
README.md                  dont la commande des tests
```

- Les fichiers sont des modules JavaScript standard : la page les charge depuis son propre site, ce que la règle de sécurité autorise, et Node.js les teste tels quels, sans construction.
- Le logo est écrit sous forme de texte (base64) dans `charte.js` ; le `.gitignore` bloque les images, pas ce fichier. Je le reprends de la page du test T5, qui le contient déjà.
- Un fichier `package.json` minimal (nom, type de module, commande de test) peut être nécessaire pour que Node.js lise les modules ; il ne déclare aucune dépendance.

## Questions à trancher

Réponds par oui ou non à chaque numéro, ou « OK pour tout ».

1. **Déroulement.** Les six lots dans l'ordre de Doc#11, une demande de fusion par lot, avec le cycle ci-dessus (feu vert, tests, fusion par toi, essai sur PC et téléphone, clôture) ? *Je préconise oui : c'est la méthode des étapes précédentes, appliquée à chaque lot.*
2. **Organisation du code.** L'arborescence ci-dessus, à inscrire dans Doc#5 section 4 ? *Je préconise oui : un fichier par fonction, comme le prévoyait l'option A2.*
3. **Conventions (Doc#5, section 8).** Noms de fichiers, de fonctions et de variables en français sans accents (`detecterBlocs`, `couleurTitre`), commentaires en français, un en-tête par fichier qui dit son rôle et les exigences couvertes, et chaque test nommé d'après l'US ou l'EX qu'il vérifie ? *Je préconise oui : le vocabulaire reste celui des documents, ce qui aide un bénévole francophone à reprendre l'outil (EX-025). L'option écartée, des noms en anglais, est l'usage courant en programmation mais oblige à traduire chaque terme métier.*
4. **Tests automatiques à chaque demande de fusion.** Ajouter une vérification GitHub Actions (service gratuit pour un dépôt public) qui lance les tests à chaque demande de fusion et affiche le résultat dans GitHub, citée dans Doc#9 comme outil hors de l'outil livré, sans numéro DEP (comme DEC-073) ? *Je préconise oui : tu vois d'un coup d'œil si les tests passent avant de fusionner, sans rien lancer toi-même. Ces actions s'exécutent chez GitHub, jamais dans la page des rédacteurs. Si tu dis non, je lance les tests de mon côté et je colle le résultat dans chaque demande de fusion.*
5. **Page en construction.** Jusqu'à la mise à disposition (étape 7), l'outil publié affiche en haut « Version en construction, ne pas utiliser pour un vrai mailing » ? *Je préconise oui : l'adresse est publique et définitive dès le lot 1.*
6. **Page du test T5.** La retirer du site publié au lot 1 (ses sources restent dans `etape-4/T5/`), puisque l'outil prend la place de la page d'accueil ? *Je préconise oui : le site ne contient plus que l'outil.*
7. **Feu vert pour le lot 1.** Démarrer le lot 1 (US-001 à US-006) dès ta validation de ce plan ? *Je préconise oui.*
8. **Fil et statut.** Ce fil devient le fil de l'étape 5, pour tous les lots, et Doc#1 passe l'étape 5 à « En cours » ? *Je préconise oui ; si le fil atteint sa limite de pièces jointes, j'en proposerai un nouveau.*

## Partage des tâches

| Action | Claude | Mat | Smartphone |
|---|---|---|---|
| US des lots 2 à 6 | Rédige au démarrage de chaque lot | Valide | Oui |
| Code et tests | Écrit, vérifie, ouvre la demande de fusion | Relit, fusionne | Relecture oui, fusion possible depuis l'application GitHub |
| Essai de chaque lot | Prépare la fiche d'essai | Essaie sur PC et téléphone | En partie |
| Textes des documents | Rédige, envoie au fil Documents de référence | Valide | Oui |

## Documents touchés

Mises à jour envoyées au fil Documents de référence, seul autorisé à écrire :
- **Doc#5** : sections 4 et 8 au lot 1 ; complétées à chaque lot si le code s'écarte du plan.
- **Doc#11** : statut des US à chaque lot ; US des lots 2 à 6 au démarrage de chaque lot.
- **Doc#9** : vérification GitHub Actions si la question 4 est acceptée ; confirmation qu'aucune dépendance n'est livrée.
- **Doc#3** : seulement si un lot révèle un besoin mal décrit (aucun changement silencieux : je te le soumets).
- **Doc#6** : les tests automatiques sont rattachés aux US et aux EX ; les cas de recette (REC) restent pour l'étape 6.
- **Doc#7** : guide utilisateur ébauché à la fin du lot 5, quand le parcours complet existe.
- **Doc#8** : revue de fin d'étape ; **Doc#12** : questions nouvelles au fil des lots.
- **Doc#4, Doc#1, Doc#2** : tes arbitrages, le statut de l'étape, la synthèse de fin d'étape.

## Livrables

Sous `etape-5/` : ce plan, les US de chaque lot, les fiches d'essai et leurs résultats, la synthèse de l'étape. Le code dans le dépôt, par une demande de fusion par lot.

## Condition de sortie de l'étape

Les six lots fusionnés, leurs US « Terminé » dans Doc#11, tous les tests automatiques au vert, chaque lot essayé sur PC et téléphone Android, Doc#5 sections 4 et 8 remplies, Doc#8 revu, clôture par une décision inscrite dans Doc#4. La vérification sur iPhone reste pour la recette (étape 6), comme convenu à la fin de l'étape 4.

## Réponses de Mat (13/10/2026, 19 h 46)

« Questions 1 à 8 ok pour tout sauf le point 4 » : questions 1 à 3 et 5 à 8 acceptées. Question 4 acceptée avec deux compléments :
- **Double vérification** : avant chaque demande de fusion, Claude lance lui-même tous les tests et colle le résultat dans la demande ; la vérification GitHub Actions les relance ensuite chez GitHub. Les deux doivent être au vert.
- **Guide** : Claude guide Mat pas à pas pour lire et utiliser les vérifications GitHub Actions, qu'il n'a jamais utilisées.

Le lot 1 démarre (question 7).
