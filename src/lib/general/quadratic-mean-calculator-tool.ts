import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-media-cuadratica",
  "Quadratic Mean (RMS) Calculator",
  "matematicas",
  "calculator",
  "Calculate the quadratic mean (root mean square, RMS) of a list of numbers.",
  [
    "quadratic mean calculator",
    "rms calculator",
    "root mean square calculator",
    "media cuadratica",
    "calculadora media cuadratica",
  ],
  {
    title: "Quadratic Mean (RMS) Calculator — sqrt(sum(x²)/n) | UtiliHub",
    description: "Free quadratic mean / RMS calculator. Enter numbers to get the root mean square. Local browser calculation, no signup.",
    summaryEs: "Calcula la media cuadrática (RMS) de una lista de números.",
  },
);
tool.faq.push(
  faq(
    "What is the quadratic mean (RMS)?",
    "RMS = sqrt( Σ(x_i²) / n ). It is useful for signal magnitudes, AC voltages, and when larger values should weigh more than in the arithmetic mean.",
  ),
);
tool.faq.push(
  faq(
    "How does it differ from the arithmetic mean?",
    "The arithmetic mean treats all values equally. RMS squares them first, so outliers influence the result more. For non-negative numbers RMS ≥ arithmetic mean.",
  ),
);

export const QUADRATIC_MEAN_CALCULATOR_TOOLS = [tool];
