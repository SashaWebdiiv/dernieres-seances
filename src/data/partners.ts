/** Partenaires (maquette 68:2167), affichés en texte comme dans la maquette. */
export interface Partner {
  name: string;
  url?: string;
}

export const partners: Partner[] = [
  { name: "Château de Sucy" },
  { name: "L'Acompagnie Improvisée" },
  { name: "Ville de Sucy-en-Brie" },
  { name: "Webdiiv", url: "https://webdiiv.com" },
  { name: "Val-de-Marne" },
  // Nom générique dans la maquette : à remplacer par le nom du mécène.
  { name: "Le Mécène" },
];
