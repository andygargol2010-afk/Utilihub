import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-line-height",
  "Line Height Calculator",
  "diseno",
  "calculator",
  "Calculate recommended line-height for a font size for optimal readability.",
  [
    "line height calculator",
    "calculadora line height",
    "font size line height",
    "optimal line height css",
    "line-height calculator px",
    "altura de linea tipografia",
  ],
  {
    title: "Line Height Calculator | Optimal Readability | UtiliHub",
    description:
      "Free line-height calculator. Enter a font size in px and get recommended line-height ratios and px values for body text and headings. EN+ES. Runs in the browser.",
    summaryEs: "Calcula la altura de línea recomendada para un tamaño de fuente dado.",
  },
);
tool.faq.push(
  faq(
    "What is a good line-height?",
    "For body text a ratio of 1.5 is widely recommended for readability. Headings usually use 1.2–1.3.",
  ),
);
tool.faq.push(
  faq(
    "Can I use it with rem?",
    "Yes. The tool shows both the unitless ratio and the computed px value. Convert your rem to px using the root font size (normally 16px).",
  ),
);

export const LINE_HEIGHT_CALCULATOR_TOOLS = [tool];
