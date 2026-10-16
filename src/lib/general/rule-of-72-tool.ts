import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-regla-72",
  "Rule of 72 Calculator",
  "finanzas",
  "calculator",
  "Estimate how long it takes for an investment to double using the Rule of 72.",
  [
    "rule of 72 calculator",
    "how long to double investment",
    "rule of 72",
    "calculadora regla del 72",
    "cuánto tiempo para duplicar inversión",
    "regla del 72",
  ],
  {
    title: "Rule of 72 Calculator — Time to Double Investment | UtiliHub",
    description: "Free Rule of 72 calculator. Enter interest rate to estimate years to double your money. Simple browser tool for quick investment insights.",
  },
);
tool.faq.push(faq("What is the Rule of 72?", "Divide 72 by the annual interest rate to estimate years for an investment to double. Accurate for rates between ~6-10%."));
tool.faq.push(faq("Is it exact?", "It's an approximation. For precise compounding, use a full compound interest calculator."));

export const RULE_OF_72_TOOLS = [tool];
