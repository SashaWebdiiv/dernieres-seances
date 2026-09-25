import { emailContact } from "./evenement";

export interface FooterLink {
  label: string;
  /** `null` : destination encore inconnue, affichée sans lien. */
  href: string | null;
}

/** Colonne « Informations » (maquette 85:3761). Les pages légales restent à créer. */
export const infoLinks: FooterLink[] = [
  { label: "Contact", href: `mailto:${emailContact}` },
  { label: "Mentions légales", href: null },
  { label: "Politique de confidentialité", href: null },
];

/** Colonne « Suivez-nous » (maquette 85:3770). */
export const socialLinks: FooterLink[] = [
  { label: "Instagram", href: null },
  { label: "Facebook", href: null },
];

export const websiteLink: FooterLink = { label: "lacompagnie.net", href: "https://lacompagnie.net" };
