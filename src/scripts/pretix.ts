/** Délai au-delà duquel un widget toujours absent est considéré en échec (réseau lent, bloqueur). */
const DELAI_ECHEC = 15_000;

/**
 * Charge le widget Pretix (script + feuille de style) une seule fois, quand un hôte
 * `[data-pretix]` arrive à moins d'un écran et demi. Rien n'est chargé au démarrage.
 * Le script de Pretix construit ses widgets même s'il arrive après le chargement de la page.
 * En cas d'échec, l'hôte reçoit `pretix-hote--erreur`, qui affiche un lien vers la boutique.
 */
export function loadPretixOnApproach(): () => void {
  const hosts = document.querySelectorAll<HTMLElement>("[data-pretix]");
  if (hosts.length === 0) return () => {};

  const signalerEchec = () => hosts.forEach((host) => host.classList.add("pretix-hote--erreur"));

  const load = ({ script, stylesheet }: DOMStringMap) => {
    if (!script || !stylesheet || document.querySelector(`script[src="${script}"]`)) return;
    const link = Object.assign(document.createElement("link"), { rel: "stylesheet", href: stylesheet });
    const tag = Object.assign(document.createElement("script"), { src: script, async: true });
    tag.addEventListener("error", signalerEchec);
    document.head.append(link, tag);

    window.setTimeout(() => {
      hosts.forEach((host) => {
        if (!host.querySelector(".pretix-widget")) host.classList.add("pretix-hote--erreur");
      });
    }, DELAI_ECHEC);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      hosts.forEach((host) => load(host.dataset));
    },
    { rootMargin: "150% 0px" },
  );
  hosts.forEach((host) => observer.observe(host));

  return () => observer.disconnect();
}
