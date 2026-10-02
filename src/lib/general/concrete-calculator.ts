import { makeTool } from "./types";

/** Gap: tile and paint tools cover surfaces, not cast concrete volume or cement bags. */
export const CONCRETE_CALCULATOR_TOOLS = [
  makeTool(
    "calculadora-hormigon",
    "Concrete and cement bag calculator",
    "hogar",
    "formula",
    "Estimate wet concrete volume, cement bags, sand, and gravel for a slab or round columns.",
    [
      "concrete calculator",
      "cement bags",
      "slab volume",
      "calculadora de hormigon",
      "sacos de cemento",
      "metros cubicos de concreto",
      "dosificacion 1:2:3",
    ],
    {
      mode: "concrete-calculator",
      title: "Concrete calculator — volume and cement bags | UtiliHub",
      description:
        "Estimate cubic meters of concrete, cement bags, sand, and gravel for a slab or columns. Mix presets 1:3:5, 1:2:3, and 1:1.5:3. Free in the browser.",
    },
  ),
];
