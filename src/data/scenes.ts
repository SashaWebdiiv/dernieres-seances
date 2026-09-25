/**
 * Parcours du château : une entrée par scène, dans l'ordre de la visite.
 *
 * Pour passer une scène en vidéo, lui ajouter `video: { desktop, mobile }` à côté
 * de `image` — l'image reste l'affiche et le repli.
 *
 * Les images hors façade sont des placeholders neutres à remplacer par les visuels définitifs.
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
    shade: 0.25,
    animation: "hero",
    priority: true,
  },
  hall: {
    id: "concept",
    media: { image: hallImage },
    pinned: true,
    length: { desktop: 2.5, mobile: 2 },
    shade: 0.35,
    animation: "hall",
  },
  experiences: {
    id: "experience",
    media: { image: { desktop: premiereSalleDesktop, mobile: premiereSalleMobile, alt: "" } },
    pinned: true,
    length: { desktop: 5, mobile: 4 },
    shade: 0.45,
    animation: "experiences",
  },
  retourHall: {
    id: "retour-hall",
    media: { image: hallImage },
    pinned: true,
    length: { desktop: 1.5, mobile: 1.2 },
    shade: 0.35,
    animation: "passage",
  },
  partners: {
    id: "partenaires",
    media: { image: { desktop: escalierDesktop, mobile: escalierMobile, alt: "" } },
    pinned: true,
    length: { desktop: 3, mobile: 2.5 },
    shade: 0.45,
    animation: "staircase",
  },
  calendar: {
    id: "calendrier",
    media: { image: { desktop: salleEtageDesktop, mobile: salleEtageMobile, alt: "" } },
    pinned: false,
    length: { desktop: 2, mobile: 2 },
    shade: 0.6,
    animation: "still",
  },
  tickets: {
    id: "billetterie",
    media: { image: { desktop: derniereSalleDesktop, mobile: derniereSalleMobile, alt: "" } },
    pinned: false,
    length: { desktop: 2, mobile: 2 },
    shade: 0.6,
    animation: "still",
  },
  faq: {
    id: "faq",
    media: { image: { desktop: fenetreJardinDesktop, mobile: fenetreJardinMobile, alt: "" } },
    pinned: false,
    length: { desktop: 2, mobile: 2 },
    shade: 0.6,
    animation: "still",
  },
} satisfies Record<string, SceneConfig>;
