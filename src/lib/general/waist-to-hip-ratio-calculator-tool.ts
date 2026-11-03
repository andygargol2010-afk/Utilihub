import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-ratio-cintura-cadera",
  "Waist-to-Hip Ratio Calculator",
  "salud",
  "calculator",
  "Calculate waist-to-hip ratio (WHR) to assess body fat distribution.",
  [
    "waist to hip ratio calculator",
    "calculadora ratio cintura cadera",
    "whr calculator",
    "waist hip ratio",
  ],
  {
    title: "Waist-to-Hip Ratio Calculator | WHR | UtiliHub",
    description: "Free waist-to-hip ratio calculator. Measure central fat distribution. Complements BMI and WHtR. EN+ES.",
    summaryEs: "Calcula el ratio cintura-cadera (WHR) para evaluar la distribución de grasa.",
  },
);
tool.faq.push(faq("What is a healthy WHR?", "Generally <0.85 for women and <0.90 for men, but consult a professional."));
tool.faq.push(faq("How to measure?", "Measure waist at the narrowest point and hip at the widest, using the same units."));

export const WAIST_TO_HIP_RATIO_CALCULATOR_TOOLS = [tool];
