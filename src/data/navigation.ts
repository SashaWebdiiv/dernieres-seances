export interface NavLink {
  /** Ancre d'une scène : `#id` tel que défini dans `data/scenes.ts`. */
  href: `#${string}`;
  label: string;
}

export const navLinks: NavLink[] = [
  { href: "#experience", label: "Expériences" },
  { href: "#calendrier", label: "Calendrier" },
  { href: "#faq", label: "Infos & FAQ" },
];

export const reserveLink: NavLink = { href: "#billetterie", label: "Réserver" };
