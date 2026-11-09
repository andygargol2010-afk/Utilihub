import { makeTool, faq } from "./types";

const tool = makeTool(
  "conversor-peso",
  "Weight Converter",
  "conversiones",
  "converter",
  "Convert between kg, lb, oz, g, and more.",
  [
    "weight converter",
    "kg to lb",
    "conversor peso",
    "kg a libras",
  ],
  {
    title: "Weight Converter — kg, lb, oz | UtiliHub",
    description: "Free weight converter. Convert kilograms, pounds, ounces, grams instantly in the browser.",
  },
);
tool.faq.push(faq("Is it exact?", "Uses standard conversion factors."));

export const WEIGHT_CONVERTER_TOOLS = [tool];
