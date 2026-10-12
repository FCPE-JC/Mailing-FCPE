# Étape 3 : plan des tests T3 (image d'aperçu) et T4 (rédaction sur téléphone), v0.1

12 octobre 2026. Rédigé par Claude, à valider par Mat avant que j'écrive les pages.

## Ce que chaque test doit établir

- **T3, image d'aperçu (EX-011).** Une page web peut-elle, sans bibliothèque (DEC-045), transformer l'email en image nette, que le rédacteur enregistre puis partage dans WhatsApp ?
- **T4, rédaction sur téléphone (QO-001, EX-019, EX-010, EX-012).** Les trois écrans validés à l'étape 2 (Écrire, Vérifier, Partager) sont-ils utilisables au doigt, sur un petit écran, avec le clavier ouvert ?

Les deux tests se font sur ton téléphone Android et sur l'iPhone ; T3 aussi sur le PC Windows.

## T3 : la page et ce que tu fais

La page affiche l'email de test aux quinze blocs, avec un bouton « Créer l'image ». Le navigateur dessine l'email dans une image PNG (technique sans bibliothèque : l'email est placé dans une image SVG, puis recopié dans un canevas). La page affiche ensuite l'image, ses dimensions, son poids et le temps mis, ou le message d'erreur exact.

1. Toucher « Créer l'image » et noter ce qu'affiche la page.
2. Enregistrer l'image dans la galerie du téléphone, par le bouton « Enregistrer » ou par un appui long sur l'image.
3. L'envoyer dans WhatsApp, à toi-même ou à un groupe de test, puis l'ouvrir dans WhatsApp et zoomer sur un paragraphe.
4. Noter : texte lisible après zoom, émojis présents, logo présent, image coupée ou non.

**Risque connu (déduit, non vérifié)** : Safari, donc l'iPhone, refuse parfois de convertir en image un dessin qui contient du HTML. Si c'est le cas, le refus est un résultat ; je te proposerai alors une bibliothèque, avec sa licence (DEC-045).

**Ce que la page claude.ai ne permet pas de tester** : le bouton « Partager » du téléphone, qui enverrait l'image directement vers WhatsApp. Les pages claude.ai le bloquent. Dans l'outil final, hébergé ailleurs, il devrait fonctionner ; c'est à vérifier à la recette (étape 6), et je le note en question ouverte.

## T4 : la maquette et ce que tu fais

Une maquette cliquable des trois écrans, avec un spécimen fixe et sans détection programmée (DEC-046) :

- **Écrire** : la zone de texte contient le texte brut du spécimen 02 (invitation au café des parents). Tu peux le modifier ou y coller un autre texte pour juger du confort de saisie ; « Mettre en forme » affiche toujours le rendu prévu du spécimen 02.
- **Vérifier** : l'objet avec son compteur et ses conseils ; l'aperçu, où chaque bloc montre son type. Un toucher sur un bloc ouvre un menu (type, pastille, surtitre) ; le choix change l'étiquette et l'allure du bloc, sans recalculer le texte.
- **Partager** : « Copier pour WhatsApp » (la version WhatsApp du spécimen), « Copier le brouillon » (le pivot), « Copier pour Gmail ».

Ce que tu fais : parcourir les trois écrans en chronométrant, corriger deux blocs, changer une pastille, copier la version WhatsApp et la coller dans WhatsApp. Puis tu réponds à cinq questions de ressenti (échelle de 1 à 4) dans la fiche : lisibilité de l'aperçu, facilité à toucher un bloc, gêne du clavier, clarté des boutons de partage, envie de rédiger un vrai email sur téléphone.

## Livrables

Sous `etape-3/T3-T4/` : la page T3, la maquette T4, une fiche de résultats, puis les résultats consignés comme pour T1 et T2. Sources dans une demande de fusion du dépôt.

## Questions à trancher

Réponds par oui ou non à chaque numéro, ou « OK pour tout ».

1. **Format de l'image.** Comparer une image longue (l'email entier) et le même email découpé en deux ou trois images ? *Je préconise oui : WhatsApp compresse fortement les images très hautes, et le découpage pourrait rester plus net. Le test le dira.*
2. **Enregistrement de l'image.** Utiliser la fonction d'enregistrement de la page claude.ai (elle demande ta confirmation) et l'appui long, et renvoyer le bouton « Partager » du téléphone à la recette, comme question ouverte ? *Je préconise oui : c'est ce que la page de test permet, sans rien héberger ailleurs.*
3. **Spécimen de T4.** Utiliser le spécimen 02 (invitation), qui contient un bloc date, un bouton et une liste ? *Je préconise oui : il est court et varié.*
4. **Mesure de T4.** Un chronométrage, plus cinq questions de ressenti notées de 1 à 4 ? *Je préconise oui : c'est assez pour répondre à QO-001 sans alourdir le test.*
5. **Ligne T1-S (question d'hier).** Ajouter un essai facultatif de collage de l'email dans une messagerie du téléphone (Gmail Android, Gmail iPhone, Mail d'Apple) ? *Je préconise oui, comme essai d'information seulement : la page T1 s'ouvre déjà sur téléphone, et le résultat dira si l'envoi depuis un téléphone est envisageable un jour. Il ne change pas le cadrage.*
