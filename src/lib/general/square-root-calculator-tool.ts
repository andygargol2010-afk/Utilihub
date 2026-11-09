import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-raiz-cuadrada",
  "Square Root Calculator",
  "matematicas",
  "calculator",
  "Calculate the square root of a number instantly. Local, private, no signup. Ideal for geometry, physics and everyday math.",
  [
    "square root calculator",
    "calculadora raiz cuadrada",
    "sqrt calculator",
    "what is the square root of",
    "raiz cuadrada online",
  ],
  {
    title: "Square Root Calculator — √x Online Free | UtiliHub",
    description:
      "Free square root calculator. Enter a non-negative number and get √x instantly. Runs in your browser, no signup.",
    summaryEs: "Calcula la raíz cuadrada de un número al instante. Ideal para geometría, física o matemáticas cotidianas.",
  },
);
tool.faq.push(
  faq(
    "Can I calculate the square root of a negative number?",
    "This tool returns real numbers only. Negative inputs are rejected (complex roots are out of scope).",
  ),
);
tool.faq.push(
  faq(
    "How precise is the result?",
    "Results are rounded to 8 decimal places for readability while remaining accurate for most practical uses.",
  ),
);

export const SQUARE_ROOT_CALCULATOR_TOOLS = [tool];
