import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-porcentaje-de",
  "Percentage Of Calculator",
  "matematicas",
  "calculator",
  "Calculate what percentage one number is of another, or X% of a number. Instant browser calculation.",
  [
    "percentage calculator",
    "what percent of",
    "calculate percentage",
    "calculadora de porcentaje",
    "que porcentaje es",
    "porcentaje de un numero",
  ],
  {
    title: "Percentage Calculator — What % of a Number | UtiliHub",
    description:
      "Free online percentage calculator. Find what percent one number is of another or calculate a percentage of a number. Runs locally, no signup.",
  },
);
tool.faq.push(
  faq(
    "How do I calculate what percent A is of B?",
    "Enter A as the part and B as the whole. The tool shows (A / B) * 100.",
  ),
);
tool.faq.push(
  faq(
    "How do I calculate X% of a number?",
    "Enter the percentage and the number. The tool multiplies them accordingly.",
  ),
);

export const PERCENTAGE_OF_TOOLS = [tool];
