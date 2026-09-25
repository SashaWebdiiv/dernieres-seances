/** Publics présentés dans la première salle (maquette « Description », 67:788). */
export interface ExperienceStep {
  id: string;
  kicker: string;
  title: string;
  text: string;
}

export const experienceSteps: ExperienceStep[] = [
  {
    id: "enfants",
    kicker: "Parcours intérieur",
    title: "Enfants",
    text: "Une expérience immersive adaptée aux plus jeunes dans les pièces du château.",
  },
  {
    id: "adultes",
    kicker: "Parcours intérieur",
    title: "Adultes",
    text: "Lorsque la nuit tombe, le château change de visage.",
  },
  {
    id: "jardin",
    kicker: "Extérieur",
    title: "Le jardin",
    text: "Animations, maquillage et expériences autour du château.",
  },
  {
    id: "parade",
    kicker: "Extérieur",
    title: "La parade",
    text: "Les personnages quittent les salles du château pour envahir les rues de Sucy.",
  },
];
