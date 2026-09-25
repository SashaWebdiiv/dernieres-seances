/**
 * Charge le widget Pretix (script + feuille de style) une seule fois, quand un bouton
 * `[data-pretix]` arrive à moins d'un écran et demi. Rien n'est chargé au démarrage.
 */
export function loadPretixOnApproach(): () => void {
  const hosts = document.querySelectorAll<HTMLElement>("[data-pretix]");
  if (hosts.length === 0) return () => {};

  const load = ({ script, stylesheet }: DOMStringMap) => {
    if (!script || !stylesheet || document.querySelector(`script[src="${script}"]`)) return;
    const link = Object.assign(document.createElement("link"), { rel: "stylesheet", href: stylesheet });
    const tag = Object.assign(document.createElement("script"), { src: script, async: true });
    document.head.append(link, tag);
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
