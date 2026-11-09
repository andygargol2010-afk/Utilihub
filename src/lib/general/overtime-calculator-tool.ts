import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-horas-extra",
  "Overtime Calculator",
  "finanzas",
  "calculator",
  "Calculate overtime pay from regular hours, hourly rate, overtime hours and multiplier.",
  [
    "overtime calculator",
    "calculadora horas extra",
    "calculadora de horas extras",
    "overtime pay calculator",
    "horas extra calculadora",
  ],
  {
    title: "Overtime Calculator | UtiliHub",
    description: "Free overtime calculator. Enter regular hours, hourly rate, overtime hours and multiplier to get total pay. Instant browser calculation, EN+ES.",
    summaryEs: "Calcula el pago de horas extra a partir de horas regulares, tarifa horaria y horas extra con multiplicador.",
  },
);
tool.faq.push(faq("How is overtime calculated?", "Regular pay = regular hours × rate. Overtime pay = overtime hours × rate × multiplier (default 1.5). Total = regular + overtime. Rounded to 2 decimals."));
tool.faq.push(faq("What is the standard overtime multiplier?", "Commonly 1.5× (time and a half) in many jurisdictions. Adjust the multiplier as needed for double time or local rules."));

export const OVERTIME_CALCULATOR_TOOLS = [tool];
