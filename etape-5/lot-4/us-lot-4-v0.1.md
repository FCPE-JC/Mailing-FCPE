# Doc#11 : US du lot 4 (corrections et conseils), v0.1

13 octobre 2026. Proposé par Claude, à valider par Mat. Lot 4 du découpage validé (DEC-075) : changer le type d'un bloc, la pastille et le surtitre ; anomalies signalées ; aide à l'objet (EX-005, EX-006, EX-026, EX-027). L'écran suit la maquette « Vérifier et corriger » de l'étape 2 (`etape-2/maquettes/maquettes-telephone-v0.1.png`). Toutes en priorité haute, version cible V1, statut « À faire ».

Ce que tu pourras essayer à la fin du lot : corriger un email mal détecté, par exemple la pastille 🍽️ de l'invitation, sans retoucher le texte.

| ID proposé | Titre | Description | Exigences liées | Critère de fin |
|---|---|---|---|---|
| US-015 | Voir le type de chaque bloc | En tant que rédacteur, je veux voir dans l'aperçu le type que l'outil a donné à chaque bloc, afin de repérer d'un coup d'œil ce qui est mal reconnu. | EX-005, EX-008 | Chaque bloc de l'aperçu porte une étiquette (Paragraphe, Accroche, Liste…) ; les étiquettes n'apparaissent que dans l'aperçu, jamais dans le code copié au lot 5 ; l'aperçu reste lisible à 320 pixels. |
| US-016 | Changer le type d'un bloc | En tant que rédacteur, je veux toucher un bloc et choisir son type, afin de corriger la détection sans réécrire mon texte. | EX-005 | Un toucher sur un bloc ouvre le panneau « Ce bloc est… » avec les neuf types de la maquette ; chaque changement suit le tableau de conversion ci-dessous ; l'aperçu se met à jour aussitôt ; le panneau se ferme au doigt et au clavier. |
| US-017 | Pastille et surtitre d'une section | En tant que rédacteur, je veux changer d'un clic la pastille d'une section et ajouter ou modifier son surtitre, afin d'obtenir le fil visuel voulu. | EX-027 | Le même panneau propose les onze pastilles de la règle D16 (plus l'émoji déjà écrit s'il est autre) et un champ de surtitre ; un surtitre de plus de 40 caractères donne un conseil, sans être refusé. |
| US-018 | Anomalies et conseils | En tant que rédacteur, je veux voir ce qui semble faux ou améliorable, afin de ne rien envoyer d'abîmé, sans que l'outil corrige quoi que ce soit en silence. | EX-026 | Une ligne « 💡 N conseils » sous l'objet s'ouvre sur la liste ; chaque anomalie relevée par la lecture (lien non valide, encadré non refermé, objet ou signature absents, image refusée) et chaque conseil (plusieurs accroches ou encadrés, section sans surtitre, surtitre trop long) a son message et un test ; toucher un message mène au bloc concerné quand il y en a un. |
| US-019 | Aide à l'objet | En tant que rédacteur, je veux écrire ou corriger l'objet sur l'écran Vérifier et être guidé en direct, afin que les parents ouvrent l'email. | EX-006 | L'objet est un champ modifiable avec son nombre de caractères ; les six contrôles de la section 5 de `regles-detection.md` (présence, longueur, émoji, capitales, ponctuation, mots à risque) ont chacun leur test et leur message ; sans objet, l'outil propose le surtitre de la première section ou le début de l'accroche, que le rédacteur accepte d'un toucher. |
| US-020 | Annuler une correction | En tant que rédacteur, je veux annuler mes dernières corrections, afin d'essayer sans risque. | EX-005 | Le bouton « ↶ Annuler » de la maquette défait les corrections une à une, jusqu'au texte collé ; il est grisé quand il n'y a rien à annuler ; rien n'est enregistré dans le navigateur (DEC-071). |

## Tableau de conversion proposé (US-016)

| Vers | Ce qui se passe |
|---|---|
| Paragraphe, Accroche, Note | Le texte reste le même ; seul l'habillage change. Une liste devient une phrase par élément ; un bouton devient « libellé : adresse » avec un lien simple ; un encadré ou un bloc Date et lieu redevient une ligne par phrase. |
| Titre de section | Le bloc devient le surtitre d'une nouvelle section, qui commence à cet endroit ; refusé, avec un message, au-delà de 60 caractères. À l'inverse, un titre redevenu paragraphe fond sa section dans la précédente. |
| Liste | Une ligne ou une phrase par élément. |
| Bouton | Possible seulement si le bloc contient une adresse web ; le libellé suit la règle D9, modifiable dans le panneau. Sinon le choix est grisé, avec la raison. |
| Important | Le texte entre dans l'encadré, titre « Important ». |
| Date et lieu | Découpé en lignes comme à la règle D12 (virgule après l'heure, point, tiret), avec 🗓️ et 📍. |
| Clôture | Proposé seulement pour le dernier bloc avant la signature ; l'ancienne clôture, s'il y en a une, redevient un paragraphe. |

## Questions pour Mat

Réponds par oui ou non à chaque numéro, ou « OK pour tout ».

1. **Les six US** ci-dessus pour le lot 4 ? *Je préconise oui.* Le « Modèle type » et le prompt IA restent aux lots 6 et 5.
2. **Les corrections réécrivent le pivot.** Dès la première correction, l'écran Écrire montre le texte au format pivot, avec une phrase qui l'explique, au lieu du texte brut collé ? *Je préconise oui : il n'y a qu'une seule version du texte, une correction ne peut pas être perdue en revenant sur Écrire, et l'export du pivot du lot 5 la contiendra.* Sinon, les corrections seraient perdues à chaque retouche du texte.
3. **Étiquettes dans l'aperçu seulement.** Les étiquettes de type (et le contour du bloc touché) ne s'affichent que dans l'aperçu ; le code copié au lot 5 n'en contient aucune ? *Je préconise oui : c'est la maquette, et le critère d'US-010 devient « l'aperçu est le code copié, plus les étiquettes ».*
4. **Le tableau de conversion** ci-dessus ? *Je préconise oui : il ne perd jamais de texte, et un choix impossible est grisé avec sa raison plutôt que refusé en silence.*
5. **Les seuils de l'aide à l'objet** de `regles-detection.md` (30 à 50 caractères conseillés, alerte au-delà de 60, un émoji au plus, moins de la moitié en capitales, une seule ponctuation forte, trois mots à risque) gardés tels quels pour la V1 ? *Je préconise oui : ils ne sont pas mesurés, mais ce sont des conseils, jamais des refus ; la recette (Doc#6) pourra les ajuster.*
6. **Les objets types du modèle choisi** (« Merci pour… », « Invitation : … ») attendent le lot 6, qui apporte les modèles ? *Je préconise oui : au lot 4, seules les deux propositions tirées du texte sont faites.*
