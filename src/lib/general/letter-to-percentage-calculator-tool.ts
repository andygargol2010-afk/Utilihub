import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-letra-a-porcentaje",
  "Letter to Percentage Calculator",
  "educacion",
  "calculator",
  "Convert a letter grade (A, B+, C-, F, etc.) to a typical percentage equivalent using standard US scale.",
  [
    "letter to percentage calculator",
    "grade letter to percent",
    "calculadora letra a porcentaje",
    "nota letra a porcentaje",
    "A to percentage",
  ],
  {
    title: "Letter to Percentage Calculator — Convert A/B/C Grades | UtiliHub",
    description: "Free letter grade to percentage converter. Enter A, B+, C or F to get the typical percent range or average. Browser-only.",
    summaryEs: "Convierte una nota en letra (A, B+, C, F) a un porcentaje típico según la escala estándar de EE.UU.",
  },
);
tool.faq.push(faq("What scale is used?", "Standard US: A 90-100, B 80-89, C 70-79, D 60-69, F below 60. + and - adjust within the band."));
tool.faq.push(faq("Is this official?", "No. Schools vary. Use as a typical reference only."));

export const LETTER_TO_PERCENTAGE_CALCULATOR_TOOLS = [tool];
