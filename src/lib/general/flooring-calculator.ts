import { makeTool } from "./types";

/** Gap: tile calculator covers ceramic pieces; this estimates laminate/vinyl plank boxes, waste by layout, and underlay. */
export const FLOORING_CALCULATOR_TOOLS = [
  makeTool(
    "calculadora-suelo-laminado",
    "Laminate flooring calculator",
    "hogar",
    "formula",
    "Estimate laminate or vinyl plank boxes from room size, plank dimensions, layout waste, and pack coverage.",
    [
      "laminate flooring calculator",
      "how many boxes of laminate",
      "vinyl plank calculator",
      "flooring waste calculator",
      "calculadora suelo laminado",
      "cuantas cajas de laminado",
      "calculadora tarima flotante",
      "suelo vinilico cajas",
    ],
    {
      mode: "flooring-calculator",
      title: "Laminate flooring calculator — boxes to buy | UtiliHub",
      description:
        "Calculate laminate or vinyl plank boxes from room size, plank size, layout waste, and pack coverage. Includes underlay. Free in the browser.",
    },
  ),
];
