// Part 1 of 3 — entries of TOOL_SEO_OVERRIDES_GROWTH, split from tool-seo-overrides-growth.ts on 2026-11-04. Add new entries in the smallest part.
import type { ToolSeoOverrideGrowth } from "./tool-seo-overrides-growth";

export const TOOL_SEO_OVERRIDES_GROWTH_PART1: Record<string, ToolSeoOverrideGrowth> = {  "imc": {
    metaTitle: "BMI Formula Calculator — Weight & Height in kg/cm | UtiliHub",
    metaTitleEs: "Calculadora de IMC — fórmula con peso y altura (kg/cm) | UtiliHub",
    metaDescription:
      "BMI formula calculator in metric units: enter weight in kg and height in cm, get your body mass index and WHO category instantly. Free, no signup.",
    metaDescriptionEs:
      "Calculadora de IMC con fórmula en unidades métricas: ingresá peso en kg y altura en cm y obtené tu índice de masa corporal y la categoría OMS. Gratis, sin registro.",
    about: [
      "The BMI formula is weight in kilograms divided by height in meters squared: BMI = kg / m². With height in centimeters, divide by 100 first.",
      "Example: 70 kg and 175 cm give 70 / 1.75² = 22.9, in the normal range.",
      "Categories follow the WHO adult cut-offs: under 18.5 underweight, 18.5–24.9 normal, 25–29.9 overweight, 30 and above obesity.",
    ],
    aboutEs: [
      "La fórmula del IMC es peso en kilogramos dividido por la altura en metros al cuadrado: IMC = kg / m². Si la altura está en centímetros, dividí por 100 primero.",
      "Ejemplo: 70 kg y 175 cm dan 70 / 1,75² = 22,9, dentro del rango normal.",
      "Las categorías siguen los umbrales de la OMS en adultos: menos de 18,5 bajo peso; 18,5–24,9 normal; 25–29,9 sobrepeso; 30 o más obesidad.",
    ],
    steps: [
      "Enter your weight in kilograms.",
      "Enter your height in centimeters.",
      "Calculate to read your BMI and its WHO category.",
    ],
    stepsEs: [
      "Ingresá tu peso en kilogramos.",
      "Ingresá tu altura en centímetros.",
      "Calculá para leer tu IMC y su categoría según la OMS.",
    ],
    faq: [
      {
        q: "How do I calculate BMI with kg and cm?",
        a: "BMI = weight in kg divided by (height in cm / 100) squared. Example: 80 kg and 170 cm → 80 / 1.70² = 27.7.",
      },
      {
        q: "Is BMI different for children?",
        a: "Yes. Children and teens use age- and sex-specific percentile charts; these adult cut-offs do not apply.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo se calcula el IMC con kg y cm?",
        a: "IMC = peso en kg dividido por (altura en cm / 100) al cuadrado. Ejemplo: 80 kg y 170 cm → 80 / 1,70² = 27,7.",
      },
      {
        q: "¿El IMC es igual en niños?",
        a: "No. En niños y adolescentes se usan curvas de percentiles por edad y sexo; estos umbrales de adulto no aplican.",
      },
    ],
  },
};
