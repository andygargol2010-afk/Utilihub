import { makeTool } from "./types";

/** Gap: gravel orders bulk mulch by depth. This sizes a firewood stack in cords, steres, and weight. */
export const FIREWOOD_CALCULATOR_TOOLS = [
  makeTool(
    "calculadora-lena",
    "Firewood calculator",
    "hogar",
    "formula",
    "Estimate cords, face cords, steres, and weight of a stacked firewood pile from length, height, and log depth.",
    [
      "firewood calculator",
      "how many cords of wood",
      "cord of wood calculator",
      "face cord calculator",
      "firewood stack calculator",
      "calculadora de leña",
      "cuantas cuerdas de leña",
      "calculadora de estéreos de leña",
      "leña apilada metros cubicos",
      "peso de una cuerda de leña",
    ],
    {
      mode: "firewood-calculator",
      title: "Firewood Calculator — Cords and Weight | UtiliHub",
      description:
        "Estimate cords, face cords, steres, and weight of stacked firewood from stack size. Free, in the browser.",
    },
  ),
];
