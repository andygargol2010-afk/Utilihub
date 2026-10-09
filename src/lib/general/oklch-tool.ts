import { makeTool } from "./types";

/** Gap: contrast and CSS clamp exist. Neither converts OKLCH, the CSS Color 4 polar form of OKLab. */
export const OKLCH_TOOLS = [
  makeTool(
    "convertidor-oklch",
    "OKLCH to hex converter",
    "diseno",
    "converter",
    "Convert a hex color to CSS oklch() and an in-gamut oklch() back to hex. Out-of-gamut values do not invent a hex.",
    [
      "oklch to hex converter",
      "hex to oklch converter",
      "css oklch color converter",
      "convert oklch to rgb",
      "convertidor oklch a hex",
      "convertidor hex a oklch",
      "conversor color oklch css",
      "oklch a hexadecimal",
    ],
    {
      mode: "oklch",
      title: "OKLCH to Hex Converter — CSS Color 4 | UtiliHub",
      description:
        "Convert #hex to oklch() and in-gamut oklch() to hex. Empty, invalid, or out-of-gamut colors do not invent a hex. Runs locally in the browser.",
    },
  ),
];
