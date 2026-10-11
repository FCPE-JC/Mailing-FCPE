# Étape 3 : plan des tests T1 (copie vers Gmail) et T2 (réception et mode sombre), v0.1

11 octobre 2026. Rédigé par Claude, à valider par Mat avant que j'écrive la page de test.

## Ce que chaque test doit établir

- **T1, copie vers Gmail (EX-009).** Un bouton « Copier » dans une page web met-il l'email dans le presse-papier de façon que Gmail le colle sans perte de mise en forme, logo compris ? Et la charte « styles en ligne seulement » tient-elle au collage ?
- **T2, réception (QO-002 constat, QO-003, EX-020, EX-022).** Que deviennent cet email et son logo chez le destinataire, en mode clair et en mode sombre, selon la messagerie ?

Les deux tests se suivent : l'email collé et envoyé en T1 est celui qu'on regarde en T2.

## L'email de test

Un email fictif, construit avec la charte de l'étape 2, qui contient **les quinze blocs** de la bibliothèque (en-tête, salutation, sections avec pastilles, surtitres, accroche, paragraphes, note, mise en valeur, liste, encadré Important, Date et lieu, bouton, séparateur, clôture, signature). Objet : « [Test] Mailing-FCPE, rendu de l'email ». Le texte dit qu'il s'agit d'un test et n'appelle aucune action ; les liens pointent vers des adresses d'exemple.

Le mail de référence d'octobre ne contient que douze blocs : un email complet couvre aussi la liste, l'encadré et le bloc Date et lieu.

## La page de test

Une page privée sur claude.ai, et le même fichier à télécharger pour l'ouvrir directement. Elle affiche l'email et deux façons de le copier :
1. **Bouton « Copier l'email »** : la page écrit l'email dans le presse-papier, en version mise en forme et en version texte. Si la méthode moderne du navigateur est refusée, la page essaie l'ancienne méthode et affiche laquelle a fonctionné, ou le message d'erreur exact.
2. **Sélection à la main** : un bouton « Tout sélectionner » sélectionne l'email ; tu fais Ctrl+C (Cmd+C sur Mac).

La page n'envoie rien et ne conserve rien.

## Ce que tu fais pour T1 (ordinateur)

Pour chaque ligne du tableau : ouvrir la page, copier, ouvrir un nouveau message dans Gmail web, coller, mettre en objet le code de la ligne (par exemple « [Test] T1-W1 »), et envoyer.

| Code | Ordinateur | Navigateur | Copie |
|---|---|---|---|
| T1-W1 | Windows | Chrome | Bouton |
| T1-W2 | Windows | Edge | Bouton |
| T1-W3 | Windows | Chrome | Sélection à la main |
| T1-M1 | Mac | Safari | Bouton |
| T1-M2 | Mac | Chrome | Bouton |
| T1-M3 | Mac | Safari | Sélection à la main |

Si le bouton échoue sur la page claude.ai, refais la même ligne avec le fichier téléchargé et note-le (« T1-W1 fichier »). Huit à dix envois au plus, une vingtaine de minutes.

À noter pour chaque ligne, dans la fiche de résultats fournie avec la page : message affiché par le bouton ; dans la fenêtre de rédaction de Gmail, l'en-tête bleu, le logo, les pastilles et le trait du fil, les couleurs, le bouton, l'encadré ; une capture de la fenêtre de rédaction.

## Ce que tu fais pour T2 (téléphones, et bénévoles)

T2 utilise l'email T1-W1, renvoyé une fois à toutes les adresses de test (en Cci).

| Code | Messagerie | Appareil | Qui |
|---|---|---|---|
| T2-G0 | Gmail web | Ordinateur | Mat (référence) |
| T2-GA | Gmail | Android | Mat |
| T2-GI | Gmail | iPhone | Mat |
| T2-AM | Mail d'Apple (Apple Mail) | iPhone | Mat |
| T2-B1 à B3 | Outlook, Orange ou autre | Au choix | Deux ou trois bénévoles |

Pour chaque ligne : une capture en mode clair et une en mode sombre, l'email ouvert en entier (deux captures si l'email est long). La fiche donne la liste des points à regarder : logo visible, en-tête bleu, lisibilité du texte, pastilles, bouton, encadré, largeur sur téléphone.

**Données personnelles.** Les captures ne doivent montrer ni adresse email ni nom : recadre-les sous la ligne de l'expéditeur avant de me les envoyer, et demande la même chose aux bénévoles.

## Ce que je fais ensuite

Je lis les captures, je remplis une fiche de résultats par test (OK, partiel, KO, par point regardé), et je rédige les conclusions pour Doc#5, section 1. Pour le mode sombre, je décris ce que chaque messagerie fait (couleurs inversées, partiellement, ou pas du tout), sans fixer de seuil : le seuil reste à l'étape 6 (QO-002).

## Ce que je n'ai pas pu vérifier

- Que la copie par bouton fonctionne depuis une page claude.ai (d'où le fichier de secours).
- Le comportement de Gmail avec un logo intégré dans le code au moment du collage : le constat d'octobre (logo bien reçu) vaut pour Gmail web sur ordinateur, avec une copie dont je ne connais pas le chemin exact.

## Questions à trancher

Réponds par oui ou non à chaque numéro, ou « OK pour tout ».

1. **Boîte d'envoi.** Faire les envois de T1 depuis la boîte Gmail commune de l'association, vers tes propres adresses ? *Je préconise oui : c'est le vrai chemin d'envoi, et un compte Gmail se comporte peut-être différemment selon ses réglages.*
2. **Email de test complet.** Utiliser l'email fictif aux quinze blocs plutôt que le mail de référence d'octobre ? *Je préconise oui : il couvre les trois blocs ajoutés à l'étape 2, et rien de réel ne part chez les bénévoles.*
3. **Firefox.** Laisser Firefox hors du test, sauf si un rédacteur l'utilise ? *Je préconise oui : Chrome, Edge et Safari couvrent l'essentiel, et cela limite les envois.*
