import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-ratio-trabajo-descanso",
  "Work-Break Ratio Calculator",
  "productividad",
  "calculator",
  "Calculate recommended break time based on work hours and work:break ratio. Ideal for Pomodoro-style productivity.",
  [
    "work break ratio calculator",
    "calculadora ratio trabajo descanso",
    "pomodoro break calculator",
    "how much break time for work hours",
    "ratio trabajo descanso",
  ],
  {
    title: "Work-Break Ratio Calculator — Pomodoro Style | UtiliHub",
    description:
      "Free calculator for recommended break time. Enter work hours and ratio. Runs in browser.",
    summaryEs: "Calcula el tiempo de descanso recomendado según horas de trabajo y ratio.",
  },
);
tool.faq.push(
  faq(
    "What ratio should I use?",
    "Common is 5:1 (25 min work / 5 min break) or 4:1. Experiment for your focus.",
  ),
);

export const WORK_BREAK_RATIO_CALCULATOR_TOOLS = [tool];
