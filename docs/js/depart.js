// Mailing-FCPE : partir d'un modèle type (US-032, DEC-125, DEC-127 ; EX-002, EX-019, EX-024).
//
// L'écran Écrire propose les cinq modèles de parametres/modeles.js. Le modèle choisi
// remplit la zone de texte, par le même chemin qu'une saisie : l'aperçu se met à jour.
// Rien n'est conservé dans le navigateur (DEC-071) : un texte déjà écrit n'est remplacé
// qu'après confirmation (DEC-127).

import { MODELES } from '../parametres/modeles.js?v=1.0.0';

export const MESSAGES_MODELE = Object.freeze({
  confirmation: 'Remplacer ton texte par le modèle ? Ton texte actuel sera perdu.',
  choisi: nom => `✓ Modèle « ${nom} » : remplace les passages entre crochets par ton texte, puis touche « Mettre en forme ».`,
});

// Remplit la liste des modèles et branche le choix.
export function brancherModeles(fenetre, modeles = MODELES) {
  const doc = fenetre.document;
  const liste = doc.getElementById('modele');
  const zoneTexte = doc.getElementById('texte');
  const retour = doc.getElementById('retour-ecrire');

  for (const m of modeles) {
    const option = doc.createElement('option');
    option.value = m.identifiant;
    option.textContent = m.nom;
    liste.append(option);
  }

  liste.addEventListener('change', () => {
    const modele = modeles.find(m => m.identifiant === liste.value);
    liste.value = '';
    if (!modele) return;
    if (zoneTexte.value.trim() && zoneTexte.value !== modele.pivot && !fenetre.confirm(MESSAGES_MODELE.confirmation)) return;
    zoneTexte.value = modele.pivot;
    zoneTexte.dispatchEvent(new fenetre.Event('input'));
    retour.textContent = MESSAGES_MODELE.choisi(modele.nom);
  });
}
