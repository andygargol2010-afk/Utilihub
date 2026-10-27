import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-porcentaje-del-total",
  "Percentage of Total Calculator",
  "matematicas",
  "calculator",
  "Calculate what percentage a part represents of a total.",
  [
    "percentage of total calculator",
    "what percent is x of y",
    "calculadora porcentaje del total",
    "qué porcentaje es de",
    "porcentaje parte del total",
  ],
  {
    title: "Percentage of Total Calculator | What % Is X of Y | UtiliHub",
    description: "Free percentage of total calculator. Enter part and total to get the percentage instantly. Browser-only.",
    summaryEs: "Calcula qué porcentaje representa una parte del total.",
  },
);
tool.faq.push(
  faq(
    "How is the percentage calculated?",
    "Percentage = (part / total) × 100. Total must be greater than zero.",
  ),
  faq(
    "Can the part be larger than the total?",
    "Yes. The result can be over 100%.",
  ),
);

export const PERCENTAGE_OF_TOTAL_CALCULATOR_TOOLS = [tool];
