// Mailing-FCPE : prompt pour une IA (US-027, EX-014).
//
// Texte copié par le bouton « 🤖 J'utilise une IA : copier le prompt » de l'écran Écrire.
// Il fait écrire à l'IA l'email au format pivot (etape-2/format-pivot.md) ; sa réponse se
// colle telle quelle dans l'outil. Copie exacte de etape-2/prompt-ia.txt, vérifiée par les
// tests : changer les deux fichiers ensemble, lancer « node --test », puis proposer le
// changement par une demande de fusion relue par Mat.
// Surtitre de 60 caractères au plus depuis DEC-108 (40 auparavant), mis à jour au lot 5a (DEC-120).

export const PROMPT_IA = `Tu es chargé de mettre en forme un email des représentants FCPE de l'école élémentaire Joliot-Curie, destiné à tous les parents. Je te donne plus bas mon texte brut. Réécris-le dans le « format pivot » de l'outil Mailing-FCPE, décrit ci-dessous, et réponds uniquement par le résultat, dans un seul bloc de code, sans commentaire avant ni après.

RÈGLES DE FOND
- Garde mon message, mes informations et mon ton. N'invente aucune information : aucune date, heure, lieu, chiffre, nom ou lien qui ne soit pas dans mon texte.
- Tu peux corriger l'orthographe, alléger les phrases trop longues et couper un long paragraphe en deux.
- Vouvoie les parents. Reste chaleureux et simple, sans jargon.
- N'ajoute aucune image, et aucun nom d'enfant.

FORMAT PIVOT (respecte-le exactement)
1. Première ligne : « Objet : » suivi d'un objet de 30 à 50 caractères, avec au plus un émoji. Puis une ligne vide.
2. La salutation seule sur sa ligne, terminée par une virgule (par défaut : « Chers parents, »).
3. Le corps est découpé en 3 à 6 sections. Chaque section commence par une ligne :
   ## <un émoji> <un surtitre court>
   L'émoji illustre le thème de la section (🗓️ date, 🏫 école, 🍽️ cantine, 📝 questionnaire, 🔒 confidentialité, 🎉 fête, 🙏 remerciement, 🤝 lien avec les familles, ⚠️ urgence…) ; n'utilise pas deux fois le même. Le surtitre fait 60 caractères au plus et ne finit pas par un point. La première section peut n'avoir qu'un émoji, sans surtitre.
4. Dans une section, sépare les blocs par une ligne vide. Les blocs possibles :
   - un paragraphe ordinaire ;
   - une accroche, une seule dans l'email, dans la première section : une ligne qui commence par « > » ;
   - un mot ou un chiffre important en gras : **comme ceci** (dates, échéances, chiffres clés ; pas plus de deux par paragraphe) ;
   - une note discrète (précision, confidentialité, post-scriptum) : le paragraphe entier entre deux étoiles simples, *comme ceci* ;
   - une liste : chaque élément sur sa ligne, commençant par « - » ;
   - un bouton, pour chaque lien sur lequel les parents doivent agir : seul sur sa ligne, [Libellé qui commence par un verbe →](adresse), libellé de 30 caractères au plus ; l'adresse est recopiée exactement ;
   - un encadré pour une information à ne pas manquer, un seul au plus :
     ::: important
     texte
     :::
   - un bloc date et lieu pour un rendez-vous, une information par ligne :
     ::: date
     🗓️ jour et heure
     📍 lieu
     :::
5. Après la dernière section : une ligne « --- », puis une phrase de clôture courte (80 caractères au plus).
6. Puis une ligne vide, la formule de politesse terminée par une virgule (par défaut : « Bien cordialement, »), et sur la ligne suivante le signataire (par défaut : « Vos représentants FCPE »).
N'utilise aucune autre syntaxe : pas de titre « # », pas de tableau, pas d'italique au milieu d'une phrase, pas de HTML.

EXEMPLE DE RÉSULTAT ATTENDU
\`\`\`
Objet : Merci pour votre confiance 🗳️

Chers parents,

## 🙏
> Nous tenions à vous remercier sincèrement pour votre participation aux élections et pour la confiance que vous nous avez accordée.

## 🏫 Au conseil d'école
Avec **10 sièges sur 17** au conseil d'école, nous continuerons à faire entendre vos préoccupations.

## 🗓️ Lundi 12 octobre · Mairie
Nous rencontrerons la mairie le **lundi 12 octobre** au sujet du périscolaire. Pour préparer ce rendez-vous, donnez-nous votre avis :
[Répondre au questionnaire →](https://forms.gle/exemple)

## 🔒 Anonyme
*Vos réponses sont anonymes.*

---
Encore merci pour votre confiance ✨

Bien cordialement,
Vos représentants FCPE
\`\`\`

MON TEXTE BRUT
(colle ton texte ici, à la place de cette ligne)
`;
