import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-raiz-cubica",
  "Cube Root Calculator",
  "matematicas",
  "calculator",
  "Calculate the cube root of a number instantly. Supports negatives. Local, private, no signup.",
  [
    "cube root calculator",
    "calculadora raiz cubica",
    "cbrt calculator",
    "what is the cube root of",
    "raiz cubica online",
  ],
  {
    title: "Cube Root Calculator — ∛x Online Free | UtiliHub",
    description:
      "Free cube root calculator. Enter any number and get ∛x instantly. Runs in your browser, no signup.",
    summaryEs: "Calcula la raíz cúbica de un número al instante. Ideal para volúmenes y matemáticas.",
  },
);
tool.faq.push(
  faq(
    "Does it support negative numbers?",
    "Yes. The real cube root of a negative number is negative (e.g. ∛−8 = −2).",
  ),
);
tool.faq.push(
  faq(
    "How precise is the result?",
    "Results are rounded to 8 decimal places for readability.",
  ),
);

export const CUBE_ROOT_CALCULATOR_TOOLS = [tool];
