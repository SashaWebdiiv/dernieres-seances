import { emailContact } from "./evenement";

export interface FooterLink {
  label: string;
  /** `null` : destination encore inconnue, affichée sans lien. */
  href: string | null;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

/** Colonnes du pied de page (maquette 166:6180), après « Navigation ». */
export const footerColumns: FooterColumn[] = [
  {
    title: "Suivez-nous",
    links: [
      { label: "Instagram", href: null },
      { label: "Facebook", href: null },
      { label: "lacompagnie.net", href: "https://lacompagnie.net" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "+33 6 47 67 30 41", href: "tel:+33647673041" },
      // La maquette écrit « dernieressences.fr » : corrigé vers le domaine du site, à confirmer.
      { label: "support@dernieresseances.fr", href: "mailto:support@dernieresseances.fr" },
    ],
  },
  {
    title: "Informations",
    links: [
      { label: emailContact, href: `mailto:${emailContact}` },
      // Pages légales à créer.
      { label: "Mentions légales", href: null },
      { label: "Politique de confidentialité", href: null },
    ],
  },
];
