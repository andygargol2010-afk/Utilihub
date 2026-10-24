import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-media-armonica",
  "Harmonic Mean Calculator",
  "educacion",
  "calculator",
  "Calculate the harmonic mean of a set of positive numbers. Useful for average rates, speeds and parallel resistances. Runs fully in the browser.",
  [
    "harmonic mean calculator",
    "calculadora media armonica",
    "harmonic average",
    "media armónica online",
    "average of rates",
  ],
  {
    title: "Harmonic Mean Calculator — Average of Rates Free | UtiliHub",
    description:
      "Free harmonic mean calculator. Enter positive numbers and get the harmonic mean instantly. Local, private, no signup.",
    summaryEs:
      "Calcula la media armónica de un conjunto de números positivos. Útil para tasas, velocidades promedio y resistencias en paralelo.",
  },
);
tool.faq.push(
  faq(
    "When should I use the harmonic mean instead of the arithmetic mean?",
    "Use the harmonic mean for rates or ratios (e.g. average speed over equal distances, parallel resistors). Prefer the arithmetic mean for simple averages of quantities.",
  ),
);
tool.faq.push(
  faq(
    "Why only positive numbers?",
    "The harmonic mean is defined for positive real numbers. Zeros and negatives make the reciprocal undefined or meaningless in this context.",
  ),
);

export const HARMONIC_MEAN_CALCULATOR_TOOLS = [tool];
