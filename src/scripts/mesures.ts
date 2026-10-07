import { mesurer } from "./consent";

/**
 * Événements Google Analytics du site immersif (envoyés seulement après consentement) :
 * - `clic_billetterie` : clic vers la billetterie, avec `emplacement` (accueil, menu, bouton_fixe…),
 *   pour savoir quels boutons font vendre.
 * Les événements de la billetterie (`billetterie_affichee`, `billetterie_erreur`) sont dans `pretix.ts`
 * et `selecteur.ts`, qui envoie aussi `selection_ajout`, `billetterie_reprise_panier` et
 * `billetterie_redirection` : clic sur « Payer » (fenêtre Pretix, nouvel onglet ou page Pretix),
 * avec `creneaux`, `experiences`, `personnes`, `montant` et `mode` (`fenetre`, `onglet`, `page`).
 * C'est l'étape la plus proche d'un achat que le site puisse mesurer (événement clé dans GA).
 * Choisir à l'étape 2 une activité vendue sur place (jardin ensorcelé) envoie `experience_sur_place`
 * (`activite`, `jour`). La carte de la parade envoie `carte_parade_affichee` et `carte_parade_erreur` (`carteParade.ts`).
 */
export function initMesures(): void {
  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const lien = event.target.closest<HTMLAnchorElement>('a[href="#billetterie"]');
    if (!lien) return;
    const emplacement = lien.closest("[data-sticky-cta]")
      ? "bouton_fixe"
      : lien.closest("header")
        ? "menu"
        : lien.closest("footer")
          ? "pied_de_page"
          : (lien.closest("section[id]")?.id ?? "autre");
    mesurer("clic_billetterie", { emplacement });
  });
}
