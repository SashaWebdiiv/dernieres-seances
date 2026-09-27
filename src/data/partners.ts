import type { ImageMetadata } from "astro";
import acompagnie from "../assets/logos/acompagnie-improvisee.png";
import villeSucy from "../assets/logos/ville-sucy.png";
import arbreOJeux from "../assets/logos/arbre-o-jeux.png";
import webdiiv from "../assets/logos/webdiiv.png";
import edenCrepes from "../assets/logos/eden-crepes.png";

/**
 * Partenaires (maquette 68:2167) : logo au-dessus du nom.
 */
/** Affichés sans lien, à la demande de l'organisation. */
export interface Partner {
  name: string;
  logo?: ImageMetadata;
}

export const partners: Partner[] = [
  { name: "L'Acompagnie Improvisée", logo: acompagnie },
  { name: "L'Arbre Ô Jeux", logo: arbreOJeux },
  { name: "Ville de Sucy-en-Brie", logo: villeSucy },
  { name: "Webdiiv", logo: webdiiv },
  { name: "Eden Crêpes", logo: edenCrepes },
];
