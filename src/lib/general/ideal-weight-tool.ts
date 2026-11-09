import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-peso-ideal",
  "Ideal Weight Calculator",
  "productividad",
  "calculator",
  "Estimate ideal body weight using Devine, Robinson and Miller formulas. Runs fully in the browser.",
  [
    "ideal weight calculator",
    "healthy weight calculator",
    "devine formula",
    "calculadora de peso ideal",
    "peso saludable",
    "formula de devine",
  ],
  {
    title: "Ideal Weight Calculator — Devine, Robinson & Miller | UtiliHub",
    description:
      "Free ideal weight calculator. Enter height and sex to see estimates from common formulas. Instant, local, no signup.",
  },
);
tool.faq.push(
  faq(
    "Which formula should I use?",
    "Devine is common in clinical settings. Robinson and Miller are alternatives. They are estimates for adults; individual factors matter more.",
  ),
);
tool.faq.push(
  faq(
    "Is this medical advice?",
    "No. These are simple population-based estimates. Consult a healthcare professional for personalized guidance.",
  ),
);

export const IDEAL_WEIGHT_TOOLS = [tool];
