import type { ImageMetadata } from "astro";
import acompagnie from "../assets/logos/acompagnie-improvisee.png";
import villeSucy from "../assets/logos/ville-sucy.png";

/**
 * Partenaires (maquette 68:2167) : logo au-dessus du nom.
 * Logos manquants (non téléchargeables depuis Figma ici) : L'Arbre Ô Jeux, Webdiiv, Eden Crêpes.
 */
export interface Partner {
  name: string;
  logo?: ImageMetadata;
  url?: string;
}

export const partners: Partner[] = [
  { name: "L'Acompagnie Improvisée", logo: acompagnie },
  { name: "L'Arbre Ô Jeux" },
  { name: "Ville de Sucy-en-Brie", logo: villeSucy },
  { name: "Webdiiv", url: "https://webdiiv.com" },
  { name: "Eden Crêpes" },
];
