/**
 * Billetterie : Pretix gère produits, panier, checkout et billets ; Stripe y est branché
 * comme moyen de paiement. Le site n'embarque que les boutons officiels du widget Pretix.
 *
 * URL publique de la boutique de l'événement, avec le « / » final
 * (ex. "https://pretix.eu/organisateur/evenement/"). `null` tant qu'elle n'existe pas :
 * les boutons restent inactifs et aucun script tiers n'est chargé.
 */
export const pretixShopUrl: string | null = null;

/** Séances proposées (maquette « TicketCard », 85:3656). */
export interface Seance {
  id: string;
  surtitre: string;
  titre: string;
  description: string;
  prix: string;
  /**
   * Produits Pretix à mettre au panier, au format du widget (`item_12=1`).
   * Absent : le bouton ouvre la boutique complète.
   */
  pretixItems?: string;
}

export const seances: Seance[] = [
  {
    id: "parcours-adulte",
    surtitre: "Expérience nocturne",
    titre: "Parcours Adulte",
    description: "Une expérience plus intense après la tombée de la nuit. Déconseillé aux moins de 14 ans.",
    // Diffère des 15 € du programme : à arbitrer.
    prix: "À partir de 18 €",
  },
];
