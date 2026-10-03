import { makeTool } from "./types";

/** Gap: fence and concrete size materials. This tool sizes a straight flight (risers, treads, run, stringer, Blondel). */
export const STAIR_CALCULATOR_TOOLS = [
  makeTool(
    "calculadora-escalera",
    "Stair calculator",
    "hogar",
    "formula",
    "Size a straight stair flight from floor-to-floor rise: riser count, tread depth, total run, stringer length, and Blondel comfort.",
    [
      "stair calculator",
      "rise and run calculator",
      "how many steps",
      "stringer length",
      "calculadora de escaleras",
      "peldaños y contrahuella",
      "longitud de zanca",
      "regla de blondel",
    ],
    {
      mode: "stair-calculator",
      title: "Stair calculator — rise, run, stringer | UtiliHub",
      description:
        "Calculate risers, treads, total run, stringer length, and angle from floor height. Blondel comfort check and residential presets. Free in the browser.",
    },
  ),
];
