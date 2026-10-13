// Mailing-FCPE : point d'entrée de la page, chargé par index.html.
//
// Retire le message « navigateur trop ancien » (visible seulement si ce module
// ne peut pas se charger), vérifie le navigateur, puis branche les trois écrans.

import { brancherEcrans } from './ecrans.js';
import { detecterFonctions, fonctionsAbsentes, afficherAvertissement } from './navigateur.js';

document.getElementById('navigateur-trop-ancien').remove();
document.getElementById('application').hidden = false;

afficherAvertissement(
  document.getElementById('avertissement-navigateur'),
  fonctionsAbsentes(detecterFonctions(window)),
);

brancherEcrans(window);
