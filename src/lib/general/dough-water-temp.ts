import { makeTool } from "./types";

/** Gap: baker's percentage builds a formula; yeast converter swaps types. This solves mix water temperature. */
export const DOUGH_WATER_TEMP_TOOLS = [
  makeTool(
    "temperatura-agua-masa",
    "Dough water temperature calculator",
    "cocina",
    "formula",
    "Find the water temperature for a target dough temperature from flour, room, preferment, and mixer friction.",
    [
      "dough water temperature calculator",
      "desired dough temperature",
      "DDT calculator",
      "water temperature for bread dough",
      "friction factor bread",
      "temperatura del agua para masa",
      "temperatura deseada de la masa",
      "calculadora DDT pan",
      "factor de friccion amasadora",
      "temperatura agua panificacion",
    ],
    {
      mode: "dough-water-temp",
      title: "Dough Water Temperature Calculator | UtiliHub",
      description:
        "Calculate mix water temperature from desired dough temperature, flour, room, preferment, and friction. Celsius or Fahrenheit, in the browser.",
    },
  ),
];
