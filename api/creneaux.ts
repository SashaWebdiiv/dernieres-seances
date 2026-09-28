/**
 * GET /api/creneaux — créneaux de la billetterie et places restantes, pour le sélecteur du site
 * (`src/components/ticketing/SelecteurCreneaux.astro`).
 *
 * Fonction Vercel (dossier `api/`) : le site Astro reste entièrement statique à côté.
 * Elle lit l'API REST de Pretix avec un jeton d'équipe en lecture seule, stocké dans la variable
 * d'environnement `PRETIX_TOKEN` de Vercel et jamais envoyé au navigateur.
 *
 * La réponse est mise en cache 30 s par le CDN de Vercel : Pretix est interrogé au plus deux fois
 * par minute, quel que soit le nombre de visiteurs. Le nombre de places affiché peut donc avoir
 * 30 s de retard ; Pretix revérifie de toute façon les places au moment du panier.
 *
 * Doc : https://docs.pretix.eu/dev/api/resources/subevents.html
 *       https://docs.pretix.eu/dev/api/resources/quotas.html
 */

/** Même organisateur et même événement que `pretixShopUrl` (`src/data/billetterie.ts`). */
const API = "https://pretix.eu/api/v1/organizers/lacompagnie/events/halloween26";

/**
 * Produit « une place » de chaque expérience. Le quota qui le contient pour un créneau donne les
 * places restantes de ce créneau (les combinés Duo, Trio et groupe puisent dans le même quota).
 * Ids visibles dans Pretix : Produits → le produit → adresse de la page.
 */
const PRODUITS_PLACE = {
  parcours: 1162101, // Adulte (14 ans et plus)
  horrifique: 1162102, // Sueurs Froides (14 ans et plus)
} as const;

const DELAI_REQUETE = 8_000;

/** Environnement Node de la fonction Vercel (évite d'ajouter `@types/node` au projet). */
declare const process: { env: Record<string, string | undefined> };

export type ExperienceId = keyof typeof PRODUITS_PLACE;

export interface Creneau {
  /** Id du créneau (« date » d'une série d'événements dans Pretix). */
  id: number;
  /** Jour à Paris, AAAA-MM-JJ. */
  jour: string;
  /** Heure de début à Paris, HH:MM. */
  heure: string;
  experience: ExperienceId;
  /** Places restantes ; `null` si le quota est illimité. 0 : complet. */
  places: number | null;
}

export interface ReponseCreneaux {
  /** Date de lecture dans Pretix (ISO 8601). */
  maj: string;
  creneaux: Creneau[];
}

interface PageApi<T> {
  count: number;
  next: string | null;
  results: T[];
}

interface SubEventApi {
  id: number;
  date_from: string;
  active: boolean;
  is_public?: boolean;
  presale_end: string | null;
}

interface QuotaApi {
  subevent: number | null;
  items: number[];
  available?: boolean;
  available_number?: number | null;
}

const lire = async <T>(url: string, jeton: string): Promise<PageApi<T>> => {
  const reponse = await fetch(url, {
    headers: { Authorization: `Token ${jeton}`, Accept: "application/json" },
    signal: AbortSignal.timeout(DELAI_REQUETE),
  });
  if (!reponse.ok) throw new Error(`Pretix ${reponse.status} sur ${new URL(url).pathname}`);
  return (await reponse.json()) as PageApi<T>;
};

/** Toutes les pages d'une liste (50 résultats au plus par page) : la première, puis les suivantes en parallèle. */
const lireTout = async <T>(chemin: string, jeton: string): Promise<T[]> => {
  const url = new URL(`${API}/${chemin}`);
  url.searchParams.set("page_size", "50");
  const premiere = await lire<T>(url.href, jeton);
  const pages = Math.ceil(premiere.count / 50);
  const suivantes = await Promise.all(
    Array.from({ length: Math.max(0, pages - 1) }, (_, i) => {
      const page = new URL(url);
      page.searchParams.set("page", String(i + 2));
      return lire<T>(page.href, jeton);
    }),
  );
  return [premiere, ...suivantes].flatMap((page) => page.results);
};

const heureDeParis = new Intl.DateTimeFormat("fr-FR", {
  timeZone: "Europe/Paris",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

const aParis = (iso: string) => {
  const parties = Object.fromEntries(heureDeParis.formatToParts(new Date(iso)).map((p) => [p.type, p.value]));
  return { jour: `${parties.year}-${parties.month}-${parties.day}`, heure: `${parties.hour}:${parties.minute}` };
};

const json = (corps: unknown, statut: number, cache: string) =>
  new Response(JSON.stringify(corps), {
    status: statut,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": cache },
  });

export async function GET(): Promise<Response> {
  const jeton = process.env.PRETIX_TOKEN;
  if (!jeton) return json({ erreur: "PRETIX_TOKEN absent" }, 503, "no-store");

  try {
    const [creneauxApi, quotas] = await Promise.all([
      lireTout<SubEventApi>("subevents/", jeton),
      lireTout<QuotaApi>("quotas/?with_availability=true", jeton),
    ]);

    // Pour chaque créneau : son expérience et le plus petit nombre de places parmi ses quotas.
    const parCreneau = new Map<number, { experience: ExperienceId; places: number | null }>();
    for (const quota of quotas) {
      if (quota.subevent === null) continue;
      const experience = (Object.keys(PRODUITS_PLACE) as ExperienceId[]).find((id) =>
        quota.items.includes(PRODUITS_PLACE[id]),
      );
      if (!experience) continue;
      const places = quota.available === false ? 0 : (quota.available_number ?? null);
      const connu = parCreneau.get(quota.subevent);
      const plusPetit = connu?.places == null ? places : places === null ? connu.places : Math.min(connu.places, places);
      parCreneau.set(quota.subevent, { experience, places: plusPetit });
    }

    const maintenant = Date.now();
    const creneaux = creneauxApi
      .filter(
        (c) =>
          c.active &&
          c.is_public !== false &&
          Date.parse(c.date_from) > maintenant &&
          (c.presale_end === null || Date.parse(c.presale_end) > maintenant),
      )
      .flatMap((c): Creneau[] => {
        const vente = parCreneau.get(c.id);
        return vente ? [{ id: c.id, ...aParis(c.date_from), ...vente }] : [];
      })
      .sort((a, b) => (a.jour + a.heure).localeCompare(b.jour + b.heure));

    const corps: ReponseCreneaux = { maj: new Date(maintenant).toISOString(), creneaux };
    return json(corps, 200, "public, max-age=0, s-maxage=30, stale-while-revalidate=30");
  } catch (erreur) {
    console.error("[creneaux]", erreur);
    return json({ erreur: "Pretix indisponible" }, 502, "no-store");
  }
}
