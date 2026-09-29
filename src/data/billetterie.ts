/**
 * Billetterie : Pretix gère produits, créneaux, panier, checkout et billets ; Stripe y est
 * branché comme moyen de paiement. Le site n'embarque que le widget officiel Pretix.
 *
 * URL publique de la boutique de l'événement, avec le « / » final
 * (ex. "https://pretix.eu/organisateur/evenement/"). `null` tant qu'elle n'existe pas :
 * la section affiche un encart d'attente et aucun script tiers n'est chargé.
 */
export const pretixShopUrl: string | null = "https://pretix.eu/lacompagnie/halloween26/";

/**
 * Sélecteur de créneau du site (jour → expérience → créneau, avec les places restantes), qui
 * renvoie ensuite vers la page Pretix du créneau pour le choix des billets et le paiement.
 * Données : fonction `api/creneaux.ts` (jeton Pretix `PRETIX_TOKEN` dans Vercel).
 * Si elle ne répond pas (jeton absent, Pretix indisponible, `astro dev`), le widget Pretix
 * s'affiche à la place : la vente ne dépend jamais du sélecteur.
 */
export const selecteurCreneaux = {
  actif: true,
  endpoint: "/api/creneaux",
  /** Correspondance avec `api/creneaux.ts` (clé) et `data/programme.ts` (titre, public, horaires). */
  experiences: [
    { id: "parcours", activite: "parcours-immersif" },
    { id: "horrifique", activite: "experience-horrifique" },
  ],
  /** Seuil sous lequel les places restantes sont mises en avant. */
  peuDePlaces: 5,
} as const;
