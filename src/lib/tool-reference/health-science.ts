// Reference content for BMI (calculadora-imc) and dew point (calculadora-punto-rocio).
// Add entries surgically; never rewrite this file wholesale.
import type { ToolReference } from "./types";
import { DEW_POINT_REFERENCE_PART1 } from "./health-science.part1";
import { DEW_POINT_REFERENCE_PART2 } from "./health-science.part2";


export const BMI_REFERENCE: ToolReference = {
  formula: {
    title: { en: "BMI formula", es: "Fórmula del IMC" },
    lines: [
      { en: "BMI = weight (kg) ÷ height (m)²", es: "IMC = peso (kg) ÷ altura (m)²" },
      {
        en: "Imperial units: BMI = 703 × weight (lb) ÷ height (in)²",
        es: "Con libras y pulgadas: IMC = 703 × peso (lb) ÷ altura (in)²",
      },
      {
        en: "Height in centimeters must be divided by 100 first (175 cm = 1.75 m).",
        es: "La altura en centímetros se divide primero por 100 (175 cm = 1,75 m).",
      },
    ],
  },
  table: {
    caption: {
      en: "WHO BMI categories for adults (18+)",
      es: "Categorías de IMC de la OMS para adultos (18 años o más)",
    },
    headers: [
      { en: "BMI (kg/m²)", es: "IMC (kg/m²)" },
      { en: "Category", es: "Categoría" },
    ],
    rows: [
      { en: ["Below 18.5", "Underweight"], es: ["Menos de 18,5", "Bajo peso"] },
      { en: ["18.5 – 24.9", "Normal weight"], es: ["18,5 – 24,9", "Peso normal"] },
      { en: ["25.0 – 29.9", "Overweight (pre-obesity)"], es: ["25,0 – 29,9", "Sobrepeso (preobesidad)"] },
      { en: ["30.0 – 34.9", "Obesity class I"], es: ["30,0 – 34,9", "Obesidad grado I"] },
      { en: ["35.0 – 39.9", "Obesity class II"], es: ["35,0 – 39,9", "Obesidad grado II"] },
      { en: ["40.0 or more", "Obesity class III"], es: ["40,0 o más", "Obesidad grado III"] },
    ],
  },
  examples: [
    {
      en: "70 kg and 1.75 m: 1.75² = 3.0625 → 70 ÷ 3.0625 = 22.9 (normal weight).",
      es: "70 kg y 1,75 m: 1,75² = 3,0625 → 70 ÷ 3,0625 = 22,9 (peso normal).",
    },
    {
      en: "85 kg and 1.68 m: 1.68² = 2.8224 → 85 ÷ 2.8224 = 30.1 (obesity class I).",
      es: "85 kg y 1,68 m: 1,68² = 2,8224 → 85 ÷ 2,8224 = 30,1 (obesidad grado I).",
    },
    {
      en: "Healthy range for 1.70 m: 18.5 × 2.89 = 53.5 kg to 24.9 × 2.89 = 72.0 kg.",
      es: "Rango de peso normal para 1,70 m: 18,5 × 2,89 = 53,5 kg hasta 24,9 × 2,89 = 72,0 kg.",
    },
    {
      en: "160 lb and 66 in: 703 × 160 ÷ 66² = 703 × 160 ÷ 4,356 = 25.8 (overweight).",
      es: "160 lb y 66 in: 703 × 160 ÷ 66² = 703 × 160 ÷ 4356 = 25,8 (sobrepeso).",
    },
  ],
};

export const DEW_POINT_REFERENCE: ToolReference = {
  ...DEW_POINT_REFERENCE_PART1,
  ...DEW_POINT_REFERENCE_PART2,
  examples: [
    {
      en: "20 °C and 65 % RH: γ = ln(0.65) + 352.5 ÷ 263.04 = −0.431 + 1.340 = 0.909 → Td = 243.04 × 0.909 ÷ 16.716 ≈ 13.2 °C. Surfaces colder than 13 °C will collect condensation.",
      es: "20 °C y 65 % de HR: γ = ln(0,65) + 352,5 ÷ 263,04 = −0,431 + 1,340 = 0,909 → Td = 243,04 × 0,909 ÷ 16,716 ≈ 13,2 °C. Las superficies a menos de 13 °C juntan condensación.",
    },
    {
      en: "32 °C and 70 % RH: dew point ≈ 25.8 °C, which feels oppressive (above 24 °C).",
      es: "32 °C y 70 % de HR: punto de rocío ≈ 25,8 °C, una sensación opresiva (más de 24 °C).",
    },
    {
      en: "Comfort guide: under 10 °C dry, 10–16 °C comfortable, 16–21 °C humid, above 21 °C muggy, above 24 °C oppressive.",
      es: "Guía de confort: menos de 10 °C seco, 10–16 °C cómodo, 16–21 °C húmedo, más de 21 °C bochornoso, más de 24 °C opresivo.",
    },
  ],
};
