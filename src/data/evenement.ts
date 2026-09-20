/** Données éditoriales de la page d'attente. */

export const emailContact = "contact@dernieresseances.fr";

/**
 * TODO — brancher l'envoi des pré-réservations.
 * Tant que cette valeur vaut `null`, le formulaire reste inerte : il valide et
 * affiche un avis, mais n'envoie rien. Renseigner ici l'URL de l'endpoint
 * (Google Apps Script, Formspree, Brevo…) suffira à l'activer.
 */
export const endpointFormulaire: string | null = null;

/** Ouverture de la billetterie — heure de Paris (CEST en septembre). */
export const ouvertureBilletterie = "2026-09-28T00:00:00+02:00";

export const ouvertureBilletterieLisible = "Le 28 septembre 2026 à 00h00";

export interface Experience {
  age: string;
  /** Mode d'accès suivi du tarif, tels qu'affichés dans l'en-tête de la carte. */
  tarif: string;
  /** Le tarif de la première carte est en 11 px dans la maquette (libellé plus long). */
  tarifCompact?: boolean;
  nom: string;
  horaires: string;
  /** Seules les expériences sur réservation alimentent le menu du formulaire. */
  reservable: boolean;
}

export const experiences: Experience[] = [
  {
    age: "4–7 ans",
    tarif: "Accès libre - Stand à partir de 3€",
    tarifCompact: true,
    nom: "Le Jardin Ensorcelé",
    horaires: "15h–18h30",
    reservable: false,
  },
  {
    age: "Dès 8 ans",
    tarif: "Sur réservation - à partir de 8 €",
    nom: "Parcours immersif au Château",
    horaires: "15h–19h",
    reservable: true,
  },
  {
    age: "14 ans et +",
    tarif: "Sur réservation - 15 €",
    nom: "Expérience horrifique",
    horaires: "20h–23h30",
    reservable: true,
  },
];

export const exceptionProgramme =
  "Le samedi 31 octobre : horaires 14h–18h. Parade à 18h30 au départ du Château — venez déguisés.";
