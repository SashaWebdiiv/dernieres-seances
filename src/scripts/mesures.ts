import { mesurer } from "./consent";

/**
 * Événements Google Analytics du site immersif (envoyés seulement après consentement) :
 * - `clic_billetterie` : clic vers la billetterie, avec `emplacement` (accueil, menu, bouton_fixe…),
 *   pour savoir quels boutons font vendre.
 * Les événements du widget (`billetterie_affichee`, `billetterie_erreur`) sont dans `pretix.ts`.
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
