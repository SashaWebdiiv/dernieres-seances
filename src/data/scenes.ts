/**
 * Parcours du château : une entrée par scène, dans l'ordre de la visite.
 *
 * Pour passer une scène en vidéo, lui ajouter `video: { desktop, mobile }` à côté
 * de `image` — l'image reste l'affiche et le repli.
 *
 * Les images hors façade sont des placeholders neutres : les visuels de la maquette Figma
 * (grandepiece, deuxiemepiece, escalier, dernieresalle, sortie-chateau) restent à importer.
 */
import type { SceneConfig } from "../types/scene";

import facadeDesktop from "../assets/scenes/facade-desktop.webp";
import facadeMobile from "../assets/scenes/facade-mobile.webp";
import hallDesktop from "../assets/scenes/hall-desktop.webp";
import hallMobile from "../assets/scenes/hall-mobile.webp";
import premiereSalleDesktop from "../assets/scenes/premiere-salle-desktop.webp";
import premiereSalleMobile from "../assets/scenes/premiere-salle-mobile.webp";
import escalierDesktop from "../assets/scenes/escalier-desktop.webp";
import escalierMobile from "../assets/scenes/escalier-mobile.webp";
import salleEtageDesktop from "../assets/scenes/salle-etage-desktop.webp";
import salleEtageMobile from "../assets/scenes/salle-etage-mobile.webp";
import derniereSalleDesktop from "../assets/scenes/derniere-salle-desktop.webp";
import derniereSalleMobile from "../assets/scenes/derniere-salle-mobile.webp";
import fenetreJardinDesktop from "../assets/scenes/fenetre-jardin-desktop.webp";
import fenetreJardinMobile from "../assets/scenes/fenetre-jardin-mobile.webp";

const hallImage = {
  desktop: hallDesktop,
  mobile: hallMobile,
  alt: "",
} satisfies SceneConfig["media"]["image"];

/* Voiles de la maquette : aplat, vignettage radial et fondus vers le noir (#090909). */
const noir = (alpha: number) => `rgb(9 9 9 / ${alpha})`;
const aplat = (alpha: number) => `linear-gradient(${noir(alpha)}, ${noir(alpha)})`;
const vignette = (from: number, to: number, alpha: number) =>
  `radial-gradient(ellipse at center, ${noir(0)} ${from * 100}%, ${noir(alpha)} ${to * 100}%)`;
const fonduBas = `linear-gradient(0deg, ${noir(1)} 0%, ${noir(0)} 40%)`;

export const scenes = {
  hero: {
    id: "accueil",
    media: {
      image: {
        desktop: facadeDesktop,
        mobile: facadeMobile,
        alt: "La façade du Château de Sucy illuminée, sous une pleine lune.",
        focus: { desktop: "49% 90%", mobile: "49% 67%" },
      },
    },
    pinned: true,
    length: { desktop: 2.5, mobile: 2 },
    // « Voile nocturne » (62:11).
    overlay: "linear-gradient(180deg, rgb(4 16 26 / 0.87) 0%, rgb(4 16 26 / 0.33) 48%, rgb(3 8 13 / 0.96) 100%)",
    animation: "hero",
    priority: true,
  },
  hall: {
    id: "experience",
    media: { image: hallImage },
    pinned: true,
    length: { desktop: 2.5, mobile: 2 },
    overlay: "rgb(0 0 0 / 0.5)",
    animation: "hall",
  },
  experiences: {
    id: "programme",
    media: { image: { desktop: premiereSalleDesktop, mobile: premiereSalleMobile, alt: "" } },
    pinned: true,
    length: { desktop: 5, mobile: 4 },
    overlay: [fonduBas, vignette(0.3, 1, 0.65), aplat(0.45)].join(", "),
    animation: "experiences",
  },
  retourHall: {
    id: "retour-hall",
    media: { image: hallImage },
    pinned: true,
    length: { desktop: 1.5, mobile: 1.2 },
    overlay: "rgb(0 0 0 / 0.5)",
    animation: "passage",
  },
  partners: {
    id: "partenaires",
    media: { image: { desktop: escalierDesktop, mobile: escalierMobile, alt: "" } },
    pinned: true,
    length: { desktop: 3, mobile: 2.5 },
    overlay: [
      `linear-gradient(180deg, ${noir(0.6)} 0%, ${noir(0)} 25%)`,
      fonduBas,
      vignette(0.3, 1, 0.6),
      aplat(0.4),
    ].join(", "),
    animation: "staircase",
  },
  calendar: {
    id: "calendrier",
    media: { image: { desktop: salleEtageDesktop, mobile: salleEtageMobile, alt: "" } },
    pinned: false,
    length: { desktop: 2, mobile: 2 },
    overlay: [vignette(0.2, 1, 0.7), aplat(0.5)].join(", "),
    animation: "still",
  },
  tickets: {
    id: "billetterie",
    media: { image: { desktop: derniereSalleDesktop, mobile: derniereSalleMobile, alt: "" } },
    pinned: false,
    length: { desktop: 2, mobile: 2 },
    overlay: [vignette(0.15, 1, 0.65), aplat(0.55)].join(", "),
    animation: "still",
  },
  faq: {
    id: "faq",
    media: { image: { desktop: fenetreJardinDesktop, mobile: fenetreJardinMobile, alt: "" } },
    pinned: false,
    length: { desktop: 2, mobile: 2 },
    overlay: [`linear-gradient(180deg, ${noir(1)} 0%, ${noir(0)} 30%)`, aplat(0.75)].join(", "),
    animation: "still",
  },
} satisfies Record<string, SceneConfig>;
