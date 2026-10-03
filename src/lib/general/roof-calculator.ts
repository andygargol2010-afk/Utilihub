import { makeTool } from "./types";

/** Gap: deck and gravel cover boards and bulk fill. This estimates roof squares, shingle bundles, and ridge caps from plan size and pitch. */
export const ROOF_CALCULATOR_TOOLS = [
  makeTool(
    "calculadora-tejado",
    "Roof shingle calculator",
    "hogar",
    "formula",
    "Estimate roof squares, shingle bundles, and ridge caps from footprint, pitch, and waste.",
    [
      "roof shingle calculator",
      "how many shingles do I need",
      "roofing square calculator",
      "bundles of shingles",
      "calculadora de tejado",
      "calculadora de tejas",
      "cuantas tejas necesito",
      "paquetes de tejas asfalticas",
    ],
    {
      mode: "roof-calculator",
      title: "Roof shingle calculator — squares and bundles | UtiliHub",
      description:
        "Calculate roof area, squares, and shingle bundles from footprint, pitch, and waste. 3-tab and architectural presets. Free in the browser.",
    },
  ),
];
