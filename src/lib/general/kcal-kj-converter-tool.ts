import { makeTool, faq } from "./types";

const tool = makeTool(
  "conversor-kcal-kj",
  "Calorie to Kilojoule Converter",
  "conversiones",
  "converter",
  "Convert between kilocalories (kcal) and kilojoules (kJ). 1 kcal = 4.184 kJ.",
  [
    "kcal to kj converter",
    "calorie to kilojoule",
    "conversor kcal kj",
    "calorias a kilojulios",
    "energy unit converter",
  ],
  {
    title: "Calorie to Kilojoule Converter (kcal ↔ kJ) | UtiliHub",
    description: "Free online converter between kilocalories (kcal) and kilojoules (kJ). Instant bidirectional conversion. Local calculation, no signup.",
    summaryEs: "Convierte entre kilocalorías (kcal) y kilojulios (kJ). 1 kcal = 4.184 kJ.",
  },
);
tool.faq.push(
  faq(
    "What is the conversion factor?",
    "1 kilocalorie (kcal) = 4.184 kilojoules (kJ). This is the thermochemical calorie used in nutrition.",
  ),
);
tool.faq.push(
  faq(
    "Is this the same as food calories?",
    "Yes. Nutrition labels use kcal (often labeled as Calories with capital C). This converter uses the standard 4.184 factor.",
  ),
);

export const KCAL_KJ_CONVERTER_TOOLS = [tool];
