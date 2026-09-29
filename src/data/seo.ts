/**
 * Données structurées schema.org (JSON-LD) du site immersif : l'événement, pour les
 * résultats enrichis « Événements » de Google. Tout est déduit des données du site
 * (programme, pied de page, billetterie) pour ne jamais diverger de ce qui est affiché.
 */
import { activites, rendezVous } from "./programme";
import { footerColumns } from "./footer";
import { ouvertureBilletterie } from "./evenement";

export const evenement = {
  nom: "Dernières Séances — Halloween 2026",
  description:
    "Du 28 octobre au 1er novembre 2026, le Château de Sucy ouvre ses portes pour Halloween : parcours immersif dès 8 ans, expérience horrifique, jardin ensorcelé et parade.",
  debut: "2026-10-28",
  fin: "2026-11-01",
  lieu: "Château de Sucy",
  /** Adresse du château, reprise dans le pied de page. */
  rue: "1 avenue Georges Pompidou",
  ville: "Sucy-en-Brie",
  codePostal: "94370",
  organisateur: "L'Acompagnie Improvisée",
  siteOrganisateur: "https://lacompagnie.net",
};

/** Tous les prix affichés (« 8 € », « 15 € »…), activités et stands compris. */
const prix = [...activites.flatMap((a) => a.tarifs), ...rendezVous.flatMap((r) => r.tarifs ?? [])]
  .map((t) => Number(t.prix.match(/\d+/)?.[0]))
  .filter((p) => Number.isFinite(p));

/** Réseaux et site de l'organisateur, repris du pied de page. */
const profils = (footerColumns.find((c) => c.title === "Suivez-nous")?.links ?? [])
  .map((l) => l.href)
  .filter((href): href is string => href !== null && href.startsWith("https://"));

export const eventJsonLd = (pageUrl: URL, images: URL[]) => ({
  "@context": "https://schema.org",
  "@type": "Event",
  name: evenement.nom,
  description: evenement.description,
  startDate: evenement.debut,
  endDate: evenement.fin,
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  inLanguage: "fr",
  url: pageUrl.href,
  image: images.map((image) => image.href),
  location: {
    "@type": "Place",
    name: evenement.lieu,
    address: {
      "@type": "PostalAddress",
      streetAddress: evenement.rue,
      addressLocality: evenement.ville,
      postalCode: evenement.codePostal,
      addressCountry: "FR",
    },
  },
  organizer: {
    "@type": "Organization",
    name: evenement.organisateur,
    url: evenement.siteOrganisateur,
    sameAs: profils,
  },
  offers: {
    "@type": "AggregateOffer",
    url: new URL("#billetterie", pageUrl).href,
    priceCurrency: "EUR",
    lowPrice: Math.min(...prix),
    highPrice: Math.max(...prix),
    availability: "https://schema.org/InStock",
    validFrom: ouvertureBilletterie,
  },
});
