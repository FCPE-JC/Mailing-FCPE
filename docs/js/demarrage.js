// Mailing-FCPE : point d'entrée de la page, chargé par index.html.
//
// Retire le message « navigateur trop ancien » (visible seulement si ce module
// ne peut pas se charger), vérifie le navigateur, branche la zone de texte et l'aperçu,
// l'écran Partager, puis les trois écrans.

import { brancherEcrans } from './ecrans.js';
import { brancherApercu } from './apercu.js';
import { brancherPartage } from './partage.js';
import { detecterFonctions, fonctionsAbsentes, afficherAvertissement } from './navigateur.js';

document.getElementById('navigateur-trop-ancien').remove();
document.getElementById('application').hidden = false;

const fonctions = detecterFonctions(window);
afficherAvertissement(document.getElementById('avertissement-navigateur'), fonctionsAbsentes(fonctions));

brancherApercu(window);
brancherPartage(window, fonctions);
brancherEcrans(window);
