import { makeTool, faq } from "./types";

const tool = makeTool(
  "conversor-millas-km",
  "Miles to Kilometers Converter",
  "conversiones",
  "converter",
  "Miles to km converter: enter miles and get kilometers instantly (1 mile = 1.609344 km) for runs, maps and road trips.",
  [
    "miles to km",
    "miles to km converter",
    "mile to km",
    "millas a km",
    "miles to kilometers",
    "conversor millas a km",
    "millas a kilómetros",
    "distance converter miles",
  ],
  {
    title: "Miles to Km Converter — Convert Miles to Kilometers Online | UtiliHub",
    description: "Convert miles to km instantly. 1 mile = 1.609344 km. Free miles to kilometers converter. No signup.",
    summaryEs: "Convertí millas a km al instante (1 milla = 1,609344 km) para carreras, mapas y viajes.",
  },
);
tool.faq.push(faq("Conversion factor?", "Exactly 1.609344 km per mile."));
tool.faq.push(faq("Negative values?", "Miles must be non-negative."));

export const MILES_TO_KM_CONVERTER_TOOLS = [tool];
