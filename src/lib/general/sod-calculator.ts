import { makeTool } from "./types";

/** Gap: flooring counts indoor packs; pavers count patio pieces. This counts sod rolls, pallets, and optional starter bags for a lawn. */
export const SOD_CALCULATOR_TOOLS = [
  makeTool(
    "calculadora-cesped",
    "Sod roll calculator",
    "hogar",
    "formula",
    "Estimate sod rolls and pallets from lawn area, roll size, and waste, with optional starter-fertilizer bags.",
    [
      "sod calculator",
      "how much sod do I need",
      "sod roll calculator",
      "sod pallet calculator",
      "lawn sod calculator",
      "calculadora de cesped",
      "cuanto cesped necesito",
      "cesped en rollo",
      "rollos de cesped",
      "pallets de cesped",
    ],
    {
      mode: "sod-calculator",
      title: "Sod Calculator — Rolls and Pallets | UtiliHub",
      description:
        "Estimate sod rolls and pallets from lawn area, roll size, and waste. Optional starter-fertilizer bags. Free, in the browser.",
    },
  ),
];
