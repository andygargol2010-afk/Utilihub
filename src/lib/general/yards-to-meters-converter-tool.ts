import { makeTool, faq } from "./types";

const tool = makeTool(
  "conversor-yardas-metros",
  "Yards to Meters Converter",
  "conversiones",
  "converter",
  "Convert yards to meters and vice versa instantly. Accurate 1 yard = 0.9144 m.",
  [
    "yards to meters",
    "yardas a metros",
    "yards meters converter",
    "convertir yardas metros",
    "yard to meter",
  ],
  {
    title: "Yards to Meters Converter — Accurate Online | UtiliHub",
    description: "Free yards to meters converter. Enter yards or meters. Instant bidirectional conversion. Browser-only.",
    summaryEs: "Convierte yardas a metros y viceversa al instante. 1 yarda = 0.9144 m.",
  },
);
tool.faq.push(
  faq(
    "How many meters in a yard?",
    "Exactly 0.9144 meters per yard (international yard).",
  ),
);

export const YARDS_TO_METERS_CONVERTER_TOOLS = [tool];
