import { makeTool } from "./types";

/** Gap: tile calculator counts pieces; caulk sizes a sealant bead. This orders grout bags from tile size and joint. */
export const GROUT_CALCULATOR_TOOLS = [
  makeTool(
    "calculadora-junta-baldosas",
    "Tile grout calculator",
    "hogar",
    "formula",
    "Estimate cement or epoxy grout kilograms and bags from tiled area, tile size, joint width, and depth.",
    [
      "grout calculator",
      "how much grout do I need",
      "tile grout coverage calculator",
      "grout bag calculator",
      "sanded grout coverage",
      "calculadora de junta de baldosas",
      "cuanta junta necesito",
      "calculadora de mortero de juntas",
      "kilos de junta por metro cuadrado",
      "sacos de junta para azulejos",
    ],
    {
      mode: "grout-calculator",
      title: "Grout Calculator — Bags and Coverage | UtiliHub",
      description:
        "Estimate grout bags from tile size, joint width, and depth. Sanded, unsanded, or epoxy. Free, in the browser.",
    },
  ),
];
