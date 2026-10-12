# Étape 3 : synthèse des tests de faisabilité, v0.1

12 octobre 2026. Rédigée par Claude, à valider par Mat. Après ta validation, j'envoie les mises à jour au fil Documents de référence, seul autorisé à écrire dans les documents.

Sources : `etape-3/T1-T2/resultats-T1-T2.md` et `etape-3/T3-T4/resultats-T3-T4.md`. Chaque constat y est daté et marqué « vérifié par capture » ou « rapporté ».

## En bref

Les quatre tests sont faits et aucun n'a bloqué. L'email se copie vers Gmail d'un geste, arrive lisible dans Gmail, Outlook et Mail d'Apple, en clair comme en sombre. L'image d'aperçu se crée sans bibliothèque sur les trois appareils, et la rédaction sur téléphone a reçu la note maximale sur Android et sur iPhone. Deux défauts sont à corriger plus tard : l'en-tête trop étroit sur téléphone, et les sauts de ligne de la version WhatsApp (déjà corrigé, DEC-057).

## Résultats par test

| Test | Question ou exigence | Résultat | Preuve |
|---|---|---|---|
| T1, copie vers Gmail | EX-009, charte (styles en ligne) | Réussi. Le bouton « Copier » (méthode moderne du presse-papier) fonctionne depuis une page claude.ai dans Chrome et Edge sous Windows ; la sélection à la main donne le même rendu. Mac rapporté réussi. Le fichier de secours n'a pas servi. | Captures T1-W1 à W3 ; Mac rapporté sans capture |
| T1-S, essai facultatif | Information | L'application Gmail du téléphone ne colle que le texte brut ; Gmail ouvert en « version ordinateur » dans le navigateur du téléphone garde la mise en forme. Ne change pas le cadrage (envoi depuis un ordinateur). | Rapporté sans capture |
| T2, réception et mode sombre | QO-002 (constat), QO-003, EX-020, EX-022 | Email complet et lisible dans Gmail Android et Outlook Android, en clair et en sombre ; Mail d'Apple et iPhone rapportés corrects. Mode sombre : Gmail garde le vert ; Outlook l'assombrit (filet sous l'en-tête et barre de l'accroche peu visibles), sans rien d'illisible. Logo présent partout grâce à son badge blanc. Orange non essayée (DEC-051). | Captures T2-OA et T2-GA ; Apple rapporté |
| T3, image d'aperçu | EX-011 | Réussi sur Android, iPhone et PC Windows, sans bibliothèque (DEC-045). Image nette après zoom dans WhatsApp, émojis et logo présents ; 1120 × 2742 px, 387 Ko sur Android. « Enregistrer » puis envoi depuis la galerie fonctionne ; « Copier l'image » ne colle pas dans WhatsApp. L'image longue est retenue seule (DEC-056). | Retours de Mat, capture des propriétés du fichier |
| T4, rédaction sur téléphone | QO-001, EX-019, EX-010, EX-012 | Réussi. Android : 1 min 21, 9 corrections ; iPhone (autre testeuse) : 59 s, 2 corrections. Note 4/4 aux cinq questions sur les deux téléphones (lisibilité, toucher d'un bloc, clavier, boutons de partage, envie de s'en servir). Le clavier réduit la zone de texte, sans gêner. Version WhatsApp correcte (gras, émojis), sauts de ligne corrigés (DEC-057). | Réponses copiées depuis la maquette |

## Défauts relevés, à corriger plus tard

1. **En-tête sur téléphone** (T2, vérifié sur 4 captures) : le texte à droite du logo passe sur six lignes étroites, parce que la colonne du logo garde sa largeur fixe de 150 pixels. Correction à étudier à l'étape 4 ou 5 ; la piste n'est pas choisie (les styles « réactifs » ne survivent pas forcément au collage dans Gmail).
2. **Police du titre de date et de la clôture** (T1, constat sur une capture) : ils semblent plus larges que l'Arial gras du modèle. Cause non recherchée ; à revoir pendant le développement.
3. **Sauts de ligne de la version WhatsApp** (T4) : corrigé le 12/10 dans `rendu.py` (DEC-057), vérifié sur la capture iPhone.
4. **Émoji 📅 trompeur** (T4, capture iPhone) : il s'affiche comme une page de calendrier portant une date imprimée (« FEB 24 »), à côté de la vraie date de l'événement. L'émoji 🗓️ (calendrier à spirale) ne porte en principe pas de date : c'est déduit des jeux d'émojis courants, non vérifié.

## Mises à jour proposées des documents

### Doc#5, section 1 (résultats des tests de faisabilité)

Ajouter le tableau « Résultats par test » ci-dessus, puis ces enseignements techniques :
- La copie de l'email en HTML par l'API du presse-papier (`navigator.clipboard.write`, texte HTML et texte brut) fonctionne dans Chrome et Edge ; « styles en ligne seulement » est confirmé comme suffisant pour Gmail (fait rapporté au cadrage, désormais vérifié).
- L'image d'aperçu se construit sans bibliothèque : l'email est placé dans une image SVG (`foreignObject`), dessinée dans un canevas, puis exportée en PNG à l'échelle 2. Le refus redouté du moteur de Safari ne s'est pas produit.
- Le copier-coller d'une image vers WhatsApp ne fonctionne pas ; l'enregistrement du fichier, si.
- Le partage direct (bouton Partager du téléphone) n'a pas pu être testé depuis claude.ai (QO-013).

### Doc#6, cahier de recette, section « Stratégie de recette »

Remplacer l'ajout du lancement par : « Tests de faisabilité de l'étape 3 (11 et 12/10/2026), faits par Mat et une autre testeuse : PC Windows (Chrome, Edge), Mac, téléphone Android (Gmail, Outlook), iPhone. Le volet bénévoles a été jugé couvert par trois messageries (DEC-051). À couvrir en recette (étape 6) : messagerie Orange (QO-003), partage direct de l'image (QO-013), Mac et iPhone avec captures, mode sombre sur iPhone. Jeu de spécimens : le mail de référence, les cinq spécimens fictifs de l'étape 2 et l'email de test aux quinze blocs (`etape-3/T1-T2/email-test-15-blocs.pivot.md`). Règle des captures : aucune adresse ni nom visible. »

### Doc#12, questions ouvertes

- **QO-001** : « Répondue » (si tu valides la question 1). Réponse : « 12/10/2026, T4 : maquette parcourue en 1 min 21 sur Android et 59 s sur iPhone, note 4/4 aux cinq questions de ressenti ; la rédaction sur téléphone est tenable, pas de repli sur PC seul. »
- **QO-002** : statut inchangé, constat ajouté : « Étape 3 : Gmail Android inverse les fonds et garde le vert ; Outlook Android inverse tout et assombrit le vert (filet et barre peu visibles) ; rien d'illisible. Seuil à fixer à l'étape 6. »
- **QO-003** : inchangée depuis DEC-051 (Orange à l'étape 6).
- **QO-010** : selon ta réponse à la question 2.

### Doc#8, revue de fin d'étape

| Risque | Aujourd'hui | Proposé | Raison |
|---|---|---|---|
| RSK-001, mode sombre | 3 × 2 = 6 forte | 3 × 1 = 3 moyenne | L'inversion est bien constatée (probabilité 3), mais rien n'est devenu illisible sur Gmail ni Outlook (gravité 1). Revue reportée à la fin de l'étape 6 (seuil QO-002). |
| RSK-003, logo absent | 2 × 2 = 4 moyenne | 1 × 2 = 2 faible | Logo affiché dans Gmail, Outlook et Mail d'Apple. Reste Orange. Revue à la fin de l'étape 6. |
| RSK-004, smartphone trop complexe | 2 × 2 = 4 moyenne | 1 × 2 = 2 faible | T4 : 4/4 sur deux téléphones, en une minute environ. Revue à la fin de l'étape 6, sur le vrai outil. |
| RSK-007, mise en forme perdue au collage | 1 × 3 = 3 moyenne | inchangé | Collage réussi sous Windows et rapporté sous Mac ; mais l'application Gmail du téléphone perd la mise en forme (T1-S). Mesure ajoutée : le guide utilisateur dira de coller depuis un ordinateur ou Gmail en version ordinateur. Revue à la fin de l'étape 6. |

Les autres risques ne sont pas touchés par l'étape 3. Aucun nouveau risque.

### Doc#4, Doc#1 et Doc#2

- Doc#4 : tes réponses aux questions ci-dessous, puis la décision de clôture.
- Doc#1, déroulé : étape 3 « Terminée » le 12/10/2026.
- Doc#2 : synthèse de l'étape 3 (ce document, section « En bref »), dépôt : demande de fusion n° 2.

## Réponses de Mat (12/10/2026, 21:11)

1 oui, 3 oui, 4 oui, 5 oui, 6 oui, 7 oui (demande de fusion n° 2 fusionnée). Question 2 : Mat demande des précisions avant de se positionner ; QO-010 reste en attente de sa réponse.

## Questions à trancher

Réponds par oui ou non à chaque numéro, ou « OK pour tout ».

1. **QO-001 répondue.** Considère-t-on que la rédaction complète sur téléphone est tenable, et qu'on ne replie pas sur PC seul ? *Je préconise oui : deux personnes, deux téléphones, note maximale partout.*
2. **QO-010 (ordinateurs personnels ou professionnels).** Renvoyer cette seconde partie à la recette (étape 6), où l'autre rédacteur testera sur son propre ordinateur ? *Je préconise oui, sauf si tu connais déjà la réponse : dans ce cas, donne-la-moi et je la note.*
3. **Bouton de l'image.** L'outil propose seulement « Enregistrer l'image », sans « Copier l'image » ? *Je préconise oui : la copie ne colle pas dans WhatsApp, et un bouton inutile embrouille.*
4. **En-tête sur téléphone.** Inscrire la correction de l'en-tête (texte sur six lignes) comme point à traiter aux étapes 4 et 5, sans choisir la solution maintenant ? *Je préconise oui : la solution dépend de ce que Gmail garde au collage, à vérifier avec l'architecture.*
5. **Revue des risques.** Valider les nouvelles cotations de RSK-001, RSK-003 et RSK-004, et la mesure ajoutée à RSK-007 ? *Je préconise oui.*
6. **Émoji de la date.** Remplacer 📅 par 🗓️ dans la charte, la détection et les rendus ? *Je préconise oui : 📅 affiche une fausse date sur la capture ; 🗓️ ne devrait pas, ce que je fais vérifier en recette.*
7. **Clôture de l'étape 3.** Clore l'étape, dont la condition de sortie est remplie (résultats consignés, QO-001 répondue, QO-003 et QO-010 renvoyées, constat de QO-002 noté, Doc#6 complété, Doc#8 revu) ? *Je préconise oui, une fois la demande de fusion n° 2 relue et fusionnée par toi.*
