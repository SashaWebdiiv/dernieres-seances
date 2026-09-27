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
      { label: "Instagram", href: "https://www.instagram.com/lacompagnieimprovisee/" },
      { label: "Facebook", href: "https://www.facebook.com/LacompagnieSucy/" },
      { label: "lacompagnie.net", href: "https://lacompagnie.net" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "+33 6 47 67 30 41", href: "tel:+33647673041" },
      { label: "support@dernieresseances.fr", href: "mailto:support@dernieresseances.fr" },
    ],
  },
  {
    title: "Informations",
    links: [
      { label: emailContact, href: `mailto:${emailContact}` },
      { label: "Mentions légales", href: "/mentions-legales/" },
      { label: "Politique de confidentialité", href: "/confidentialite/" },
      { label: "Conditions générales de vente", href: "/cgv/" },
    ],
  },
];
