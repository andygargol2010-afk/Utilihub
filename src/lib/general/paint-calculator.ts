import { makeTool } from "./types";

/** Gap: coste-pintura is area × price. This tool estimates liters and cans from coverage, coats, and waste. */
export const PAINT_CALCULATOR_TOOLS = [
  makeTool(
    "calculadora-pintura",
    "Paint coverage calculator",
    "hogar",
    "formula",
    "Estimate liters and paint cans from wall area, coats, coverage per liter, and waste.",
    [
      "paint calculator",
      "paint coverage calculator",
      "how much paint do I need",
      "liters of paint",
      "calculadora de pintura",
      "litros de pintura",
      "cuanta pintura necesito",
      "rendimiento pintura m2",
    ],
    {
      mode: "paint-calculator",
      title: "Paint calculator — liters and cans | UtiliHub",
      description:
        "Calculate liters of paint and cans to buy from wall size, openings, coats, and coverage. Latex, primer, and exterior presets. Free in the browser.",
    },
  ),
];
