import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-horas-a-decimal",
  "Hours to Decimal Calculator",
  "fechas",
  "calculator",
  "Convert hours and minutes to decimal hours.",
  [
    "hours to decimal calculator",
    "convert time to decimal",
    "calculadora horas a decimal",
    "horas y minutos a decimal",
    "time to decimal hours",
  ],
  {
    title: "Hours to Decimal Calculator | Convert Time to Decimal | UtiliHub",
    description: "Free hours to decimal calculator. Enter hours and minutes to get decimal hours instantly. Browser-only, no signup.",
    summaryEs: "Convierte horas y minutos a horas decimales.",
  },
);
tool.faq.push(
  faq(
    "How do you convert hours and minutes to decimal?",
    "Decimal hours = hours + (minutes / 60). For example, 2 hours 30 minutes = 2.5.",
  ),
  faq(
    "Why use decimal hours?",
    "Useful for payroll, timesheets, and billing where partial hours are expressed as decimals.",
  ),
);

export const HOURS_TO_DECIMAL_CALCULATOR_TOOLS = [tool];
