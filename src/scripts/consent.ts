/**
 * Consentement à la mesure d'audience (Google Analytics 4), selon les recommandations CNIL :
 * - rien n'est chargé chez Google avant « Tout accepter » ; refuser ou ignorer = aucune mesure ;
 * - le choix est gardé 6 mois dans le navigateur (localStorage, pas de cookie), puis redemandé ;
 * - « Gestion des cookies » (`[data-cookies-ouvrir]`) rouvre le bandeau à tout moment ;
 * - un retrait du consentement coupe la mesure immédiatement et efface les cookies `_ga`.
 */
const CLE = "ds-consentement";

interface Choix {
  analytique: boolean;
  date: number;
}

interface Reglages {
  id: string;
  domaines: string[];
  dureeChoixJours: number;
  dureeCookiesSecondes: number;
}

type Gtag = (...args: unknown[]) => void;
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
    [cle: `ga-disable-${string}`]: boolean;
  }
}

let reglages: Reglages | null = null;

const lire = (): Choix | null => {
  if (!reglages) return null;
  try {
    const choix = JSON.parse(localStorage.getItem(CLE) ?? "null") as Choix | null;
    const valide = choix && Date.now() - choix.date < reglages.dureeChoixJours * 86_400_000;
    return valide ? choix : null;
  } catch {
    return null;
  }
};

const enregistrer = (analytique: boolean) => {
  try {
    localStorage.setItem(CLE, JSON.stringify({ analytique, date: Date.now() } satisfies Choix));
  } catch {
    // Stockage indisponible (navigation privée stricte) : le choix vaut pour cette page seulement.
  }
};

const chargerGoogleAnalytics = () => {
  if (!reglages || window.gtag) return;
  const { id, domaines, dureeCookiesSecondes } = reglages;
  window[`ga-disable-${id}`] = false;
  if (!domaines.includes(location.hostname)) {
    console.info(`[mesure] consentement donné, mais ${location.hostname} n'est pas un domaine mesuré.`);
    return;
  }
  window.dataLayer = window.dataLayer ?? [];
  window.gtag = function gtag() {
    // gtag.js attend l'objet `arguments` lui-même, pas un tableau.
    window.dataLayer!.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", id, {
    cookie_expires: dureeCookiesSecondes,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
  const script = Object.assign(document.createElement("script"), {
    src: `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`,
    async: true,
  });
  document.head.append(script);
};

const effacerCookiesGoogle = () => {
  const morceaux = location.hostname.split(".");
  const domaines = ["", location.hostname, `.${location.hostname}`, `.${morceaux.slice(-2).join(".")}`];
  for (const cookie of document.cookie.split(";")) {
    const nom = cookie.split("=")[0].trim();
    if (!nom.startsWith("_ga")) continue;
    for (const domaine of domaines) {
      document.cookie = `${nom}=; Max-Age=0; path=/${domaine ? `; domain=${domaine}` : ""}`;
    }
  }
};

/** Envoie un événement GA4, seulement si la mesure est active (consentement donné). */
export const mesurer = (evenement: string, parametres: Record<string, string> = {}) => {
  if (lire()?.analytique && window.gtag) window.gtag("event", evenement, parametres);
};

export function initConsentement(): void {
  const bandeau = document.querySelector<HTMLElement>("[data-cookies]");
  if (!bandeau?.dataset.gaId) return;
  reglages = {
    id: bandeau.dataset.gaId,
    domaines: JSON.parse(bandeau.dataset.domaines ?? "[]") as string[],
    dureeChoixJours: Number(bandeau.dataset.dureeChoix),
    dureeCookiesSecondes: Number(bandeau.dataset.dureeCookies),
  };

  const afficher = (visible: boolean) => {
    bandeau.hidden = !visible;
    document.documentElement.classList.toggle("cookies-ouvert", visible);
  };

  const decider = (analytique: boolean) => {
    enregistrer(analytique);
    afficher(false);
    if (analytique) return chargerGoogleAnalytics();
    if (reglages) window[`ga-disable-${reglages.id}`] = true;
    effacerCookiesGoogle();
  };

  bandeau.querySelector("[data-cookies-accepter]")?.addEventListener("click", () => decider(true));
  bandeau.querySelector("[data-cookies-refuser]")?.addEventListener("click", () => decider(false));
  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element) || !event.target.closest("[data-cookies-ouvrir]")) return;
    afficher(true);
    // Focus sur le bandeau lui-même, pas sur un bouton : aucun choix n'est suggéré.
    bandeau.focus();
  });

  const choix = lire();
  if (choix === null) afficher(true);
  else if (choix.analytique) chargerGoogleAnalytics();
}
