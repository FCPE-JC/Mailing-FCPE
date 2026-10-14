# Mailing-FCPE : règles de détection et aide à l'objet, v0.1

11 octobre 2026. Rédigé par Claude, statut **Proposé** (à valider par Mat). Ces règles disent comment l'outil passe d'un texte brut, sans syntaxe, aux blocs de la charte (EX-001, EX-004). Elles produisent un pivot (`format-pivot.md`), que le rédacteur corrige d'un clic (EX-005). Elles deviendront des règles de gestion (RG) de Doc#3 ; les numéros D1 à D16 sont provisoires.

## 1. Principes

1. **Prudence** : dans le doute, un texte reste un paragraphe. Une détection ratée coûte un clic ; une détection abusive (un paragraphe transformé en titre) gêne plus.
2. **Transparence** : l'outil affiche le type de chaque bloc détecté ; rien n'est caché.
3. **Signalement** : ce qui semble faux (lien non valide, encadré non refermé, mail sans signature) est signalé, jamais corrigé en silence.
4. **Pas d'invention** : l'outil ne rédige rien. Il ne crée un surtitre que s'il le tire du texte (une date), et ne choisit d'émoji que pour les pastilles.
5. **Pivot d'abord** : si le texte collé contient déjà la syntaxe pivot (`## `, `::: ` ou une ligne `> `), l'outil le lit comme un pivot (EX-003), sans détection.

## 2. Règles, dans l'ordre d'application

**D1. Préparation.** Les espaces insécables deviennent des espaces simples, les fins de ligne sont uniformisées, les espaces en fin de ligne sont retirées.

**D2. Objet.** Si la première ligne non vide commence par « Objet : » ou « Sujet : », c'est l'objet de l'email ; elle est retirée du corps.

**D3. Découpage en paragraphes.** Une ligne vide sépare deux paragraphes. Une ligne isolée de ses voisines même sans ligne vide :
- une adresse web seule, éventuellement précédée de 👉, ➡️, →, -> (ajout de DEC-100), ou de « Lien : », « Formulaire : », « Inscription : » ;
- une ligne qui commence par une formule de politesse (D5) ;
- le début et la fin d'une suite de lignes à puces (D8).

**D4. Salutation.** Le premier paragraphe est la salutation s'il fait 40 caractères au plus, et s'il finit par une virgule ou commence par « Chers », « Chères », « Cher », « Chère », « Bonjour », « Bonsoir », « Madame », « Mesdames » (« Cher », « Chère » et « Mesdames » ajoutés par DEC-100, comme dans l'outil de travail).

**D5. Signature.** Le premier paragraphe qui commence par une formule de politesse ouvre la signature. Formules reconnues : bien cordialement, cordialement, bien à vous, amicalement, à bientôt, à très bientôt, belle ou bonne journée / soirée / semaine, avec nos salutations, bon courage, merci et à bientôt. La première ligne est la formule ; les lignes et paragraphes suivants forment le signataire. Tout ce qui suit est retiré du corps.

**D6. Clôture.** Le dernier paragraphe avant la signature devient la clôture, précédée d'un séparateur, s'il fait 80 caractères au plus et qu'il reste au moins un autre bloc avant lui.

**D7. Titres.** Un paragraphe d'une seule ligne, qui n'est pas le dernier paragraphe, devient un titre de section dans l'un de ces trois cas :
- il est entièrement en gras (`*Au programme*` dans WhatsApp) et fait 60 caractères au plus, quelle que soit sa ponctuation finale ; c'est le signe le plus sûr d'un titre (ajouté à la relecture de Mat le 11/10/2026) ;
- il fait 50 caractères au plus, ne finit pas par un signe de ponctuation (. , ; : ! ? …) et ne contient aucun mot en gras ;
- il est entièrement en capitales et fait 60 caractères au plus.

Une ligne dont seuls quelques mots sont en gras reste un paragraphe : ce gras-là est une mise en valeur (« Avec *10 sièges sur 17* … »). Un émoji en tête du titre devient la pastille de la section ; le gras et un « : » final sont retirés du surtitre.

**D8. Listes.** Les lignes consécutives qui commencent par `-`, `*`, `•`, `–`, `·`, ou par un numéro suivi de `.` ou `)`, forment une liste à puces.

**D9. Adresses web.** Une adresse seule sur sa ligne (D3) devient un bouton. Son libellé dépend de l'adresse, et reste modifiable :

| Adresse | Libellé proposé |
|---|---|
| forms.gle, docs.google.com/forms, framaforms | Répondre au questionnaire → |
| doodle, framadate | Indiquer mes disponibilités → |
| se termine par .pdf | Lire le document → |
| chat.whatsapp.com | Rejoindre le groupe → |
| autre | Ouvrir le lien → |

Une adresse au milieu d'une phrase reste un lien simple.

**D10. Mise en valeur.** Les marques de WhatsApp sont converties : `*mots*` devient du gras, `_mots_` de l'italique. Les dates (D12) d'un paragraphe ou d'une accroche sont mises en gras, si elles ne le sont pas déjà.

**D11. Encadré Important.** Un paragraphe qui commence par « Important », « Attention », « Urgent », « À retenir », « À noter » ou « Rappel », suivi de « : » ou « ! » (un émoji peut précéder), devient un encadré. Le mot-clé devient le titre de l'encadré, sauf « Important », titre par défaut.

**D12. Dates.** Une date est reconnue sous les formes suivantes :
- « 12 octobre », « 1er mars », « lundi 12 octobre », avec l'année ou sans ;
- « lundi 12/10 » ;
- « 12/10/2026 ».

Une heure est reconnue sous les formes « 8 h 30 », « 18h », « 18:30 ». Un paragraphe de 160 caractères au plus qui contient une date, une heure et un lieu (salle, mairie, école, préau, gymnase, cantine, médiathèque, adresse, lieu, ou 📍) devient un bloc Date et lieu. Il est découpé en lignes à la virgule qui suit l'heure, au point ou au tiret ; la première ligne reçoit 🗓️ et une ligne de lieu reçoit 📍.

**D13. Note.** Un paragraphe entièrement en italique (`_…_`), ou qui commence par « PS », « P.S. », « NB » ou « N.B. », devient une note.

**D14. Regroupement en sections.**
- Si le texte contient au moins un titre (D7), chaque titre ouvre une section, et tout ce qui suit lui appartient jusqu'au titre suivant. Ce qui précède le premier titre forme une première section sans surtitre.
- Sinon (décision de l'étape 2), chaque paragraphe ouvre une section, avec deux exceptions.
  - Un bouton ou une liste rejoint la section du paragraphe qui précède.
  - Une introduction de 80 caractères au plus, terminée par « : » et suivie d'un lien, rejoint la section précédente avec ce lien.

**D15. Accroche.** Si la première section n'a pas de surtitre et ne contient qu'un paragraphe de 300 caractères au plus, ce paragraphe devient l'accroche.

**D16. Pastilles et surtitres de date.**

Une section sans émoji reçoit une pastille selon le premier mot-clé trouvé dans son texte, dans cet ordre de priorité (décision de l'étape 2) :

| Pastille | Mots-clés |
|---|---|
| ⚠️ | urgent, grève, fermeture, annulé, alerte |
| 🗓️ | une date (D12) |
| 🔒 | anonyme, confidentiel |
| 🍽️ | cantine, repas, restauration, menu |
| 📝 | questionnaire, formulaire, sondage, témoignage, avis |
| 🏫 | école, conseil d'école, classe, enseignant, maître, maîtresse |
| 🎉 | fête, kermesse, carnaval, spectacle, goûter |
| 🙏 | merci, remercier |
| 🗳️ | élection, vote, scrutin |
| 📢 | annonce, actualité, nouvelle (DEC-109) |
| 📚 | pédagogique, apprentissage, devoirs, lecture, bibliothèque (DEC-109) |
| 👨‍👩‍👧‍👦 | communauté (DEC-109) |
| 🗣️ | consultation, débat, parole, exprimer (DEC-109) |
| ♻️ | recyclage, collecte, environnement, écologie, durable (DEC-109) |
| 🙋 | bénévole, volontaire, besoin de vous, coup de main (DEC-109) |
| 🤝 | écoute, lien, ensemble, contact, rencontre |
| ℹ️ | aucun mot-clé (pastille neutre) |

Le panneau des pastilles ne propose qu'un calendrier, 🗓️ (📅 retiré à l'essai du lot 5b, car il s'affiche avec une date imprimée sur certains téléphones) ; il accepte aussi tout autre émoji, tapé ou collé (DEC-109). Un émoji déjà utilisé par une section précédente est évité si un autre mot-clé correspond ; sinon il est gardé, car ℹ️ ne vaut que sans aucun mot-clé. Les mots-clés « maître » et « maîtres » sont reconnus au singulier comme au pluriel. (Ces deux précisions corrigent l'outil de travail `detection.py`, DEC-101.) Une section sans surtitre qui contient une date reçoit cette date comme surtitre (« Lundi 12 octobre »). C'est le seul surtitre créé automatiquement, et jamais sur une section de note ni sur une section qui contient un bloc Date et lieu.

## 3. Ce qui reste au rédacteur

La détection ne peut pas deviner les surtitres thématiques (« Au conseil d'école », « Toute l'année ») ni le choix de passer un paragraphe en note. Le résultat est donc plus sobre que le modèle tant que le rédacteur n'a rien ajouté. Il ajoute ces éléments en un clic par section, ou part du pivot produit par une IA (`prompt-ia.txt`), qui sait les rédiger.

## 4. Essais sur six textes

J'ai appliqué ces règles à la lettre, avec un outil de travail écrit pour l'occasion (`outils-de-travail/detection.py`, qui n'est pas le futur outil), aux six textes de `specimens/` :
- le texte WhatsApp réel du mail de référence ;
- cinq spécimens fictifs, un par modèle type.

**Vérifié**, en comparant les rendus aux modèles (`specimens/apercus/`) :
- **Mail de référence, depuis son texte WhatsApp.** Salutation, accroche, bouton et libellé, clôture et signature sont retrouvés, ainsi que les cinq pastilles du modèle (🙏 🏫 🗓️ 🔒 🤝) et le surtitre « Lundi 12 octobre ». Il manque les surtitres thématiques (« Au conseil d'école », « Anonyme », « Toute l'année ») et la note, que le modèle avait ajoutés à la main.
- **Remerciement.** Tout est retrouvé, y compris le post-scriptum en note. Une section reçoit la pastille neutre ℹ️.
- **Invitation.** Le bloc Date et lieu, la liste « Au programme » et le bouton framadate sont retrouvés. Défaut : la pastille 🍽️ de la section programme vient du mot « cantine » dans la liste ; le rédacteur la changera.
- **Conseil d'école.** Le titre, la liste, le bouton, l'encadré Important et la clôture sont retrouvés.
- **Appel à témoignages.** La note d'anonymat (italique WhatsApp) et le bouton sont retrouvés.
- **Information urgente.** L'encadré « Attention », la pastille ⚠️, le bouton « Lire le document » (PDF) et la signature « Bon courage à tous, » sont retrouvés.

Après la correction de D7 (titres en gras), les six textes redonnent exactement le même résultat, et un texte d'essai supplémentaire confirme les trois cas : une ligne entièrement en gras devient un titre, une ligne en gras suivie d'autres lignes reste un paragraphe, un gras partiel reste une mise en valeur.

Ces essais ont fait corriger trois règles en cours de route :
- la formule de politesse est désormais limitée à la première ligne ;
- « bon courage » a été ajouté aux formules ;
- une courte introduction suivie d'un lien rejoint la section précédente.

**Non vérifié** : la détection sur de vrais textes de rédacteurs, autres que le mail de référence. C'est à faire en recette (Doc#6), sur des textes rendus fictifs.

## 5. Aide à l'objet (EX-006)

Les règles ci-dessous sont proposées. Les seuils viennent de mes connaissances sur l'affichage des boîtes de réception ; je ne les ai pas mesurés.

| Contrôle | Règle | Message affiché |
|---|---|---|
| Présence | Objet vide | « Ajoute un objet : sans objet, beaucoup de parents n'ouvriront pas l'email. » |
| Longueur | 30 à 50 caractères conseillés ; alerte au-delà de 60 | « Ton objet sera coupé sur téléphone (environ 35 à 40 caractères visibles). Mets l'essentiel au début. » |
| Émoji | Un émoji au plus, en tête ou en fin | « Un seul émoji suffit. » |
| Capitales | Plus de la moitié des lettres en capitales | « Évite les capitales : elles se lisent comme un cri et attirent les filtres anti-spam. » |
| Ponctuation | « !! », « ?! » ou plus | « Une seule ponctuation forte suffit. » |
| Mots à risque | gratuit, urgent!!!, cliquez ici | « Ce mot peut envoyer l'email dans les indésirables. » |

Si aucun objet n'est écrit, l'outil propose :
- le surtitre de la première section ;
- sinon, le début de l'accroche coupé à 50 caractères ;
- et toujours les objets types du modèle choisi : « Merci pour… », « Invitation : … le … », « Conseil d'école du … : vos questions », « Votre avis sur … », « ⚠️ … : information importante ».

Le rédacteur garde la main.
