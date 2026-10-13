// Mailing-FCPE : fonctions communes aux tests (lecture des fichiers publiés, faux navigateur).
// Ce fichier n'est pas un test : son nom ne finit pas par « .test.js ».

import { readdirSync, readFileSync } from 'node:fs';
import { join, relative, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { brancherApercu } from '../docs/js/apercu.js';

export const RACINE = fileURLToPath(new URL('..', import.meta.url));
export const SITE = join(RACINE, 'docs');

// Tous les fichiers du site publié (dossier docs/), chemins relatifs à docs/.
export function fichiersDuSite(extensions) {
  const resultat = [];
  (function parcourir(dossier) {
    for (const entree of readdirSync(dossier, { withFileTypes: true })) {
      const chemin = join(dossier, entree.name);
      if (entree.isDirectory()) parcourir(chemin);
      else if (!extensions || extensions.includes(extname(entree.name))) resultat.push(relative(SITE, chemin));
    }
  })(SITE);
  return resultat.sort();
}

export function lireDuSite(chemin) {
  return readFileSync(join(SITE, chemin), 'utf8');
}

export function lireDuDepot(chemin) {
  return readFileSync(join(RACINE, chemin), 'utf8');
}

// Faux document, juste assez pour les modules qui écrivent dans la page.
export class FauxElement {
  constructor(document, balise) {
    this.ownerDocument = document;
    this.balise = balise;
    this.enfants = [];
    this.attributs = {};
    this.hidden = false;
    this.className = '';
    this.textContent = '';
    this.aLeFocus = false;
  }
  append(...elements) { this.enfants.push(...elements); }
  replaceChildren(...elements) { this.enfants = elements; }
  setAttribute(nom, valeur) { this.attributs[nom] = String(valeur); }
  getAttribute(nom) { return nom in this.attributs ? this.attributs[nom] : null; }
  removeAttribute(nom) { delete this.attributs[nom]; }
  focus() { this.ownerDocument.focus = this; }
  // Événements : écouteurs enregistrés, déclenchés à la main par les tests.
  addEventListener(nom, fonction) { ((this.ecouteurs ??= {})[nom] ??= []).push(fonction); }
  declencher(nom, evenement = {}) { for (const f of this.ecouteurs?.[nom] ?? []) f(evenement); }
  dispatchEvent(evenement) { this.declencher(evenement.type, evenement); }
  get firstElementChild() { return this.enfants.find(e => typeof e !== 'string') ?? null; }
  // Texte visible de l'élément et de ses enfants.
  get texte() {
    return this.textContent + this.enfants.map(e => (typeof e === 'string' ? e : e.texte)).join('');
  }
}

export class FauxDocument {
  constructor() {
    this.title = '';
    this.focus = null;
    this.selecteurs = {};
  }
  createElement(balise) { return new FauxElement(this, balise); }
  // Les éléments sont enregistrés à l'avance sous leur sélecteur exact.
  enregistrer(selecteur, element) { this.selecteurs[selecteur] = element; return element; }
  querySelector(selecteur) { return this.selecteurs[selecteur] || null; }
  getElementById(id) { return this.selecteurs[`#${id}`] || null; }
}

// Fausse page : un faux document dont les éléments sont enregistrés sous leur id.
export function faussePage(ids) {
  const document = new FauxDocument();
  const elements = {};
  for (const id of ids) {
    const e = document.enregistrer(`#${id}`, new FauxElement(document, 'div'));
    e.id = id;
    e.value = '';
    e.innerHTML = '';
    elements[id] = e;
  }
  return { document, elements, fenetre: { document } };
}

// Éléments de l'écran Vérifier que l'aperçu branche.
const IDS = ['texte', 'note-pivot', 'apercu-vide', 'verification', 'lecture', 'objet', 'objet-compteur', 'objet-messages', 'objet-propositions',
  'conseils', 'conseils-titre', 'conseils-liste', 'annuler', 'apercu', 'panneau', 'panneau-types', 'panneau-raison', 'panneau-section',
  'panneau-pastilles', 'panneau-surtitre', 'panneau-conseil-surtitre', 'panneau-libelle-zone', 'panneau-libelle', 'panneau-fermer'];
// Page dont l'aperçu est branché (US-010 à US-020) ; taper() simule la saisie du rédacteur.
export function pageBranchee(texte = '') {
  const page = faussePage(IDS);
  page.elements.texte.value = texte;
  brancherApercu(page.fenetre);
  const taper = valeur => { page.elements.texte.value = valeur; page.elements.texte.declencher('input'); };
  return { ...page, taper };
}
