# Doc#7 : guide référent et ébauche du guide utilisateur, v0.1

14 octobre 2026. Rédigé par le fil « Étape 5 : développement » au lot 6 (question 9 du lot 6, validée par Mat le 14/10/2026). Texte proposé pour les sections 1 et 2 de Doc#7, à reporter par le fil Documents de référence. L'outil décrit est celui de la version 0.6.0. Les captures d'écran du guide utilisateur viendront à l'étape 7, comme le prévoit Doc#7.

## Section 1. Guide utilisateur pas à pas (ébauche, sans captures)

L'outil transforme un texte en email aux couleurs du conseil local FCPE, prêt à coller dans Gmail. Il s'ouvre dans le navigateur, sur téléphone comme sur ordinateur, à l'adresse https://mat130718.github.io/Mailing-FCPE/. Rien n'est installé, rien n'est envoyé à un serveur et rien n'est gardé : quand la page se ferme, le texte disparaît, sauf si tu l'as exporté.

Le parcours tient en trois écrans, Écrire, Vérifier et Partager, que l'on suit dans l'ordre avec les boutons en haut de la page.

### 1. Écrire

Quatre façons de commencer :
- **Coller un texte** déjà écrit, par exemple un message WhatsApp ou un ancien email. L'outil le met en forme tout seul.
- **Partir d'un modèle** : remerciement, invitation, préparation du conseil d'école, appel à témoignages ou information urgente. Le modèle remplit la zone de texte. Remplace chaque passage entre crochets, par exemple `[date]`, par ton texte. Si la zone contenait déjà un texte, l'outil demande d'abord s'il peut le remplacer.
- **Reprendre un brouillon** exporté plus tôt : colle-le, ou ouvre son fichier avec « 📂 Reprendre un brouillon ».
- **Utiliser une IA** : « 🤖 J'utilise une IA : copier le prompt » copie les consignes à donner à l'IA. Colle-les dans l'IA, ajoute ton texte à la fin, puis colle sa réponse ici, avec le bouton « Copier » de son bloc de code.

Touche ensuite « Mettre en forme → ».

### 2. Vérifier

L'écran montre l'email tel que les parents le recevront.
- **Objet** : écris-le ou choisis une proposition. Les messages sous le champ préviennent si l'objet est trop long ou risque d'être pris pour un indésirable.
- **Conseils** : la liste signale ce qu'il reste à faire, par exemple « Il reste à compléter : [date] », et les points de rédaction (surtitre manquant, liste trop longue…). Toucher un message mène au bloc concerné.
- **Corriger un bloc** : touche un bloc ou son étiquette. Le panneau « Ce bloc est… » permet de changer son type (paragraphe, accroche, liste, bouton, encadré Important, date et lieu, clôture, signature…), son texte, la pastille de sa section ou son surtitre. « Autre émoji » accepte n'importe quel émoji.
- **Annuler** revient en arrière, correction par correction.

### 3. Partager

- **Pour la relecture (téléphone)** : « Copier pour WhatsApp », « Enregistrer l'image » (et « Partager l'image » quand le téléphone le permet), « Exporter le brouillon » ou « Télécharger le brouillon ».
- **Pour l'envoi (ordinateur)** : « Copier l'email pour Gmail », puis colle-le dans un nouveau message Gmail (Ctrl+V, ou ⌘+V sur Mac). « Copier la version texte » sert quand le collage mis en forme ne marche pas.

Si le navigateur refuse une copie, l'outil affiche le contenu sélectionné : copie-le alors à la main.

### À savoir

- Avant de fermer la page, exporte ton brouillon si tu veux le reprendre. Le navigateur prévient au rechargement tant que l'email n'est ni copié pour Gmail ni exporté.
- Le numéro de version figure en bas de la page. Après une mise à jour de l'outil, il change tout seul.

## Section 2. Guide référent (paramètres partagés)

Le référent peut modifier la charte, les modèles types et le prompt IA sans toucher au reste du code. Ces paramètres sont dans trois fichiers du dépôt `Mat130718/Mailing-FCPE`, dossier `docs/parametres/`. Chaque fichier commence par un commentaire qui explique ce qu'il contient.

| Fichier | Contenu | À savoir |
|---|---|---|
| `charte.js` | Couleurs, tailles et graisses du texte, dimensions, textes fixes de l'en-tête et de la signature, logo (en base64) | Aucun autre fichier de l'outil ne contient de couleur de la charte. Un test vérifie que chaque couleur de texte reste lisible sur son fond (contraste d'au moins 4,5 pour 1). La description complète de la charte est dans `etape-2/charte-blocs.md`. |
| `modeles.js` | Les cinq modèles types, au format pivot (`etape-2/format-pivot.md`) | Chaque modèle commence par sa ligne « Objet : ». Les passages à compléter sont entre crochets ; dans une adresse, sans espace : `https://[adresse]`. Un test vérifie que chaque modèle est lu sans autre anomalie que ses crochets. |
| `prompt-ia.js` | Le prompt copié par « J'utilise une IA » | C'est une copie exacte de `etape-2/prompt-ia.txt` : modifier les deux fichiers de la même façon, sinon un test échoue. |

### Proposer une modification

1. Sur GitHub, ouvrir le fichier, toucher le crayon « Edit », faire la modification.
2. Choisir « Create a new branch » puis « Propose changes » : GitHub ouvre une demande de fusion.
3. Changer aussi le numéro de version (DEC-123) : dans `package.json` et partout où `?v=` apparaît dans `docs/`, ainsi que dans le pied de page de `docs/index.html`. Un test vérifie qu'il est le même partout. C'est ce numéro qui oblige les navigateurs à charger les nouveaux fichiers.
4. Attendre la vérification « Tests automatiques » : elle doit être verte. Si elle est rouge, son journal dit quel test échoue (voir `etape-5/guide-verifications-github-v0.1.md`).
5. Mat relit et fusionne. Le site est mis à jour une à deux minutes après.

### Lancer les tests sur un ordinateur

Il faut Node.js 22 ou plus récent, sans aucune installation de paquet. Depuis le dossier du dépôt : `node --test`. Chaque test porte le numéro de l'US ou de l'exigence qu'il vérifie.
