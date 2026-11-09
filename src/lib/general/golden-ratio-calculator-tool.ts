import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-ratio-dorado",
  "Golden Ratio Calculator",
  "diseno",
  "calculator",
  "Calculate golden ratio segments from a base length. φ ≈ 1.618.",
  [
    "golden ratio calculator",
    "calculadora ratio aureo",
    "calculadora ratio dorado",
    "golden ratio",
    "ratio aureo",
  ],
  {
    title: "Golden Ratio Calculator | UtiliHub",
    description: "Free golden ratio calculator. Enter a base length and get major/minor segments. Runs in your browser.",
    summaryEs: "Calcula segmentos de la proporción áurea a partir de una longitud base.",
  },
);
tool.faq.push(faq("What is the golden ratio?", "Approximately 1.618, often used in design and nature for aesthetically pleasing proportions."));

export const GOLDEN_RATIO_CALCULATOR_TOOLS = [tool];
