# Résultats des tests T1 et T2

Consignés par Claude à partir des messages de Mat dans le fil « Étape 3 : tests de faisabilité ». Rien n'est déduit : ce qui n'a pas été rapporté est noté « non rapporté ».

## T1 : copie vers Gmail

| Code | Date | Résultat global (Mat) | Message de la page | Détail par point | Captures |
|---|---|---|---|---|---|
| T1-W1 (Windows, Chrome, bouton, page en ligne) | 11/10/2026 18:48 | OK | « Copié par la méthode moderne » | Vu sur la capture de la fenêtre de rédaction : en-tête bleu, logo, filet vert, salutation, pastilles et trait du fil, barre de l'accroche, surtitre en capitales, mise en valeur, liste à puces vertes, fond gris autour de l'email, coins arrondis. Encadré, bloc date, bouton, note, clôture et signature : hors de la capture, non vérifiés. | `captures/T1-W1-message-page.png`, `captures/T1-W1-redaction-gmail.png` |
| T1-W2 (Windows, Edge, bouton, page en ligne) | 11/10/2026 18:52 | OK | « Copié par la méthode moderne » | Même rendu que T1-W1 sur la partie visible ; le haut de l'encadré (surtitre « Encadré », fond violet clair) apparaît aussi. Bloc date, bouton, note, clôture et signature : hors de la capture, non vérifiés. | `captures/T1-W2-message-page.png`, `captures/T1-W2-redaction-gmail.png` |
| T1-W3 (Windows, Chrome, sélection à la main, page en ligne) | 11/10/2026 18:54 | OK | « Email sélectionné » (copie par Ctrl+C) | Même rendu sur la partie visible, à une différence près : le bandeau bleu de l'en-tête commence tout en haut de la carte, alors qu'en T1-W1 et T1-W2 une fine bande blanche arrondie apparaît au-dessus. Cause non recherchée (constat seulement). Bas de l'email non vérifié. | `captures/T1-W3-message-page.png`, `captures/T1-W3-redaction-gmail.png` |

**Bas de l'email** (capture envoyée par Mat le 11/10/2026 à 18:55, ligne T1 non précisée ; `captures/T1-bas-email-recu.png`) : fin de l'encadré, surtitre et pastille du rendez-vous, bloc Date et lieu, paragraphe, bouton arrondi et lien de secours, note grise, filet séparateur, clôture, signature et coins arrondis du bas : tous présents et conformes à la charte. Constat à vérifier : le titre du bloc date et la clôture semblent écrits dans une police plus large et plus grasse que dans le rendu de référence (Arial gras) ; cause non recherchée.

Premiers enseignements (vérifiés sur T1-W1 à T1-W3) : la copie par la méthode moderne du presse-papier fonctionne depuis une page claude.ai dans Chrome et dans Edge sous Windows ; le fichier de secours n'a pas été nécessaire. La sélection à la main donne le même rendu, à la bande blanche près au-dessus de l'en-tête.

## T2 : réception

| Code | Date | Messagerie (à confirmer) | Mode | Email regardé | Constat (lu sur la capture) | Capture |
|---|---|---|---|---|---|---|
| T2-OA | 11/10/2026 19:52 | Outlook, Android (confirmé par Mat à 19:54) ; email transféré (préfixe « Fw: »), source du transfert non précisée | Clair | « Fw: [Test] T1-W3 », donc un transfert de l'email copié à la main | Email entier présent et adapté à la largeur du téléphone : logo, en-tête bleu, filet vert, pastilles et trait, accroche, liste, encadré, bloc date, bouton et lien de secours, note, filet, clôture, signature. Deux constats : le texte de droite de l'en-tête passe sur six lignes étroites, parce que la colonne du logo garde sa largeur fixe ; la police diffère de l'Arial du modèle (police de l'application). | `captures/T2-android-clair-1.jpg` |

| T2-OA | 11/10/2026 19:54 | Outlook, Android (confirmé par Mat) | Sombre | « Fw: [Test] T1-W3 » | Inversion complète des couleurs par l'application : fond de la carte noir, texte blanc, titres et clôture en lavande. Restent lisibles : logo (son badge blanc le protège), en-tête bleu, texte courant, liste, encadré (fond gris foncé), bloc date (fond noir, bordure blanche), bouton (violet éclairci), note (gris). Affaiblis : filet vert sous l'en-tête et barre de l'accroche, passés en vert très sombre, peu visibles ; intérieur des pastilles assombri. Rien d'illisible ni de manquant. | `captures/T2-android-sombre-1.jpg` |
| T2-GA | 11/10/2026 19:57 | Gmail, Android (application reconnue sur la capture) | Clair | « [Test] T1-W3 » reçu directement (envoyé à 20:54 heure du téléphone) | Email entier, adapté à la largeur : logo, en-tête bleu, filet vert, pastilles et trait, accroche avec sa barre, liste, encadré, bloc date, bouton et lien de secours, note, filet, clôture, signature. Mêmes constats qu'Outlook : texte de l'en-tête sur six lignes étroites, police de l'application (Roboto) au lieu d'Arial. | `captures/T2-GA-clair.jpg` (ligne de l'expéditeur masquée par Claude) |
| T2-GA | 11/10/2026 19:57 | Gmail, Android | Sombre | Même email | Gmail inverse les fonds : carte noire, texte blanc, titres en lavande. En-tête bleu, logo (badge blanc), filet vert sous l'en-tête et barre verte de l'accroche restent bien visibles, contrairement à Outlook. Encadré, bloc date (bordure grise), bouton violet, note grise : lisibles. Rien d'illisible ni de manquant. | `captures/T2-GA-sombre.jpg` (ligne de l'expéditeur masquée) |

## Appareils Apple (T1-M1 à M3, T2-GI, T2-AM)

12/10/2026, 08:44, message de Mat : « Je n'ai pas les screenshot, mais on me confirme que l'émission et la réception des mails depuis et vers des devices apple (mac / iphone) se sont bien déroulés. »

Consigné comme **rapporté, non vérifié par capture**. Non précisés : navigateurs et méthode de copie utilisés sur Mac, messageries de l'iPhone (Gmail, Mail d'Apple), mode sombre sur iPhone. Ces points restent à confirmer en recette (étape 6) si Mat ne les précise pas.

## Volet bénévoles (T2-B1 à B3)

12/10/2026, 08:46, arbitrage de Mat : volet considéré comme couvert, « car 3 clients de messagerie différents ont donné un résultat positif » (Gmail, Outlook, Mail d'Apple). Les bénévoles n'ont pas été sollicités. La messagerie Orange n'a pas été essayée : elle reste à couvrir par QO-003 en recette (étape 6). À transmettre au fil Documents de référence pour Doc#4.

## Essai facultatif T1-S : collage dans une messagerie du téléphone

12/10/2026, 13:38, rapporté par Mat, sans capture : « le collage direct dans l'application du téléphone ne donne pas le résultat attendu (uniquement le texte brut est collé), mais coller le HTML dans gmail via le navigateur avec la version ordinateur fonctionne très bien. »

Constat : l'application Gmail du téléphone perd la mise en forme ; Gmail ouvert dans le navigateur du téléphone, en version ordinateur, la garde. Non précisés : téléphone (Android ou iPhone), navigateur, rendu chez le destinataire. Essai d'information seulement ; il ne modifie pas le cadrage (envoi depuis un ordinateur).
