import { makeTool } from "./types";

/** Gap: studs count sticks; sheet goods count panels. This converts a lumber cut list into board feet. */
export const BOARD_FOOT_CALCULATOR_TOOLS = [
  makeTool(
    "calculadora-pies-tablares",
    "Board foot calculator",
    "hogar",
    "formula",
    "Convert a lumber cut list into board feet, cubic volume, and material cost from thickness, width, length, and piece count.",
    [
      "board foot calculator",
      "lumber board feet",
      "how many board feet in a 2x4",
      "nominal vs actual board feet",
      "board foot formula",
      "calculadora de pies tablares",
      "pies tablares de madera",
      "cuantos pies tablares tiene un 2x4",
      "medida nominal o cepillada",
      "volumen de madera en pies tablares",
    ],
    {
      mode: "board-foot-calculator",
      title: "Board Foot Calculator — Lumber Volume | UtiliHub",
      description:
        "Convert lumber thickness, width, and length into board feet, cubic feet, and cost. Nominal or dressed sizes. Free, in the browser.",
    },
  ),
];
