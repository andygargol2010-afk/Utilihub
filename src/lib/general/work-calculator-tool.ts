import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-trabajo",
  "Work Calculator",
  "ciencia",
  "calculator",
  "Calculate work done from force and distance. Result in joules.",
  [
    "work calculator",
    "physics work",
    "calculadora trabajo",
    "trabajo fisico",
    "force distance work",
  ],
  {
    title: "Work Calculator — Physics | UtiliHub",
    description: "Free work calculator. Enter force (N) and distance (m) to get work in joules. Instant physics formula.",
  },
);
tool.faq.push(faq("How is work calculated?", "Work (J) = Force (N) × Distance (m). Assumes force is constant and parallel to displacement."));

export const WORK_CALCULATOR_TOOLS = [tool];
