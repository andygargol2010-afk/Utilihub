import { makeTool, faq } from "./types";

const tool = makeTool(
  "conversor-gramos-libras",
  "Grams to Pounds Converter",
  "conversiones",
  "converter",
  "Convert grams to pounds and back. Exact conversion (1 lb = 453.59237 g). Runs fully in the browser.",
  [
    "grams to pounds",
    "g to lb",
    "gramos a libras",
    "conversor gramos libras",
    "weight converter grams pounds",
  ],
  {
    title: "Grams to Pounds Converter — g ↔ lb | UtiliHub",
    description: "Free grams to pounds converter. Convert g to lb instantly with the exact factor. Local, private, no signup.",
    summaryEs: "Convierte gramos a libras y viceversa. Conversión exacta (1 lb = 453.59237 g).",
  },
);
tool.faq.push(
  faq(
    "How do I convert grams to pounds?",
    "Divide the grams by 453.59237: lb = g / 453.59237.",
  ),
);
tool.faq.push(
  faq(
    "How many grams in a pound?",
    "There are exactly 453.59237 grams in one international avoirdupois pound.",
  ),
);

export const GRAMS_TO_POUNDS_CONVERTER_TOOLS = [tool];
