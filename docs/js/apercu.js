// Mailing-FCPE : collage du texte et aperçu continu (US-009, US-010, US-014 ; EX-001, EX-003, EX-008, EX-019).
//
// L'écran Écrire reçoit le texte ; l'écran Vérifier affiche l'email rendu, mis à jour à
// chaque modification. L'aperçu est le code exact que la copie du lot 5 mettra dans le
// presse-papier. Un texte qui contient la syntaxe pivot est lu tel quel ; un texte brut passe
// d'abord par la détection (principe 5 de regles-detection.md). Le texte ne vit que dans la
// page : rien n'est enregistré (DEC-071).

import { lirePivot } from './pivot.js';
import { rendreEmail } from './rendu.js';
import { estPivot, detecterPivot, completerPastilles } from './detection.js';

// Phrase affichée sur l'écran Vérifier selon la lecture faite (US-014).
export const LECTURES = Object.freeze({
  pivot: 'Texte au format pivot, lu tel quel.',
  detection: 'Texte brut, mis en forme automatiquement.',
});

// Prépare l'aperçu d'un texte : rien si le texte est vide, sinon la lecture faite, le pivot,
// l'objet, le code de l'email et les anomalies notées à la lecture.
export function preparerApercu(texte) {
  if (!String(texte ?? '').trim()) return { vide: true };
  const lecture = estPivot(texte) ? 'pivot' : 'detection';
  const pivot = lecture === 'pivot' ? String(texte) : detecterPivot(texte);
  // D16 : pastilles par mots-clés des sections écrites sans émoji.
  const doc = completerPastilles(lirePivot(pivot));
  return { vide: false, lecture, pivot, objet: doc.objet, html: rendreEmail(doc), anomalies: doc.anomalies, doc };
}

// Branche la zone de texte et l'aperçu sur la page.
export function brancherApercu(fenetre) {
  const doc = fenetre.document;
  const zoneTexte = doc.getElementById('texte');
  const zoneApercu = doc.getElementById('apercu');
  const ligneObjet = doc.getElementById('objet');
  const invitation = doc.getElementById('apercu-vide');
  const ligneLecture = doc.getElementById('lecture');

  function mettreAJour() {
    const apercu = preparerApercu(zoneTexte.value);
    invitation.hidden = !apercu.vide;
    zoneApercu.hidden = apercu.vide;
    ligneObjet.hidden = apercu.vide;
    ligneLecture.hidden = apercu.vide;
    if (apercu.vide) {
      zoneApercu.innerHTML = '';
      return;
    }
    ligneLecture.textContent = LECTURES[apercu.lecture];
    ligneObjet.textContent = apercu.objet ? `Objet : ${apercu.objet}` : 'Objet : (aucun objet dans le texte)';
    // Code produit par rendreEmail : tout texte du rédacteur y est échappé (US-011).
    zoneApercu.innerHTML = apercu.html;
  }

  zoneTexte.addEventListener('input', mettreAJour);
  mettreAJour();
}
