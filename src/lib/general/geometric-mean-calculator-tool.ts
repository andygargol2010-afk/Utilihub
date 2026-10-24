import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-media-geometrica",
  "Geometric Mean Calculator",
  "educacion",
  "calculator",
  "Calculate the geometric mean of a set of positive numbers. Useful for average growth rates and ratios. Runs fully in the browser.",
  [
    "geometric mean calculator",
    "media geometrica",
    "calculadora media geometrica",
    "geometric average",
    "growth rate mean",
  ],
  {
    title: "Geometric Mean Calculator — Average Growth | UtiliHub",
    description:
      "Free geometric mean calculator. Enter positive numbers to compute the geometric mean instantly. Perfect for rates and ratios. Local, private.",
    summaryEs: "Calcula la media geométrica de un conjunto de números positivos. Ideal para tasas de crecimiento.",
  },
);
tool.faq.push(
  faq(
    "What is the geometric mean?",
    "The geometric mean is the n-th root of the product of n numbers. It is useful when averaging ratios or growth rates.",
  ),
);
tool.faq.push(
  faq(
    "Why only positive numbers?",
    "The geometric mean is defined for positive real numbers. Negative or zero values are not allowed.",
  ),
);

export const GEOMETRIC_MEAN_CALCULATOR_TOOLS = [tool];
