/**
 * Questions de la maquette (« Préparez votre visite », 85:3673), réponses fournies par
 * l'organisation. « À partir de quel âge ? » est déduite du programme : elle suit les
 * cartes d'activités si un âge change.
 */
import { activites, rendezVous } from "./programme";

export interface FaqItem {
  question: string;
  /** Un paragraphe par entrée. */
  answer: string[];
}

/** « 8 ans et + » → « dès 8 ans », « 4-7 ans » → « de 4 à 7 ans » : lisible dans une phrase. */
const enToutesLettres = (age: string) =>
  age.replace(/^(\d+) ans et \+$/, "dès $1 ans").replace(/^(\d+)-(\d+) ans$/, "de $1 à $2 ans");
const ageMinimum = (age: string) => Number(age.match(/\d+/)?.[0] ?? 0);

const ages = [
  ...[...activites]
    .sort((a, b) => ageMinimum(a.public) - ageMinimum(b.public))
    .map(({ titre, public: age, note }) => `${titre} : ${enToutesLettres(age)}${note ? ` (${note.toLowerCase()})` : ""}.`),
  ...rendezVous.filter((rdv) => rdv.mention).map((rdv) => `${rdv.titre} : ${rdv.mention?.toLowerCase()}.`),
];

export const faqItems: FaqItem[] = [
  {
    question: "Combien de temps dure le parcours ?",
    answer: [
      "Le parcours dure 15 minutes. Les sessions démarrent toutes les 10 minutes, pendant les horaires de chaque expérience.",
    ],
  },
  {
    question: "À partir de quel âge ?",
    answer: ages,
  },
  {
    question: "Le parcours fait-il peur ?",
    answer: [
      "Le Parcours immersif au château est pensé comme une activité familiale : les enfants y deviennent acteurs de leur propre histoire, sans frissons.",
      "L'Expérience horrifique, en revanche, est déconseillée aux personnes cardiaques : frissons garantis !",
    ],
  },
  {
    question: "Peut-on venir déguisé ?",
    answer: [
      "Avec plaisir ! Des maquilleuses seront sur place pour sublimer vos costumes, avant d'aller jeter des sorts à toutes les maisons sucyciennes.",
    ],
  },
  {
    question: "Peut-on acheter des billets sur place ?",
    answer: [
      "Oui, même si nous vous conseillons de réserver en ligne pour être sûr d'avoir votre place.",
      "Pendant l'événement, vous pourrez régler sur place en espèces ou par carte bancaire.",
    ],
  },
  {
    question: "L'événement est-il accessible PMR ?",
    answer: [
      "Oui. Le parcours est pensé pour être accessible à tous, et le château est équipé d'un ascenseur : les personnes à mobilité réduite peuvent profiter pleinement de l'expérience.",
    ],
  },
  {
    question: "À quelle heure faut-il arriver ?",
    answer: [
      "Si vous avez réservé en ligne, présentez-vous au moins 10 minutes avant votre créneau.",
      "Chaque session démarre à l'heure exacte : en cas de retard, nous ne pouvons pas garantir de vous proposer un autre créneau.",
    ],
  },
];
