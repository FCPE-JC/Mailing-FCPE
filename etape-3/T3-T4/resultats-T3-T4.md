# Étape 3 : résultats T3 et T4

## T3, image d'aperçu

12/10/2026, retours de Mat (une capture des propriétés du fichier sur Android).

- **Enregistrer l'image** : fonctionne très bien.
- **Réception dans WhatsApp** : l'image arrive lisible chez le destinataire.
- **Copier l'image** : le collage dans WhatsApp ne fonctionne pas. Non essayé dans d'autres logiciels.

- **Appareils** : Android, iPhone et PC Windows. L'image se crée sur les trois, iPhone compris : le refus redouté du moteur de Safari (utilisé par tous les navigateurs d'iPhone) ne s'est pas produit.
- **Formats** : plusieurs essais, toutes les versions (longue, 2 et 3 morceaux) fonctionnent. La version longue est jugée la meilleure : elle résiste bien au zoom et a l'avantage de tout réunir sur une seule image.
- **Émojis et logo** : présents dans l'image reçue.
- **Chiffres (Android)** : apercu-test-long.png, 1120 × 2742 px, 387 Ko, enregistrée dans Téléchargements. À titre de comparaison, Chromium sur le serveur donnait 1120 × 2798 px et 400 Ko : la hauteur varie un peu selon les polices du téléphone. Le temps de création n'a pas été relevé.

**Décision de Mat (12/10, 20:00)** : seule l'image longue est conservée dans l'outil, sans découpage (DEC-056, qui complète DEC-052).

**Conclusion T3** : EX-011 est faisable sans bibliothèque, sur les trois appareils. Le circuit qui marche est « Enregistrer » puis envoi depuis la galerie. « Copier l'image » ne colle pas dans WhatsApp. Le partage direct reste à vérifier à la recette (DEC-055, QO-013).

## T4, maquette téléphone

Notes de 1 (pas du tout) à 4 (tout à fait).

| Ligne | Appareil | Durée | Corrections | Q1 lisibilité | Q2 toucher un bloc | Q3 clavier | Q4 boutons de partage | Q5 envie |
|---|---|---|---|---|---|---|---|---|
| T4-A | Android | 1:21 | 9 | 4 | 4 | 4 (corrigé) | 4 | 4 |
| T4-I | iPhone (autre testeuse) | 0:59 | 2 | 4 | 4 | 4 | 4 | 4 |

Q3 était formulée « Le clavier gêne-t-il peu la saisie et la relecture ? » : la double négation rend la note 1 ambiguë. Précision de Mat : « Le clavier ne m'a pas dérangé. Il réduit la fenêtre de modification du texte, mais ça reste OK. » La note se lit donc 4 (pas de gêne).

T4-I (12/10, 20:40) : passage fait par une autre personne sur iPhone, avec la question 3 reformulée et la version WhatsApp corrigée (DEC-057). 2 corrections enregistrées au lieu des 3 demandées (deux blocs et une pastille). Question reformulée dans la maquette pour l'iPhone : « La saisie et la relecture restent-elles confortables avec le clavier ouvert ? »

**Collage dans WhatsApp (Android)** : le texte s'affiche bien, avec les titres en gras et les émojis. Seule gêne de lecture relevée par Mat : certains sauts de ligne du texte initial disparaissent, par exemple entre « vos questions » et « Pour nous aider ».

Cause (vérifiée dans rendu.py, fonction sortie_texte) : les versions WhatsApp et texte ne mettent une ligne vide qu'entre deux sections ; les blocs d'une même section (liste, paragraphe, bouton, date) s'enchaînent sans ligne vide. Le même défaut touche donc la version texte de l'email. Correction validée par Mat (12/10, 20:15, DEC-057) : une ligne vide entre chaque bloc, appliquée dans rendu.py le jour même ; la maquette T4 republiée l'utilise pour le passage sur l'iPhone.
