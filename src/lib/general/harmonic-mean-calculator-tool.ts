import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-media-armonica",
  "Harmonic Mean Calculator",
  "matematicas",
  "calculator",
  "Calculate the harmonic mean of a list of positive numbers.",
  [
    "harmonic mean calculator",
    "media armonica",
    "calculadora media armonica",
    "average of rates",
    "harmonic average",
  ],
  {
    title: "Harmonic Mean Calculator — n / Σ(1/x) | UtiliHub",
    description: "Free harmonic mean calculator. Enter positive numbers to get the harmonic average. Local browser calculation, no signup.",
    summaryEs: "Calcula la media armónica de una lista de números positivos.",
  },
);
tool.faq.push(
  faq(
    "What is the harmonic mean?",
    "H = n / Σ(1/x_i). It is the appropriate average for rates, speeds, or ratios (e.g. average speed over equal distances). Only defined for positive numbers.",
  ),
);
tool.faq.push(
  faq(
    "How does it differ from the arithmetic mean?",
    "The arithmetic mean treats values equally. The harmonic mean gives more weight to smaller values and is always ≤ the arithmetic mean for positive numbers.",
  ),
);

export const HARMONIC_MEAN_CALCULATOR_TOOLS = [tool];
