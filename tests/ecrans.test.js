// US-001 « Trois écrans » (EX-018, EX-019) : parcours Écrire, Vérifier, Partager, avec retour en arrière.
// Le rendu sur téléphone (pas de défilement horizontal) se vérifie à l'essai du lot, sur appareil.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ECRANS, ecranDepuisAncre, ecranSuivant, ecranPrecedent, brancherEcrans } from '../docs/js/ecrans.js';
import { lireDuSite, FauxDocument } from './aides.js';

test('US-001 : les trois écrans existent, dans l’ordre Écrire, Vérifier, Partager', () => {
  assert.deepEqual(ECRANS.map(e => e.nom), ['Écrire', 'Vérifier', 'Partager']);
});

test('US-001 : une ancre vide ou inconnue mène à l’écran Écrire', () => {
  assert.equal(ecranDepuisAncre(''), 'ecrire');
  assert.equal(ecranDepuisAncre('#'), 'ecrire');
  assert.equal(ecranDepuisAncre('#inconnu'), 'ecrire');
  assert.equal(ecranDepuisAncre(undefined), 'ecrire');
  assert.equal(ecranDepuisAncre('#verifier'), 'verifier');
  assert.equal(ecranDepuisAncre('#partager'), 'partager');
});

test('US-001 : on avance et on revient d’un écran à l’autre', () => {
  assert.equal(ecranSuivant('ecrire'), 'verifier');
  assert.equal(ecranSuivant('verifier'), 'partager');
  assert.equal(ecranSuivant('partager'), null);
  assert.equal(ecranPrecedent('partager'), 'verifier');
  assert.equal(ecranPrecedent('verifier'), 'ecrire');
  assert.equal(ecranPrecedent('ecrire'), null);
});

test('US-001 : la page contient les trois écrans et la barre des étapes', () => {
  const html = lireDuSite('index.html');
  for (const e of ECRANS) {
    assert.match(html, new RegExp(`data-ecran="${e.identifiant}"`), `écran ${e.nom} absent`);
    assert.match(html, new RegExp(`href="#${e.identifiant}" data-etape="${e.identifiant}"`), `étape ${e.nom} absente de la barre`);
  }
});

test('US-001 : chaque écran a ses boutons Suivant et Retour vers les bons écrans', () => {
  const html = lireDuSite('index.html');
  for (const e of ECRANS) {
    const debut = html.indexOf(`data-ecran="${e.identifiant}"`);
    const section = html.slice(debut, html.indexOf('</section>', debut));
    const suivant = ecranSuivant(e.identifiant);
    const precedent = ecranPrecedent(e.identifiant);
    if (suivant) assert.match(section, new RegExp(`class="bouton" href="#${suivant}"`), `${e.nom} : bouton Suivant`);
    if (precedent) assert.match(section, new RegExp(`class="bouton bouton-second" href="#${precedent}"`), `${e.nom} : bouton Retour`);
  }
});

test('US-001 : la page affiche l’écran de l’ancre et suit le bouton Retour', () => {
  const doc = new FauxDocument();
  const sections = {};
  const onglets = {};
  const titres = {};
  for (const e of ECRANS) {
    sections[e.identifiant] = doc.enregistrer(`[data-ecran="${e.identifiant}"]`, doc.createElement('section'));
    onglets[e.identifiant] = doc.enregistrer(`[data-etape="${e.identifiant}"]`, doc.createElement('a'));
    titres[e.identifiant] = doc.enregistrer(`[data-ecran="${e.identifiant}"] h2`, doc.createElement('h2'));
  }
  const ecouteurs = {};
  const fenetre = {
    document: doc,
    location: { hash: '' },
    addEventListener: (nom, fonction) => { ecouteurs[nom] = fonction; },
    scrollTo: () => {},
  };

  brancherEcrans(fenetre);
  const visibles = () => ECRANS.filter(e => !sections[e.identifiant].hidden).map(e => e.identifiant);
  assert.deepEqual(visibles(), ['ecrire']);
  assert.equal(onglets.ecrire.getAttribute('aria-current'), 'step');
  assert.equal(doc.focus, titres.ecrire);

  fenetre.location.hash = '#partager';
  ecouteurs.hashchange();
  assert.deepEqual(visibles(), ['partager']);
  assert.equal(onglets.partager.getAttribute('aria-current'), 'step');
  assert.equal(onglets.ecrire.getAttribute('aria-current'), null);
  assert.equal(doc.title, 'Partager · Mailing-FCPE');

  // Bouton Retour du téléphone : le navigateur remet l'ancre précédente.
  fenetre.location.hash = '#verifier';
  ecouteurs.hashchange();
  assert.deepEqual(visibles(), ['verifier']);
});

test('US-001 : la feuille de style cache vraiment les écrans masqués', () => {
  // Sans cette règle, « display: grid » des sections l'emporte sur l'attribut hidden
  // et les trois écrans s'affichent l'un sous l'autre (constaté au contrôle du lot 1).
  assert.match(lireDuSite('style.css'), /\[hidden\]\s*\{\s*display:\s*none\s*!important;\s*\}/);
});
