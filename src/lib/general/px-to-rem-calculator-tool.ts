import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-px-a-rem",
  "PX to REM Calculator",
  "diseno",
  "calculator",
  "Convert pixels to rem units for CSS based on a base font size.",
  [
    "px to rem calculator",
    "pixels to rem",
    "calculadora px a rem",
    "convertir px a rem",
    "css rem converter",
  ],
  {
    title: "PX to REM Calculator — CSS Units | UtiliHub",
    description: "Free px to rem calculator. Enter pixels and base size to get rem value. Browser-only.",
    summaryEs: "Convierte píxeles a rem para CSS según el tamaño de base.",
  },
);
tool.faq.push(
  faq(
    "How does the px to rem calculator work?",
    "Enter the pixel value and the base font size (usually 16px). The tool divides px by base to get rem.",
  ),
);

export const PX_TO_REM_CALCULATOR_TOOLS = [tool];
