import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-velocidad-distancia-tiempo",
  "Speed Distance Time Calculator",
  "ciencia",
  "calculator",
  "Calculate average speed from distance and time.",
  [
    "speed calculator",
    "distance time speed",
    "calculadora velocidad",
    "velocidad distancia tiempo",
  ],
  {
    title: "Speed Distance Time Calculator | UtiliHub",
    description: "Free speed calculator. Enter distance and time to get average speed in km/h, mph or m/s. Browser-only.",
    summaryEs: "Calcula la velocidad promedio a partir de distancia y tiempo.",
  },
);
tool.faq.push(
  faq(
    "What is the formula for speed?",
    "Speed = distance / time. The tool supports km/h, mph and m/s.",
  ),
);

export const SPEED_DISTANCE_TIME_CALCULATOR_TOOLS = [tool];
