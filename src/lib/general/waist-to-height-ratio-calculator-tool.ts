import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-ratio-cintura-altura",
  "Waist-to-Height Ratio Calculator",
  "salud",
  "calculator",
  "Calculate your waist-to-height ratio (WHtR) to assess central obesity risk.",
  [
    "waist to height ratio",
    "whtr calculator",
    "calculadora ratio cintura altura",
    "waist height ratio",
    "central obesity calculator",
  ],
  {
    title: "Waist-to-Height Ratio Calculator (WHtR) | UtiliHub",
    description: "Free waist-to-height ratio calculator. Assess health risk from central obesity with WHtR. Instant browser calculation, EN+ES.",
    summaryEs: "Calcula tu ratio cintura-altura (WHtR) para evaluar el riesgo de obesidad central.",
  },
);
tool.faq.push(faq("What is a healthy waist-to-height ratio?", "A WHtR below 0.5 is generally considered healthy. 0.5–0.6 is increased risk; above 0.6 is high risk."));
tool.faq.push(faq("How do I measure waist and height?", "Measure waist at the navel (relaxed), height without shoes. Use the same units (cm recommended)."));

export const WAIST_TO_HEIGHT_RATIO_CALCULATOR_TOOLS = [tool];
