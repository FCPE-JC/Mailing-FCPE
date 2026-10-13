// Mailing-FCPE : fonctions communes aux tests (lecture des fichiers publiés, faux navigateur).
// Ce fichier n'est pas un test : son nom ne finit pas par « .test.js ».

import { readdirSync, readFileSync } from 'node:fs';
import { join, relative, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

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
  replaceChildren() { this.enfants = []; }
  setAttribute(nom, valeur) { this.attributs[nom] = String(valeur); }
  getAttribute(nom) { return nom in this.attributs ? this.attributs[nom] : null; }
  removeAttribute(nom) { delete this.attributs[nom]; }
  focus() { this.ownerDocument.focus = this; }
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
}
