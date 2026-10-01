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
  directeurPublication: "Sasha Cohen" as string | null,
};

/** Hébergeur du site en ligne (confirmé : Vercel). */
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

/**
 * Durées de conservation : les plus courtes possibles. Le RGPD impose une durée maximale
 * (le temps nécessaire à l'objet du traitement) ; seules les pièces comptables ont une
 * durée légale de conservation obligatoire.
 */
export const conservation = {
  preReservations:
    "supprimées une fois l'ouverture de la billetterie annoncée, et au plus tard à la fin de l'événement (1er novembre 2026)",
  billetterie:
    "le temps de l'événement et du traitement des éventuelles réclamations ; seules les pièces comptables (factures, justificatifs de vente) sont ensuite conservées, pendant la durée légale imposée par les obligations comptables et fiscales",
  contact: "le temps de traiter la demande, puis supprimées",
};

/**
 * Conditions de vente (`/cgv/`) : texte fourni par l'association. Seule la mention de TVA
 * reste à confirmer par le comptable ; `null` affiche un repère « [À compléter] ».
 */
export const cgv = {
  /** Provisoire, en attendant le comptable (ex. « TVA non applicable, article 293 B du CGI. »). */
  mentionTva: "TVA non applicable." as string | null,
};

/** Date affichée en tête des pages légales. À mettre à jour à chaque modification du contenu. */
export const miseAJour = "1er octobre 2026";

const manquantes = (champs: [string, string | null][]) =>
  champs.filter(([, valeur]) => valeur === null).map(([libelle]) => libelle);

/** Informations encore manquantes, signalées au build page par page. */
export const manquants = manquantes([
  ["forme juridique", editeur.forme],
  ["adresse du siège", editeur.siege],
  ["numéro RNA", editeur.rna],
  ["directeur de la publication", editeur.directeurPublication],
]);

export const manquantsCgv = manquantes([["mention de TVA", cgv.mentionTva]]);
