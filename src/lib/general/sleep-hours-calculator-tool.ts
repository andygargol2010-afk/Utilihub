import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-horas-sueno",
  "Sleep Hours Calculator",
  "salud",
  "calculator",
  "Get recommended sleep hours based on age.",
  [
    "sleep hours calculator",
    "recommended sleep by age",
    "calculadora horas sueno",
    "cuantas horas dormir",
    "sleep needs by age",
  ],
  {
    title: "Sleep Hours Calculator — Recommended by Age | UtiliHub",
    description: "Free sleep hours calculator. Enter your age to see recommended nightly sleep range. Based on standard guidelines. Not medical advice.",
  },
);
tool.faq.push(faq("Is this medical advice?", "No. These are general recommendations from sleep guidelines. Consult a doctor for personal needs."));
tool.faq.push(faq("How accurate are the ranges?", "They follow common public health ranges for different age groups."));

export const SLEEP_HOURS_CALCULATOR_TOOLS = [tool];
