import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-horas-extras",
  "Overtime Pay Calculator",
  "productividad",
  "calculator",
  "Calculate overtime pay from hours worked, hourly rate and overtime multiplier.",
  [
    "overtime calculator",
    "overtime pay",
    "calculadora horas extras",
    "pago horas extras",
    "overtime rate calculator",
  ],
  {
    title: "Overtime Pay Calculator | UtiliHub",
    description: "Free overtime calculator. Enter hours, rate and multiplier to get regular + overtime pay. Instant, no signup.",
  },
);
tool.faq.push(faq("How is overtime calculated?", "Regular hours are paid at the base rate. Hours above the threshold are paid at base rate × overtime multiplier (often 1.5)."),
);

export const OVERTIME_CALCULATOR_TOOLS = [tool];
