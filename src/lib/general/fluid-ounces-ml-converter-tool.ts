import { makeTool, faq } from "./types";

const tool = makeTool(
  "conversor-onzas-ml",
  "Fluid Ounces to ml Converter",
  "hogar",
  "converter",
  "Convert US fluid ounces (fl oz) to milliliters and back. Instant cooking and drink conversion (1 fl oz = 29.5735 ml). Runs fully in the browser.",
  [
    "fluid ounces to ml",
    "fl oz to ml converter",
    "onzas liquidas a ml",
    "conversor onzas mililitros",
    "oz to ml",
  ],
  {
    title: "Fluid Ounces to ml Converter — Fl Oz to Milliliters | UtiliHub",
    description: "Free fluid ounces to ml converter. Convert US fl oz to milliliters instantly. Local, private, no signup.",
    summaryEs: "Convierte onzas líquidas (fl oz) a mililitros y viceversa. Conversión de cocina y bebidas (1 fl oz = 29.5735 ml).",
  },
);
tool.faq.push(
  faq(
    "How many ml in a fluid ounce?",
    "In the US standard used here, 1 fluid ounce (fl oz) = 29.5735 ml.",
  ),
);
tool.faq.push(
  faq(
    "Is this exact?",
    "It uses the precise US fluid ounce definition of 29.5735 ml. Some recipes round to 30 ml.",
  ),
);

export const FLUID_OUNCES_ML_CONVERTER_TOOLS = [tool];
