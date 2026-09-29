import { sceneAnimations as sceneAnimationNames, type SceneAnimation } from "../../types/scene";
import { MOBILE_QUERY, MOTION_QUERY } from "../mediaQueries";
import { gsap, ScrollTrigger } from "./gsap";
import { sceneAnimations } from "./sceneAnimations";

const isSceneAnimation = (value: string | undefined): value is SceneAnimation =>
  sceneAnimationNames.includes(value as SceneAnimation);

/**
 * Portes de noir : la scène sort au noir avant de se décoller, la suivante entre depuis le noir.
 * La jonction entre deux médias se fait donc toujours noir sur noir.
 */
function animateVeils(scene: HTMLElement, { first, last }: { first: boolean; last: boolean }): void {
  const veilIn = scene.querySelector("[data-veil-in]");
  const veilOut = scene.querySelector("[data-veil-out]");

  if (veilIn && !first) {
    gsap.fromTo(
      veilIn,
      { opacity: 1 },
      { opacity: 0, ease: "power2.in", scrollTrigger: { trigger: scene, start: "top bottom", end: "top top", scrub: true } },
    );
  }

  if (veilOut && !last) {
    gsap.fromTo(
      veilOut,
      { opacity: 0 },
      { opacity: 1, ease: "power2.in", scrollTrigger: { trigger: scene, start: "bottom 150%", end: "bottom bottom", scrub: true } },
    );
  }
}

/**
 * Le contenu peut changer de hauteur après coup (widget Pretix, FAQ dépliée) :
 * toutes les positions de déclenchement situées en dessous doivent être recalculées.
 */
function refreshOnContentResize(content: Element): () => void {
  let height = content.getBoundingClientRect().height;
  const refresh = gsap.delayedCall(0.2, () => ScrollTrigger.refresh()).pause();

  const observer = new ResizeObserver(([entry]) => {
    const next = entry?.contentRect.height ?? height;
    if (Math.abs(next - height) < 1) return;
    height = next;
    refresh.restart(true);
  });
  observer.observe(content);

  return () => {
    observer.disconnect();
    refresh.kill();
  };
}

/** Crée toutes les animations de scroll. Renvoie la fonction de nettoyage. */
export function initScroll(): () => void {
  const scenes = gsap.utils.toArray<HTMLElement>("[data-scene]");
  const media = gsap.matchMedia();

  // Recréé automatiquement (et proprement annulé) à chaque changement de breakpoint
  // ou de préférence de mouvement. Mouvement réduit : aucune animation, scènes statiques.
  media.add({ mobile: MOBILE_QUERY, motion: MOTION_QUERY }, (context) => {
    const { mobile = false, motion = false } = context.conditions ?? {};
    if (!motion) return;

    const amplitude = mobile ? 0.6 : 1;
    scenes.forEach((scene, index) => {
      animateVeils(scene, { first: index === 0, last: index === scenes.length - 1 });
      const name = scene.dataset.sceneAnimation;
      if (isSceneAnimation(name)) sceneAnimations[name](scene, { amplitude });
    });
  });

  const main = document.querySelector("main");
  const stopResizeWatch = main ? refreshOnContentResize(main) : () => {};

  return () => {
    stopResizeWatch();
    media.revert();
  };
}
