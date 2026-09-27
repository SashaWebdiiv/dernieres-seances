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
  forme: "association régie par la loi du 1er juillet 1901" as string | null,
  /** Adresse du siège social. */
  siege: "21 rue du Moulin à Vent, 94370 Sucy-en-Brie" as string | null,
  /** Numéro RNA (W + 9 chiffres), au Journal officiel des associations. */
  rna: "W941017604" as string | null,
  /** Facultatif : seulement si l'association en a un. */
  siret: null as string | null,
  email: emailContact,
  telephone: { affiche: "+33 6 47 67 30 41", lien: "tel:+33647673041" },
  /**
   * Prénom et nom du représentant légal de l'association (présidence) : pour une personne
   * morale, c'est lui le directeur de la publication (loi n° 82-652, art. 93-2). Pas le
   * prestataire qui a réalisé le site.
   */
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

/**
 * Conditions générales de vente : choix que seul le bureau peut faire. `null` affiche
 * un repère « [À compléter] » avec une suggestion sur la page `/cgv/`.
 */
export const cgv: Record<"mentionTva" | "fraisReservation" | "echange" | "delaiRemboursement", string | null> = {
  mentionTva: "TVA non applicable, article 293 B du CGI.",
  fraisReservation: "Aucun frais ne s'ajoute au prix affiché.",
  /** Échange de créneau ou d'activité à la demande du client. */
  echange:
    "Un changement de créneau est possible jusqu'à 48 h avant, selon les disponibilités, sur demande par e-mail. Les billets ne sont pas remboursés.",
  /** Délai de remboursement si l'organisateur annule, inséré dans la phrase de l'article 9. */
  delaiRemboursement: "dans un délai de 30 jours",
};

/** Date affichée en tête des pages légales. À mettre à jour à chaque modification du contenu. */
export const miseAJour = "27 septembre 2026";

const manquantes = (champs: [string, string | null][]) =>
  champs.filter(([, valeur]) => valeur === null).map(([libelle]) => libelle);

/** Informations encore manquantes, signalées au build page par page. */
export const manquants = manquantes([
  ["forme juridique", editeur.forme],
  ["adresse du siège", editeur.siege],
  ["numéro RNA", editeur.rna],
  ["directeur de la publication", editeur.directeurPublication],
]);

export const manquantsCgv = manquantes([
  ["forme juridique", editeur.forme],
  ["adresse du siège", editeur.siege],
  ["mention de TVA", cgv.mentionTva],
  ["frais de réservation", cgv.fraisReservation],
  ["échange de billets", cgv.echange],
  ["délai de remboursement", cgv.delaiRemboursement],
]);
