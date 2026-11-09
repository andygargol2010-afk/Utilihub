import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-porcentaje-completado",
  "Percentage Complete Calculator",
  "productividad",
  "calculator",
  "Calculate the percentage completed from done amount and total.",
  [
    "percentage complete calculator",
    "progress percentage",
    "calculadora porcentaje completado",
    "porcentaje de avance",
  ],
  {
    title: "Percentage Complete Calculator — (done / total) × 100 | UtiliHub",
    description: "Free percentage complete calculator. Enter done and total to get the progress percentage. Local browser calculation.",
  },
);
tool.faq.push(faq("How is percentage complete calculated?", "(done / total) × 100. Total must be greater than zero."));

export const PERCENTAGE_COMPLETE_CALCULATOR_TOOLS = [tool];
