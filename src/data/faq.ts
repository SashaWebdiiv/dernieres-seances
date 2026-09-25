/**
 * PROVISOIRE : questions construites à partir des seules informations déjà publiées
 * (evenement.ts). Rédaction définitive à reprendre de la maquette Figma Design.
 */
import {
  emailContact,
  exceptionProgramme,
  experiences,
  lieu,
  ouvertureBilletterieLisible,
  periodeLisible,
} from "./evenement";

export interface FaqItem {
  question: string;
  answer: string[];
}

export const faqItems: FaqItem[] = [
  {
    question: "Quand et où a lieu Dernières Séances ?",
    answer: [`${periodeLisible}, au ${lieu}.`],
  },
  {
    question: "Quelles expériences, et pour quel âge ?",
    answer: experiences.map((e) => `${e.nom} — ${e.age}, ${e.horaires}. ${e.tarif}.`),
  },
  {
    question: "Les horaires changent-ils le 31 octobre ?",
    answer: [exceptionProgramme],
  },
  {
    question: "Quand ouvre la billetterie ?",
    answer: [`${ouvertureBilletterieLisible}.`],
  },
  {
    question: "Comment nous contacter ?",
    answer: [`Par e-mail : ${emailContact}.`],
  },
];
