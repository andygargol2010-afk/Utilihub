import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-promedio-ponderado",
  "Weighted Average Calculator",
  "educacion",
  "calculator",
  "Calculate a weighted average from up to four values and their weights (grades, scores, etc.).",
  [
    "weighted average calculator",
    "weighted mean calculator",
    "grade weighted average",
    "calculadora promedio ponderado",
    "promedio ponderado",
    "media ponderada",
  ],
  {
    title: "Weighted Average Calculator — Grades & Scores | UtiliHub",
    description: "Free weighted average calculator. Enter up to four values and weights to get the weighted mean. Ideal for grades, scores or any weighted data. Browser-only.",
  },
);
tool.faq.push(faq("How is the weighted average calculated?", "Weighted average = (v1×w1 + v2×w2 + …) / (w1 + w2 + …). Empty or zero-weight slots are ignored."));
tool.faq.push(faq("Do weights need to sum to 100?", "No. Weights are relative. You can use percentages, points or any positive numbers."));

export const WEIGHTED_AVERAGE_CALCULATOR_TOOLS = [tool];
