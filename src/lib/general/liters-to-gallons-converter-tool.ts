import { makeTool, faq } from "./types";

const tool = makeTool(
  "conversor-litros-galones",
  "Liters to Gallons Converter",
  "conversiones",
  "converter",
  "Convert liters to US gallons and gallons to liters instantly.",
  [
    "liters to gallons",
    "gallons to liters",
    "conversor litros galones",
    "litros a galones",
    "galones a litros",
  ],
  {
    title: "Liters to Gallons Converter — US Gallon | UtiliHub",
    description: "Free liters to gallons converter. Convert between liters and US gallons with instant results.",
  },
);
tool.faq.push(faq("What gallon is used?", "US liquid gallon (3.78541 liters). Imperial gallon is different."));
tool.faq.push(faq("Is the conversion exact?", "Uses the standard factor 3.78541. Results are rounded to 4 decimals."));

export const LITERS_TO_GALLONS_CONVERTER_TOOLS = [tool];
