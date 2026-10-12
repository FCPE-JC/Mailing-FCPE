# Étape 4 : note comparative d'architecture, v0.1

12 octobre 2026. Rédigée par Claude, à arbitrer par Mat. Plan : `etape-4/plan-etape-4-v0.1.md` (DEC-065).

## En bref

Je préconise **une page web en quelques fichiers JavaScript, sans cadriciel ni bibliothèque**, publiée par **GitHub Pages** après avoir **rendu le dépôt public**. Une règle de sécurité placée dans la page interdit au navigateur tout envoi réseau : c'est la preuve qu'aucun texte ne sort. Deux choix sont à arbitrer sur carte (A, la forme de l'outil ; B, l'hébergeur), et quatre par oui ou non (C à F).

## Règle de comparaison (validée par Mat le 12/10/2026)

- **Éliminatoires** : 1. gratuité durable (DEC-011) ; 2. sans installation sur PC, Mac, Android et iPhone (DEC-010, EX-018) ; 3. aucun texte ne quitte le navigateur, et c'est démontrable (EX-017).
- **Pour départager**, par ordre d'importance : 4. reprise par un bénévole (DEC-012, EX-025) ; 5. aucune bibliothèque tierce à auditer (Doc#9) ; 6. réemploi de l'étape 3 ; 7. facilité des tests automatiques (EX-028) ; 8. démarches à faire par Mat.

Notation : ✔ satisfait, ◐ partiellement, ✘ non satisfait.

## Ce qui a été vérifié, ce qui est déduit

| Fait | Statut |
|---|---|
| GitHub Pages n'est gratuit que pour un dépôt public : « GitHub Pages is available in public repositories with GitHub Free […], and in public and private repositories with GitHub Pro, GitHub Team […] » | Vérifié le 12/10/2026, docs.github.com, « What is GitHub Pages? » |
| GitHub Pages : site de 1 Go au plus, limite souple de 100 Go de trafic par mois ; usage commercial exclu ; pas de transactions sensibles (mots de passe, cartes bancaires) | Vérifié, docs.github.com, « GitHub Pages limits » |
| Cloudflare Pages, offre gratuite : « Unlimited bandwidth », « Unlimited static requests », « Unlimited sites » ; 500 publications par mois ; 20 000 fichiers | Vérifié, pages.cloudflare.com et developers.cloudflare.com |
| Cloudflare Pages publie depuis un dépôt GitHub privé | Connu, non vérifié sur ces pages |
| Netlify gratuit : 300 crédits par mois (15 par publication, 20 par Go de trafic) ; au-delà, « it enters a paused state until the start of the next billing cycle » | Vérifié, netlify.com/pricing |
| Netlify gratuit publie depuis un dépôt privé personnel | Non établi : la page ne mentionne les dépôts privés que pour l'offre payante |
| Le dépôt actuel ne contient aucune donnée personnelle ; le logo n'y est pas (exclu par `.gitignore`) ; seul lien réel : le questionnaire du mailing d'octobre (forms.gle) dans le spécimen 00 | Vérifié sur le dépôt le 12/10/2026 |
| Le code d'une page web est lisible par toute personne qui l'ouvre, quel que soit l'hébergeur | Fait général du web |

## A. Forme de l'outil

| Option | Description |
|---|---|
| A1 | Un seul fichier HTML qui contient tout (mise en page, code, logo) |
| A2 | Quelques fichiers en JavaScript standard (une page, une feuille de style, un fichier par fonction : détection, rendu, image, partage), sans étape de construction |
| A3 | Application écrite avec un cadriciel (React, Svelte…) et assemblée par un outil de construction |
| A4 | Variante de A2 installable et utilisable hors ligne (application web progressive, PWA) |

| Critère | A1 | A2 | A3 | A4 |
|---|---|---|---|---|
| 1. Gratuité | ✔ | ✔ | ✔ | ✔ |
| 2. Sans installation | ✔ | ✔ | ✔ | ✔ (l'installation reste facultative) |
| 3. Aucun flux, démontrable | ✔ | ✔ | ◐ des centaines de paquets à contrôler | ✔ |
| 4. Reprise par un bénévole | ◐ un fichier de plusieurs milliers de lignes | ✔ fichiers courts, rangés par fonction | ✘ il faut connaître le cadriciel et ses outils | ◐ s'ajoute la mise en cache hors ligne, source de bugs (ancienne version affichée) |
| 5. Aucune bibliothèque | ✔ | ✔ | ✘ | ✔ |
| 6. Réemploi de l'étape 3 | ✔ | ✔ | ◐ à réécrire | ✔ |
| 7. Tests automatiques | ◐ le code doit être extrait du fichier | ✔ chaque fichier se teste seul | ✔ | ✔ |
| 8. Démarches de Mat | ✔ | ✔ | ✔ | ✔ |

**Préconisation : A2.** Elle reprend telles quelles les techniques prouvées à l'étape 3 et transcrit en JavaScript les deux scripts Python de l'étape 2, qui servent de référence. Les tests automatiques utilisent l'outil de test intégré à Node.js, sans dépendance ; ils comparent les sorties aux spécimens de l'étape 2 et vérifient EX-028 (le pivot réimporté redonne le même email). A4 pourra s'ajouter plus tard sans rien défaire. A3 est écartée : elle n'apporte rien à un outil de cette taille et alourdit l'audit.

## B. Hébergeur (QO-004)

| Option | Description |
|---|---|
| B1 | GitHub Pages, dépôt rendu public |
| B2 | Cloudflare Pages, dépôt laissé privé |
| B3 | GitHub Pages depuis un second dépôt public qui ne contient que l'outil ; le dépôt de travail reste privé |
| B4 | Netlify, dépôt laissé privé |
| B5 | Pas d'hébergeur : chaque rédacteur ouvre le fichier depuis son appareil |

| Critère | B1 | B2 | B3 | B4 | B5 |
|---|---|---|---|---|---|
| 1. Gratuité durable | ✔ | ✔ | ✔ | ◐ site suspendu si le crédit mensuel est épuisé ; dépôt privé non établi | ✔ |
| 2. Sans installation, 4 appareils | ✔ | ✔ | ✔ | ✔ | ✘ ouvrir un fichier local est malcommode sur Android et ne fonctionne pas correctement sur iPhone (déduit) |
| 3. Aucun flux | ✔ | ✔ | ✔ | ✔ | ✔ |
| 4. Reprise par un bénévole | ✔ un seul compte, un seul endroit | ◐ un second compte, relié au dépôt | ◐ deux dépôts à tenir synchronisés | ◐ un second compte | ◐ redistribuer le fichier à chaque version |
| 5. Aucune bibliothèque | ✔ | ✔ | ✔ | ✔ | ✔ |
| 6. Réemploi | ✔ | ✔ | ✔ | ✔ | ✔ |
| 7. Tests automatiques | ✔ | ✔ | ✔ | ✔ | ✔ |
| 8. Démarches de Mat | ✔ rendre le dépôt public, activer Pages | ◐ créer un compte Cloudflare, autoriser l'accès au dépôt, configurer | ◐ créer le second dépôt, activer Pages | ◐ comme B2 | ✔ |

B4 et B5 sont écartées par un critère éliminatoire. Restent B1, B2 et B3, qui ne diffèrent que sur la visibilité du dépôt et la reprise.

**Ce que rendre le dépôt public change.** Le code de l'outil, lui, sera lisible de tous dans tous les cas, puisqu'une page web s'ouvre avec son code. Ce qui devient visible en plus : les documents de travail des étapes 2 et 3, les spécimens fictifs, l'historique des modifications, et, une fois l'outil construit, le logo FCPE (autorisé pour les mailings officiels, DEC-013, et déjà visible dans chaque email). Le seul élément réel est le lien du questionnaire du mailing d'octobre ; s'il est encore ouvert, mieux vaut le fermer avant. Les Claude Docs (Doc#1 à Doc#12) ne sont pas dans le dépôt. Cela remplacerait DEC-047, qui fixait un dépôt privé.

**Préconisation : B1.** C'est la solution la plus simple à reprendre (un seul compte, celui où vit déjà le code) et la moins coûteuse en démarches. B2 est le bon repli si tu tiens à garder le dépôt privé.

**Point à trancher plus tard, avant l'étape 7** : l'adresse de l'outil contiendra ton identifiant GitHub (mat130718.github.io/mailing-fcpe). Pour qu'un bénévole puisse un jour reprendre l'outil sans changer d'adresse, le dépôt peut être placé dans une organisation GitHub gratuite au nom du conseil local. Ce n'est pas nécessaire pour l'étape 4 ; je le note en question ouverte.

## C. Charte et modèles types (paramètres partagés)

- **Préconisation** : les couleurs, tailles et textes fixes de la charte dans un fichier de paramètres commenté (`parametres/charte.js`), et les cinq modèles types écrits au format pivot dans `parametres/modeles.js`. Un référent les modifie sans toucher au reste du code ; chaque changement passe par une demande de fusion relue.
- **Écarté** : des fichiers de données séparés, lus par la page au démarrage. Ils obligeraient à autoriser la page à faire des requêtes réseau, même vers son propre site, ce qui affaiblirait la preuve du point D.
- **Logo** : intégré à l'email en base64, comme dans le mailing d'octobre et aux tests T1 et T2. Un logo hébergé obligerait les messageries des parents à le télécharger chez l'hébergeur, donc créerait un flux.

## D. Preuve de l'absence de flux (EX-017)

- **Préconisation** : la page déclare une politique de sécurité du contenu (CSP, Content Security Policy), qui interdit au navigateur toute requête réseau lancée par le code (`connect-src 'none'`) et n'autorise que les fichiers du site lui-même (`default-src 'self'`, images en `data:` et `blob:`). Même un code modifié par erreur ne pourrait pas envoyer le texte.
- **Méthode de vérification**, reprise dans Doc#9 : lire la ligne de la CSP dans `index.html` ; ouvrir l'onglet Réseau des outils de développement du navigateur, rédiger un email complet et constater qu'aucune requête ne part après le chargement ; vérifier que le dépôt ne déclare aucune dépendance.
- **Limites, à écrire dans Doc#9** : la CSP n'empêche pas les gestes volontaires du rédacteur (coller dans Gmail, partager vers WhatsApp, cliquer un lien de l'aperçu), qui sont l'objet même de l'outil. L'hébergeur voit, comme tout site, l'adresse IP des visiteurs qui chargent la page, mais jamais le texte.
- Le test T5 vérifiera que cette règle ne bloque ni la copie, ni l'image, ni le partage.

## E. Fichiers temporaires et durée de vie des données

| Donnée | Où elle vit | Durée de vie |
|---|---|---|
| Texte saisi et email mis en forme | Mémoire de la page | Jusqu'à la fermeture ou au rechargement de la page |
| Image d'aperçu | Mémoire, puis galerie du téléphone si le rédacteur l'enregistre | Mémoire : libérée après l'enregistrement ; galerie : à la main du rédacteur |
| Pivot exporté (brouillon) | Fichier `.md` téléchargé, ou presse-papier | À la main du rédacteur |
| Presse-papier | Système de l'appareil | Jusqu'à la copie suivante |

- **Préconisation** : aucun stockage dans le navigateur (ni cookie, ni stockage local), conformément à DEC-006 et EX-017. En contrepartie, **un avertissement avant de quitter** la page si l'email n'a été ni copié ni exporté, pour éviter de perdre un texte. C'est une petite exigence nouvelle, à ajouter à Doc#3 si tu l'acceptes.
- Le guide utilisateur (Doc#7) conseillera de supprimer de la galerie les images envoyées.

## F. Navigateurs cibles

- **Préconisation** : Chrome et Edge sur Windows et Android, Safari sur Mac et iPhone, dans leurs versions des deux dernières années ; Firefox utilisable mais non testé, sauf si un rédacteur l'utilise (DEC-050). Au démarrage, l'outil vérifie que le navigateur sait copier en HTML, dessiner l'image et partager ; sinon il le dit clairement et propose la solution de repli (sélection à la main, enregistrement de l'image), sans échec silencieux (même esprit que EX-026).
- Je ne fixe pas de numéros de version : ceux que je connais viennent de ma mémoire et ne sont pas vérifiés. La vérification au démarrage les rend inutiles.

## Conséquences pour les documents (après arbitrage)

- Doc#4 : une décision par choix (A à F), plus la règle de comparaison ; DEC-047 remplacée si B1 est retenue.
- Doc#5 : section 2 (cette comparaison et les TEC), section 3 (schéma des flux), sections 6 et 7.
- Doc#9 : aucune dépendance d'exécution ; cartographie des flux et méthode de vérification (point D).
- Doc#10 : tableau des durées de vie (point E) ; adresses IP vues par l'hébergeur.
- Doc#8 : risques nouveaux proposés : l'hébergeur change ses conditions gratuites (mesure : le code ne dépend d'aucun service propre à l'hébergeur, le déménagement prend une heure) ; un contenu sensible est publié par erreur dans le dépôt public (mesure : `.gitignore` déjà en place, relecture de chaque demande de fusion).
- Doc#12 : QO-004 répondue ; nouvelle question sur l'adresse définitive (organisation GitHub), à trancher avant l'étape 7.
- Doc#3 : avertissement avant de quitter la page (point E), si tu l'acceptes.

## Questions à trancher

A et B sont posées sur des cartes de décision. Pour les autres, réponds par oui ou non, ou « OK pour tout ».

1. **C, paramètres partagés** : charte et modèles types dans deux fichiers de paramètres du dépôt, logo intégré en base64 ? *Je préconise oui.*
2. **D, preuve de l'absence de flux** : la règle de sécurité qui interdit toute requête réseau, avec la méthode de vérification ci-dessus ? *Je préconise oui.*
3. **E, durée de vie** : aucun stockage dans le navigateur, et un avertissement avant de quitter la page si l'email n'a été ni copié ni exporté ? *Je préconise oui.*
4. **F, navigateurs** : navigateurs des deux dernières années, avec une vérification au démarrage plutôt que des numéros de version ? *Je préconise oui.*

## Arbitrages de Mat

- 12/10/2026, 21:45 : **A, forme de l'outil : A2, fichiers JavaScript** (carte de décision).
- 12/10/2026, 21:45 : **B, hébergeur : B1, GitHub Pages avec dépôt rendu public** (carte de décision). Remplace DEC-047 sur la visibilité du dépôt.
- 12/10/2026, 21:47 : **C, D, E, F : préconisations retenues** (« Questions 1 à 4 : ok pour tout »). Mises à jour demandées : etape-4/maj-documents-arbitrages-v0.1.md.
