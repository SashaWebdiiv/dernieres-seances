/// <reference types="google.maps" />
import { mesurer } from "./consent";

/**
 * Carte du parcours de la parade (Google Maps, API JavaScript).
 *
 * Rien n'est demandé à Google avant un clic sur « Afficher la carte » : le chargement transmet
 * l'adresse IP du visiteur (voir la politique de confidentialité). Le choix est mémorisé dans le
 * navigateur ; aux visites suivantes, la carte se charge seule à l'approche de la section.
 * Style de la carte : Map ID (console Google Cloud). Sans clé, ou si le chargement échoue, il
 * reste le lien « Ouvrir dans Google Maps ».
 */
const STOCKAGE = "ds-carte-parade";
const RAPPEL = "__carteParadePrete";
const ZOOM_MAX = 18;

type Lieu = google.maps.LatLngLiteral;

declare global {
  interface Window {
    [RAPPEL]?: () => void;
    gm_authFailure?: () => void;
  }
}

let chargement: Promise<void> | undefined;

/** Script Google Maps (chargement asynchrone recommandé : `loading=async` + rappel). */
function chargerGoogleMaps(cle: string): Promise<void> {
  chargement ??= new Promise<void>((resolve, reject) => {
    window[RAPPEL] = () => resolve();
    const script = document.createElement("script");
    const parametres = new URLSearchParams({
      key: cle,
      v: "weekly",
      loading: "async",
      language: "fr",
      region: "FR",
      callback: RAPPEL,
    });
    script.src = `https://maps.googleapis.com/maps/api/js?${parametres}`;
    script.async = true;
    script.onerror = () => reject(new Error("script"));
    document.head.append(script);
  });
  return chargement;
}

/** `parcours` : ordre de passage du tracé (indices dans `lieux`), qui peut repasser par une étape. */
async function dessiner(conteneur: HTMLElement, mapId: string, lieux: Lieu[], parcours: number[]): Promise<void> {
  const [{ Map, Polyline }, { AdvancedMarkerElement }, { LatLngBounds, event }] = await Promise.all([
    google.maps.importLibrary("maps") as Promise<google.maps.MapsLibrary>,
    google.maps.importLibrary("marker") as Promise<google.maps.MarkerLibrary>,
    google.maps.importLibrary("core") as Promise<google.maps.CoreLibrary>,
  ]);

  const carte = new Map(conteneur, {
    mapId,
    // Le style du Map ID est associé au mode sombre : sans cela, la carte s'ouvre en mode clair
    // (style Google par défaut).
    colorScheme: "DARK",
    center: lieux[0],
    zoom: 17,
    disableDefaultUI: true,
    zoomControl: true,
    fullscreenControl: true,
    clickableIcons: false,
    // Un doigt fait défiler la page ; deux doigts (ou Ctrl + molette) déplacent la carte.
    gestureHandling: "cooperative",
  });

  const bornes = new LatLngBounds();
  lieux.forEach((lieu) => bornes.extend(lieu));
  carte.fitBounds(bornes, 48);
  event.addListenerOnce(carte, "idle", () => {
    if ((carte.getZoom() ?? 0) > ZOOM_MAX) carte.setZoom(ZOOM_MAX);
  });

  const trace = parcours.map((index) => lieux[index]).filter(Boolean);
  new Polyline({ map: carte, path: trace.length > 1 ? trace : lieux, strokeColor: "#f5a923", strokeOpacity: 0.9, strokeWeight: 4 });

  lieux.forEach((lieu, index) => {
    const pastille = document.createElement("span");
    pastille.className = "carte-etape";
    pastille.textContent = String(index + 1);
    new AdvancedMarkerElement({ map: carte, position: lieu, content: pastille, title: `Étape ${index + 1}` });
  });
}

export function initCarteParade(): void {
  const bloc = document.querySelector<HTMLElement>("[data-carte-parade]");
  const cle = bloc?.dataset.cle;
  const mapId = bloc?.dataset.mapId;
  if (!bloc || !cle || !mapId) return;

  const lieux = JSON.parse(bloc.dataset.lieux ?? "[]") as Lieu[];
  const parcours = JSON.parse(bloc.dataset.parcours ?? "[]") as number[];
  const canevas = bloc.querySelector<HTMLElement>("[data-carte-canevas]");
  const accord = bloc.querySelector<HTMLElement>("[data-carte-accord]");
  const bouton = bloc.querySelector<HTMLButtonElement>("[data-carte-afficher]");
  const statut = bloc.querySelector<HTMLElement>("[data-carte-statut]");
  if (!canevas || !accord || !bouton || !statut || lieux.length === 0) return;

  const echec = () => {
    canevas.hidden = true;
    accord.hidden = false;
    bouton.hidden = true;
    statut.textContent = "La carte n'a pas pu se charger. Utilisez le lien « Ouvrir dans Google Maps ».";
    mesurer("carte_parade_erreur");
  };
  // Appelée par Google si la clé est refusée (domaine non autorisé, API désactivée…).
  window.gm_authFailure = echec;

  let affichee = false;
  const afficher = async (memoriser: boolean) => {
    if (affichee) return;
    affichee = true;
    if (memoriser) {
      try {
        localStorage.setItem(STOCKAGE, "oui");
      } catch {
        // Stockage indisponible (navigation privée stricte) : la carte s'affiche quand même.
      }
    }
    bouton.disabled = true;
    statut.textContent = "Chargement de la carte…";
    try {
      await chargerGoogleMaps(cle);
      canevas.hidden = false;
      await dessiner(canevas, mapId, lieux, parcours);
      accord.hidden = true;
      statut.textContent = "";
      mesurer("carte_parade_affichee");
    } catch {
      echec();
    }
  };

  bouton.hidden = false;
  bouton.addEventListener("click", () => void afficher(true));

  let dejaAccepte = false;
  try {
    dejaAccepte = localStorage.getItem(STOCKAGE) === "oui";
  } catch {
    // Stockage indisponible : on redemandera.
  }
  if (!dejaAccepte) return;

  const observateur = new IntersectionObserver(
    (entrees) => {
      if (!entrees.some((entree) => entree.isIntersecting)) return;
      observateur.disconnect();
      void afficher(false);
    },
    { rootMargin: "600px 0px" },
  );
  observateur.observe(bloc);
}
