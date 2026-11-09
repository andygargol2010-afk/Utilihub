import { makeTool } from "./types";

const tool = makeTool(
  "conversor-metros-pies",
  "Meters to Feet Converter",
  "conversiones",
  "converter",
  "Convert meters to feet and inches instantly. Accurate for everyday and construction use.",
  [
    "meters to feet",
    "m to ft converter",
    "conversor metros pies",
    "metros a pies",
    "length converter meters feet",
  ],
  {
    title: "Meters to Feet Converter | UtiliHub",
    description: "Free meters to feet converter. Enter meters to get feet and inches. Instant, private, no signup.",
    summaryEs: "Convierte metros a pies y pulgadas al instante.",
  },
);

export const METERS_TO_FEET_CONVERTER_TOOLS = [tool];
