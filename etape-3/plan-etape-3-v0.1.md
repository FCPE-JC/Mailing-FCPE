# Étape 3 : tests de faisabilité, plan v0.1

11 octobre 2026. Rédigé par Claude, à valider par Mat. Rien n'est produit avant ton feu vert.

## Ce que j'ai lu

- Doc#1, déroulé : l'étape 3 teste le collage dans Gmail sous Windows et Mac, le mode sombre, le smartphone et l'image d'aperçu ; Claude prépare des pages de test, tu testes sur tes appareils ; documents touchés Doc#5 et Doc#6 ; faisable sur smartphone en partie.
- Doc#3 v2.0 : les exigences à éprouver sont EX-009 (copie en un geste vers Gmail), EX-010 et EX-012 (version WhatsApp, export du brouillon), EX-011 (image d'aperçu), EX-019 (rédaction sur smartphone), EX-020 (mode sombre) et EX-022 (logo).
- Doc#12 v0.2 : quatre questions attendent cette étape. QO-001 (smartphone tenable ?), QO-002 (constat du mode sombre ; le seuil reste pour l'étape 6), QO-003 (logo dans les autres messageries), QO-010 (ordinateurs personnels ou professionnels).
- Doc#5 v0.3, section 1 vide ; la charte (`etape-2/charte-blocs.md`) note que « styles en ligne seulement » est un fait rapporté au cadrage, à confirmer ici.
- Le dépôt GitHub `mailing-fcpe` est créé et rattaché à ce fil ; il ne contient qu'un README d'une ligne (vérifié).

## Principes de l'étape

- Chaque test répond à une question ouverte ou éprouve une exigence ; ses conclusions vont dans Doc#5, section 1.
- Données fictives seulement : les pages de test reprennent le mail de référence et les spécimens de l'étape 2.
- Le plan de chaque test est validé par toi avant que j'écrive la page ; tu relis la page avant de l'ouvrir.
- Un blocage est un résultat : tu me le copies tel quel (capture ou message d'erreur), je ne le contourne pas.
- Les pages de test ne sont pas l'outil : elles ne servent qu'à prouver ce qui est possible, l'architecture restant choisie à l'étape 4.
- Aucune bibliothèque tierce sans ta validation (elle irait dans Doc#9).

## Les tests proposés

| N° | Test | Question ou exigence | Appareils | Ce que tu fais | Smartphone |
|---|---|---|---|---|---|
| T1 | Copie vers Gmail | EX-009, charte (styles en ligne) | Ordinateurs : Windows (Chrome, Edge), Mac (Safari, Chrome) | Ouvrir la page de test, toucher « Copier », coller dans un nouveau message Gmail, envoyer à toi-même ; comparer avec un copier-coller fait à la souris | Non |
| T2 | Réception et mode sombre | QO-002 (constat), QO-003, EX-020, EX-022 | Téléphones et messageries : Gmail Android, Gmail iPhone, Apple Mail, plus Outlook ou Orange si quelqu'un les utilise | Ouvrir l'email de T1 en clair puis en sombre, faire une capture de chaque | Oui |
| T3 | Image d'aperçu | EX-011 | Téléphone et ordinateur | Toucher « Créer l'image », vérifier sa netteté, la partager dans WhatsApp | Oui |
| T4 | Rédaction sur téléphone | QO-001, EX-019, EX-010, EX-012 | Ton téléphone | Sur une maquette cliquable des trois écrans (Écrire, Vérifier, Partager) : coller un texte, toucher un bloc pour changer son type, copier la version WhatsApp, enregistrer le brouillon ; chronométrer et noter ton ressenti | Oui |

Détail technique de chaque test (à valider avec sa page) :
- **T1** compare deux façons de copier : le bouton, qui écrit l'email en HTML dans le presse-papier (fonction standard des navigateurs), et la sélection manuelle. Le logo y reste intégré dans le code (« base64 »), comme pour le mailing d'octobre.
- **T2** n'exige rien de l'outil : il observe ce que chaque messagerie fait de l'email. Les captures serviront de point de départ au seuil de l'étape 6.
- **T3** essaie d'abord une technique sans bibliothèque (le navigateur dessine l'email dans une image). Si elle ne suffit pas, je te proposerai une bibliothèque, avec sa licence, avant de l'utiliser.
- **T4** utilise un spécimen fixe : la détection n'y est pas programmée (ce serait du développement, étape 5). Il juge les gestes, la place à l'écran et le clavier, pas la qualité de la détection.

## Livrables

Sous `etape-3/` : ce plan, un plan court par test, les pages de test, une fiche de résultats par test à remplir (cases à cocher, captures attendues), puis une synthèse des résultats.

Les documents sont mis à jour par le fil Documents de référence, à qui j'envoie le texte : Doc#5 section 1 (résultats), Doc#6 (stratégie de recette : appareils et messageries retenus, jeu de spécimens), Doc#12 (QO-001, QO-003 et QO-010 répondues ou renvoyées, QO-002 constat), Doc#8 (revue de fin d'étape), Doc#4 (tes arbitrages et la clôture), Doc#1 et Doc#2 (statut de l'étape).

## Questions à trancher

Réponds par oui ou non à chaque numéro, ou « OK pour tout » si tu suis mes préconisations. Seule la question 1 demande une liste.

1. **Tes appareils.** Quels appareils et navigateurs as-tu sous la main : PC Windows, Mac, Android, iPhone ? Et les ordinateurs des rédacteurs sont-ils personnels, ou parfois professionnels avec des restrictions (QO-010) ? *Ta réponse fixe la liste des cas de T1 à T4 ; un appareil absent devient une question ouverte, renvoyée à la recette avec un autre rédacteur.*
2. **Où ouvrir les pages de test.** Je les publie comme pages privées sur claude.ai, que tu ouvres d'un lien sur ordinateur et sur téléphone ; pour T1 seulement, j'y ajoute le même fichier à télécharger et à ouvrir directement, au cas où la page claude.ai bloquerait la copie ? *Je préconise oui : rien à installer ni à héberger, et l'hébergement définitif reste un choix de l'étape 4 (QO-004). Je n'ai pas vérifié que la copie fonctionne depuis une page claude.ai ; c'est la raison du fichier de secours.*
3. **Autres messageries pour T2.** Envoyer l'email de test, au contenu fictif et marqué « Test », à deux ou trois bénévoles qui lisent avec Outlook, Orange ou Apple Mail, et leur demander une capture en clair et en sombre ? *Je préconise oui : c'est le seul moyen de répondre à QO-003 avant l'étape 6. Leurs adresses restent dans Gmail ; ni moi ni l'outil ne les voyons.*
4. **Image d'aperçu sans bibliothèque d'abord.** Commencer T3 par la technique sans dépendance, et ne proposer une bibliothèque qu'en cas d'échec ? *Je préconise oui : aucune dépendance à auditer si cela suffit.*
5. **Maquette cliquable pour T4.** Une maquette avec un spécimen fixe, sans détection programmée, suffit-elle pour juger la rédaction sur téléphone ? *Je préconise oui : la question est l'ergonomie, pas la détection, déjà essayée à l'étape 2 et renvoyée à la recette (QO-012).*
6. **Premier contenu du dépôt.** Ouvrir maintenant, dans ce fil, la première demande de fusion (« pull request ») du dépôt : README, `.gitignore` bloquant PDF, images, scans, emails et tableurs, livrables de l'étape 2 (charte, format pivot, règles, prompt, spécimens texte, outils Python), puis les pages de test de l'étape 3 au fil de l'eau ? *Je préconise oui : c'est la méthode prévue au démarrage, et le dépôt devient la source des pages de test. Je laisse de côté le dossier `mails/` (vrai mailing, images) et les rendus HTML, régénérables par les outils. Tu relis et tu fusionnes ; je ne fusionne rien moi-même.*

## Ordre de travail

1. Après ton feu vert : la demande de fusion du dépôt (question 6), puis le plan court de T1 et T2, qui se suivent (l'email collé en T1 est celui qu'on regarde en T2).
2. Ensuite T3 et T4, qui peuvent se faire sur téléphone pendant que T1 attend un ordinateur.
3. Synthèse des résultats, puis mises à jour des documents par le fil Documents de référence.

## Condition de sortie de l'étape

Résultats de T1 à T4 consignés dans Doc#5, section 1 ; QO-001, QO-003 et QO-010 répondues ou renvoyées explicitement, constat de QO-002 noté ; Doc#6 complété (stratégie et spécimens) ; Doc#8 revu ; clôture par une décision inscrite dans Doc#4. Faisable sur smartphone : en partie (T2, T3, T4 oui ; T1 demande un ordinateur).
