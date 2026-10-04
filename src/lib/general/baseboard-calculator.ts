import { makeTool } from "./types";

/** Gap: paint and wallpaper cover walls. This orders baseboard, casing, and shoe molding by room perimeter. */
export const BASEBOARD_CALCULATOR_TOOLS = [
  makeTool(
    "calculadora-zocalos",
    "Baseboard and trim calculator",
    "hogar",
    "formula",
    "Estimate baseboard sticks, shoe molding, and leftover from room perimeter, door openings, and waste.",
    [
      "baseboard calculator",
      "how much baseboard do I need",
      "trim calculator",
      "quarter round calculator",
      "baseboard linear feet",
      "calculadora de zocalos",
      "cuantos metros de rodapie",
      "calculadora de rodapie",
      "molduras de zocalo",
      "cuarto de rondana",
    ],
    {
      mode: "baseboard-calculator",
      title: "Baseboard Calculator — Sticks and Waste | UtiliHub",
      description:
        "Estimate baseboard and shoe-molding sticks from room perimeter, doors, and waste. Free, in the browser.",
    },
  ),
];
