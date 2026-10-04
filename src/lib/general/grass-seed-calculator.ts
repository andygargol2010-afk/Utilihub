import { makeTool } from "./types";

/** Gap: sod counts rolls. This orders seed mass and bags for a new lawn, overseed, or patch. */
export const GRASS_SEED_CALCULATOR_TOOLS = [
  makeTool(
    "calculadora-semilla-cesped",
    "Grass seed calculator",
    "hogar",
    "formula",
    "Estimate grass seed weight and bags for a new lawn, overseed, or bare patch from area and a planning rate.",
    [
      "grass seed calculator",
      "how much grass seed do I need",
      "lawn seed coverage calculator",
      "overseeding calculator",
      "grass seed per square foot",
      "calculadora de semilla de cesped",
      "cuanta semilla de cesped necesito",
      "calculadora de resiembra",
      "kilos de semilla por metro cuadrado",
      "sacos de semilla de cesped",
    ],
    {
      mode: "grass-seed-calculator",
      title: "Grass Seed Calculator — Bags and Coverage | UtiliHub",
      description:
        "Estimate grass seed kilograms or pounds and bags for a new lawn, overseed, or patch. Free, in the browser.",
    },
  ),
];
