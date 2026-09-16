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

/** Day 3 — Finance (high EN traffic) */
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
    "interes-compuesto",
    "Compound interest",
    "Project future value with compound interest by compounding frequency.",
    "compound-interest",
    ["Principal", "Annual rate %", "Years", "Compounds per year"],
  ),
  f(
    "pago-anticipado-prestamo",
    "Early loan repayment",
    "Estimate remaining balance after a number of payments have already been made.",
    "early-repayment",
    ["Principal", "Annual rate %", "Term (months)", "Payments made"],
  ),
  f(
    "roi",
    "ROI calculator",
    "Calculate return on investment from cost and final value or net gain.",
    "roi",
    ["Cost", "Final value"],
  ),
  f(
    "cagr",
    "CAGR calculator",
    "Compute compound annual growth rate between a start and end value over years.",
    "cagr",
    ["Start value", "End value", "Years"],
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
];
