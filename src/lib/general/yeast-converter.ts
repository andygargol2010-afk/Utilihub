import { makeTool } from "./types";

/** Gap: baker's percentage scales a formula; air fryer converts oven time. This swaps yeast types. */
export const YEAST_CONVERTER_TOOLS = [
  makeTool(
    "conversor-levadura",
    "Yeast conversion calculator",
    "cocina",
    "formula",
    "Convert instant, active dry, fresh, and osmotolerant yeast by weight, teaspoon, or packet.",
    [
      "yeast conversion calculator",
      "fresh yeast to instant",
      "active dry to instant yeast",
      "instant yeast to fresh",
      "yeast packet to grams",
      "conversor de levadura",
      "levadura fresca a instantanea",
      "levadura seca a fresca",
      "gramos de levadura por sobre",
      "equivalencia levadura pan",
    ],
    {
      mode: "yeast-converter",
      title: "Yeast Conversion Calculator | UtiliHub",
      description:
        "Convert instant, active dry, fresh, and osmotolerant yeast by grams, teaspoons, or packets. Baking ratios stay in the browser.",
    },
  ),
];
