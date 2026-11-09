import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-iva",
  "VAT / Sales Tax Calculator",
  "utilidades",
  "calculator",
  "Calculate VAT or sales tax: add tax to a net price or extract tax from a gross price.",
  [
    "vat calculator",
    "sales tax calculator",
    "calculadora iva",
    "calculadora impuesto ventas",
    "add vat",
    "extract vat",
  ],
  {
    title: "VAT / Sales Tax Calculator | UtiliHub",
    description:
      "Free VAT and sales tax calculator. Add tax to net price or extract from gross. Browser-only, no signup.",
    summaryEs: "Calcula el IVA o impuesto sobre ventas: suma al precio neto o extrae del precio bruto.",
  },
);
tool.faq.push(
  faq(
    "How do I extract VAT from a gross price?",
    "Base = gross / (1 + rate/100). Tax = gross − base.",
  ),
);

export const IVA_CALCULATOR_TOOLS = [tool];
