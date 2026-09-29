/**
 * Affiche le bouton de réservation fixe (mobile) hors de l'accueil, de la billetterie et du
 * pied de page : là, un bouton est déjà visible ou le bouton fixe masquerait des liens.
 */
export function initStickyCta(): void {
  const cta = document.querySelector<HTMLElement>("[data-sticky-cta]");
  if (!cta) return;

  const zones = ["#accueil", "#billetterie", "footer"]
    .map((selector) => document.querySelector(selector))
    .filter((zone): zone is Element => zone !== null);
  const visibles = new Set<Element>();

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) visibles.add(entry.target);
      else visibles.delete(entry.target);
    }
    cta.classList.toggle("is-visible", visibles.size === 0);
  });

  zones.forEach((zone) => observer.observe(zone));
}
