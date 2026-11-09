import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-tasa-efectiva-anual",
  "Effective Annual Rate Calculator",
  "finanzas",
  "calculator",
  "Convert a nominal annual interest rate to the effective annual rate (EAR) given compounding frequency.",
  [
    "effective annual rate calculator",
    "ear calculator",
    "tasa efectiva anual",
    "calculadora tasa efectiva",
    "nominal to effective rate",
  ],
  {
    title: "Effective Annual Rate Calculator — Nominal to EAR | UtiliHub",
    description: "Free calculator: convert nominal annual rate and compounding periods to the effective annual rate (EAR). Local browser calculation, no signup.",
    summaryEs: "Convertí una tasa nominal anual a la tasa efectiva anual (EAR) según la frecuencia de capitalización.",
  },
);
tool.faq.push(
  faq(
    "What is the effective annual rate?",
    "The EAR is the actual annual interest earned or paid after accounting for compounding. It is higher than the nominal rate when compounding occurs more than once a year.",
  ),
);
tool.faq.push(
  faq(
    "How is EAR calculated?",
    "EAR = (1 + r/n)^n − 1, where r is the nominal annual rate as a decimal and n is the number of compounding periods per year.",
  ),
);

export const EFFECTIVE_ANNUAL_RATE_CALCULATOR_TOOLS = [tool];
