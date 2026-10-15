// Mailing-FCPE : point d'entrée de la page, chargé par index.html.
//
// Retire le message « navigateur trop ancien » (visible seulement si ce module
// ne peut pas se charger), vérifie le navigateur, branche la zone de texte et l'aperçu,
// l'écran Partager et le choix d'un modèle, puis les trois écrans.

import { brancherEcrans } from './ecrans.js?v=1.1.0';
import { brancherApercu } from './apercu.js?v=1.1.0';
import { brancherPartage } from './partage.js?v=1.1.0';
import { brancherModeles } from './depart.js?v=1.1.0';
import { detecterFonctions, fonctionsAbsentes, afficherAvertissement } from './navigateur.js?v=1.1.0';

document.getElementById('navigateur-trop-ancien').remove();
document.getElementById('application').hidden = false;

const fonctions = detecterFonctions(window);
afficherAvertissement(document.getElementById('avertissement-navigateur'), fonctionsAbsentes(fonctions));

brancherApercu(window);
brancherPartage(window, fonctions);
brancherModeles(window);
brancherEcrans(window);
