import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-escala-modular",
  "Modular Scale Calculator",
  "diseno",
  "calculator",
  "Generate a modular typography scale from a base size and ratio.",
  [
    "modular scale",
    "typography scale calculator",
    "type scale",
    "calculadora de escala modular",
    "escala tipográfica",
    "calculadora de escala tipográfica",
  ],
  {
    title: "Modular Scale Calculator — Typography Type Scale | UtiliHub",
    description: "Free modular scale calculator for typography. Enter base size and ratio to generate a harmonious font size scale. Browser-only, no signup.",
    summaryEs: "Genera una escala tipográfica modular a partir de un tamaño base y un ratio.",
  },
);
tool.faq.push(
  faq(
    "What is a modular scale?",
    "A modular scale multiplies a base font size by a constant ratio for each step up or down, creating harmonious typography sizes (e.g. 1.25 major third, 1.333 perfect fourth).",
  ),
  faq(
    "Which ratio should I use?",
    "Common ratios: 1.125 (minor second), 1.2 (minor third), 1.25 (major third), 1.333 (perfect fourth), 1.414 (augmented fourth), 1.5 (perfect fifth), 1.618 (golden ratio).",
  ),
);

export const MODULAR_SCALE_CALCULATOR_TOOLS = [tool];
