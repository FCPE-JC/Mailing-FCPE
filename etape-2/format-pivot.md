# Mailing-FCPE : le format pivot, v0.1

11 octobre 2026. Rédigé par Claude, statut **Proposé** (à valider par Mat). Le format est du Markdown enrichi (DEC-004). La syntaxe des sections, les quatre extensions, la ligne Objet et la lecture des autres blocs ont été décidées par Mat le 11/10/2026 (décisions de l'étape 2). Ce document les précise ligne à ligne.

## 1. À quoi sert le pivot

Le pivot est le texte intermédiaire entre ce que le rédacteur écrit et l'email mis en forme. On peut l'obtenir de trois façons :
- l'écrire à la main ;
- le recevoir d'une IA, grâce au prompt fourni (`prompt-ia.txt`) ;
- le faire produire par l'outil, qui l'obtient en détectant la structure d'un texte brut.

Il sert aussi à reprendre un brouillon plus tard ou sur un autre appareil, sans que l'outil stocke quoi que ce soit (EX-012) : on l'exporte, on le garde où l'on veut (note, WhatsApp à soi-même), on le recolle.

Trois qualités sont visées :
- **lisible tel quel**, y compris dans WhatsApp ou un bloc-notes ;
- **facile à taper sur téléphone** : seuls les caractères `#`, `>`, `*`, `-`, `[`, `]`, `(`, `)` et `:` sont utilisés ;
- **tolérant** : une ligne mal écrite devient un paragraphe, jamais une erreur bloquante.

## 2. Exemple complet

Le mail de référence, au format pivot. Son rendu est `specimens/rendus/00-reference-merci-elections-pivot-redige.html`.

```
Objet : Merci pour votre confiance 🗳️

Chers parents,

## 🙏
> Nous tenions à vous remercier sincèrement pour votre participation aux élections des représentants de parents d’élèves et pour la confiance que vous nous avez accordée 🗳️

## 🏫 Au conseil d’école
Avec **10 sièges sur 17** au conseil d’école, nous sommes heureux de pouvoir continuer à vous représenter…

## 🗓️ Lundi 12 octobre · Mairie
Comme nous vous l’avions indiqué, nous rencontrerons la mairie le **lundi 12 octobre** afin d’échanger au sujet des activités et services périscolaires.

Pour préparer au mieux ce rendez-vous, nous vous invitons à nous faire part de vos questions, remarques et suggestions en remplissant ce formulaire :
[Répondre au questionnaire →](https://forms.gle/exemple-mairie)

## 🔒 Anonyme
*Vos réponses seront anonymes et nous permettront de mieux cerner les besoins des familles…*

## 🤝 Toute l’année
Être parent délégué, c’est avant tout faire le lien entre les familles, l’école et la mairie…

---
Encore merci pour votre confiance ✨

Bien cordialement,
Vos représentants FCPE
```

## 3. Règles d'écriture, dans l'ordre du mail

Une ligne vide sépare deux blocs. Deux lignes qui se suivent sans ligne vide forment un même paragraphe (le retour à la ligne devient une espace), sauf dans les cas où une ligne isolée a un sens propre : bouton, élément de liste, `##`, `---`, `:::`, formule de politesse.

| N° | Bloc | Écriture | Règle de lecture |
|---|---|---|---|
| P1 | Objet | `Objet : texte` | Première ligne non vide, si elle commence par « Objet : » (« Sujet : » est accepté). Facultative. |
| P2 | Salutation | `Chers parents,` | Premier paragraphe, s'il fait 40 caractères au plus et finit par une virgule. Sinon, pas de salutation. |
| P3 | Section | `## 🗓️ Surtitre` | Ouvre une section du fil. Un émoji en tête devient la pastille ; le reste de la ligne devient le surtitre. Les deux sont facultatifs : `## 🙏` (pastille seule), `## Surtitre` (pastille choisie par l'outil), `##` seul (pastille choisie, pas de surtitre). Tout ce qui suit, jusqu'au prochain `##` ou `---`, appartient à la section. |
| P4 | Accroche | `> texte` | Ligne commençant par `>` et une espace. |
| P5 | Paragraphe | texte libre | Tout ce qui n'est pas reconnu autrement. |
| P6 | Note | `*texte entier*` ou `_texte entier_` | Paragraphe entièrement entouré d'étoiles simples ou de tirets bas. |
| P7 | Mise en valeur | `**mots**` | Gras ; `*mots*` ou `_mots_` dans une phrase donnent de l'italique. |
| P8 | Lien simple | `[texte](https://…)` ou adresse nue | Dans une phrase : lien cliquable sans bouton. |
| P9 | Bouton | `[Libellé →](https://…)` | Lien seul sur sa ligne. La flèche est conseillée, pas obligatoire. |
| P10 | Liste | `- élément` | Lignes consécutives commençant par `- ` (`* ` et `• ` sont acceptés). |
| P11 | Encadré Important | `::: important` / texte / `:::` | Le texte entre les deux lignes `:::`. Si sa première ligne est seulement « Attention », « Urgent », « À retenir », « À noter » ou « Rappel », elle devient le titre de l'encadré à la place d'« Important ». |
| P12 | Date et lieu | `::: date` / lignes / `:::` | Une information par ligne ; la première est mise en avant. Exemple : `🗓️ Jeudi 5 novembre à 8 h 30`, `📍 Salle polyvalente`. |
| P13 | Séparateur et clôture | `---` puis la phrase | Ce qui suit le dernier `---` et précède la signature est la clôture. |
| P14 | Signature | `Bien cordialement,` / `Vos représentants FCPE` | Paragraphe qui commence par une formule de politesse connue : bien cordialement, cordialement, bien à vous, amicalement, à bientôt, à très bientôt, belle ou bonne journée / soirée / semaine, avec nos salutations, bon courage, merci et à bientôt. La formule va jusqu'à la première virgule ; le reste est le signataire. |

Contenu placé avant le premier `##` : il forme une première section sans surtitre, dont la pastille est choisie par l'outil.

## 4. Cas limites et tolérance

- **Ligne `:::` non refermée** : l'encadré court jusqu'à la fin du texte, et l'outil signale l'oubli.
- **Bouton dont l'adresse ne commence pas par http** : rendu en paragraphe, et signalé (« lien non valide »).
- **Émoji en tête de surtitre non reconnu** (rare, émoji très récent) : il reste dans le surtitre, et le rédacteur choisit la pastille d'un clic.
- **Plusieurs accroches ou plusieurs encadrés** : acceptés, et signalés comme conseil (un seul conseillé).
- **Pas de signature reconnue** : aucun bloc signature ; l'outil propose la signature par défaut.
- **Markdown non prévu** (`#` titre de niveau 1, `###`, tableaux, images) : lu comme du texte simple ; `###` est traité comme `##`. Les images sont refusées (RG-002).

## 5. Le pivot sert aussi de sortie

L'outil exporte toujours un pivot **normalisé** :
- un bloc par paragraphe, séparé par une ligne vide ;
- les pastilles choisies automatiquement écrites en clair ;
- les choix du rédacteur (type de bloc, libellé de bouton) inscrits dans le texte.

Réimporter ce pivot redonne exactement le même email. Cette propriété est à inscrire en recette (Doc#6).
