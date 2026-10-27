import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-presupuesto-mensual",
  "Monthly Budget Calculator",
  "finanzas",
  "calculator",
  "Calculate remaining monthly budget after fixed and variable expenses.",
  [
    "monthly budget calculator",
    "remaining budget calculator",
    "calculadora presupuesto mensual",
    "presupuesto mensual restante",
    "calculadora de gastos mensuales",
  ],
  {
    title: "Monthly Budget Calculator | Remaining Money | UtiliHub",
    description: "Free monthly budget calculator. Income minus fixed and variable expenses. Instant remaining amount and percentage. Browser-only.",
    summaryEs: "Calcula el presupuesto mensual restante después de gastos fijos y variables.",
  },
);
tool.faq.push(
  faq(
    "How is remaining calculated?",
    "Remaining = income - fixed expenses - variable expenses. Percentage used = (total expenses / income) × 100.",
  ),
  faq(
    "Can expenses be zero?",
    "Yes. Zero expenses are valid. Income must be greater than zero.",
  ),
);

export const MONTHLY_BUDGET_CALCULATOR_TOOLS = [tool];
