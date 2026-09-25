import { isMobile, prefersReducedMotion, prefersSaveData } from "./mediaQueries";

/**
 * Vidéos de scène : rien n'est téléchargé au chargement de la page. Chaque vidéo est
 * chargée quand sa scène arrive à moins d'un écran, dans la version adaptée à l'écran,
 * puis affichée par-dessus son image une fois la première image décodée.
 * Mouvement réduit ou économie de données : l'image reste seule.
 *
 * La lecture (boucle ou pilotage de `currentTime` au scroll) reste à décider par scène.
 */
export function initSceneVideos(): () => void {
  const videos = document.querySelectorAll<HTMLVideoElement>("video[data-scene-video]");
  if (videos.length === 0 || prefersReducedMotion() || prefersSaveData()) return () => {};

  const load = (video: HTMLVideoElement) => {
    const src = isMobile() ? video.dataset.srcMobile : video.dataset.srcDesktop;
    if (!src) return;
    video.addEventListener("loadeddata", () => video.classList.remove("opacity-0"), { once: true });
    video.src = src;
    video.load();
  };

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        entry.target.querySelectorAll<HTMLVideoElement>("video[data-scene-video]").forEach(load);
      }
    },
    { rootMargin: "100% 0px" },
  );

  videos.forEach((video) => {
    const scene = video.closest("[data-scene]");
    if (scene) observer.observe(scene);
  });

  return () => observer.disconnect();
}
