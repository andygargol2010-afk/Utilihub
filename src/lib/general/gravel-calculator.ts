import { makeTool } from "./types";

/** Gap: concrete sizes a wet mix. This orders loose gravel, mulch, or topsoil by area and depth. */
export const GRAVEL_CALCULATOR_TOOLS = [
  makeTool(
    "calculadora-grava",
    "Gravel and mulch calculator",
    "hogar",
    "formula",
    "Estimate cubic meters, tonnes, bags, and cubic yards of gravel, mulch, or topsoil from area and depth.",
    [
      "gravel calculator",
      "mulch calculator",
      "how much gravel do I need",
      "cubic yards calculator",
      "topsoil calculator",
      "calculadora de grava",
      "calculadora de mantillo",
      "metros cubicos de aridos",
      "cuanta grava necesito",
    ],
    {
      mode: "gravel-calculator",
      title: "Gravel and mulch calculator | UtiliHub",
      description:
        "Calculate gravel, mulch, or topsoil volume from area and depth. Tonnes, bags, cubic yards, and waste. Free in the browser.",
    },
  ),
];
