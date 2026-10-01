import type { ImageMetadata } from "astro";
import clodineBarrais from "../assets/parade/clodine-barrais.png";
import acdf from "../assets/parade/acdf.png";
import destinationDanses from "../assets/parade/destination-danses.png";
import grs from "../assets/parade/grs.png";
import artEtMouvement from "../assets/parade/art-et-mouvement.png";

/**
 * Parade des associations (maquette « Parade », 237:6315), le samedi 31 octobre.
 * Logos recadrés comme dans la maquette (sources transparentes, 256 px au plus).
 */
export interface Association {
  nom: string;
  logo: ImageMetadata;
  /** Largeur × hauteur d'affichage du logo en px, comme dans la maquette. */
  taille: [number, number];
}

export const parade = {
  horaires: ["Samedi 31 octobre", "De 18h30 à 19h00, départ du château"],
  itineraire:
    "Les associations se produisent dans 6 lieux différents du quartier. Suivez le parcours pour découvrir toutes les représentations.",
  associations: [
    { nom: "Groupe 1 – Clôdine Barrais", logo: clodineBarrais, taille: [42, 56] },
    { nom: "Groupe 2 – Clôdine Barrais", logo: clodineBarrais, taille: [42, 56] },
    { nom: "Carole – ACDF", logo: acdf, taille: [64, 64] },
    { nom: "Destination Danse", logo: destinationDanses, taille: [64, 30] },
    { nom: "GRS", logo: grs, taille: [64, 48] },
    { nom: "Art et Mouvement", logo: artEtMouvement, taille: [64, 64] },
  ] satisfies Association[],
};
