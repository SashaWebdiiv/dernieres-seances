import type { ImageMetadata } from "astro";
import acompagnie from "../assets/logos/acompagnie-improvisee.png";
import villeSucy from "../assets/logos/ville-sucy.png";
import arbreOJeux from "../assets/logos/arbre-o-jeux.png";
import webdiiv from "../assets/logos/webdiiv.png";

/**
 * Partenaires (maquette 68:2167) : logo au-dessus du nom.
 * Eden Crêpes n'a pas encore de logo : la maquette réutilise provisoirement celui de Webdiiv.
 */
export interface Partner {
  name: string;
  logo?: ImageMetadata;
  url?: string;
}

export const partners: Partner[] = [
  { name: "L'Acompagnie Improvisée", logo: acompagnie },
  { name: "L'Arbre Ô Jeux", logo: arbreOJeux },
  { name: "Ville de Sucy-en-Brie", logo: villeSucy },
  { name: "Webdiiv", logo: webdiiv, url: "https://webdiiv.com" },
  { name: "Eden Crêpes" },
];
