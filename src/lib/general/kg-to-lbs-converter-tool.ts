import { makeTool, faq } from "./types";

const tool = makeTool(
  "conversor-kg-libras",
  "Kg to Lbs Converter",
  "conversiones",
  "converter",
  "Convert kilograms to pounds and pounds to kilograms accurately.",
  [
    "kg to lbs",
    "kilograms to pounds",
    "conversor kg libras",
    "kilos a libras",
    "lbs to kg",
  ],
  {
    title: "Kg to Lbs Converter — Kilograms to Pounds | UtiliHub",
    description: "Free online kg to lbs converter. Instant, accurate conversion between kilograms and pounds. Runs in your browser.",
  },
);
tool.faq.push(faq("What is the conversion factor?", "1 kilogram = 2.20462262185 pounds. The tool uses a precise value."));
tool.faq.push(faq("Can I convert both ways?", "Yes, enter kg for lbs or lbs for kg."));

export const KG_TO_LBS_CONVERTER_TOOLS = [tool];
