import { makeTool, faq } from "./types";

const tool = makeTool(
  "conversor-mpg-l100km",
  "MPG to L/100km Converter",
  "utilidades",
  "converter",
  "Convert US MPG to L/100km and vice versa for fuel efficiency.",
  [
    "mpg to l/100km",
    "conversor mpg litros 100km",
    "fuel efficiency converter",
    "millas por galon a l100",
    "consumo combustible",
  ],
  {
    title: "MPG to L/100km Converter | Fuel Efficiency | UtiliHub",
    description: "Free MPG to liters per 100 km converter. Convert US miles per gallon ↔ L/100km instantly. Browser calculation, EN+ES.",
    summaryEs: "Convierte millas por galón (MPG) a litros por 100 km y viceversa.",
  },
);
tool.faq.push(faq("How to convert MPG to L/100km?", "Divide 235.214 by the MPG value to get L/100km (US gallons)."));
tool.faq.push(faq("Is the factor exact?", "Uses the standard 235.214583 factor for US MPG. Sufficient for practical comparisons."));

export const MPG_L100KM_CONVERTER_TOOLS = [tool];
