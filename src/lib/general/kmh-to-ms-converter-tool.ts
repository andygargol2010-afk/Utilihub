import { makeTool, faq } from "./types";

const tool = makeTool(
  "conversor-kmh-ms",
  "km/h to m/s Converter",
  "conversiones",
  "converter",
  "Convert speed between kilometres per hour (km/h) and metres per second (m/s).",
  [
    "km/h to m/s",
    "m/s to km/h",
    "conversor km/h m/s",
    "convertir kmh a ms",
    "speed converter kmh ms",
  ],
  {
    title: "km/h to m/s Converter | UtiliHub",
    description:
      "Free converter between km/h and m/s. Instant, browser-only. 1 m/s = 3.6 km/h.",
    summaryEs: "Convierte velocidad entre kilómetros por hora (km/h) y metros por segundo (m/s).",
  },
);
tool.faq.push(
  faq(
    "What is the conversion factor?",
    "1 m/s = 3.6 km/h. To convert km/h → m/s divide by 3.6; the reverse multiplies by 3.6.",
  ),
);

export const KMH_TO_MS_CONVERTER_TOOLS = [tool];
