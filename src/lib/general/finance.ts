import { makeTool } from "./types";

const f = (
  slug: string,
  name: string,
  summary: string,
  operation: string,
  fields: string[],
) =>
  makeTool(slug, name, "matematicas", "number", summary, name.toLowerCase().split(/\s+/), {
    mode: "finance",
    operation,
    fields,
  });

/**
 * Extra finance / calc tools that are NOT already in FINANCIAL_CATALOG.
 * Do not re-add interes-compuesto, roi, or cagr — they live in src/lib/financial/catalog.ts
 * and ALL_TOOLS throws on duplicate slugs (500 on every request).
 */
export const FINANCE_TOOLS = [
  f(
    "pago-prestamo",
    "Loan payment",
    "Calculate the fixed monthly payment for a loan given principal, annual rate, and term.",
    "loan-payment",
    ["Principal", "Annual rate %", "Term (months)"],
  ),
  f(
    "amortizacion-prestamo",
    "Loan amortization",
    "Estimate monthly payment, total paid, and total interest over the full loan term.",
    "loan-amortization",
    ["Principal", "Annual rate %", "Term (months)"],
  ),
  f(
    "pago-anticipado-prestamo",
    "Early loan repayment",
    "Estimate remaining balance after a number of payments have already been made.",
    "early-repayment",
    ["Principal", "Annual rate %", "Term (months)", "Payments made"],
  ),
  f(
    "meta-ahorro",
    "Savings goal",
    "Find the monthly deposit needed to reach a savings goal at a given rate.",
    "savings-goal",
    ["Goal amount", "Annual rate %", "Months", "Starting balance"],
  ),
  f(
    "inflacion-poder-compra",
    "Inflation / purchasing power",
    "See how inflation changes the real value of money over a number of years.",
    "inflation",
    ["Present amount", "Annual inflation %", "Years"],
  ),
  f(
    "asignacion-portafolio",
    "Portfolio allocation",
    "Split a portfolio total across up to three weights and see each dollar amount.",
    "portfolio",
    ["Total capital", "Weight A %", "Weight B %", "Weight C %"],
  ),
  f(
    "wacc",
    "WACC calculator",
    "Estimate weighted average cost of capital from equity, debt, costs, and tax rate.",
    "wacc",
    ["Equity value", "Debt value", "Cost of equity %", "Cost of debt %", "Tax rate %"],
  ),
  f(
    "tarifa-hora",
    "Hourly rate",
    "Convert a salary or total pay into an equivalent hourly rate from hours worked.",
    "hourly-rate",
    ["Total pay", "Hours worked"],
  ),
  f(
    "calculadora-basica",
    "Calculator",
    "Quick four-operation calculator for add, subtract, multiply, and divide.",
    "basic-calc",
    ["Value A", "Value B", "Operation (1=add 2=sub 3=mul 4=div)"],
  ),
];
