import type { ImageMetadata } from "astro";

/** Point visé par la caméra (origine des zooms), en % du cadre plein écran : "49% 88%". */
export interface SceneFocus {
  desktop: string;
  mobile: string;
}

export interface SceneImage {
  desktop: ImageMetadata;
  mobile: ImageMetadata;
  /** Chaîne vide si l'image est purement décorative. */
  alt: string;
  focus?: SceneFocus;
}

/** URLs des vidéos (H.264/MP4 au minimum). Chargées uniquement à l'approche de la scène. */
export interface SceneVideo {
  desktop: string;
  mobile: string;
}

/**
 * Média d'une scène. L'image est toujours requise : elle est l'affiche et le repli de la
 * vidéo (chargement, réseau lent, Save-Data, mouvement réduit). Passer une scène en vidéo
 * revient donc à ajouter `video`, sans toucher aux composants.
 */
export interface SceneMedia {
  image: SceneImage;
  video?: SceneVideo;
}

/** Nom de la timeline GSAP associée, résolu dans `scripts/gsap/sceneAnimations.ts`. */
export const sceneAnimations = ["hero", "presentation", "experiences", "staircase", "still"] as const;

export type SceneAnimation = (typeof sceneAnimations)[number];

export interface SceneConfig {
  /** Identifiant unique, repris en ancre (`#id`) quand la scène est une destination. */
  id: string;
  media: SceneMedia;
  /**
   * `true` : décor ET contenu restent fixes à l'écran pendant toute la scène.
   * `false` : seul le décor reste fixe ; le contenu, de hauteur libre, défile par-dessus.
   */
  pinned: boolean;
  /**
   * Longueur de la scène en hauteurs d'écran. Épinglée : durée exacte du scroll.
   * Non épinglée : hauteur minimale (le contenu peut l'allonger), qui laisse au décor
   * le temps d'apparaître entre les fondus d'entrée et de sortie.
   */
  length: { desktop: number; mobile: number };
  /** Voile posé sur le décor pour la lisibilité (valeur CSS `background`, calques de la maquette). */
  overlay: string;
  animation: SceneAnimation;
  /** Uniquement la première scène : chargement prioritaire du média. */
  priority?: boolean;
}
