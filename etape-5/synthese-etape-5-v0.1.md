# Synthèse de l'étape 5 (développement de la V1), v0.1

14 octobre 2026. Rédigée par le fil « Étape 5 : développement », à valider par Mat. Elle prépare la clôture de l'étape : les textes proposés pour Doc#5 section 8 et pour la revue de Doc#8 sont à reporter par le fil Documents de référence, qui attribue les numéros.

## 1. Ce qui a été livré

L'outil est en ligne à https://mat130718.github.io/Mailing-FCPE/, en version 0.6.0. Il couvre tout le parcours prévu : écrire ou partir d'un modèle, vérifier et corriger, puis partager vers WhatsApp et Gmail.

| Lot | Contenu | US | Demandes de fusion | Essai de Mat |
|---|---|---|---|---|
| 1 | Socle : page, trois écrans, vérification du navigateur, règle de sécurité, GitHub Actions | US-001 à US-006 | n° 8 | Conforme, PC et Android |
| 2 | Lecture du format pivot et rendu de l'email | US-007 à US-011 | n° 9 | Conforme |
| 3 | Détection d'un texte brut | US-012 à US-014 | n° 10 | Conforme |
| 4 | Corrections d'un clic, conseils, aide à l'objet | US-015 à US-020 | n° 11, 12, 13 | Conforme après réglages (seuils de titre, note, signature) |
| 5a | Écran Partager : copies, image, export et reprise, prompt IA, avertissement | US-021 à US-028 | n° 14 | Conforme |
| 5b | Pastilles et « Autre émoji », texte du bloc, type Signature, numéro de version | US-029 à US-031 | n° 15, 16 | Conforme après retrait de 📅 |
| 6 | Cinq modèles types, passages à compléter, graisse 700, accessibilité | US-032 à US-037 | n° 17, 18 | Conforme |

Les 37 US sont « Terminé » dans Doc#11 (v0.19). Décisions de l'étape : DEC-084 à DEC-135.

## 2. Résultats des vérifications

- **Tests automatiques** : 297 tests, tous au vert, sur mon poste avant chaque demande de fusion et sur GitHub Actions à chaque demande et à chaque fusion.
- **Erreurs injectées** : à chaque lot, une erreur volontaire a fait échouer les tests de sécurité et de conservation, ce qui montre qu'ils fonctionnent.
- **Navigateur** : chaque lot a été contrôlé dans Chromium à plusieurs largeurs avant la demande de fusion.
- **Essais de Mat** : sept fiches d'essai remplies, sur PC et sur téléphone Android, toutes conformes.
- **Essai chronométré (EX-024)** : moins de 3 minutes en partant d'un modèle comme d'un texte issu d'une IA, pour un objectif de moins de 15 minutes.

## 3. Enseignements

1. **Le cache du navigateur** a d'abord servi d'anciens fichiers après une fusion. Le numéro de version ajouté à chaque adresse de fichier (DEC-123) l'a réglé, et un test vérifie qu'il est le même partout.
2. **Deux émojis calendrier** (📅 et 🗓️) se ressemblaient, et 📅 s'affiche comme une date selon la messagerie. Seul 🗓️ est gardé (DEC-124).
3. **Les essais sur téléphone** ont trouvé ce que les tests automatiques ne voient pas : seuils de titre, aspect de la note, signature sur plusieurs lignes. Faire essayer chaque lot par Mat avant le suivant a évité de corriger tard.
4. **La double vérification** (mes tests, puis GitHub Actions) n'a jamais donné de résultats différents. Elle reste utile, car c'est elle que Mat peut lire sans moi.

## 4. Condition de sortie du plan

| Point | État |
|---|---|
| Six lots fusionnés | Fait (demandes n° 8 à 17 ; n° 18, fiche d'essai et synthèse, en attente de fusion) |
| US « Terminé » dans Doc#11 | Fait (v0.19) |
| Tests automatiques au vert | Fait (297 tests) |
| Chaque lot essayé sur PC et Android | Fait |
| Doc#5 sections 4 et 8 remplies | Section 4 à jour (v0.16) ; section 8 rédigée au lot 1, compléments proposés en question 2 |
| Doc#8 revu | Proposé en question 3 |
| Décision de clôture dans Doc#4 | Proposée en question 4 |
| Vérification sur iPhone | Renvoyée à la recette (étape 6), comme prévu |

## 5. Questions pour Mat

**Question 1. Valides-tu cette synthèse ?**
Recommandation : oui.

**Question 2. Doc#5 section 8 : ajouter ces trois conventions, puis passer les sections 4 et 8 en « validées » ?**
La section contient déjà les noms en français, l'en-tête de chaque fichier, le nom des tests, l'absence de bibliothèque, la double vérification et les erreurs injectées. Il manque trois règles appliquées pendant l'étape :
- « Numéro de version : chaque demande de fusion qui touche docs/ change la version dans package.json, dans chaque ?v= et dans le pied de page ; un test vérifie qu'elle est la même partout (DEC-123). »
- « Les valeurs que le référent peut changer (charte, modèles, prompt IA) sont dans docs/parametres/ et nulle part ailleurs ; un test vérifie le contraste des couleurs et un autre la lecture des modèles. »
- « Les références de rendu (tests/references/) ne s'écrivent pas à la main : elles sont produites par l'outil de travail rendu.py ; un changement de charte modifie les deux de la même façon. »
Recommandation : oui pour les trois. Doc#5 passerait alors en « Validé » pour toutes ses sections.

**Question 3. Doc#8 : valides-tu cette revue de fin d'étape 5 ?**
- **RSK-002, non-adoption (6 forte)** : maintenu à 6. Les modèles et le résultat de 3 minutes réduisent le risque, mais seul Mat a essayé l'outil. On le recotera après la recette avec un autre rédacteur (étape 6). Mesure ajoutée : « Étape 5 : modèles livrés, email préparé en moins de 3 minutes par Mat (EX-024). »
- **RSK-005, départ du mainteneur (4 moyenne)** : sa revue tombait à la fin de l'étape 5. Le guide référent est écrit (Doc#7, section 2) et le code reste simple, sans dépendance. Je propose de le maintenir à 4, de noter le guide comme fait, et de le revoir à la fin de l'étape 7 avec QO-014 (publication depuis une organisation au nom du conseil local).
- **RSK-006, détection (3 moyenne)** : maintenu. Sa date de revue, « fin de l'étape 2 », est dépassée ; elle passe à la fin de l'étape 6, avec QO-012 (vrais textes de rédacteurs).
- **RSK-009 et RSK-010 (2 faible)** : inchangés. Leur date de revue, « fin de l'étape 1 », est dépassée ; RSK-009 passe à la fin de l'étape 7 avec Doc#10, et RSK-010 à la fin de l'étape 6 avec QO-006.
- **RSK-012, contenu sensible dans le dépôt public (3 moyenne)** : inchangé. Aucun fichier réel n'a été ajouté pendant l'étape, et chaque demande a été relue par Mat.
- **RSK-001, RSK-003, RSK-004, RSK-007, RSK-008, RSK-011** : inchangés ; leur revue est déjà prévue aux étapes 6 ou 7.
- **Nouveau risque (numéro à attribuer)**, catégorie Technique : « Après une mise à jour, le navigateur garde d'anciens fichiers. » Cause : le cache du navigateur ou un numéro de version oublié. Conséquence : une partie de l'outil est ancienne, ce qui peut produire des erreurs. Probabilité 1, gravité 2, criticité 2 faible. Mesures : numéro de version sur chaque fichier (DEC-123), test de cohérence, numéro affiché dans le pied de page pour le vérifier ; rappel dans le guide référent. Responsable : Claude, puis le référent. Revue à la fin de l'étape 7.
Recommandation : oui.

**Question 4. Clôturer l'étape 5 par cette décision ?**
« L'étape 5 est close le 14/10/2026 : les six lots sont fusionnés et essayés sur PC et Android, les 37 US sont terminées, les 297 tests sont au vert, Doc#5 est complété et Doc#8 revu. La vérification sur iPhone reste pour la recette (étape 6). »
Recommandation : oui, une fois la demande n° 18 fusionnée.

**Question 5. Passer ensuite à l'étape 6, la recette ?**
Elle comprend l'iPhone, Orange (QO-003), le seuil du mode sombre (QO-002), les seuils de l'objet (QO-011) et l'essai par un autre rédacteur (QO-012, RSK-002). Je préparerai d'abord son plan et sa fiche de recette, pour ta validation.
Recommandation : oui.
