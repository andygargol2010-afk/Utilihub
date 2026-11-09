import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-horas-para-meta",
  "Time to Goal Calculator",
  "productividad",
  "calculator",
  "Calculate hours needed to reach a goal at a given hourly rate.",
  [
    "time to goal calculator",
    "hours to reach goal",
    "calculadora horas para meta",
    "tiempo para alcanzar meta",
  ],
  {
    title: "Time to Goal Calculator | UtiliHub",
    description: "Free calculator for hours needed to complete a goal. Enter goal and rate per hour. Browser-only.",
    summaryEs: "Calcula las horas necesarias para alcanzar una meta a una tasa por hora.",
  },
);
tool.faq.push(
  faq(
    "How is the time calculated?",
    "Hours = goal / rate per hour. Days shown assume 8-hour workdays.",
  ),
);

export const TIME_TO_GOAL_CALCULATOR_TOOLS = [tool];
