import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-aceleracion",
  "Acceleration Calculator",
  "ciencia",
  "calculator",
  "Calculate acceleration from initial velocity, final velocity, and time. Instant results in the browser.",
  [
    "acceleration calculator",
    "calculate acceleration",
    "velocity time acceleration",
    "calculadora de aceleración",
    "calcular aceleración",
    "aceleración velocidad tiempo",
  ],
  {
    title: "Acceleration Calculator — Velocity & time to acceleration | UtiliHub",
    description:
      "Free acceleration calculator. Enter initial velocity, final velocity, and time to get acceleration in m/s² or ft/s². Simple physics formula, runs locally.",
  },
);
tool.faq.push(
  faq(
    "What is the formula for acceleration?",
    "Acceleration a = (final velocity - initial velocity) / time. Units must be consistent (e.g. m/s and seconds for m/s²).",
  ),
);
tool.faq.push(
  faq(
    "What if time is zero?",
    "Acceleration is undefined when time is zero. The tool shows a warning and does not divide by zero.",
  ),
);

export const ACCELERATION_TOOLS = [tool];
