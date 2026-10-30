import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-cuota-prestamo",
  "Loan Monthly Payment Calculator",
  "finanzas",
  "calculator",
  "Calculate the monthly payment for a fixed-rate loan from principal, annual interest rate, and term in years.",
  [
    "loan payment calculator",
    "monthly payment calculator",
    "calculadora cuota prestamo",
    "calculadora hipoteca",
    "amortization calculator",
  ],
  {
    title: "Loan Monthly Payment Calculator — Principal, Rate, Years | UtiliHub",
    description: "Free loan payment calculator. Enter principal, annual rate and years to get the monthly installment. Local browser calculation, no signup.",
    summaryEs: "Calcula la cuota mensual de un préstamo a tasa fija a partir del capital, tasa anual y plazo en años.",
  },
);
tool.faq.push(
  faq(
    "What is the formula?",
    "Monthly payment M = P * r * (1+r)^n / ((1+r)^n - 1), where r = annual rate / 12 / 100, n = years * 12.",
  ),
);
tool.faq.push(
  faq(
    "Does it include taxes or insurance?",
    "No. This is principal and interest only. Add taxes, insurance or fees separately if needed.",
  ),
);

export const LOAN_MONTHLY_PAYMENT_CALCULATOR_TOOLS = [tool];
