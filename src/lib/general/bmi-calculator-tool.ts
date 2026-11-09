import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-imc",
  "BMI Calculator",
  "salud",
  "calculator",
  "Calculate Body Mass Index (BMI) from weight in kg and height in cm.",
  [
    "bmi calculator",
    "imc calculator",
    "calculadora imc",
    "body mass index",
    "indice de masa corporal",
  ],
  {
    title: "BMI Calculator | Body Mass Index | UtiliHub",
    description: "Free BMI calculator. Enter weight (kg) and height (cm) to get your Body Mass Index and category. Browser-only, no signup.",
    summaryEs: "Calcula el Índice de Masa Corporal (IMC) a partir del peso en kg y la altura en cm.",
  },
);
tool.faq.push(
  faq(
    "What is BMI?",
    "BMI = weight (kg) / height (m)². Categories: underweight <18.5, normal 18.5-24.9, overweight 25-29.9, obese ≥30.",
  ),
  faq(
    "Is BMI accurate?",
    "It is a screening tool, not a diagnosis. It does not account for muscle mass, age, or sex. Consult a doctor.",
  ),
);

export const BMI_CALCULATOR_TOOLS = [tool];
