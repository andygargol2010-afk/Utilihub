import { makeTool, faq } from "./types";

const tool = makeTool(
  "conversor-pulgadas-cm",
  "Inches to Centimeters Converter",
  "conversiones",
  "converter",
  "Convert inches to centimeters instantly. Exact 2.54 factor. Local, private, no signup.",
  [
    "inches to cm",
    "pulgadas a centimetros",
    "inches to centimeters converter",
    "convert inches to cm",
    "conversor pulgadas cm",
  ],
  {
    title: "Inches to CM Converter — Free Online | UtiliHub",
    description:
      "Free inches to centimeters converter. Enter inches and get cm instantly using the exact 2.54 factor. Browser-only.",
    summaryEs: "Convierte pulgadas a centímetros al instante. Factor exacto 2.54.",
  },
);
tool.faq.push(
  faq(
    "What is the conversion factor?",
    "Exactly 1 inch = 2.54 centimeters (international standard).",
  ),
);
tool.faq.push(
  faq(
    "Does it support decimals?",
    "Yes. Enter any non-negative number; results are shown with up to 4 decimal places.",
  ),
);

export const INCHES_TO_CM_CONVERTER_TOOLS = [tool];
