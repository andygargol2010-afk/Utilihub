import { makeTool, faq } from "./types";

const tool = makeTool(
  "conversor-color-hex",
  "Hex Color Converter",
  "diseno",
  "converter",
  "Convert HEX colors to RGB and HSL and back. Instant local conversion for design work.",
  [
    "hex to rgb",
    "hex to hsl",
    "rgb to hex",
    "color converter",
    "hex color converter",
    "conversor hex rgb",
    "conversor de colores hex",
    "hex a rgb",
  ],
  {
    title: "Hex Color Converter — HEX, RGB, HSL online | UtiliHub",
    description:
      "Free online hex color converter. Convert between HEX, RGB, and HSL instantly in your browser. No signup required.",
  },
);
tool.faq.push(
  faq(
    "What formats does it support?",
    "HEX (#RRGGBB or RRGGBB), RGB (0-255), and HSL (hue 0-360, saturation/lightness 0-100%).",
  ),
);
tool.faq.push(
  faq(
    "Does it handle alpha/transparency?",
    "No. This converter is for opaque colors only. Alpha requires separate handling.",
  ),
);
tool.faq.push(
  faq(
    "Is the conversion accurate?",
    "Yes, standard formulas are used for bidirectional conversion between the three formats.",
  ),
);

export const HEX_COLOR_CONVERTER_TOOLS = [tool];
