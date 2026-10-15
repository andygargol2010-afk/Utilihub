import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-cuota-prestamo",
  "Loan Payment Calculator",
  "utilidades",
  "calculator",
  "Calculate monthly loan payment (EMI), total interest, and total amount from principal, annual rate, and term in months.",
  [
    "loan calculator",
    "EMI calculator",
    "loan payment calculator",
    "monthly payment calculator",
    "calculadora cuota prestamo",
    "calculadora de prestamos",
    "cuota mensual prestamo",
  ],
  {
    title: "Loan Payment Calculator — Monthly EMI & total interest | UtiliHub",
    description:
      "Free loan payment calculator. Enter principal, annual interest rate, and term in months to get monthly payment, total interest, and total amount. Runs in the browser.",
  },
);
tool.faq.push(
  faq(
    "How is the monthly payment calculated?",
    "EMI = P × r × (1+r)^n / ((1+r)^n − 1), where P is principal, r is monthly rate (annual/12/100), and n is number of months.",
  ),
);
tool.faq.push(
  faq(
    "Does it support different payment frequencies?",
    "This version calculates a fixed monthly payment. For weekly or bi-weekly, convert the term and rate accordingly.",
  ),
);
tool.faq.push(
  faq(
    "Is the result exact?",
    "Results use standard amortisation formula and are rounded to 2 decimal places for currency.",
  ),
);

export const LOAN_PAYMENT_TOOLS = [tool];
