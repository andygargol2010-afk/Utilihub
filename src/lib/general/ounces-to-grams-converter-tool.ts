import { makeTool, faq } from "./types";

const tool = makeTool(
  "conversor-onzas-gramos",
  "Ounces to Grams Converter",
  "conversiones",
  "converter",
  "Convert ounces to grams instantly. 1 oz = 28.3495 g.",
  [
    "ounces to grams",
    "oz to g converter",
    "conversor onzas a gramos",
    "onzas a gramos",
    "convert oz to grams",
  ],
  {
    title: "Ounces to Grams Converter — oz to g | UtiliHub",
    description: "Free ounces to grams converter. Enter ounces and get grams instantly. Accurate conversion factor 28.3495.",
  },
);
tool.faq.push(faq("What is the conversion factor?", "1 ounce = 28.349523125 grams (international avoirdupois)."));
tool.faq.push(faq("Does it handle decimals?", "Yes. Enter any non-negative number."));

export const OUNCES_TO_GRAMS_CONVERTER_TOOLS = [tool];
