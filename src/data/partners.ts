import type { ImageMetadata } from "astro";
import villeSucy from "../assets/partners/ville-sucy.png";
import acompagnie from "../assets/partners/acompagnie-improvisee.png";

export interface Partner {
  name: string;
  logo?: ImageMetadata;
  url?: string;
}

/** PROVISOIRE : liste et ordre des partenaires à confirmer. */
export const partners: Partner[] = [
  { name: "L'Acompagnie Improvisée", logo: acompagnie },
  { name: "Ville de Sucy-en-Brie", logo: villeSucy },
];
