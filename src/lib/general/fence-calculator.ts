import { makeTool } from "./types";

/** Gap: paint, drywall, tile, and concrete cover surfaces or pours, not fence posts, bays, and boards. */
export const FENCE_CALCULATOR_TOOLS = [
  makeTool(
    "calculadora-valla",
    "Fence calculator",
    "hogar",
    "formula",
    "Estimate fence posts, bays, rails, pickets or panels, and concrete bags from run length and spacing.",
    [
      "fence calculator",
      "fence post calculator",
      "how many fence posts",
      "picket fence calculator",
      "calculadora de valla",
      "calculadora de postes de cerca",
      "cuantos postes necesito",
      "tablas de cerca",
    ],
    {
      mode: "fence-calculator",
      title: "Fence calculator — posts, rails, and boards | UtiliHub",
      description:
        "Estimate fence posts, bays, rails, pickets or panels, and concrete bags from run length, spacing, and gates. Free in the browser.",
    },
  ),
];
