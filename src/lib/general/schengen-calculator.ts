import { makeTool } from "./types";

/** Gap: jet-lag only subtracts UTC offsets. This counts Schengen presence days in a rolling 180-day window. */
export const SCHENGEN_CALCULATOR_TOOLS = [
  makeTool(
    "calculadora-schengen",
    "Schengen 90/180 calculator",
    "viajes",
    "formula",
    "Count days used and days left under the Schengen 90/180 short-stay rule from a list of entry and exit dates.",
    [
      "schengen 90/180 calculator",
      "schengen days remaining",
      "90 days in 180 calculator",
      "schengen stay calculator",
      "visa free schengen days",
      "calculadora schengen 90/180",
      "dias restantes schengen",
      "calculadora estancia schengen",
      "90 dias en 180",
      "contador de dias schengen",
    ],
    {
      mode: "schengen-calculator",
      title: "Schengen 90/180 Calculator — Days Left | UtiliHub",
      description:
        "Count days used and days left in the Schengen area under the 90 days in any 180-day rule. Entry and exit dates stay in the browser.",
    },
  ),
];
