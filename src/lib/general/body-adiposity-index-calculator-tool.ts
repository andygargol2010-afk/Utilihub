import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-indice-adiposidad-corporal",
  "Body Adiposity Index Calculator",
  "salud",
  "calculator",
  "Estimate Body Adiposity Index (BAI) from hip circumference and height as a proxy for body fat percentage.",
  [
    "body adiposity index calculator",
    "BAI calculator",
    "hip to height body fat",
    "calculadora indice adiposidad corporal",
    "calculadora BAI",
  ],
  {
    title: "Body Adiposity Index (BAI) Calculator — Hip & Height | UtiliHub",
    description: "Free BAI calculator. Enter height (cm) and hip circumference (cm) to estimate Body Adiposity Index. Browser-only, no signup.",
    summaryEs: "Estima el Índice de Adiposidad Corporal (BAI) a partir de la circunferencia de cadera y la altura como proxy de porcentaje de grasa.",
  },
);
tool.faq.push(faq("What is BAI?", "Body Adiposity Index uses hip circumference and height. It is an estimate, not a medical diagnosis. Consult a professional for body composition."));

export const BODY_ADIPOSITY_INDEX_CALCULATOR_TOOLS = [tool];
