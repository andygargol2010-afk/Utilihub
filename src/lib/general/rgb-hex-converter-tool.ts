import { makeTool, faq } from "./types";

const tool = makeTool(
  "conversor-rgb-hex",
  "RGB to HEX Converter",
  "conversiones",
  "converter",
  "Convert RGB color values (0-255) to HEX color code.",
  [
    "rgb to hex",
    "rgb hex converter",
    "conversor rgb hex",
    "color rgb a hexadecimal",
  ],
  {
    title: "RGB to HEX Converter — Conversor RGB a HEX | UtiliHub",
    description: "Free RGB to HEX converter. Enter red, green and blue values to get the HEX color code instantly.",
  },
);
tool.faq.push(faq("How does RGB to HEX work?", "Each channel (0-255) is converted to a two-digit hexadecimal value and prefixed with #."));

export const RGB_HEX_CONVERTER_TOOLS = [tool];
