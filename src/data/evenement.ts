/** Données éditoriales de la page d'attente. */

export const emailContact = "contact@dernieresseances.fr";

/**
 * Endpoint des pré-réservations : application web Apps Script attachée au Google Sheet
 * de l'association. Elle enregistre la ligne puis notifie `emailContact`.
 * Voir docs/brancher-le-formulaire.md — toute modification du script exige un
 * nouveau déploiement, sans quoi l'ancienne version continue de répondre.
 *
 * Cette URL est publique par nature : c'est le navigateur du visiteur qui l'appelle.
 */
export const endpointFormulaire: string | null =
  "https://script.google.com/macros/s/AKfycbxEP90e1wWzTChMkM1182GMStf9Uies0lOg8X8lA5qfMoCpy7sGKu9-M1E1wWb60eE/exec";

/** Ouverture de la billetterie — heure de Paris (CEST en septembre). */
export const ouvertureBilletterie = "2026-09-29T00:00:00+02:00";

export const ouvertureBilletterieLisible = "Le 29 septembre 2026 à 00h00";

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
