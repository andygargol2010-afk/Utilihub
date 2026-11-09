import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-factor-de-escala",
  "Scale Factor Calculator",
  "diseno",
  "calculator",
  "Calculate the scale factor between an original size and a scaled size.",
  [
    "scale factor calculator",
    "calculadora factor de escala",
    "factor de escala",
    "scale factor",
    "design scale",
  ],
  {
    title: "Scale Factor Calculator | Design & Models | UtiliHub",
    description: "Free scale factor calculator. Enter original and scaled sizes to get the factor and percentage. Browser-only, no signup.",
    summaryEs: "Calcula el factor de escala entre un tamaño original y un tamaño escalado.",
  },
);
tool.faq.push(
  faq(
    "What is a scale factor?",
    "The scale factor is scaled size ÷ original size. A factor of 2 means twice as large; 0.5 means half.",
  ),
  faq(
    "Can I use it for maps or models?",
    "Yes. Useful for models, drawings, maps, or any proportional scaling.",
  ),
);

export const SCALE_FACTOR_CALCULATOR_TOOLS = [tool];
