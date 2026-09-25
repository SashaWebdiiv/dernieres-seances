/**
 * Contenus de la première salle. Les faits (âges, horaires, tarifs) viennent de
 * `evenement.ts`, source unique partagée avec la page d'attente.
 *
 * PROVISOIRE : la correspondance « parcours enfant / adulte » avec les expériences
 * existantes est à confirmer, et les textes à reprendre de la maquette Figma Design.
 */
import { exceptionProgramme, experiences, type Experience } from "./evenement";

export interface ExperienceStep {
  id: string;
  title: string;
  lines: string[];
}

function experience(nom: string): Experience {
  const found = experiences.find((e) => e.nom === nom);
  if (!found) throw new Error(`Expérience introuvable dans evenement.ts : « ${nom} »`);
  return found;
}

function describe({ nom, age, horaires, tarif }: Experience): string[] {
  return [nom, `${age} · ${horaires}`, tarif];
}

export const experienceSteps: ExperienceStep[] = [
  { id: "parcours-enfant", title: "Parcours intérieur enfant", lines: describe(experience("Parcours immersif au Château")) },
  { id: "parcours-adulte", title: "Parcours intérieur adulte", lines: describe(experience("Expérience horrifique")) },
  { id: "jardin", title: "Activités du jardin", lines: describe(experience("Le Jardin Ensorcelé")) },
  { id: "parade", title: "La parade", lines: [exceptionProgramme] },
];
