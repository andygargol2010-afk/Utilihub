import { makeTool } from "./types";

/** Gap: gutter orders sections; roof orders shingles. This estimates captured litres from roof area and rainfall. */
export const RAINWATER_CALCULATOR_TOOLS = [
  makeTool(
    "calculadora-agua-lluvia",
    "Rainwater harvesting calculator",
    "hogar",
    "formula",
    "Estimate litres and gallons captured from a roof for a storm and a year, plus how many barrels you need.",
    [
      "rainwater harvesting calculator",
      "rain barrel calculator",
      "roof runoff calculator",
      "how much rainwater can I collect",
      "rainwater collection litres",
      "calculadora de agua de lluvia",
      "calculadora de tanque de lluvia",
      "cuanta agua recoge un techo",
      "captacion de agua pluvial",
      "litros de lluvia por metro cuadrado",
    ],
    {
      mode: "rainwater-calculator",
      title: "Rainwater Harvesting Calculator | UtiliHub",
      description:
        "Calculate litres collected from roof area and rainfall, with runoff coefficient, first flush, and barrel count. Free, in the browser.",
    },
  ),
];