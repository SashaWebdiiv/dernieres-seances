/**
 * Parcours du château : une entrée par scène, dans l'ordre de la visite.
 *
 * Pour passer une scène en vidéo, lui ajouter `video: { desktop, mobile }` à côté
 * de `image` — l'image reste l'affiche et le repli.
 *
 * Images des pièces issues de la maquette Figma (sources 1536 × 1024). Les versions mobiles
 * sont des recadrages portrait 9:16 centrés, à affiner pièce par pièce si besoin.
 */
import type { SceneConfig } from "../types/scene";

import facadeDesktop from "../assets/scenes/facade-desktop.webp";
import facadeMobile from "../assets/scenes/facade-mobile.webp";
import hallDesktop from "../assets/scenes/hall-desktop.webp";
import hallMobile from "../assets/scenes/hall-mobile.webp";
import salonDesktop from "../assets/scenes/salon-desktop.webp";
import salonMobile from "../assets/scenes/salon-mobile.webp";
import escalierDesktop from "../assets/scenes/escalier-desktop.webp";
import escalierMobile from "../assets/scenes/escalier-mobile.webp";
import salleEtageDesktop from "../assets/scenes/salle-etage-desktop.webp";
import salleEtageMobile from "../assets/scenes/salle-etage-mobile.webp";
import derniereSalleDesktop from "../assets/scenes/derniere-salle-desktop.webp";
import derniereSalleMobile from "../assets/scenes/derniere-salle-mobile.webp";
import sousSolDesktop from "../assets/scenes/sous-sol-desktop.webp";
import sousSolMobile from "../assets/scenes/sous-sol-mobile.webp";

/*
 * Voile commun à toutes les pièces (groupes « Overlay » de la maquette) : fondu noir en haut,
 * fondu noir en bas, vignettage radial et aplat #090909 à 60 %.
 */
const noir = (alpha: number) => `rgb(9 9 9 / ${alpha})`;
const voile = [
  `linear-gradient(180deg, ${noir(0.6)} 0%, ${noir(0)} 25%)`,
  `linear-gradient(0deg, ${noir(1)} 0%, ${noir(0)} 40%)`,
  `radial-gradient(ellipse at center, ${noir(0)} 30%, ${noir(0.6)} 100%)`,
  `linear-gradient(${noir(0.6)}, ${noir(0.6)})`,
].join(", ");

/* Ordre de la visite : façade, hall, escalier, salle à l'étage, salon, dernière salle, sous-sol. */
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
  calendar: {
    id: "calendrier",
    media: { image: { desktop: hallDesktop, mobile: hallMobile, alt: "" } },
    pinned: false,
    length: { desktop: 2, mobile: 2 },
    overlay: voile,
    animation: "still",
  },
  partners: {
    id: "partenaires",
    media: { image: { desktop: escalierDesktop, mobile: escalierMobile, alt: "" } },
    pinned: true,
    length: { desktop: 3, mobile: 2.5 },
    overlay: voile,
    animation: "staircase",
  },
  presentation: {
    id: "experience",
    media: { image: { desktop: salleEtageDesktop, mobile: salleEtageMobile, alt: "" } },
    pinned: true,
    length: { desktop: 2.5, mobile: 2 },
    overlay: voile,
    animation: "presentation",
  },
  experiences: {
    id: "programme",
    media: { image: { desktop: salonDesktop, mobile: salonMobile, alt: "" } },
    pinned: true,
    length: { desktop: 5, mobile: 4 },
    overlay: voile,
    animation: "experiences",
  },
  tickets: {
    id: "billetterie",
    media: { image: { desktop: derniereSalleDesktop, mobile: derniereSalleMobile, alt: "" } },
    pinned: false,
    length: { desktop: 2, mobile: 2 },
    overlay: voile,
    animation: "still",
  },
  faq: {
    id: "faq",
    media: { image: { desktop: sousSolDesktop, mobile: sousSolMobile, alt: "" } },
    pinned: false,
    length: { desktop: 2, mobile: 2 },
    overlay: voile,
    animation: "still",
  },
} satisfies Record<string, SceneConfig>;
