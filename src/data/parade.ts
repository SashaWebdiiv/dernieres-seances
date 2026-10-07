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
    "Les associations se produisent dans 4 lieux différents du quartier. Suivez le parcours pour découvrir toutes les représentations.",
  /**
   * Carte Google Maps : style personnalisé porté par le Map ID (console Google Cloud), clé
   * publique `PUBLIC_GOOGLE_MAPS_KEY` (Vercel), restreinte au domaine du site.
   * `lieux` : étapes numérotées sur la carte. `parcours` : ordre de passage (indices dans `lieux`),
   * tracé en ligne droite et repris par le lien « Ouvrir dans Google Maps » (itinéraire à pied).
   */
  carte: {
    mapId: "c0781287449e02409935b400",
    lieux: [
      { lat: 48.77124, lng: 2.52182 },
      { lat: 48.77055, lng: 2.52185 },
      { lat: 48.77048, lng: 2.51961 },
      { lat: 48.7695, lng: 2.52062 },
    ],
    // 1 → 2 → 3 → 4, puis retour à l'étape 2.
    parcours: [0, 1, 2, 3, 1],
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
