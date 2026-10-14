// Mailing-FCPE : modèles types (DEC-069, TEC-003 ; EX-002, EX-025 ; US-032, US-033).
//
// Les cinq modèles types du cahier des charges (remerciement, invitation, préparation
// du conseil d'école, appel à témoignages, information urgente), écrits au format pivot
// (etape-2/format-pivot.md) à partir des spécimens fictifs de l'étape 2
// (etape-2/specimens/01 à 05). Le rédacteur part d'un modèle et le complète.
//
// Chaque modèle commence par son objet type (ligne « Objet : »). Les passages à compléter
// sont entre crochets, par exemple [date] : l'outil les signale tant qu'il en reste
// (US-034). Dans une adresse, le passage à compléter ne contient pas d'espace :
// https://[adresse].
//
// Pour ajouter ou modifier un modèle : changer ce fichier, lancer les tests
// (« node --test »), puis proposer le changement par une demande de fusion relue par Mat.
//
// Forme de chaque modèle :
//   { identifiant: 'invitation', nom: 'Invitation', pivot: `…texte au format pivot…` }

export const MODELES = Object.freeze([
  Object.freeze({
    identifiant: 'remerciement',
    nom: 'Remerciement',
    pivot: `Objet : Merci pour [l'événement] 🎉

Chers parents,

## 🙏
> Un immense merci à toutes les familles qui ont fait de [l'événement] du [date] une très belle réussite !

## 🎉 Grâce à vous
Grâce à vous, nous avons [ce que l'événement a permis], qui servira à [à quoi].

Merci aussi aux bénévoles qui ont [ce qu'ils ont fait].

## 📸 Les photos
Les photos (sans enfants) sont à retrouver ici :
[Voir les photos →](https://[adresse])

---
À l'année prochaine !

Amicalement,
Vos représentants FCPE`,
  }),
  Object.freeze({
    identifiant: 'invitation',
    nom: 'Invitation',
    pivot: `Objet : Invitation : [événement] le [date]

Chers parents,

## ☕
> Nous avons le plaisir de vous inviter à [événement].

## 🗓️ Rendez-vous
::: date
🗓️ [Jour et date] à [heure]
📍 [Lieu]
:::

Ce sera l'occasion de [but de la rencontre].

## 📝 Au programme
- [Premier point]
- [Deuxième point]
- Vos questions

## 🤝 Votre venue
Pour nous aider à nous organiser, merci d'indiquer votre venue :
[Indiquer ma venue →](https://[adresse])

---
Au plaisir de vous y retrouver !

Bien cordialement,
Vos représentants FCPE`,
  }),
  Object.freeze({
    identifiant: 'conseil-ecole',
    nom: "Préparation du conseil d'école",
    pivot: `Objet : Conseil d'école du [date] : vos questions

Chers parents,

## 🏫
> Le prochain conseil d'école aura lieu le [jour et date]. Vos représentants y porteront vos questions et vos remarques.

## 📝 Les sujets déjà prévus
- [Premier sujet]
- [Deuxième sujet]
- [Troisième sujet]

## 🗣️ Vos questions
Vous souhaitez aborder un autre sujet ? Faites-le-nous savoir avant le [date limite] grâce à ce formulaire :
[Poser ma question →](https://[adresse])

::: important
Seules les questions reçues avant le [date limite] pourront être transmises.
:::

## 📢 Après le conseil
Le compte rendu vous sera envoyé dans les jours qui suivent le conseil.

---
Merci pour votre participation !

Cordialement,
Vos représentants FCPE`,
  }),
  Object.freeze({
    identifiant: 'temoignages',
    nom: 'Appel à témoignages',
    pivot: `Objet : Votre avis sur [le sujet]

Chers parents,

## 📝
> Plusieurs familles nous ont fait part de remarques sur [le sujet].

## 🗣️ Votre avis compte
Avant notre rendez-vous avec [l'interlocuteur], nous aimerions recueillir le plus de témoignages possible : [les points à aborder].

Vous pouvez répondre en quelques minutes ici :
[Donner mon avis →](https://[adresse])

## 🔒 Anonyme
*Le questionnaire est anonyme : aucune adresse email ni aucun nom d'enfant ne vous sera demandé.*

## 📢 La suite
Nous vous présenterons une synthèse des réponses avant le [date].

---
Merci d'avance pour votre aide 🙏

Bien à vous,
Vos représentants FCPE`,
  }),
  Object.freeze({
    identifiant: 'information-urgente',
    nom: 'Information urgente',
    pivot: `Objet : ⚠️ [Sujet] : information importante

Chers parents,

## ⚠️
::: important
[L'information principale, avec la date]
:::

## 🏫 Ce qui est prévu
[Ce qui est mis en place à la place, avec les horaires et le lieu]

## 📄 Plus d'informations
Retrouvez toutes les informations ici :
[Lire l'information →](https://[adresse])

---
Nous vous tiendrons informés si la situation évolue.

Bon courage à tous,
Vos représentants FCPE`,
  }),
]);
