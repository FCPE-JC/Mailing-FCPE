// Mailing-FCPE : rendu de l'email selon la charte (US-008, US-011 ; EX-007, RG-003, EX-017).
//
// Transforme le modèle interne (js/pivot.js) en code HTML prêt à coller dans Gmail : styles
// en ligne seulement, mise en page en tableaux, valeurs tirées de parametres/charte.js.
// Le résultat est un <div> qui porte le fond de page et contient la carte de l'email :
// c'est exactement ce que l'aperçu affiche et ce que la copie du lot 5 mettra dans le
// presse-papier (même forme qu'aux tests T1 et T5).
//
// Transcription en JavaScript de html_email() de etape-2/outils-de-travail/rendu.py,
// avec l'en-tête V1 (DEC-078). Tout texte du rédacteur est échappé : il ne peut jamais
// devenir du code (US-011).
//
// Pour l'aperçu seulement (US-015), l'option « etiquettes » entoure chaque bloc d'un repère
// et de l'étiquette de son type ; sans elle, le code est exactement celui qui sera copié.

import { CHARTE } from '../parametres/charte.js?v=0.6.0';
import { ADRESSE_LIEN } from './pivot.js?v=0.6.0';

// Échappe un texte pour l'insérer dans le code HTML (contenu ou valeur d'attribut).
export function echapper(texte) {
  return String(texte).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Mise en forme dans une phrase (P7, P8) : liens, adresses nues, gras, italique.
// Le texte est échappé d'abord ; seuls les liens https, http et mailto deviennent cliquables.
export function enLigne(texte, couleurGras, charte = CHARTE) {
  const bleu = charte.couleurs.bleuTitre;
  let t = echapper(texte);
  t = t.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (tout, libelle, adresse) =>
    ADRESSE_LIEN.test(adresse) ? `<a href="${adresse}" style="color:${bleu};">${libelle}</a>` : tout);
  t = t.replace(/(?<![">])(https?:\/\/[^\s<]+)/g, (adresse) => `<a href="${adresse}" style="color:${bleu};word-break:break-word;">${adresse}</a>`);
  t = t.replace(/\*\*(.+?)\*\*/g, `<strong style="color:${couleurGras || bleu};">$1</strong>`);
  t = t.replace(/(?<![\p{L}\p{N}_*])_(.+?)_(?![\p{L}\p{N}_])/gu, '<em>$1</em>');
  t = t.replace(/(?<![\p{L}\p{N}_*])\*(.+?)\*(?![\p{L}\p{N}_*])/gu, '<em>$1</em>');
  return t;
}

const tableau = (attributs = '') => `<table role="presentation" ${attributs} cellpadding="0" cellspacing="0" border="0"`;
const LARGE = 'width="100%"';

// Style du conteneur de l'email : fond de page, police et couleur du texte.
export function styleConteneur(charte = CHARTE) {
  const c = charte.couleurs;
  return `margin:0;padding:0;background:${c.fondPage};font-family:${charte.police};color:${c.texte};`;
}

// Rendu du modèle interne en code HTML de l'email. options.etiquettes : noms des types,
// pour l'aperçu seulement (US-015).
export function rendreEmail(doc, charte = CHARTE, options = {}) {
  const c = charte.couleurs;
  const ty = charte.typographie;
  const d = charte.dimensions;
  const e = charte.entete;
  const F = `font-family:${charte.police};`;
  const px = n => `${n}px`;
  const out = [];
  const a = ligne => out.push(ligne);
  // Repère et étiquette d'un bloc, dans l'aperçu seulement.
  const noms = options.etiquettes;
  const ouvrir = (repere, type) => { if (noms) a(`<div class="repere" data-bloc="${repere}"><button type="button" class="etiquette-bloc">${echapper(noms[type])} ▾</button>`); };
  const fermer = () => { if (noms) a('</div>'); };

  a(`${tableau(LARGE)} style="background:${c.fondPage};"><tr><td align="center" style="padding:${d.margeFond};">`);
  a(`${tableau(LARGE)} style="max-width:${charte.largeurMax}px;background:${c.carte};border-radius:${px(d.rayonCarte)};">`);
  // En-tête V1 (DEC-078) et filet vert.
  a(`<tr><td style="padding:${e.marges};background:${c.bleuEntete};border-radius:${px(d.rayonCarte)} ${px(d.rayonCarte)} 0 0;">${tableau(LARGE)}><tr>`
    + `<td width="${e.largeurColonneLogo}" valign="middle"><img src="${charte.logo}" alt="${echapper(charte.textes.texteAlternatifLogo)}" width="${e.largeurLogo}" style="display:block;width:${px(e.largeurLogo)};height:auto;border:0;margin:0;"></td>`
    + `<td valign="middle" align="right" style="${F}font-size:${px(e.tailleLigne1)};line-height:${e.interligne};color:${c.blanc};">${echapper(e.ligne1)}<br><strong style="color:${c.blanc};font-size:${px(e.tailleLigne2)};">${echapper(e.ligne2)}</strong></td>`
    + `</tr></table></td></tr><tr><td style="height:${px(e.hauteurFilet)};line-height:${px(e.hauteurFilet)};font-size:${px(e.hauteurFilet)};background:${c.vert};">&nbsp;</td></tr>`);
  a(`<tr><td style="padding:${d.margesCorps};">`);

  if (doc.salutation) {
    a(`<h1 style="${F}font-size:${px(ty.salutation.taille)};line-height:${ty.salutation.interligne};margin:0 0 20px;color:${c.bleuTitre};">${enLigne(doc.salutation, null, charte)}</h1>`);
  }

  const n = doc.sections.length;
  doc.sections.forEach((s, k) => {
    const verte = k % 2 === 0;
    const [fond, bord] = verte ? [c.fondPastilleVerte, c.vert] : [c.fondPastilleBleue, c.bleuTitre];
    const couleurSurtitre = verte ? c.bleuTitre : c.vertFonce;
    // Trait vertical du fil, sauf sous la dernière section.
    const trait = k < n - 1
      ? `background-image:linear-gradient(${c.trait},${c.trait});background-repeat:no-repeat;background-position:21px 0;background-size:2px 100%;`
      : '';
    // Sans émoji, pastille par défaut (DEC-093) ; les mots-clés (D16) la choisissent avant le rendu (DEC-099).
    const pastille = s.pastille || charte.textes.pastilleParDefaut;
    const repereSection = noms ? ` class="repere-pastille" data-bloc="${k}.${s.surtitre || !s.blocs.length ? 'titre' : 0}"` : '';
    a(`${tableau(LARGE)}><tr>\n<td width="${d.colonnePastille}" valign="top"${repereSection} style="${trait}">${tableau()}><tr><td width="${d.pastille}" height="${d.pastille}" align="center" valign="middle" `
      + `style="width:${px(d.pastille)};height:${px(d.pastille)};background:${fond};border:2px solid ${bord};border-radius:22px;font-size:${px(d.taillePastille)};line-height:${px(d.pastille)};">${echapper(pastille)}</td></tr></table></td>`);
    a(`<td valign="top" style="padding:${d.margesContenuSection};">`);
    if (s.surtitre) {
      ouvrir(`${k}.titre`, 'titre');
      a(`<p style="${F}font-size:${px(ty.surtitre.taille)};letter-spacing:${px(ty.surtitre.espacement)};text-transform:uppercase;font-weight:${ty.surtitre.graisse};color:${couleurSurtitre};margin:0 0 10px;">${enLigne(s.surtitre, null, charte)}</p>`);
      fermer();
    }
    s.blocs.forEach((b, j) => {
      const mb = j === s.blocs.length - 1 ? '0' : '16px';
      ouvrir(`${k}.${j}`, b.type);
      switch (b.type) {
        case 'accroche':
          a(`${tableau(LARGE)} style="margin:0 0 ${mb};"><tr><td width="${d.barreAccroche}" style="background:${c.vert};border-radius:2px;"></td>`
            + `<td style="padding:2px 0 2px 18px;"><p style="${F}font-size:${px(ty.accroche.taille)};line-height:${ty.accroche.interligne};margin:0;color:${c.bleuTitre};font-weight:${ty.accroche.graisse};">${enLigne(b.texte, null, charte)}</p></td></tr></table>`);
          break;
        case 'paragraphe':
          a(`<p style="${F}font-size:${px(ty.paragraphe.taille)};line-height:${ty.paragraphe.interligne};margin:0 0 ${mb};color:${c.texte};">${enLigne(b.texte, null, charte)}</p>`);
          break;
        case 'note':
          a(`<p style="${F}font-size:${px(ty.note.taille)};line-height:${ty.note.interligne};margin:0 0 ${mb};color:${c.texteSecondaire};font-style:${ty.note.style};">${enLigne(b.texte, c.texteSecondaire, charte)}</p>`);
          break;
        case 'liste':
          a(`${tableau(LARGE)} style="margin:0 0 ${mb};">`);
          for (const element of b.elements) {
            a(`<tr><td width="22" valign="top" aria-hidden="true" style="${F}font-size:${px(ty.paragraphe.taille)};line-height:${ty.paragraphe.interligne};color:${c.vert};font-weight:700;">●</td>`
              + `<td valign="top" style="${F}font-size:${px(ty.paragraphe.taille)};line-height:${ty.paragraphe.interligne};color:${c.texte};padding:0 0 6px;">${enLigne(element, null, charte)}</td></tr>`);
          }
          a('</table>');
          break;
        case 'bouton': {
          const adresse = echapper(b.adresse);
          a(`${tableau()} style="margin:4px 0 8px;"><tr><td style="background:${c.bleuTitre};border-radius:${px(d.rayonBouton)};"><a href="${adresse}" target="_blank" `
            + `style="display:inline-block;padding:${d.margesBouton};${F}font-size:${px(ty.bouton.taille)};font-weight:${ty.bouton.graisse};color:${c.blanc};text-decoration:none;border-radius:${px(d.rayonBouton)};">${echapper(b.libelle)}</a></td></tr></table>`);
          a(`<p style="${F}font-size:${px(ty.lienSecours.taille)};line-height:${ty.lienSecours.interligne};margin:0 0 ${mb};color:${c.lienSecours};word-break:break-word;">ou : <a href="${adresse}" style="color:${c.bleuTitre};">${adresse}</a></p>`);
          break;
        }
        case 'important':
          a(`${tableau(LARGE)} style="margin:0 0 ${mb};"><tr><td style="background:${c.fondPastilleBleue};border-left:5px solid ${c.bleuTitre};border-radius:${px(d.rayonImportant)};padding:${d.margesEncadre};">`
            + `<p style="${F}font-size:${px(ty.surtitre.taille)};letter-spacing:${px(ty.surtitre.espacement)};text-transform:uppercase;font-weight:${ty.surtitre.graisse};color:${c.bleuTitre};margin:0 0 6px;">⚠️ ${echapper(b.titre)}</p>`
            + b.lignes.map(x => `<p style="${F}font-size:${px(ty.paragraphe.taille)};line-height:${ty.paragraphe.interligne};margin:0;color:${c.texte};font-weight:700;">${enLigne(x, null, charte)}</p>`).join('')
            + '</td></tr></table>');
          break;
        case 'date':
          a(`${tableau(LARGE)} style="margin:0 0 ${mb};"><tr><td style="border:2px solid ${c.trait};border-radius:${px(d.rayonDate)};padding:${d.margesEncadre};">`);
          b.lignes.forEach((x, q) => {
            const [style, couleur] = q === 0 ? [ty.titreDate, c.bleuTitre] : [ty.ligneDate, c.texte];
            a(`<p style="${F}font-size:${px(style.taille)};line-height:${style.interligne};margin:0 0 ${q < b.lignes.length - 1 ? '6px' : '0'};color:${couleur};font-weight:${style.graisse};">${enLigne(x, null, charte)}</p>`);
          });
          a('</td></tr></table>');
          break;
        default:
          break;
      }
      fermer();
    });
    a('</td></tr></table>');
  });

  if (doc.cloture) {
    a(`<div style="border-top:1px solid ${c.trait};margin:4px 0 24px;height:1px;line-height:1px;font-size:1px;">&nbsp;</div>`);
    ouvrir('cloture', 'cloture');
    a(`<p style="${F}font-size:${px(ty.cloture.taille)};line-height:${ty.cloture.interligne};margin:0 0 14px;color:${c.bleuTitre};font-weight:${ty.cloture.graisse};">${enLigne(doc.cloture, null, charte)}</p>`);
    fermer();
  }
  if (doc.signature) {
    // Formule (facultative depuis DEC-114), puis le signataire : première ligne en gras bleu,
    // suivantes en texte normal (DEC-110).
    const { formule, signataire } = doc.signature;
    const lignes = [
      ...(formule ? [echapper(formule)] : []),
      ...(signataire ? signataire.split('\n').map((ligne, q) => (q === 0 ? `<strong style="color:${c.bleuTitre};">${echapper(ligne)}</strong>` : echapper(ligne))) : []),
    ];
    ouvrir('signature', 'signature');
    a(`<p style="${F}font-size:${px(ty.signature.taille)};line-height:${ty.signature.interligne};margin:0;color:${c.texte};">${lignes.join('<br>')}</p>`);
    fermer();
  }
  a('</td></tr>\n</table></td></tr></table>');

  // lang : la synthèse vocale lit l'email en français (EX-021, US-036, DEC-132).
  return `<div lang="fr" style="${styleConteneur(charte)}">${out.join('\n')}</div>`;
}
