# Étape 4 : brouillons des documents (Doc#5, Doc#9, Doc#10, Doc#8, Doc#11), v0.1

12 octobre 2026. Rédigé par Claude, à valider par Mat. Rien n'est encore envoyé au fil Documents de référence : ces textes seront complétés avec les résultats du test T5, puis soumis.

Ce qui reste suspendu à T5 est marqué **[après T5]**.

## 1. Doc#5, section 3 « Schéma d'architecture et des flux »

```
                Appareil du rédacteur (ordinateur ou téléphone)
 ┌─────────────────────────────────────────────────────────────────┐
 │  Navigateur                                                      │
 │  ┌──────────────────────── page Mailing-FCPE ─────────────────┐ │
 │  │ texte saisi ─► détection ─► modèle interne ─► rendus        │ │
 │  │ (ou pivot)                  (en mémoire)      email, WhatsApp│ │
 │  │                                               texte, image   │ │
 │  │ Règle de sécurité : aucune requête réseau (connect-src none) │ │
 │  └──────────────────────────────────────────────────────────────┘ │
 │        │ copier            │ enregistrer / partager   │ exporter  │
 │        ▼                   ▼                          ▼           │
 │   presse-papier       galerie, WhatsApp          fichier .md      │
 └─────────────────────────────────────────────────────────────────┘
        ▲ ① chargement de la page (une fois, sans texte)
        │
   GitHub Pages (fichiers statiques du dossier docs/ du dépôt public)
```

Flux, tous déclenchés par le rédacteur :
1. **Chargement** : le navigateur télécharge les fichiers de la page chez GitHub Pages. Aucun texte ne part ; GitHub voit l'adresse IP de l'appareil, comme pour tout site.
2. **Copie** vers le presse-papier, puis collage dans Gmail par le rédacteur (EX-009).
3. **Image** : enregistrée dans l'appareil ou partagée vers WhatsApp par le bouton Partager du téléphone (EX-011, QO-013 **[après T5]**).
4. **Export du pivot** : fichier téléchargé ou texte copié (EX-012).
5. **Liens** de l'aperçu : ouverts seulement si le rédacteur les touche.

Aucun autre flux : la règle de sécurité (DEC-070, TEC-004) interdit au code toute requête réseau, y compris vers GitHub. Vérification : Doc#9, section 3.

## 2. Doc#5, section 6 « Gestion des fichiers temporaires »

Texte proposé : « Aucun stockage dans le navigateur : ni cookie, ni stockage local, ni base locale (DEC-071, TEC-005). Le texte et l'email n'existent qu'en mémoire, jusqu'à la fermeture ou au rechargement de la page. L'image est créée en mémoire ; son adresse temporaire (blob:) est libérée après l'enregistrement ou le partage. Ce qui sort de la page n'en sort que par un geste du rédacteur : presse-papier (jusqu'à la copie suivante), image enregistrée ou partagée, pivot exporté ; leur durée de vie relève du rédacteur (Doc#10). Avant de quitter, la page avertit si l'email n'a été ni copié ni exporté (EX-029) **[après T5 : comportement sur iPhone]**. »

## 3. Doc#5, section 7 « Stockage des paramètres partagés »

Texte proposé : « Deux fichiers de paramètres, versionnés dans le dépôt (DEC-069, TEC-003) : `charte.js` (couleurs, tailles, textes fixes de l'en-tête et de la signature, pastilles par mot-clé) et `modeles.js` (les cinq modèles types de EX-002, écrits au format pivot). Ils sont chargés comme le reste du code, sans requête réseau. Un changement passe par une demande de fusion relue par Mat. Le logo est intégré en base64 dans `charte.js` ; il n'est jamais chargé depuis un serveur. Les noms et l'emplacement exacts des fichiers seront fixés avec l'organisation du code (Doc#5, section 4, étape 5). »

## 4. Doc#9 - Dossier d'auditabilité technique

### Section 1, présentation synthétique (remplace le texte actuel)

« Mailing-FCPE est une page web statique, publiée par GitHub Pages depuis le dossier `docs/` du dépôt public `Mat130718/mailing-fcpe` (DEC-068). Elle est écrite en HTML, CSS et JavaScript standard, sans cadriciel, sans bibliothèque et sans étape de construction (DEC-067). Tout le traitement se fait dans le navigateur ; une règle de sécurité interdit toute requête réseau (DEC-070) ; rien n'est conservé (DEC-071). »

### Section 2, inventaire des dépendances

« Aucune dépendance d'exécution. » Puis une ligne d'information, sans numéro DEP, car rien n'est livré aux utilisateurs :

| Outil | Rôle | Hors de l'outil livré |
|---|---|---|
| Node.js (outil de test intégré) | Tests automatiques, sur le poste du développeur | Oui |
| Python 3 | Scripts de travail et de construction des pages de test | Oui |
| GitHub Pages | Hébergement (service, pas une dépendance du code) | Oui |

**Question pour Mat (Q1 ci-dessous)** : faut-il quand même numéroter ces outils en DEP ?

### Section 3, cartographie des flux et méthode de vérification

Reprendre le schéma et la liste des flux de la section 1 ci-dessus, puis :

« Méthode de vérification, à la portée de tout relecteur :
1. Ouvrir `docs/index.html` (ou toute page publiée) et lire la ligne `Content-Security-Policy` : `connect-src 'none'` interdit au code toute requête ; `default-src 'none'` et `script-src 'self'` n'autorisent que les fichiers du site.
2. Ouvrir la page, puis les outils de développement du navigateur (touche F12), onglet Réseau ; rédiger un email complet, le copier, créer l'image : aucune requête ne doit apparaître après le chargement.
3. Vérifier qu'aucun fichier du dépôt ne déclare de dépendance (pas de `package.json` avec des dépendances d'exécution) et qu'aucune page ne charge de script venu d'un autre site.
Vérifié par Claude le 12/10/2026 sur la page T5, dans Chromium : la requête d'essai est bloquée par la règle, aucune requête après le chargement. **[après T5 : vérification par Mat sur ses appareils]** »

### Section 5, mesures de sécurité

« Règle de sécurité du contenu (DEC-070) ; aucune dépendance (DEC-067) ; aucun stockage (DEC-071) ; dépôt public relu à chaque demande de fusion, `.gitignore` qui bloque PDF, images, scans, emails et tableurs ; aucune donnée personnelle dans le dépôt (spécimens fictifs) ; pages publiées marquées « noindex » pour ne pas apparaître dans les moteurs de recherche. Limites : la règle n'empêche pas les gestes volontaires du rédacteur (coller, partager, ouvrir un lien) ; GitHub voit l'adresse IP des visiteurs au chargement. »

### Section 7, points à valider (par Mat)

1. La règle de sécurité suffit-elle comme preuve d'absence de flux ? (Proposé : oui.)
2. L'absence de dépendance d'exécution est-elle une règle permanente, toute exception passant par une décision ? (Proposé : oui.)

## 5. Doc#10 - Dossier préparatoire à l'analyse d'impact

Ajouts proposés :
- **Section 1**, tableau des données, deux lignes :
  - « Image d'aperçu » : mêmes personnes que le texte ; toujours si le rédacteur la crée ; en mémoire, puis dans la galerie du téléphone ou dans WhatsApp, à la main du rédacteur.
  - « Adresse IP de l'appareil du rédacteur » : rédacteurs ; à chaque chargement de la page ; conservée par GitHub selon sa propre politique, hors de l'outil, et jamais associée au texte.
- **Section 2**, principe « Absence de conservation » : ajouter « ni cookie, ni stockage local (DEC-071) ; une règle de sécurité interdit tout envoi (DEC-070) ».
- **Section 4**, troisième point pour le bureau : « Le guide utilisateur doit-il conseiller de supprimer de la galerie les images envoyées sur WhatsApp ? »

## 6. Doc#8 - Revue de l'étape 4 **[à soumettre en fin d'étape, après T5]**

| Risque | Aujourd'hui | Proposé | Raison |
|---|---|---|---|
| RSK-008, l'hébergeur change ses conditions | 1 × 2 = 2 faible, revue fin d'étape 4 | inchangé, revue fin d'étape 7 | Hébergeur choisi (DEC-068). Mesure ajoutée : la page n'utilise aucun service propre à GitHub ; un déménagement vers un autre hébergeur statique (Cloudflare Pages, par exemple) ne demande que de republier le dossier `docs/`. |
| RSK-012 (nouveau), un contenu sensible est publié dans le dépôt public | — | Données ; cause : un fichier réel ajouté par erreur (email, capture, tableur) ; conséquence : données personnelles visibles de tous et conservées dans l'historique ; 1 × 3 = 3 moyenne | Mesures : `.gitignore` en place, relecture de chaque demande de fusion par Mat, captures jamais versionnées ; en cas d'erreur, retrait et réécriture de l'historique. Responsable : Claude et Mat. Revue à chaque fin d'étape. |

## 7. Doc#11 - Backlog : découpage en lots **[proposé, à valider]**

Six lots, dans l'ordre de construction. Chaque lot se termine par une demande de fusion relue par Mat et une page publiée qu'il peut essayer sur son téléphone.

| Lot | Contenu | Exigences | Ce que Mat peut essayer à la fin |
|---|---|---|---|
| 1. Socle | Page aux trois écrans (Écrire, Vérifier, Partager), règle de sécurité, vérification du navigateur au démarrage, fichiers de paramètres, tests automatiques en place | EX-015 à EX-018, EX-023, DEC-069 à DEC-072 | Naviguer entre les trois écrans vides |
| 2. Pivot et rendu | Lecture du format pivot, modèle interne, rendu de l'email, aperçu continu | EX-003, EX-007, EX-008 | Coller un pivot et voir l'email |
| 3. Détection | Passage du texte brut au pivot (règles D1 à D16), comparée aux spécimens de l'étape 2 | EX-001, EX-004 | Coller un texte brut |
| 4. Corrections et conseils | Changer le type d'un bloc, la pastille et le surtitre ; anomalies signalées ; aide à l'objet | EX-005, EX-006, EX-026, EX-027 | Corriger un email mal détecté |
| 5. Sorties | Copie pour Gmail, version WhatsApp, version texte, image, export et réimport du pivot, prompt IA, avertissement avant de quitter | EX-009 à EX-014, EX-028, EX-029 | Faire tout le parcours jusqu'à Gmail |
| 6. Modèles et finitions | Cinq modèles types, en-tête sur téléphone (DEC-060, selon T5), accessibilité, police de la date et de la clôture | EX-002, EX-019 à EX-022, EX-024, EX-025 | Préparer un vrai email de test en moins de 15 minutes |

Les US (une ou plusieurs par exigence, « En tant que rédacteur, je veux… afin de… ») seront écrites lot par lot une fois ce découpage validé, US-001 à US-006 pour le lot 1 d'abord, pour ne pas figer trop tôt le détail des lots suivants.

## Questions à trancher

Réponds par oui ou non, ou « OK pour tout ».

1. **Outils hors de l'outil livré** (Node.js, Python, GitHub Pages) : les mentionner dans Doc#9 pour information, sans numéro DEP ? *Je préconise oui : un DEP désigne ce qui est livré aux utilisateurs, et rien ne l'est.*
2. **Nouveau risque RSK-012** (contenu sensible publié dans le dépôt public), coté 3 moyenne ? *Je préconise oui.*
3. **Découpage en six lots** ci-dessus, avec les US écrites lot par lot ? *Je préconise oui : chaque lot donne quelque chose d'essayable sur téléphone.*

## Décision à inscrire avec ce lot (13/10/2026)

- **Lien du questionnaire d'octobre** : remplacé par un lien fictif dans les fichiers du dépôt (demande de fusion n° 5) ; le vrai lien reste dans l'historique, ce que Mat accepte (carte de décision du 13/10/2026, 05:06). Raisons : Mat n'a pas la main sur le questionnaire ; le lien a déjà été envoyé à 350 parents ; réponses anonymes ; rencontre passée. Options écartées : nouveau dépôt public sans historique ; demander la fermeture au propriétaire du questionnaire. Impacts : RSK-012 (risque résiduel connu), DEC-068.

## Réponses de Mat (13/10/2026, 05:17)

« Ok pour tout » aux questions 1 à 3 : outils cités dans Doc#9 pour information, sans DEP ; RSK-012 ajouté (3 moyenne) ; découpage en six lots, US rédigées lot par lot.

Envoyé au fil Documents de référence le 13/10/2026 : décisions (questions 1 à 3 et lien du questionnaire), Doc#5 sections 3, 6 et 7, Doc#9 sections 1, 2, 3, 5 et 7, Doc#10, RSK-012, structure des lots dans Doc#11. Restent pour la fin d'étape : compléments issus de T5 (marqués « après T5 ») et revue de RSK-008.
