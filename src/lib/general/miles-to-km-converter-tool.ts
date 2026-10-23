import { makeTool, faq } from "./types";

const tool = makeTool(
  "conversor-millas-km",
  "Miles to Kilometers Converter",
  "conversiones",
  "converter",
  "Convert miles to kilometers. 1 mile = 1.609344 km.",
  [
    "miles to km converter",
    "miles to kilometers",
    "conversor millas a km",
    "millas a kil\u00f3metros",
    "distance converter miles",
  ],
  {
    title: "Miles to Kilometers Converter | UtiliHub",
    description: "Free miles to km converter. Enter miles to get kilometers. Instant browser calculation.",
    summaryEs: "Convierte millas a kil\u00f3metros. 1 milla = 1.609344 km.",
  },
);
tool.faq.push(faq("Conversion factor?", "Exactly 1.609344 km per mile."));
tool.faq.push(faq("Negative values?", "Miles must be non-negative."));

export const MILES_TO_KM_CONVERTER_TOOLS = [tool];
