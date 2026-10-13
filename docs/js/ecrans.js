// Mailing-FCPE : passage entre les trois écrans Écrire, Vérifier et Partager (US-001 ; EX-018, EX-019).
//
// L'écran affiché suit l'ancre de l'adresse (#ecrire, #verifier, #partager) : le bouton
// Retour du téléphone ou du navigateur ramène donc à l'écran précédent. L'ancre ne quitte
// jamais l'appareil et rien n'est enregistré (DEC-071).
//
// La logique de parcours (fonctions sans accès à la page) est séparée du branchement
// sur la page, pour être testée par Node.js (tests/ecrans.test.js).

export const ECRANS = Object.freeze([
  Object.freeze({ identifiant: 'ecrire', numero: 1, nom: 'Écrire' }),
  Object.freeze({ identifiant: 'verifier', numero: 2, nom: 'Vérifier' }),
  Object.freeze({ identifiant: 'partager', numero: 3, nom: 'Partager' }),
]);

export const ECRAN_DE_DEPART = 'ecrire';

// Renvoie l'identifiant de l'écran désigné par une ancre (« #verifier »),
// ou l'écran de départ si l'ancre est vide ou inconnue.
export function ecranDepuisAncre(ancre) {
  const identifiant = String(ancre || '').replace(/^#/, '');
  return ECRANS.some(e => e.identifiant === identifiant) ? identifiant : ECRAN_DE_DEPART;
}

// Écran qui suit, ou null après le dernier.
export function ecranSuivant(identifiant) {
  const i = ECRANS.findIndex(e => e.identifiant === identifiant);
  return i >= 0 && i < ECRANS.length - 1 ? ECRANS[i + 1].identifiant : null;
}

// Écran qui précède, ou null avant le premier.
export function ecranPrecedent(identifiant) {
  const i = ECRANS.findIndex(e => e.identifiant === identifiant);
  return i > 0 ? ECRANS[i - 1].identifiant : null;
}

// Branche le parcours sur la page : affiche l'écran de l'ancre, met à jour la barre
// des étapes, et suit les changements d'ancre (liens, boutons, bouton Retour).
export function brancherEcrans(fenetre) {
  const doc = fenetre.document;

  function afficher() {
    const actif = ecranDepuisAncre(fenetre.location.hash);
    for (const e of ECRANS) {
      const section = doc.querySelector(`[data-ecran="${e.identifiant}"]`);
      if (section) section.hidden = e.identifiant !== actif;
      const onglet = doc.querySelector(`[data-etape="${e.identifiant}"]`);
      if (onglet) {
        if (e.identifiant === actif) onglet.setAttribute('aria-current', 'step');
        else onglet.removeAttribute('aria-current');
      }
    }
    const nom = ECRANS.find(e => e.identifiant === actif).nom;
    doc.title = `${nom} · Mailing-FCPE`;
    // Le titre de l'écran reçoit le focus, pour les lecteurs d'écran et le clavier.
    const titre = doc.querySelector(`[data-ecran="${actif}"] h2`);
    if (titre) titre.focus({ preventScroll: true });
    fenetre.scrollTo(0, 0);
  }

  fenetre.addEventListener('hashchange', afficher);
  afficher();
}
