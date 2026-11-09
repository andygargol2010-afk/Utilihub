import { makeTool, faq } from "./types";

const tool = makeTool(
  "conversor-tazas-ml",
  "Cups to ml Converter",
  "hogar",
  "converter",
  "Convert US cups to milliliters and back. Instant cooking conversion (1 cup = 236.588 ml). Runs fully in the browser.",
  [
    "cups to ml",
    "cup to ml converter",
    "tazas a ml",
    "conversor tazas mililitros",
    "cups ml",
  ],
  {
    title: "Cups to ml Converter — US Cup to Milliliters | UtiliHub",
    description: "Free cups to ml converter. Convert US cups to milliliters instantly. Local, private, no signup.",
    summaryEs: "Convierte tazas (US) a mililitros y viceversa. Conversión de cocina (1 taza = 236.588 ml).",
  },
);
tool.faq.push(
  faq(
    "How many ml in a cup?",
    "In the US standard used here, 1 cup = 236.588 ml.",
  ),
);
tool.faq.push(
  faq(
    "Is this exact?",
    "It uses the precise US cup definition of 236.588 ml. Some recipes round to 240 ml or 250 ml.",
  ),
);

export const CUPS_ML_CONVERTER_TOOLS = [tool];
