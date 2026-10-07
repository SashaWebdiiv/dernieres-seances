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
  /**
   * `false` : section, liens du menu et du pied de page, et paragraphe « carte » de la politique
   * de confidentialité masqués, en attendant la confirmation de la mairie (parcours, horaires).
   */
  affichee: true,
  horaires: ["Samedi 31 octobre", "De 18h30 à 19h00, départ du château"],
  itineraire:
    "Les associations se produisent dans 6 lieux différents du quartier. Suivez le parcours pour découvrir toutes les représentations.",
  /**
   * Carte Google Maps : style personnalisé porté par le Map ID (console Google Cloud), clé
   * publique `PUBLIC_GOOGLE_MAPS_KEY` (Vercel), restreinte au domaine du site.
   * Lieux dans l'ordre du parcours, reliés par un tracé en ligne droite.
   */
  carte: {
    mapId: "c0781287449e02409935b400",
    lieux: [
      { lat: 48.77124, lng: 2.52182 },
      { lat: 48.77069, lng: 2.52086 },
      { lat: 48.77043, lng: 2.51961 },
      { lat: 48.76881, lng: 2.52041 },
      { lat: 48.76977, lng: 2.52158 },
      { lat: 48.77055, lng: 2.52185 },
    ],
  },
  associations: [
    { nom: "Groupe 1 – Clodine Barrais", logo: clodineBarrais, taille: [42, 56] },
    { nom: "Groupe 2 – Clodine Barrais", logo: clodineBarrais, taille: [42, 56] },
    { nom: "ACDF", logo: acdf, taille: [64, 64] },
    { nom: "Destination Danse", logo: destinationDanses, taille: [64, 30] },
    { nom: "GRS", logo: grs, taille: [64, 48] },
    { nom: "Art et Mouvement", logo: artEtMouvement, taille: [64, 64] },
  ] satisfies Association[],
};
