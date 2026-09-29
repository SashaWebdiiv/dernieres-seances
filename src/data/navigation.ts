export interface NavLink {
  /** Ancre d'une scène : `#id` tel que défini dans `data/scenes.ts`. */
  href: `#${string}`;
  label: string;
}

/** Barre supérieure (maquette 63:5), dans l'ordre des sections de la page. */
export const navLinks: NavLink[] = [
  { href: "#calendrier", label: "Calendrier" },
  { href: "#experience", label: "L'expérience" },
  { href: "#programme", label: "Programme" },
  { href: "#faq", label: "FAQ" },
];

/** Colonne « Navigation » du pied de page (maquette 85:3750). */
export const footerLinks: NavLink[] = [
  { href: "#calendrier", label: "Calendrier" },
  { href: "#experience", label: "L'expérience" },
  { href: "#programme", label: "Programme" },
  { href: "#billetterie", label: "Billetterie" },
  { href: "#faq", label: "FAQ" },
];

export const ticketingHref = "#billetterie";

/** Page d'accueil (site immersif), cible du retour depuis les pages légales. */
export const accueilHref = "/";
