import { makeTool } from "./types";

/** Gap: brick counts masonry units; insulation counts batts. This counts vinyl siding squares, panels, starter, and J-channel. */
export const SIDING_CALCULATOR_TOOLS = [
  makeTool(
    "calculadora-siding",
    "Vinyl siding calculator",
    "hogar",
    "formula",
    "Estimate vinyl siding squares, panels, starter strip, and J-channel from wall area, openings, and exposure.",
    [
      "vinyl siding calculator",
      "how many squares of siding do I need",
      "siding square calculator",
      "vinyl siding panels",
      "starter strip and j channel calculator",
      "calculadora de siding vinilico",
      "cuantos squares de siding necesito",
      "paneles de revestimiento exterior",
      "starter strip y canal J",
      "revestimiento vinilico por metro",
    ],
    {
      mode: "siding-calculator",
      title: "Vinyl Siding Calculator — Squares and Panels | UtiliHub",
      description:
        "Estimate vinyl siding squares, panels, starter strip, and J-channel from wall area. Deduct openings and add waste. Free, in the browser.",
    },
  ),
];
