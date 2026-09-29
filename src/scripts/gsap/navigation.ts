import { prefersReducedMotion } from "../mediaQueries";
import { gsap, ScrollTrigger } from "./gsap";

const FADE_IN = 0.35;
const FADE_OUT = 0.5;
/** Attente maximale du décor de destination avant de rouvrir l'image. */
const MEDIA_WAIT_MS = 800;

let jumping = false;

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

/** Force le chargement de l'image de la scène d'arrivée, pour ne pas révéler un décor vide. */
async function loadSceneImage(target: HTMLElement): Promise<void> {
  const image = target.closest("[data-scene]")?.querySelector<HTMLImageElement>("[data-scene-image]");
  if (!image) return;
  image.loading = "eager";
  await Promise.race([image.decode().catch(() => undefined), wait(MEDIA_WAIT_MS)]);
}

/** Les timelines « scrubbées » rattrapent le scroll avec un lissage : on les amène à destination sans délai. */
function syncScrollTriggers(): void {
  ScrollTrigger.update();
  ScrollTrigger.getAll().forEach((trigger) => {
    // Sans lissage (`scrub: true`), il n'y a pas de tween de rattrapage : `getTween()` n'en renvoie pas.
    const tween: gsap.core.Tween | undefined = trigger.getTween() || undefined;
    tween?.progress(1);
  });
}

/**
 * Scène épinglée : on arrive à son début, décor en place. Scène à contenu défilant :
 * on arrive directement sur son contenu, sous l'en-tête fixe, sans quoi il serait encore
 * sous la ligne de flottaison.
 */
function landingPosition(target: HTMLElement): number {
  const pinned = !target.matches("[data-scene]") || target.hasAttribute("data-pinned") || prefersReducedMotion();
  if (pinned) return target.getBoundingClientRect().top + window.scrollY;

  const content = target.querySelector<HTMLElement>(":scope > .scene-content > *") ?? target;
  const header = document.querySelector("header")?.offsetHeight ?? 0;
  return content.getBoundingClientRect().top + window.scrollY - header;
}

function focusTarget(target: HTMLElement): void {
  const headingId = target.getAttribute("aria-labelledby");
  const focusable = (headingId && document.getElementById(headingId)) || target;
  if (!focusable.hasAttribute("tabindex")) focusable.setAttribute("tabindex", "-1");
  focusable.focus({ preventScroll: true });
}

/**
 * Navigation directe vers une scène, sans faire défiler toutes celles qui la précèdent :
 * fondu au noir, repositionnement instantané, synchronisation des ScrollTriggers, retour de l'image.
 */
export async function jumpTo(target: HTMLElement): Promise<void> {
  if (jumping) return;
  jumping = true;

  const overlay = document.querySelector<HTMLElement>("[data-transition-overlay]");
  const cinematic = overlay !== null && !prefersReducedMotion();

  try {
    if (cinematic) {
      await gsap.to(overlay, { opacity: 1, duration: FADE_IN, ease: "power2.in" });
      await loadSceneImage(target);
    }

    window.scrollTo({ top: landingPosition(target), behavior: "instant" });
    syncScrollTriggers();
    focusTarget(target);
  } finally {
    // Quoi qu'il arrive, l'écran ne doit jamais rester noir.
    if (cinematic) {
      await nextFrame();
      await gsap.to(overlay, { opacity: 0, duration: FADE_OUT, ease: "power2.out" });
    }
    jumping = false;
  }
}

/** Intercepte les liens `a[data-jump]` vers une ancre de la page. Renvoie la fonction de nettoyage. */
export function initNavigation(): () => void {
  const onClick = (event: MouseEvent) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    if (!(event.target instanceof Element)) return;

    const link = event.target.closest<HTMLAnchorElement>("a[data-jump]");
    const target = link?.hash ? document.getElementById(decodeURIComponent(link.hash.slice(1))) : null;
    if (!link || !target) return;

    event.preventDefault();
    if (location.hash !== link.hash) history.pushState(null, "", link.hash);
    void jumpTo(target);
  };

  document.addEventListener("click", onClick);
  return () => document.removeEventListener("click", onClick);
}
