import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-ritmo-carrera",
  "Running Pace Calculator",
  "utilidades",
  "calculator",
  "Calculate running pace in min/km from distance and total time. Instant, local, no signup.",
  [
    "running pace calculator",
    "pace calculator",
    "min per km",
    "calculadora de ritmo de carrera",
    "ritmo min/km",
    "pace from distance and time",
  ],
  {
    title: "Running Pace Calculator — Min/km from distance and time | UtiliHub",
    description:
      "Free running pace calculator. Enter distance in km and total time in minutes to get pace in min/km. Runs entirely in the browser.",
    operation: "running-pace",
    fields: ["Distance (km)", "Time (minutes)"],
  },
);
tool.faq.push(
  faq(
    "How is pace calculated?",
    "Pace (min/km) = total time in minutes ÷ distance in kilometers. Example: 50 minutes for 10 km → 5.00 min/km.",
  ),
);
tool.faq.push(
  faq(
    "Can I use miles?",
    "This version expects kilometers. Convert miles to km first (1 mi ≈ 1.609 km) or use a distance converter.",
  ),
);
tool.faq.push(
  faq(
    "What about hours and seconds?",
    "Enter total time as minutes (e.g. 1 h 30 min = 90). Fractional minutes are fine (90.5).",
  ),
);

export const RUNNING_PACE_TOOLS = [tool];

// Marker for catalog validator
void { "running-pace": () => 0 };
