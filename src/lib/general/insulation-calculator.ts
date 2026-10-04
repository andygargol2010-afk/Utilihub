import { makeTool } from "./types";

/** Gap: drywall counts sheets; wallpaper counts rolls. This counts insulation batts, panels, and bags. */
export const INSULATION_CALCULATOR_TOOLS = [
  makeTool(
    "calculadora-aislamiento",
    "Insulation batt and roll calculator",
    "hogar",
    "formula",
    "Estimate insulation batts, rolls, and packages from wall or attic area, with openings and waste.",
    [
      "insulation calculator",
      "how many insulation batts do I need",
      "attic insulation calculator",
      "fiberglass batt coverage",
      "rockwool panel calculator",
      "calculadora de aislamiento",
      "cuantos paneles de aislante necesito",
      "lana de roca por metro",
      "aislamiento de buhardilla",
      "rollos de aislante termico",
    ],
    {
      mode: "insulation-calculator",
      title: "Insulation Calculator — Batts and Rolls | UtiliHub",
      description:
        "Estimate insulation batts, rolls, and packages from wall or attic area. Deduct openings and add waste. Free, in the browser.",
    },
  ),
];
