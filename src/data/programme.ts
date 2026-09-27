/**
 * Programme affiché dans le hall (maquette « Calendrier », 68:2602).
 *
 * ATTENTION : certains tarifs diffèrent de ceux publiés sur la page d'attente
 * (`evenement.ts`, Jardin « accès libre, stand à partir de 3 € ») — à arbitrer.
 */
export interface Tarif {
  label: string;
  prix: string;
}

export interface Activite {
  id: string;
  titre: string;
  description: string;
  public: string;
  /** Une entrée par ligne affichée. */
  horaires: string[];
  tarifs: Tarif[];
  note?: string;
}

export interface RendezVous {
  id: string;
  surtitre?: string;
  titre: string;
  /** Lignes mises en avant (ambre). */
  lignes: string[];
  tarifs?: Tarif[];
  mention?: string;
}

export const activites: Activite[] = [
  {
    id: "parcours-immersif",
    titre: "Parcours immersif au château",
    description:
      "Le maître des lieux recrute ! Traversez les salles, relevez les épreuves et tentez de rejoindre son équipe.",
    public: "8 ans et +",
    horaires: ["15h00 - 19h00", "(sauf sam. 31 oct. : 14h00 - 18h00)", "Sessions toutes les 10 minutes"],
    tarifs: [
      { label: "8-13 ans :", prix: "8 €" },
      { label: "14 ans et + :", prix: "15 €" },
    ],
  },
  {
    id: "experience-horrifique",
    titre: "Expérience horrifique",
    description:
      "Le noir. Les murmures. Une présence qui vous frôle sans prévenir... Entrez dans l'univers de M. Vanderbeck et confrontez-vous aux grands classiques de l'horreur.",
    public: "14 ans et +",
    horaires: ["20h00 - 23h30", "Sessions toutes les 10 minutes"],
    tarifs: [{ label: "Tarif :", prix: "15 €" }],
  },
  {
    id: "jardin-ensorcele",
    titre: "Le jardin ensorcelé",
    description: "Une aventure dans les jardins à la rencontre de personnages drôles et effrayants.",
    public: "4-7 ans",
    horaires: ["15h00 - 18h30", "(sauf sam. 31 oct. : 14h00 - 18h00)"],
    tarifs: [
      { label: "Tarif :", prix: "5 €" },
      { label: "Avec maquillage :", prix: "8 €" },
    ],
    note: "Accompagnement d'un adulte recommandé",
  },
];

export const rendezVous: RendezVous[] = [
  {
    id: "stand-maquillage",
    titre: "Stand maquillage",
    lignes: ["15h00 - 19h00", "(sam. 31 oct. : 14h00 - 18h00)"],
    tarifs: [
      { label: "Maquillage seul :", prix: "5 €" },
      { label: "Avec jardin ensorcelé :", prix: "8 €" },
    ],
    mention: "Petits et grands",
  },
  {
    id: "parade",
    surtitre: "31 octobre",
    titre: "Parade",
    lignes: ["À 18h30, départ du château", "Avec la participation de plusieurs associations sucyciennes"],
  },
];
