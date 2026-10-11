# Mailing-FCPE : charte et bibliothèque de blocs, v0.1

11 octobre 2026. Rédigé par Claude, statut **Proposé** (à valider par Mat). Source : le modèle de référence `mails/2026-10-11-merci-elections-M-mixte-L-BF-entete-bleu.html` (DEC-007). Décisions d'étape 2 appliquées : bibliothèque de 15 blocs (12 du modèle + 3 ajoutés), dessin des 3 blocs ajoutés dans le style du modèle.

Ce qui est **vérifié** : les valeurs ci-dessous sont relevées dans le code du modèle. Le mail de référence, réécrit au format pivot puis rendu par un outil de travail selon cette charte, redonne le code du modèle, à quelques marges redondantes près (`specimens/rendus/00-reference-merci-elections-pivot-redige.html`). Ce qui est **proposé sans précédent** : le dessin des blocs 13 à 15 et les règles de couleur des sections au-delà de cinq.

## 1. Principes de construction

1. **Styles en ligne seulement**, écrits sur chaque élément, sans bloc `<style>` ni classe : c'est ce qui survit au collage dans Gmail (fait rapporté au cadrage, à confirmer à l'étape 3).
2. **Mise en page en tableaux** (`<table role="presentation">`), largeur maximale 640 px, pour les messageries anciennes.
3. **Polices système** : Arial, Helvetica, sans-serif. Aucune police téléchargée.
4. **Effets traités comme des bonus** : coins arrondis et trait vertical du fil (dégradé en image de fond) peuvent disparaître dans Outlook pour Windows sans gêner la lecture.
5. **Émojis plutôt qu'images** pour les pastilles et les pictogrammes : aucune image à héberger en dehors du logo (RG-002).
6. **Rien de réglable par le rédacteur** dans l'apparence (EX-007) : il choisit des blocs, pas des couleurs ni des tailles.

## 2. Palette

| Rôle | Couleur | Usage |
|---|---|---|
| Fond de page | #f4f4f8 | Autour de la carte |
| Carte | #ffffff | Fond du mail, coins arrondis 20 px |
| Bleu en-tête | #263f9d | Bandeau d'en-tête |
| Bleu titre | #383288 | Salutation, accroche, mise en valeur, bouton, clôture, signature, liens |
| Vert | #7ab850 | Filet sous l'en-tête, barre de l'accroche, bordure des pastilles vertes, puces |
| Vert foncé | #467d1e | Surtitre des sections à pastille bleue (#5f9e2f dans le modèle, foncé pour le contraste, décision du 11/10/2026) |
| Texte | #2a2a3a | Texte courant |
| Texte secondaire | #55607a | Note |
| Lien de secours | #5f6f8c | Ligne « ou : adresse » sous un bouton (#6b7f9e dans le modèle, foncé pour le contraste, décision du 11/10/2026) |
| Trait | #e2e0ee | Trait du fil, séparateur, cadre du bloc Date et lieu |
| Fond pastille verte | #e6f3dc | Pastilles impaires |
| Fond pastille bleue | #ebe9f7 | Pastilles paires, fond de l'encadré Important |

Sept couleurs de fond et de texte au plus, contre huit couleurs de fond dans la trame de départ (spécimen 01 du cadrage).

## 3. Typographie

| Élément | Taille | Interligne | Graisse | Couleur |
|---|---|---|---|---|
| Salutation | 25 px | 1,25 | gras (titre `h1`) | Bleu titre |
| Accroche | 18 px | 1,6 | 700 | Bleu titre |
| Paragraphe | 16 px | 1,6 | normale | Texte |
| Note | 15 px | 1,6 | normale | Texte secondaire |
| Surtitre | 12 px, capitales, espacement 1,5 px | — | 800 | Alterné (voir bloc 3) |
| Bouton | 15 px | — | 700 | Blanc sur bleu titre |
| Lien de secours | 12 px | 1,4 | normale | #5f6f8c |
| Clôture | 20 px | 1,4 | 800 | Bleu titre |
| Signature | 15 px | 1,6 | formule normale, signataire en gras | Texte, signataire bleu titre |

## 4. Bibliothèque de blocs

Pour chaque bloc : rôle, rendu dans l'email, rendu dans la version WhatsApp (EX-010) et dans la version texte de secours (EX-013), écriture au format pivot (détail dans `format-pivot.md`).

### Blocs fixes

**1. En-tête** — Bandeau #263f9d, marges 24 / 32 / 22 px, coins hauts arrondis. Logo FCPE à gauche (largeur 134 px, badge blanc intégré à l'image pour le mode sombre), à droite « Représentants des parents d'élèves » (14 px) et « École élémentaire Joliot-Curie » (16 px gras), en blanc. Filet vert de 4 px dessous. Non modifiable (RG-001). WhatsApp et texte : absent. Pivot : rien à écrire.

**2. Salutation** — Titre 25 px bleu titre, marge basse 20 px. Valeur par défaut « Chers parents, ». WhatsApp et texte : la ligne telle quelle. Pivot : première ligne du corps, terminée par une virgule.

### Blocs du fil

**3. Section du fil** — L'unité de construction du mail. Colonne gauche de 46 px avec une pastille ronde de 40 px (émoji 18 px), colonne droite avec le contenu (marges 8 / 0 / 24 / 14 px). Les pastilles alternent : sections impaires vertes (fond #e6f3dc, bordure 2 px #7ab850), sections paires bleues (fond #ebe9f7, bordure 2 px #383288). Un trait vertical de 2 px #e2e0ee relie chaque pastille à la suivante ; la dernière section n'en a pas. Pastille par défaut si aucun émoji n'est trouvé : ℹ️. Nombre de sections : pas de limite technique ; au-delà de 7, l'outil le signale comme conseil de rédaction. WhatsApp : l'émoji puis le surtitre en gras et en capitales sur une ligne ; une section sans surtitre n'a pas de ligne de tête. Texte : surtitre en capitales. Pivot : `## 📅 Surtitre`.

**4. Surtitre** — Facultatif, en tête d'une section. 12 px, capitales, espacement 1,5 px, graisse 800, marge basse 10 px. Couleur opposée à celle de la pastille : bleu titre sur une section verte, vert foncé sur une section bleue. Conseil : 40 caractères au plus.

**5. Accroche** — Paragraphe mis en avant, normalement la première section. Barre verticale verte de 5 px à gauche, texte 18 px gras bleu titre, retrait 18 px. Une seule par mail conseillée. WhatsApp : en gras. Pivot : `> texte`.

**6. Paragraphe** — Texte courant 16 px, marge basse 16 px (0 pour le dernier bloc d'une section). Pivot : texte libre.

**7. Note** — Paragraphe secondaire (précision, confidentialité, post-scriptum), 15 px, couleur texte secondaire. WhatsApp : en italique. Pivot : paragraphe entièrement en italique `*…*`.

**8. Mise en valeur** — Mots en gras bleu titre dans un paragraphe (chiffre, date, échéance). Dans une note, le gras reste de la couleur de la note. WhatsApp : `*…*`. Texte : sans marque. Pivot : `**…**`.

**9. Bouton** — Bouton arrondi (rayon 22 px), fond bleu titre, texte blanc 15 px gras, marges internes 12 / 22 px, terminé par « → ». Toujours suivi d'une ligne « ou : adresse » en 12 px, pour les messageries qui n'affichent pas le bouton et pour pouvoir copier le lien. Contrôle : l'adresse commence par `https://` ou `http://` ; sinon l'outil le signale. Conseil : libellé de 30 caractères au plus, commençant par un verbe. WhatsApp : `👉 Libellé : adresse`. Texte : `Libellé : adresse`. Pivot : `[Libellé →](https://…)` seul sur sa ligne.

**10. Séparateur** — Filet gris 1 px #e2e0ee, marges 4 / 24 px, avant la clôture. WhatsApp et texte : une ligne vide. Pivot : `---`.

**11. Clôture** — Phrase finale 20 px, graisse 800, bleu titre. Conseil : 80 caractères au plus. Pivot : le texte qui suit `---`.

**12. Signature** — Formule de politesse (15 px) puis, à la ligne, le signataire en gras bleu titre. Valeur par défaut « Bien cordialement, / Vos représentants FCPE ». WhatsApp : signataire en gras. Pivot : la formule sur une ligne, le signataire sur la suivante.

### Blocs ajoutés (décision d'étape 2, dessin proposé)

**13. Liste à puces** — Une ligne par élément : puce « ● » verte #7ab850, texte 16 px, 6 px entre éléments. Usage : programme, ordre du jour, liste de sujets. Conseil : 7 éléments au plus. WhatsApp : `• élément`. Texte : `- élément`. Pivot : lignes commençant par `- `.

**14. Encadré Important** — Pour une information à ne pas manquer (grève, fermeture, échéance). Fond #ebe9f7, bordure gauche 5 px bleu titre, coins 6 px, marges internes 14 / 18 px. Titre en surtitre « ⚠️ IMPORTANT » (ou « ATTENTION », « URGENT », « À RETENIR », « À NOTER », « RAPPEL » si le texte l’indique), puis le texte 16 px gras. Conseil : un seul par mail, placé le plus haut possible. WhatsApp : `⚠️ *IMPORTANT*` puis le texte. Pivot : `::: important` … `:::`.

**15. Date et lieu** — Pour une invitation ou un rendez-vous. Cadre 2 px #e2e0ee, coins 14 px, marges internes 14 / 18 px. Première ligne en 18 px graisse 800 bleu titre (la date et l'heure), lignes suivantes en 15 px texte (lieu, précisions). Émojis 📅 et 📍 en tête de ligne conseillés. WhatsApp et texte : les lignes telles quelles. Pivot : `::: date` … `:::`, une information par ligne.

## 5. Mode sombre

Le copier-coller dans Gmail ne permet pas d'imposer un rendu en mode sombre : chaque messagerie inverse les couleurs à sa façon (Doc#8, risque déjà inscrit ; seuil d'acceptation : QO-002). La charte limite les dégâts par construction :
- logo avec badge blanc intégré, lisible sur fond clair comme sur fond sombre ;
- aucun texte blanc sur fond transparent : le blanc n'apparaît que sur l'en-tête et le bouton, qui ont leur propre fond ;
- pastilles et encadrés sur fonds pâles bordés d'une couleur franche, qui restent visibles une fois inversés ;
- aucune information portée par la couleur seule (le surtitre et l'émoji doublent la couleur des pastilles).

Vérification sur appareils réels : étape 3 (Gmail Android, Gmail iPhone, Apple Mail), comme prévu par EX-020.

## 6. Accessibilité (EX-021)

- Contrastes calculés par moi selon la formule des règles d'accessibilité WCAG (non mesurés sur appareil) : texte courant 14,1 pour 1 ; bleu titre 10,6 ; blanc sur l'en-tête 9,2 ; texte secondaire 6,3 ; tous au-dessus du minimum de 4,5. Les deux couleurs du modèle qui restaient sous ce minimum ont été foncées sur décision de Mat (11/10/2026) : le vert des surtitres #5f9e2f devient #467d1e (3,3 → 5,0 pour 1), et le gris de la ligne « ou : adresse » #6b7f9e devient #5f6f8c (4,1 → 5,1 pour 1).
- Texte alternatif « FCPE » sur le logo.
- Ordre de lecture du code identique à l'ordre visuel ; tableaux marqués `role="presentation"` pour que les synthèses vocales ne les lisent pas comme des tableaux de données.
- Les émojis des pastilles sont lus par les synthèses vocales (« calendrier », « cadenas ») ; c'est acceptable mais à surveiller en recette.
