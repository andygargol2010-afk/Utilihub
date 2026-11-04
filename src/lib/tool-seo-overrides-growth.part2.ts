// Part 2 of 3 — entries of TOOL_SEO_OVERRIDES_GROWTH, split from tool-seo-overrides-growth.ts on 2026-11-04. Add new entries in the smallest part.
import type { ToolSeoOverrideGrowth } from "./tool-seo-overrides-growth";

export const TOOL_SEO_OVERRIDES_GROWTH_PART2: Record<string, ToolSeoOverrideGrowth> = {
  "calculadora-imc": {
    metaTitle: "BMI Calculator — Free Body Mass Index Online | UtiliHub",
    metaTitleEs: "Calculadora de IMC online gratis | UtiliHub",
    metaDescription:
      "Free BMI calculator: enter weight and height, get your body mass index and WHO category in seconds. Private, no signup.",
    metaDescriptionEs:
      "Calculadora de IMC gratis: ingresá peso y altura y obtené tu índice de masa corporal y la categoría OMS al instante. Sin registro.",
    about: [
      "Body mass index (BMI) is weight in kilograms divided by height in meters squared. It is a screening number, not a full health diagnosis.",
      "This calculator uses the standard WHO adult cut-offs: under 18.5 underweight, 18.5–24.9 normal, 25–29.9 overweight, 30+ obesity.",
      "Athletes and older adults can have misleading BMI because muscle and fat distribution differ. Use the result as a starting point, not medical advice.",
    ],
    aboutEs: [
      "El índice de masa corporal (IMC) es el peso en kilogramos dividido por la altura en metros al cuadrado. Es un indicador de cribado, no un diagnóstico.",
      "Usamos los umbrales habituales de la OMS en adultos: menos de 18,5 bajo peso; 18,5–24,9 normal; 25–29,9 sobrepeso; 30 o más obesidad.",
      "En deportistas o personas mayores el IMC puede engañar por la masa muscular. Tomalo como orientación, no como consejo médico.",
    ],
    steps: [
      "Enter weight in kilograms and height in centimeters.",
      "Calculate to get BMI and the category label.",
      "Compare with related tools such as ideal weight if you need more context.",
    ],
    stepsEs: [
      "Ingresá peso en kg y altura en cm.",
      "Calculá para ver el IMC y la categoría.",
      "Si querés más contexto, usá también la calculadora de peso ideal.",
    ],
    faq: [
      {
        q: "Is BMI the same for men and women?",
        a: "The formula is the same. Interpretation categories are usually shared for adults; individual health still depends on many other factors.",
      },
      {
        q: "Do you store my weight?",
        a: "No. The calculation runs in your browser and is not sent to a server for this tool.",
      },
    ],
    faqEs: [
      {
        q: "¿El IMC es igual para hombres y mujeres?",
        a: "La fórmula es la misma. Las categorías de adultos suelen compartirse; la salud individual depende de muchos más factores.",
      },
      {
        q: "¿Guardan mi peso?",
        a: "No. El cálculo corre en tu navegador y no se envía a un servidor en esta herramienta.",
      },
    ],
  },
};
