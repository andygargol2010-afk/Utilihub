import { makeTool } from "./types";

/** Gap: gravel orders open aggregate by area and depth. This sizes soil for boxed raised beds, with a compost blend and bag count. */
export const RAISED_BED_CALCULATOR_TOOLS = [
  makeTool(
    "calculadora-jardinera",
    "Raised bed soil calculator",
    "hogar",
    "formula",
    "Estimate soil volume, compost blend, and bags for raised garden beds from length, width, fill height, and bed count.",
    [
      "raised bed soil calculator",
      "how much soil for a raised garden bed",
      "raised bed cubic yards",
      "garden box soil calculator",
      "compost blend for raised bed",
      "calculadora de jardinera",
      "cuanta tierra para un bancal",
      "volumen de sustrato para huerto elevado",
      "sacos de tierra para jardinera",
      "mezcla compost bancal",
    ],
    {
      mode: "raised-bed-calculator",
      title: "Raised Bed Soil Calculator — Bags and Mix | UtiliHub",
      description:
        "Estimate cubic meters or cubic yards of soil, compost, and bags for raised garden beds. Free, in the browser.",
    },
  ),
];
