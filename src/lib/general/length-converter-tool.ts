import { makeTool, faq } from "./types";

const tool = makeTool(
  "conversor-longitud",
  "Length Converter",
  "conversiones",
  "converter",
  "Convert between meters, centimeters, kilometers, inches, feet, yards, and miles.",
  [
    "length converter",
    "meters to feet",
    "conversor longitud",
    "metros a pies",
  ],
  {
    title: "Length Converter — m, cm, km, in, ft | UtiliHub",
    description: "Free length unit converter. Convert meters, feet, inches, miles and more instantly in the browser.",
  },
);
tool.faq.push(faq("Are conversions exact?", "Uses standard factors (1 m = 3.28084 ft, 1 mi = 1.60934 km)."));

export const LENGTH_CONVERTER_TOOLS = [tool];
