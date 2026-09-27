/**
 * Informations des pages légales (mentions légales, politique de confidentialité).
 *
 * `null` : information que seule l'association peut fournir. La page affiche alors un
 * repère « [À compléter] » bien visible et le build le signale dans la console :
 * rien ne doit rester à `null` au moment de la mise en ligne.
 */
import { emailContact } from "./evenement";

export const editeur = {
  /** Nom de l'association tel que déclaré en préfecture. */
  nom: "L'Acompagnie Improvisée",
  /** Ex. « Association régie par la loi du 1er juillet 1901 ». */
  forme: null as string | null,
  /** Adresse du siège social. */
  siege: null as string | null,
  /** Numéro RNA (W + 9 chiffres), au Journal officiel des associations. */
  rna: null as string | null,
  /** Facultatif : seulement si l'association en a un. */
  siret: null as string | null,
  email: emailContact,
  telephone: { affiche: "+33 6 47 67 30 41", lien: "tel:+33647673041" },
  /** Prénom et nom de la personne responsable de la publication (en général la présidence). */
  directeurPublication: null as string | null,
};

/** Hébergeur du site en ligne. Vercel : à confirmer si le site est servi ailleurs. */
export const hebergeur = {
  nom: "Vercel Inc.",
  adresse: "440 N Barranca Ave #4133, Covina, CA 91723, États-Unis",
  telephone: "+1 559 288 7060",
  site: "https://vercel.com",
};

export const conception = { nom: "Webdiiv", site: null as string | null };

/** Prestataires qui traitent des données pour le compte de l'association. */
export const prestataires = {
  billetterie: {
    nom: "pretix GmbH",
    adresse: "Berthold-Mogel-Straße 1, 69126 Heidelberg, Allemagne",
    site: "https://pretix.eu",
  },
  paiement: {
    nom: "Stripe Payments Europe Ltd.",
    adresse: "One Wilton Park, Wilton Place, Dublin 2, Irlande",
    site: "https://stripe.com/fr/privacy",
  },
  formulaire: {
    nom: "Google Ireland Limited",
    adresse: "Gordon House, Barrow Street, Dublin 4, Irlande",
    site: "https://policies.google.com/privacy?hl=fr",
  },
};

/** Durées de conservation : propositions, à valider par le bureau de l'association. */
export const conservation = {
  preReservations: "jusqu'au 31 janvier 2027 au plus tard, puis supprimées",
  billetterie:
    "le temps de l'événement et du traitement des éventuelles réclamations, puis pendant la durée imposée par les obligations comptables et fiscales pour les pièces de vente",
  contact: "le temps de traiter la demande, et au plus tard un an après l'événement",
};

/** Date affichée en tête des deux pages. À mettre à jour à chaque modification du contenu. */
export const miseAJour = "27 septembre 2026";

/** Informations encore manquantes, signalées au build. */
export const manquants = [
  ["forme juridique", editeur.forme],
  ["adresse du siège", editeur.siege],
  ["numéro RNA", editeur.rna],
  ["directeur de la publication", editeur.directeurPublication],
]
  .filter(([, valeur]) => valeur === null)
  .map(([libelle]) => libelle as string);
