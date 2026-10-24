import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-gasto-diario",
  "Daily Spending Calculator",
  "finanzas",
  "calculator",
  "Calculate daily spending budget from monthly income or allowance. Simple and practical.",
  [
    "daily spending calculator",
    "calculadora gasto diario",
    "budget per day",
    "gasto diario presupuesto",
    "daily budget calculator",
  ],
  {
    title: "Daily Spending Calculator — Budget Per Day | UtiliHub",
    description: "Free daily spending calculator. Enter monthly amount and days. Get daily budget. Browser-only.",
    summaryEs: "Calcula el gasto diario a partir del presupuesto mensual. Simple y práctico.",
  },
);
tool.faq.push(
  faq(
    "How is daily spending calculated?",
    "Monthly amount divided by number of days in the period (usually 30 or actual days).",
  ),
);

export const DAILY_SPENDING_CALCULATOR_TOOLS = [tool];
