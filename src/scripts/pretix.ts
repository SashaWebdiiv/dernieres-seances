/** Délai au-delà duquel un widget toujours absent est considéré en échec (réseau lent, bloqueur). */
const DELAI_ECHEC = 15_000;
/** Au-delà, on cesse de guetter un widget arrivé en retard (il resterait masqué derrière l'erreur sinon). */
const DELAI_ABANDON = 120_000;

/**
 * Vrai dès que Pretix a construit son widget dans l'hôte. Ne dépend pas de la structure
 * interne du widget (changée entre v1 et v2) : l'élément `<pretix-widget>` d'origine a été
 * remplacé, rempli ou doté d'un shadow DOM, ou un élément `pretix-widget…` est apparu.
 */
const widgetConstruit = (host: HTMLElement): boolean => {
  const element = host.querySelector("pretix-widget");
  return (
    element === null ||
    element.childElementCount > 0 ||
    element.shadowRoot !== null ||
    host.querySelector('[class*="pretix-widget"]') !== null
  );
};

/**
 * Charge le widget Pretix (script + feuille de style) une seule fois, quand un hôte
 * `[data-pretix]` arrive à moins d'un écran et demi. Rien n'est chargé au démarrage.
 * Le script de Pretix construit ses widgets même s'il arrive après le chargement de la page.
 *
 * États de l'hôte : `pretix-hote--pret` (widget affiché, message de chargement masqué),
 * `pretix-hote--erreur` (script en échec ou rien après 15 s : lien vers la boutique).
 */
export function loadPretixOnApproach(): () => void {
  const hosts = [...document.querySelectorAll<HTMLElement>("[data-pretix]")];
  if (hosts.length === 0) return () => {};

  // Vérification périodique : l'ajout d'un shadow DOM ne déclenche aucune mutation observable.
  const suivre = (host: HTMLElement) => {
    const debut = Date.now();
    const verifier = () => {
      if (widgetConstruit(host)) {
        host.classList.add("pretix-hote--pret");
        return window.clearInterval(minuteur);
      }
      const ecoule = Date.now() - debut;
      if (ecoule > DELAI_ECHEC) host.classList.add("pretix-hote--erreur");
      if (ecoule > DELAI_ABANDON) window.clearInterval(minuteur);
    };
    const minuteur = window.setInterval(verifier, 300);
  };

  const load = ({ script, stylesheet }: DOMStringMap) => {
    if (!script || !stylesheet || document.querySelector(`script[src="${script}"]`)) return;
    const link = Object.assign(document.createElement("link"), {
      rel: "stylesheet",
      href: stylesheet,
      crossOrigin: "anonymous",
    });
    const tag = Object.assign(document.createElement("script"), { src: script, async: true, crossOrigin: "anonymous" });
    tag.addEventListener("error", () => hosts.forEach((host) => host.classList.add("pretix-hote--erreur")));
    document.head.append(link, tag);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      hosts.forEach((host) => {
        suivre(host);
        load(host.dataset);
      });
    },
    { rootMargin: "150% 0px" },
  );
  hosts.forEach((host) => observer.observe(host));

  return () => observer.disconnect();
}
