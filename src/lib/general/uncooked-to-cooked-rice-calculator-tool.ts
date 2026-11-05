import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-arroz-crudo-a-cocido",
  "Uncooked to Cooked Rice Calculator",
  "cocina",
  "calculator",
  "Estimate cooked rice yield, water needed and approximate cooking time from uncooked grams (white or brown).",
  [
    "uncooked to cooked rice calculator",
    "rice yield calculator",
    "how much cooked rice from dry",
    "calculadora arroz crudo a cocido",
    "cuánto arroz cocido de crudo",
  ],
  {
    title: "Uncooked to Cooked Rice Calculator — Yield, Water & Time | UtiliHub",
    description: "Free rice calculator. Enter uncooked grams and type (white/brown) to get cooked weight, water and approximate cook time. Browser-only.",
    summaryEs: "Estima el rendimiento de arroz cocido, agua necesaria y tiempo aproximado a partir de gramos crudos (blanco o integral).",
  },
);
tool.faq.push(faq("Are the ratios exact?", "No. Typical volume/weight approximations. Adjust for your variety, pot and preference. Always follow package instructions."));

export const UNCOOKED_TO_COOKED_RICE_CALCULATOR_TOOLS = [tool];
