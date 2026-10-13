# Étape 4 : synthèse de l'architecture, v0.1

13 octobre 2026. Rédigée par Claude, à valider par Mat. Après ta validation, j'envoie les mises à jour au fil Documents de référence, seul autorisé à écrire dans les documents.

Sources : `etape-4/note-comparative-architecture-v0.1.md`, `etape-4/brouillons-documents-etape-4-v0.1.md`, `etape-4/T5/resultats-T5-v0.1.md`.

## En bref

L'architecture est choisie et vérifiée en conditions réelles. L'outil sera une page web en fichiers JavaScript simples, sans bibliothèque, publiée gratuitement sur GitHub Pages depuis le dépôt devenu public. Une règle de sécurité interdit toute requête réseau, et rien n'est conservé dans le navigateur. Le test T5, fait par Mat depuis l'adresse définitive, a tout validé : copie vers Gmail, image, bouton Partager vers WhatsApp et blocage des requêtes. Deux enseignements : l'en-tête V1 (logo réduit) est retenu, et l'avertissement avant de quitter ne fonctionne qu'au rechargement de la page.

## Ce que l'étape a tranché

| Choix | Décision | Inscription |
|---|---|---|
| A. Règle de comparaison | 3 critères éliminatoires, 5 pour départager | DEC-066 |
| B. Forme du code | Fichiers JavaScript simples, sans bibliothèque ni construction ; tests avec Node.js seul | DEC-067, TEC-001 |
| C. Hébergeur | GitHub Pages, dépôt public, dossier `docs/` de la branche `main` (QO-004 répondue) | DEC-068, TEC-002 |
| D. Paramètres partagés | Charte et modèles dans deux fichiers JavaScript commentés ; logo intégré | DEC-069, TEC-003 |
| E. Règle de sécurité | Aucune requête réseau (`connect-src 'none'`) | DEC-070, TEC-004 |
| F. Données | Aucun stockage dans le navigateur ; avertissement avant de quitter | DEC-071, TEC-005, EX-029 |
| Navigateurs | Deux dernières années, fonctions vérifiées au démarrage | DEC-072, TEC-006 |
| Outils cités | Node.js, Python et GitHub Pages cités dans Doc#9 sans numéro de dépendance | DEC-073 |
| Risque nouveau | RSK-012, contenu sensible publié dans le dépôt public, 1 × 3 = 3 | DEC-074 |
| Backlog | Six lots, US rédigées lot par lot ; US-001 à US-006 du lot 1 validées | DEC-075, DEC-077 |
| Lien du questionnaire | Remplacé par un lien fictif (demande de fusion n° 5) | DEC-076 |

## Résultats du test T5

| Point | Résultat |
|---|---|
| Hébergement | Page ouverte depuis https://mat130718.github.io/Mailing-FCPE/ sur ordinateur et téléphone. |
| Règle de sécurité | Requête d'essai bloquée sur les quatre navigateurs de la fiche, sans gêner la copie, l'image ni le partage. |
| Copie vers Gmail | Les deux emails collés et reçus, comme en T1. |
| En-tête sur téléphone | Variante V1 préférée (logo de 88 pixels dans une colonne de 96). |
| Image d'aperçu | 1 120 × 2 742 pixels, 380 Ko, rendu fidèle. |
| Bouton Partager (QO-013) | Ouvre la liste des applications du téléphone, dont WhatsApp : l'image part sans passer par la galerie. |
| Avertissement avant de quitter | S'affiche au rechargement, pas à la fermeture de l'onglet. |

Limite : un seul téléphone a servi, et son modèle n'est pas précisé.

## Arbitrages déjà donnés (13/10, 18 h 55)

- **En-tête V1** retenu comme en-tête définitif ; il remplace la colonne fixe de 150 pixels. Proposé : DEC-078, qui solde DEC-060.
- **Fermeture de l'onglet** : limite acceptée. EX-029 est reformulée : « Avant de recharger la page, l'outil avertit le rédacteur si l'email en cours n'a été ni copié ni exporté au format pivot. La fermeture de l'onglet n'est pas couverte : les navigateurs n'affichent pas l'avertissement dans ce cas (T5). » Proposé : DEC-079.

## Mises à jour proposées des documents

### Compléments marqués « après T5 » dans les brouillons déjà envoyés

- **Doc#5 § 3, point 3** : « … partagée vers WhatsApp par le bouton Partager du téléphone (EX-011 ; vérifié au test T5, QO-013 répondue). »
- **Doc#5 § 6**, dernière phrase : « Avant de recharger la page, elle avertit si l'email n'a été ni copié ni exporté (EX-029). À la fermeture de l'onglet, les navigateurs n'affichent pas cet avertissement : limite connue, acceptée (T5, DEC-079). »
- **Doc#9 § 3**, fin : « Vérifié par Mat le 13/10/2026 depuis l'adresse GitHub Pages, sur PC (Chrome, Edge) et téléphone : la requête d'essai est bloquée. »
- **Doc#5 § 1** : ajouter la ligne « T5, outil hébergé » au tableau des tests, avec le tableau ci-dessus.

### Autres documents

- **Doc#3** : EX-029 reformulée (ci-dessus) ; EX-011 complétée selon la question 1.
- **Doc#12** : QO-013 répondue par le test T5 du 13/10/2026.
- **Doc#11** : lot 6, « en-tête sur téléphone (variante V1, DEC-078) » au lieu de « selon T5 ».
- **Doc#8** : revue de fin d'étape (question 3).
- **Doc#1** : étape 4 « Terminée », étape 5 « À venir » ; **Doc#2** : entrée de clôture.

## Questions à trancher

Réponds par oui ou non à chaque numéro, ou « OK pour tout ».

1. **Bouton « Partager l'image ».** L'outil propose « Partager l'image » quand le navigateur le permet, et garde « Enregistrer l'image » dans tous les cas ? Cela complète DEC-059, qui ne gardait que « Enregistrer ». *Je préconise oui : le partage direct évite le passage par la galerie, et l'enregistrement reste la solution de repli.*
2. **iPhone.** Ton téléphone de test était-il l'Android ? Si oui, on renvoie la vérification du partage et de l'avertissement sur iPhone à la recette (étape 6) ? *Je préconise oui : ces deux fonctions ont des solutions de repli, l'iPhone ne bloque donc pas l'étape 5.*
3. **Revue des risques.** RSK-008 (l'hébergeur change ses conditions) reste à 1 × 2 = 2, avec la mesure « un déménagement ne demande que de republier `docs/` », revue reportée à la fin de l'étape 7 ? *Je préconise oui.*
4. **Clôture de l'étape 4.** Clore l'étape, dont la condition de sortie est remplie (choix A à F arbitrés et inscrits, Doc#5 sections 2, 3, 6 et 7 remplies, Doc#9 rempli, QO-004 répondue, test T5 consigné, Doc#8 revu) ? *Je préconise oui.*

## Réponses de Mat (13/10/2026, 19 h 04)

« Oui pour tout » : questions 1 à 4 acceptées. Le téléphone de test est donc l'Android ; la vérification sur iPhone est renvoyée à la recette (étape 6). Étape 4 close.
