import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-media-geometrica",
  "Geometric Mean Calculator",
  "matematicas",
  "calculator",
  "Calculate the geometric mean of a list of positive numbers.",
  [
    "geometric mean calculator",
    "media geometrica",
    "calculadora media geometrica",
    "geometric average",
    "product mean",
  ],
  {
    title: "Geometric Mean Calculator — (\u03a0 x)^(1/n) | UtiliHub",
    description: "Free geometric mean calculator. Enter positive numbers to get the geometric average. Local browser calculation, no signup.",
    summaryEs: "Calcula la media geométrica de una lista de números positivos.",
  },
);
tool.faq.push(
  faq(
    "What is the geometric mean?",
    "G = (\u03a0 x_i)^(1/n). It is the appropriate average for rates of change, growth factors, or multiplicative data. Only defined for positive numbers.",
  ),
);
tool.faq.push(
  faq(
    "How does it differ from the arithmetic mean?",
    "The arithmetic mean is the sum divided by n. The geometric mean is the nth root of the product and is always ≤ the arithmetic mean for positive numbers (by AM-GM inequality).",
  ),
);

export const GEOMETRIC_MEAN_CALCULATOR_TOOLS = [tool];
