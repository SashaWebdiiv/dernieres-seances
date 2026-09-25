import type { SceneAnimation } from "../../types/scene";
import { gsap, ScrollTrigger } from "./gsap";

export interface SceneAnimationContext {
  /** Facteur d'amplitude des mouvements : 1 sur desktop, réduit sur mobile. */
  amplitude: number;
}

type SceneAnimationFactory = (scene: HTMLElement, context: SceneAnimationContext) => void;

/** Lissage du scrub, en secondes : assez court pour rester lié au doigt, assez long pour adoucir. */
const SCRUB = 0.5;

/** Timeline couvrant toute la durée où la scène est épinglée. Durée arbitraire : 1 = scène entière. */
function sceneTimeline(scene: HTMLElement, triggerVars: ScrollTrigger.Vars = {}): gsap.core.Timeline {
  return gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: { trigger: scene, start: "top top", end: "bottom bottom", scrub: SCRUB, ...triggerVars },
  });
}

function select(scene: HTMLElement, selector: string): HTMLElement[] {
  return gsap.utils.toArray<HTMLElement>(selector, scene);
}

export const sceneAnimations: Record<SceneAnimation, SceneAnimationFactory> = {
  /** Façade : zoom lent vers l'entrée, le contenu s'efface, la nuit tombe (le décor s'éteint sur le noir). */
  hero(scene, { amplitude }) {
    sceneTimeline(scene)
      .to(select(scene, "[data-scene-media]"), { scale: 1 + 0.6 * amplitude, ease: "power1.in", duration: 1 }, 0)
      .to(select(scene, "[data-hero-content]"), { autoAlpha: 0, y: -60 * amplitude, duration: 0.3 }, 0)
      .to(select(scene, "[data-scene-media]"), { opacity: 0.6, duration: 1 }, 0);
  },

  /**
   * Hall : légère avancée, puis le regard glisse vers la droite. Le texte apparaît avec le
   * fondu d'entrée de la scène : il est donc lisible dès l'arrivée par le menu « L'expérience ».
   */
  hall(scene, { amplitude }) {
    const media = select(scene, "[data-scene-media]");
    const content = select(scene, "[data-scene-content]");
    sceneTimeline(scene)
      .fromTo(media, { scale: 1.06 }, { scale: 1.12, duration: 1 }, 0)
      .fromTo(content, { y: 0 }, { y: -30 * amplitude, duration: 0.7 }, 0)
      .to(content, { autoAlpha: 0, duration: 0.15 }, 0.7)
      .to(media, { xPercent: -5 * amplitude, ease: "power1.in", duration: 0.3 }, 0.7);
  },

  /** Première salle : le décor avance à peine, les publics se relaient, les points suivent. */
  experiences(scene, { amplitude }) {
    const steps = select(scene, "[data-step]");
    const dots = select(scene, "[data-step-dots] > li");
    let active = 0;
    const onUpdate = ({ progress }: ScrollTrigger) => {
      // Bascule au milieu du fondu entre deux étapes (voir les positions ci-dessous).
      const index = Math.min(steps.length - 1, Math.floor(progress * steps.length + 0.15));
      if (index === active) return;
      dots[active]?.removeAttribute("data-active");
      dots[index]?.setAttribute("data-active", "");
      active = index;
    };

    const timeline = sceneTimeline(scene, { onUpdate }).fromTo(
      select(scene, "[data-scene-media]"),
      { scale: 1 },
      { scale: 1.08, duration: steps.length },
      0,
    );

    // La première étape est visible dès l'arrivée (navigation directe comprise).
    steps.forEach((step, index) => {
      if (index > 0) timeline.from(step, { autoAlpha: 0, y: 30 * amplitude, duration: 0.25 }, index);
      if (index < steps.length - 1) timeline.to(step, { autoAlpha: 0, y: -30 * amplitude, duration: 0.25 }, index + 0.7);
    });
  },

  /** Retour dans le hall : panoramique vers l'escalier. */
  passage(scene, { amplitude }) {
    sceneTimeline(scene).fromTo(
      select(scene, "[data-scene-media]"),
      { scale: 1.12, xPercent: 4 * amplitude },
      { scale: 1.16, xPercent: -4 * amplitude, duration: 1 },
    );
  },

  /** Escalier : l'image descend pendant que l'on « monte », les partenaires apparaissent. */
  staircase(scene, { amplitude }) {
    sceneTimeline(scene)
      .fromTo(
        select(scene, "[data-scene-media]"),
        { scale: 1.2, yPercent: -6 * amplitude },
        { yPercent: 6 * amplitude, duration: 1 },
        0,
      )
      .from(select(scene, "[data-reveal]"), { autoAlpha: 0, y: 20 * amplitude, stagger: 0.1, duration: 0.2 }, 0.1);
  },

  /** Décor fixe : seules les transitions génériques s'appliquent. */
  still() {},
};
