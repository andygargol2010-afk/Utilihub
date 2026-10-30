import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-promedio-ponderado",
  "Weighted Mean Calculator",
  "educacion",
  "calculator",
  "Calculate the weighted average of a set of values with their respective weights.",
  [
    "weighted average calculator",
    "weighted mean calculator",
    "calculadora media ponderada",
    "promedio ponderado",
    "media ponderada calculadora",
  ],
  {
    title: "Weighted Mean Calculator — Promedio Ponderado | UtiliHub",
    description: "Free weighted average calculator. Enter values and weights to get the weighted mean instantly. No signup, browser-based.",
  },
);
tool.faq.push(faq("What is a weighted mean?", "A weighted mean is an average where some values contribute more than others, multiplied by their weights before dividing by the total weight."));

export const WEIGHTED_MEAN_CALCULATOR_TOOLS = [tool];
