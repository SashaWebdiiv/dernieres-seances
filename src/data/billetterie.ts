/**
 * Billetterie : Pretix gère produits, panier, checkout et billets ; Stripe y est branché
 * comme moyen de paiement. Le site n'embarque que le widget officiel Pretix.
 *
 * URL publique de la boutique de l'événement, avec le « / » final
 * (ex. "https://pretix.eu/organisateur/evenement/"). `null` tant qu'elle n'existe pas :
 * la section affiche alors un encart d'attente et aucun script tiers n'est chargé.
 */
export const pretixShopUrl: string | null = null;
