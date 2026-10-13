# Étape 4 : mises à jour des documents après les arbitrages du 12/10/2026, v0.1

Rédigé par Claude (fil « Étape 4 : architecture ») pour le fil Documents de référence, seul autorisé à écrire. Les numéros sont proposés dans l'ordre ; le fil Documents de référence les attribue.

Sources : `etape-4/note-comparative-architecture-v0.1.md` (section « Arbitrages de Mat ») et les messages de Mat du 12/10/2026 : 21:31 (question 2 du plan), 21:45 (cartes A et B), 21:47 (« Questions 1 à 4 : ok pour tout »).

## Doc#4, décisions (à partir de DEC-066)

| Proposé | Thème | Décision | Justification | Options écartées | Éléments impactés |
|---|---|---|---|---|---|
| DEC-066 | Méthode | Règle de comparaison de l'étape 4 : trois critères éliminatoires (gratuité durable ; sans installation sur PC, Mac, Android, iPhone ; aucun texte ne quitte le navigateur, de façon démontrable) et cinq critères pour départager, par ordre d'importance (reprise par un bénévole ; aucune bibliothèque tierce ; réemploi de l'étape 3 ; tests automatiques ; démarches de Mat). | Tirés des décisions en vigueur (DEC-010, DEC-011, DEC-012, EX-017). | Huit critères de même poids. | Doc#5 § 2 |
| DEC-067 | Architecture | L'outil est une page web en quelques fichiers JavaScript standard, sans cadriciel, sans bibliothèque et sans étape de construction ; tests automatiques avec l'outil de test intégré à Node.js. | Reprend les techniques prouvées à l'étape 3, lisible par un bénévole, aucune dépendance à auditer. | Fichier HTML unique ; cadriciel avec construction (React, Svelte) ; application installable hors ligne dès la V1 (possible plus tard). | TEC-001, Doc#5 § 2, Doc#9 |
| DEC-068 | Architecture | Hébergement par GitHub Pages ; le dépôt `Mat130718/mailing-fcpe` devient public. Remplace DEC-047 pour la seule visibilité du dépôt (le reste de DEC-047 reste en vigueur). QO-004 est répondue. | GitHub Pages n'est gratuit que pour un dépôt public (documentation GitHub, vérifié le 12/10/2026) ; un seul compte, le plus simple à reprendre ; le code d'une page web est de toute façon lisible. Le dépôt ne contient aucune donnée personnelle (vérifié). | Cloudflare Pages avec dépôt privé ; second dépôt public pour l'outil seul ; Netlify (site suspendu si le crédit est épuisé) ; fichier ouvert depuis l'appareil (malcommode sur téléphone). | TEC-002, QO-004, DEC-047, Doc#5 § 2, Doc#9, Doc#10, Doc#8 |
| DEC-069 | Architecture | La charte et les cinq modèles types sont dans deux fichiers de paramètres du dépôt, écrits en JavaScript et commentés ; le logo reste intégré à l'email en base64. | Un référent les modifie sans toucher au reste ; aucune lecture de fichier par le réseau, ce qui garde la preuve de DEC-070 ; un logo hébergé créerait un flux vers l'hébergeur à chaque ouverture d'email. | Fichiers de données lus par le réseau au démarrage ; logo hébergé. | TEC-003, Doc#5 § 7 |
| DEC-070 | Sécurité | La page déclare une politique de sécurité du contenu (CSP) qui interdit toute requête réseau lancée par le code (`connect-src 'none'`) et n'autorise que les fichiers du site ; méthode de vérification : lecture de la règle, onglet Réseau du navigateur, absence de dépendance. | Preuve vérifiable d'EX-017, même en cas d'erreur de code. Limites : les gestes volontaires du rédacteur (coller, partager, ouvrir un lien) et l'adresse IP vue par l'hébergeur au chargement. | Aucune preuve technique, seulement la relecture du code. | TEC-004, EX-017, Doc#5 § 3, Doc#9 |
| DEC-071 | Données | Aucun stockage dans le navigateur (ni cookie, ni stockage local) ; un avertissement s'affiche avant de quitter la page si l'email n'a été ni copié ni exporté. | Applique DEC-006 et EX-017 ; évite de perdre un texte, puisque rien n'est conservé. | Stockage local du brouillon ; aucun avertissement. | TEC-005, EX-029 (nouvelle), Doc#5 § 6, Doc#10 |
| DEC-072 | Compatibilité | Navigateurs cibles : Chrome et Edge (Windows, Android), Safari (Mac, iPhone), dans leurs versions des deux dernières années ; Firefox utilisable, non testé sauf besoin (DEC-050). Au démarrage, l'outil vérifie qu'il sait copier en HTML, dessiner l'image et partager, et le dit clairement sinon, avec la solution de repli. | Pas de numéros de version non vérifiés ; aucun échec silencieux. | Liste de versions minimales. | TEC-006, EX-018, Doc#6 |

## Doc#5, section 2 « Comparaison des architectures et choix retenu »

Texte proposé :

« Comparaison détaillée : etape-4/note-comparative-architecture-v0.1.md. Règle de comparaison : DEC-066. Quatre formes (fichier unique, fichiers JavaScript, cadriciel, application hors ligne) et cinq hébergements (GitHub Pages public, Cloudflare Pages privé, second dépôt public, Netlify, fichier local) ont été notés ; Netlify et le fichier local sont écartés par un critère éliminatoire. »

| ID | Choix technique | Décision | Statut |
|---|---|---|---|
| TEC-001 | Page web en fichiers JavaScript standard, sans cadriciel, bibliothèque ni construction ; tests avec l'outil intégré à Node.js | DEC-067 | Validé |
| TEC-002 | Hébergement GitHub Pages, dépôt public | DEC-068 | Validé |
| TEC-003 | Charte et modèles types dans deux fichiers de paramètres ; logo en base64 dans l'email | DEC-069 | Validé |
| TEC-004 | Politique de sécurité du contenu interdisant toute requête réseau (`connect-src 'none'`) | DEC-070 | Validé |
| TEC-005 | Aucun stockage dans le navigateur ; avertissement avant de quitter | DEC-071 | Validé |
| TEC-006 | Navigateurs des deux dernières années, vérification des fonctions au démarrage | DEC-072 | Validé |

Les sections 3, 6 et 7 de Doc#5, ainsi que Doc#9, Doc#10 et Doc#8, suivront après le test T5, pour y inscrire ce qui aura été vérifié sur l'hébergeur.

## Doc#3, nouvelle exigence

| Proposé | Fonction | Exigence | Décision | Statut |
|---|---|---|---|---|
| EX-029 | Sorties | Avant de quitter ou de recharger la page, l'outil avertit le rédacteur si l'email en cours n'a été ni copié ni exporté au format pivot. | DEC-071 | Validé |

## Doc#12

- **QO-004** : « Répondue ». Réponse : « 12/10/2026 : GitHub Pages, dépôt rendu public (DEC-068). » Report : DEC-068.
- **Nouvelle QO-014** : thème Architecture. Question : « L'outil doit-il être publié depuis une organisation GitHub gratuite au nom du conseil local, plutôt que depuis le compte de Mat, pour qu'un bénévole puisse le reprendre sans changer d'adresse ? » Pourquoi elle compte : l'adresse contient l'identifiant GitHub de Mat (mat130718.github.io/Mailing-FCPE) ; la changer après la diffusion casserait les favoris des rédacteurs (DEC-012). Qui peut répondre : Mat. Échéance : avant l'étape 7. Statut : Ouverte.
