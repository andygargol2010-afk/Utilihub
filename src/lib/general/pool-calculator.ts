import { makeTool } from "./types";

/** Gap: gravel is loose volume; deck and roof are materials. This estimates pool water volume and a labeled chlorine dose. */
export const POOL_CALCULATOR_TOOLS = [
  makeTool(
    "calculadora-piscina",
    "Pool Volume Calculator",
    "hogar",
    "formula",
    "Estimate pool volume in liters and gallons from shape and depth, plus a labeled chlorine dose and one turnover time.",
    [
      "pool volume calculator",
      "pool volume liters",
      "calculate pool gallons",
      "pool gallon calculator",
      "how many gallons in my pool",
      "swimming pool liters",
      "chlorine dose calculator",
      "calculadora de piscina",
      "litros de piscina",
      "galones de piscina",
      "volumen de alberca",
      "dosis de cloro piscina",
    ],
    {
      mode: "pool-calculator",
      title: "Pool Volume Calculator — Gallons, Liters & m³ Free | UtiliHub",
      description:
        "Calculate rectangular, round, or oval pool volume in liters, cubic meters, and gallons. Optional chlorine dose and turnover time. Free in the browser.",
    },
  ),
];
