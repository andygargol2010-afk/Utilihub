import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-promedio-examenes",
  "Exam Average Calculator",
  "educacion",
  "calculator",
  "Calculate the average score of multiple exams or tests. Enter grades to get the mean, count of scores, and optional insights.",
  [
    "exam average",
    "test score average",
    "calculadora promedio examenes",
    "media de notas",
    "average exam scores",
    "promedio de calificaciones",
  ],
  {
    title: "Exam Average Calculator | Average Test Scores | UtiliHub",
    description: "Free exam average calculator. Compute the mean of multiple test scores with validation. EN+ES.",
    summaryEs: "Calcula el promedio de varias notas de exámenes o pruebas.",
  },
);
tool.faq.push(faq("How is the average calculated?", "Sum of all valid numeric scores divided by the number of scores entered."));
tool.faq.push(faq("What if some fields are empty?", "Empty or non-numeric values are ignored; only valid scores are included in the average."));

export const EXAM_AVERAGE_CALCULATOR_TOOLS = [tool];
