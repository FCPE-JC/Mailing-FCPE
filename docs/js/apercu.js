// Mailing-FCPE : collage du texte et aperçu continu (US-009, US-010 ; EX-003, EX-008, EX-019).
//
// L'écran Écrire reçoit le texte ; l'écran Vérifier affiche l'email rendu, mis à jour à
// chaque modification. L'aperçu est le code exact que la copie du lot 5 mettra dans le
// presse-papier. Le texte ne vit que dans la page : rien n'est enregistré (DEC-071).

import { lirePivot } from './pivot.js';
import { rendreEmail } from './rendu.js';

// Prépare l'aperçu d'un texte : rien si le texte est vide, sinon l'objet, le code de
// l'email et les anomalies notées à la lecture.
export function preparerApercu(texte) {
  if (!String(texte ?? '').trim()) return { vide: true };
  const doc = lirePivot(texte);
  return { vide: false, objet: doc.objet, html: rendreEmail(doc), anomalies: doc.anomalies, doc };
}

// Branche la zone de texte et l'aperçu sur la page.
export function brancherApercu(fenetre) {
  const doc = fenetre.document;
  const zoneTexte = doc.getElementById('texte');
  const zoneApercu = doc.getElementById('apercu');
  const ligneObjet = doc.getElementById('objet');
  const invitation = doc.getElementById('apercu-vide');

  function mettreAJour() {
    const apercu = preparerApercu(zoneTexte.value);
    invitation.hidden = !apercu.vide;
    zoneApercu.hidden = apercu.vide;
    ligneObjet.hidden = apercu.vide;
    if (apercu.vide) {
      zoneApercu.innerHTML = '';
      return;
    }
    ligneObjet.textContent = apercu.objet ? `Objet : ${apercu.objet}` : 'Objet : (aucun objet dans le texte)';
    // Code produit par rendreEmail : tout texte du rédacteur y est échappé (US-011).
    zoneApercu.innerHTML = apercu.html;
  }

  zoneTexte.addEventListener('input', mettreAJour);
  mettreAJour();
}
