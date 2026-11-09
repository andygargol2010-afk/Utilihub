import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-horas-estudio",
  "Study Hours Calculator",
  "productividad",
  "calculator",
  "Calculate daily study hours needed to reach a total goal. Instant result for study planning. Runs fully in the browser.",
  [
    "study hours calculator",
    "hours of study needed",
    "calculadora horas de estudio",
    "study time calculator",
    "how many hours to study",
  ],
  {
    title: "Study Hours Calculator — Daily Hours to Reach Your Goal | UtiliHub",
    description: "Free study hours calculator. Enter total goal hours and days available to get the daily study time needed. Local, private, no signup.",
    summaryEs: "Calcula las horas diarias de estudio necesarias para alcanzar una meta total.",
  },
);
tool.faq.push(
  faq(
    "How do I calculate study hours?",
    "Daily hours = total goal hours / days available. Round up for practical planning.",
  ),
);
tool.faq.push(
  faq(
    "What if I have zero days?",
    "The calculator shows a message; you need at least one day.",
  ),
);

export const STUDY_HOURS_CALCULATOR_TOOLS = [tool];
