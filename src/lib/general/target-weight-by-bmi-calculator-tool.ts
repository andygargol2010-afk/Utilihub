import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-peso-objetivo-imc",
  "Target Weight by BMI Calculator",
  "salud",
  "calculator",
  "Calculate the target body weight for a given height and desired BMI.",
  [
    "target weight by bmi",
    "bmi target weight calculator",
    "peso objetivo imc",
    "calculadora peso por imc",
    "ideal weight from bmi",
  ],
  {
    title: "Target Weight by BMI Calculator — Find Goal Weight from Height & BMI | UtiliHub",
    description: "Free calculator: enter height and target BMI to get the corresponding weight in kg. Local browser calculation, no signup.",
    summaryEs: "Calculá el peso objetivo a partir de la altura y un IMC deseado.",
  },
);
tool.faq.push(
  faq(
    "How is the target weight calculated?",
    "Weight (kg) = target BMI × (height in meters)². Example: 175 cm and BMI 22 gives approximately 67.4 kg.",
  ),
);
tool.faq.push(
  faq(
    "What BMI range is considered healthy?",
    "For most adults the WHO range 18.5–24.9 is classified as normal weight. Always consult a professional for personal advice.",
  ),
);

export const TARGET_WEIGHT_BY_BMI_CALCULATOR_TOOLS = [tool];
