/** Aligné sur l'écran `md` de Tailwind (48rem). */
export const MOBILE_QUERY = "(max-width: 767px)";
export const MOTION_QUERY = "(prefers-reduced-motion: no-preference)";

export const prefersReducedMotion = (): boolean => !window.matchMedia(MOTION_QUERY).matches;

export const isMobile = (): boolean => window.matchMedia(MOBILE_QUERY).matches;

/** Mode « économie de données » (Chrome Android). Absent de Safari : `false`. */
export const prefersSaveData = (): boolean =>
  (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
