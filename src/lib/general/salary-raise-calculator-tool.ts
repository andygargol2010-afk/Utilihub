import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-aumento-salarial",
  "Salary Raise Calculator",
  "finanzas",
  "calculator",
  "Calculate new salary after a percentage raise. Formula: New = Current × (1 + percent/100).",
  [
    "salary raise calculator",
    "pay raise percentage calculator",
    "calculadora aumento salarial",
    "calculadora subida de sueldo",
    "percentage raise calculator",
  ],
  {
    title: "Salary Raise Calculator — New Pay After % Increase | UtiliHub",
    description: "Free salary raise calculator. Enter current salary and raise percentage to get the new salary and increase amount. Instant browser calculation.",
    summaryEs: "Calcula el nuevo salario después de un aumento porcentual. Fórmula: Nuevo = Actual × (1 + %/100).",
  },
);
tool.faq.push(faq("How is the raise calculated?", "Increase = Current × (percent / 100). New salary = Current + Increase."));
tool.faq.push(faq("Negative raise?", "Negative percentages are allowed (pay cut). Result cannot be negative."));

export const SALARY_RAISE_CALCULATOR_TOOLS = [tool];
