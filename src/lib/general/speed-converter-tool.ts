import { makeTool, faq } from "./types";

const tool = makeTool(
  "conversor-velocidad",
  "Speed Converter",
  "conversiones",
  "converter",
  "Convert speeds between km/h, mph, m/s and knots instantly.",
  [
    "speed converter",
    "km/h to mph",
    "mph to km/h",
    "m/s to km/h",
    "conversor de velocidad",
    "km/h a mph",
    "conversor kmh mph",
  ],
  {
    title: "Speed Converter — km/h, mph, m/s, knots | UtiliHub",
    description: "Free speed converter. Convert between kilometers per hour, miles per hour, meters per second and knots. Accurate, browser-based.",
  },
);
tool.faq.push(faq("How do I convert km/h to mph?", "mph = km/h × 0.621371."));
tool.faq.push(faq("What is 1 m/s in km/h?", "1 m/s = 3.6 km/h."));

export const SPEED_CONVERTER_TOOLS = [tool];
