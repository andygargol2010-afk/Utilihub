import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-imc",
  "BMI Calculator",
  "ciencia",
  "calculator",
  "Calculate Body Mass Index (BMI) from weight and height. Instant classification underweight, normal, overweight or obese. Runs fully in the browser.",
  [
    "bmi calculator",
    "body mass index",
    "calculadora imc",
    "indice de masa corporal",
    "bmi chart",
    "imc online",
  ],
  {
    title: "BMI Calculator — Body Mass Index | UtiliHub",
    description:
      "Free BMI calculator. Enter weight and height to get your Body Mass Index and category. Metric and imperial units. Local, private, no signup.",
  },
);
tool.faq.push(
  faq(
    "How is BMI calculated?",
    "BMI = weight (kg) / height (m)². With imperial units: BMI = 703 × weight (lb) / height (in)².",
  ),
);
tool.faq.push(
  faq(
    "What do the BMI categories mean?",
    "Standard WHO ranges: underweight < 18.5, normal 18.5–24.9, overweight 25–29.9, obese ≥ 30.",
  ),
);

export const BMI_CALCULATOR_TOOLS = [tool];
