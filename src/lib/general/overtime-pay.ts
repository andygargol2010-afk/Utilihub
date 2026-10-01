import { makeTool } from "./types";

/** Work-pay gap: existing tools only subtract clock times or multiply rates. */
export const OVERTIME_PAY_TOOLS = [
  makeTool(
    "calculadora-horas-extra",
    "Overtime pay calculator",
    "productividad",
    "number",
    "Estimate regular pay, overtime pay, and total pay from an hourly rate, regular hours, overtime hours, and a multiplier.",
    ["overtime pay", "overtime calculator", "time and a half", "horas extra", "calculadora de horas extra", "pago de horas extra"],
    {
      mode: "overtime-pay",
      title: "Overtime pay calculator free online | UtiliHub",
      description:
        "Calculate overtime pay, regular pay, and total pay from hourly rate, hours, and multiplier. Free, in the browser, no signup.",
    },
  ),
];
