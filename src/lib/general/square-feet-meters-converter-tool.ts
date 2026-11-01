import { makeTool, faq } from "./types";

const tool = makeTool(
  "conversor-pies2-m2",
  "Square Feet to Square Meters Converter",
  "utilidades",
  "converter",
  "Convert square feet to square meters and vice versa for area calculations.",
  [
    "square feet to square meters",
    "conversor pies cuadrados metros",
    "ft2 to m2",
    "area converter",
    "calculadora area pies metros",
  ],
  {
    title: "Square Feet to m² Converter | Area Converter | UtiliHub",
    description: "Free square feet to square meters converter. Convert ft² ↔ m² instantly for rooms, land, or construction. Browser calculation, EN+ES.",
    summaryEs: "Convierte pies cuadrados a metros cuadrados y viceversa.",
  },
);
tool.faq.push(faq("How to convert square feet to square meters?", "Multiply square feet by 0.092903 to get square meters. Or divide square meters by 0.092903 for square feet."));
tool.faq.push(faq("Is it exact?", "Uses the standard factor 1 ft² = 0.09290304 m². Sufficient for most practical uses."));

export const SQUARE_FEET_METERS_CONVERTER_TOOLS = [tool];
