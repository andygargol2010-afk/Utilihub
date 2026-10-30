import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-media-ponderada",
  "Weighted Average Calculator",
  "educacion",
  "calculator",
  "Calculate the weighted average of a list of values with their weights.",
  [
    "weighted average calculator",
    "media ponderada",
    "calculadora media ponderada",
    "promedio ponderado",
    "weighted mean",
  ],
  {
    title: "Weighted Average Calculator — sum(value × weight) / sum(weight) | UtiliHub",
    description: "Free weighted average calculator. Enter values and weights (comma-separated) to get the weighted mean. Local browser calculation, no signup.",
    summaryEs: "Calcula la media ponderada de una lista de valores con sus pesos.",
  },
);
tool.faq.push(
  faq(
    "What is the formula?",
    "Weighted average = Σ(value × weight) / Σ(weight). Weights must sum to a positive number.",
  ),
);
tool.faq.push(
  faq(
    "What if weights are percentages?",
    "You can use any positive weights (0.3, 0.7 or 30, 70). The formula normalizes them.",
  ),
);

export const WEIGHTED_AVERAGE_CALCULATOR_TOOLS = [tool];
