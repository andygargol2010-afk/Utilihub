import { makeTool } from "./types";

/** Gap: pavers count patio units; concrete counts pour volume. This counts wall bricks and mortar bags. */
export const BRICK_CALCULATOR_TOOLS = [
  makeTool(
    "calculadora-ladrillos",
    "Brick and mortar calculator",
    "hogar",
    "formula",
    "Estimate wall bricks and mortar bags from area, brick size, joint, and openings.",
    [
      "brick calculator",
      "how many bricks do I need",
      "mortar bag calculator",
      "bricks per square meter",
      "brick wall calculator",
      "calculadora de ladrillos",
      "cuantos ladrillos necesito",
      "sacos de mortero por metro",
      "ladrillos por metro cuadrado",
      "pared de ladrillo",
    ],
    {
      mode: "brick-calculator",
      title: "Brick Calculator — Wall and Mortar | UtiliHub",
      description:
        "Estimate bricks and mortar bags for a single-wythe wall. Deduct openings, add waste, and use common brick sizes. Free, in the browser.",
    },
  ),
];
