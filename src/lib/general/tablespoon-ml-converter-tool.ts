import { makeTool, faq } from "./types";

const tool = makeTool(
  "conversor-cucharadas-ml",
  "Tablespoon to ml Converter",
  "hogar",
  "converter",
  "Convert tablespoons (tbsp) and teaspoons (tsp) to milliliters and back. Instant cooking conversion, US standard (1 tbsp = 15 ml). Runs fully in the browser.",
  [
    "tablespoon to ml",
    "tbsp to ml converter",
    "cucharadas a ml",
    "conversor cucharadas mililitros",
    "teaspoon to ml",
  ],
  {
    title: "Tablespoon to ml Converter — Tbsp and Tsp to Milliliters | UtiliHub",
    description: "Free tablespoon to ml converter. Convert US tablespoons and teaspoons to milliliters instantly. Local, private, no signup.",
    summaryEs: "Convierte cucharadas (tbsp) y cucharaditas (tsp) a mililitros y viceversa. Conversión de cocina estándar (1 cucharada = 15 ml).",
  },
);
tool.faq.push(
  faq(
    "How many ml in a tablespoon?",
    "In the US culinary standard used here, 1 tablespoon (tbsp) = 15 ml and 1 teaspoon (tsp) = 5 ml.",
  ),
);
tool.faq.push(
  faq(
    "Is this exact?",
    "It uses the common US cooking approximation of 15 ml per tablespoon. Metric recipes sometimes use 15 ml exactly or 14.8 ml.",
  ),
);

export const TABLESPOON_ML_CONVERTER_TOOLS = [tool];
