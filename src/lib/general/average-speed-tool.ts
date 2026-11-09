import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-velocidad-media",
  "Average Speed Calculator",
  "ciencia",
  "calculator",
  "Calculate average speed from distance and time. Supports km/h and mph. Instant results in the browser.",
  [
    "average speed calculator",
    "speed calculator",
    "distance time speed",
    "calculadora velocidad media",
    "velocidad promedio",
    "calcular velocidad media",
  ],
  {
    title: "Average Speed Calculator — Distance & time to speed | UtiliHub",
    description:
      "Free average speed calculator. Enter distance and time to get speed in km/h or mph. Simple formula, runs locally in the browser.",
  },
);
tool.faq.push(
  faq(
    "What is the formula?",
    "Average speed = distance ÷ time. Convert units so distance and time are consistent (e.g. km and hours for km/h).",
  ),
);
tool.faq.push(
  faq(
    "Can I use minutes or seconds?",
    "Yes. Enter time in hours (e.g. 0.5 for 30 minutes) or use the unit selector if available. Results update instantly.",
  ),
);

export const AVERAGE_SPEED_TOOLS = [tool];
