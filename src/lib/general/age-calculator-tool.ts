import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-edad",
  "Age Calculator",
  "fechas",
  "calculator",
  "Calculate exact age in years, months, and days from date of birth.",
  [
    "age calculator",
    "calculate age",
    "calculadora de edad",
    "edad exacta",
    "how old am i",
  ],
  {
    title: "Age Calculator — Exact Years, Months, Days | UtiliHub",
    description: "Free age calculator. Enter birth date to get precise age in years, months, and days. Browser-only.",
    summaryEs: "Calcula la edad exacta en años, meses y días a partir de la fecha de nacimiento.",
  },
);
tool.faq.push(
  faq(
    "How is age calculated?",
    "Age is computed by comparing the birth date to the current date, accounting for full years, months, and remaining days.",
  ),
);

export const AGE_CALCULATOR_TOOLS = [tool];
