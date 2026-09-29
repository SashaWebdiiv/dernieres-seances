/** Étapes de l'expérience, présentées dans le salon (maquette « Description », 67:788). */
export interface ExperienceStep {
  id: string;
  kicker: string;
  title: string;
  text: string;
}

export const experienceSteps: ExperienceStep[] = [
  {
    id: "classiques",
    kicker: "Des films devenus réalité",
    title: "Les classiques de l'horreur",
    text: "Alien, maisons hantées, tueurs, démons, cauchemars… Le château donne vie aux grands codes du cinéma d'horreur, salle après salle.",
  },
  {
    id: "histoire",
    kicker: "Regarder ne suffira pas",
    title: "Vous faites partie de l'histoire",
    text: "Observer, chercher, participer à un rituel, capturer une créature ou suivre des instructions pour survivre… Chaque pièce vous entraîne dans une nouvelle mécanique où le public devient acteur de ce qui se passe.",
  },
  {
    id: "regles",
    kicker: "Quelque chose échappe au contrôle",
    title: "Les règles changent",
    text: "Au début, tout semble parfaitement orchestré. Puis les personnages commencent à vous remarquer, les scènes déraillent et les frontières entre les films et votre réalité deviennent de plus en plus fragiles.",
  },
  {
    id: "sous-sol",
    kicker: "Certaines portes devraient rester fermées",
    title: "Le sous-sol",
    text: "Lorsque la seule issue vous mène vers les profondeurs du château, il est déjà trop tard pour faire demi-tour. Ce qui vous attend en bas n'aurait jamais dû être libéré.",
  },
];
