import { makeTool } from "./types";

/** Gap: tile calculator counts pieces; grout sizes the joint. This orders thinset bags from trowel notch and area. */
export const THINSET_CALCULATOR_TOOLS = [
  makeTool(
    "calculadora-adhesivo-baldosas",
    "Tile adhesive calculator",
    "hogar",
    "formula",
    "Estimate thinset or tile adhesive kilograms and bags from area, trowel notch, and optional back-buttering.",
    [
      "thinset calculator",
      "tile adhesive coverage",
      "how much thinset do I need",
      "mortar coverage calculator",
      "back butter tile adhesive",
      "calculadora de adhesivo para baldosas",
      "cuanto cemento cola necesito",
      "calculadora de pegamento para azulejos",
      "cobertura de cemento cola",
      "sacos de adhesivo para baldosas",
    ],
    {
      mode: "thinset-calculator",
      title: "Tile Adhesive Calculator — Thinset Bags | UtiliHub",
      description:
        "Estimate thinset bags from area and trowel notch. Wall, floor, or large-format back-butter. Free, in the browser.",
    },
  ),
];
