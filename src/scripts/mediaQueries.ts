/** Aligné sur l'écran `md` de Tailwind (48rem). */
export const MOBILE_QUERY = "(max-width: 767px)";
export const MOTION_QUERY = "(prefers-reduced-motion: no-preference)";

export const prefersReducedMotion = (): boolean => !window.matchMedia(MOTION_QUERY).matches;
