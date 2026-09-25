/**
 * Questions de la maquette (« Préparez votre visite », 85:3673). La maquette ne contient
 * aucune réponse : `null` signale une réponse à fournir par l'organisation.
 */
import { activites } from "./programme";

export interface FaqItem {
  question: string;
  answer: string[] | null;
}

export const faqItems: FaqItem[] = [
  { question: "Combien de temps dure le parcours ?", answer: null },
  {
    question: "À partir de quel âge ?",
    answer: activites.map((a) => `${a.titre} : ${a.public}.`),
  },
  { question: "Le parcours fait-il peur ?", answer: null },
  { question: "Peut-on venir déguisé ?", answer: null },
  { question: "Peut-on acheter des billets sur place ?", answer: null },
  { question: "L'événement est-il accessible PMR ?", answer: null },
  { question: "À quelle heure faut-il arriver ?", answer: null },
];
