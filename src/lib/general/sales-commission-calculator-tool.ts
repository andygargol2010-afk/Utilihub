import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-comision-de-venta",
  "Sales Commission Calculator",
  "finanzas",
  "calculator",
  "Calculate sales commission amount from sale value and percentage.",
  [
    "sales commission calculator",
    "commission calculator",
    "calculadora comision de venta",
    "calculadora de comisión",
    "commission percentage calculator",
  ],
  {
    title: "Sales Commission Calculator | UtiliHub",
    description: "Free sales commission calculator. Enter sale amount and commission % to get the commission. Instant browser calculation, EN+ES.",
    summaryEs: "Calcula la comisión de venta a partir del monto de la venta y el porcentaje.",
  },
);
tool.faq.push(faq("How is sales commission calculated?", "Commission = sale amount × (percentage ÷ 100). The result is rounded to 2 decimals."));
tool.faq.push(faq("Does this include the base sale?", "This tool returns the commission amount. Add it to the sale if you need the total payout."));

export const SALES_COMMISSION_CALCULATOR_TOOLS = [tool];
