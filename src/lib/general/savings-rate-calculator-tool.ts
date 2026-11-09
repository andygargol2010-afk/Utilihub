import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-tasa-de-ahorro",
  "Savings Rate Calculator",
  "utilidades",
  "calculator",
  "Calculate your savings rate from monthly income and expenses. See how much you save as a percentage. Runs fully in the browser.",
  [
    "savings rate calculator",
    "savings percentage calculator",
    "calculadora tasa de ahorro",
    "tasa de ahorro",
    "porcentaje de ahorro",
  ],
  {
    title: "Savings Rate Calculator — Income & Expenses Percentage | UtiliHub",
    description: "Free savings rate calculator. Enter income and expenses to get your savings percentage and amount saved. Local, private, no signup.",
    summaryEs: "Calcula tu tasa de ahorro a partir de ingresos y gastos mensuales. Porcentaje y monto ahorrado.",
  },
);
tool.faq.push(
  faq(
    "How is the savings rate calculated?",
    "Savings rate = ((Income − Expenses) / Income) × 100. Positive means you save that percentage.",
  ),
);
tool.faq.push(
  faq(
    "What is a good savings rate?",
    "Many experts suggest 10–20% or more of income, depending on goals and situation.",
  ),
);

export const SAVINGS_RATE_CALCULATOR_TOOLS = [tool];
