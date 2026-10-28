// TOOL_SEO_OVERRIDES_RANK6 part 1 — split out of ../tool-seo-overrides-rank6.ts on 2026-10-28.
// Add new entries in the smallest file of this folder; never rewrite files wholesale.
import type { ToolSeoOverride } from "../tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_RANK6_1: Record<string, ToolSeoOverride> = {
  imc: {
    metaTitle: "BMI Calculator Free — kg & cm, WHO Categories | UtiliHub",
    metaTitleEs: "Calculadora de IMC online gratis — kg, cm y categorías OMS | UtiliHub",
    metaDescription:
      "Calculate body mass index from weight (kg) and height (cm). See WHO category instantly. Free BMI calculator, no signup, private in your browser.",
    metaDescriptionEs:
      "Calculá el índice de masa corporal con peso (kg) y altura (cm). Categoría OMS al instante. Calculadora de IMC gratis, sin registro, en el navegador.",
    about: [
      "BMI (body mass index) is weight in kilograms divided by height in meters squared: BMI = kg / m². If height is in cm, convert to meters first (divide by 100).",
      "Example: 70 kg and 175 cm → 70 / 1.75² ≈ 22.9 (normal range for adults).",
      "WHO adult ranges: under 18.5 underweight; 18.5–24.9 normal; 25–29.9 overweight; 30+ obesity. BMI is a screening number, not a full health diagnosis.",
    ],
    aboutEs: [
      "El IMC (índice de masa corporal) es el peso en kilogramos dividido por la altura en metros al cuadrado: IMC = kg / m². Si la altura está en cm, pasala a metros (÷ 100).",
      "Ejemplo: 70 kg y 175 cm → 70 / 1,75² ≈ 22,9 (rango normal en adultos).",
      "Umbrales OMS en adultos: <18,5 bajo peso; 18,5–24,9 normal; 25–29,9 sobrepeso; ≥30 obesidad. El IMC es una cifra de cribado, no un diagnóstico médico completo.",
    ],
    steps: [
      "Enter weight in kilograms.",
      "Enter height in centimeters.",
      "Read BMI and WHO category.",
    ],
    stepsEs: [
      "Ingresá el peso en kilogramos.",
      "Ingresá la altura en centímetros.",
      "Leé el IMC y la categoría según la OMS.",
    ],
    faq: [
      {
        q: "How do I calculate BMI with kg and cm?",
        a: "BMI = kg ÷ (cm ÷ 100)². Example: 80 kg and 170 cm → 80 / 1.70² ≈ 27.7.",
      },
      {
        q: "Is BMI the same for children?",
        a: "No. Children and teens need age- and sex-specific charts; adult cut-offs do not apply.",
      },
      {
        q: "Is this BMI calculator free?",
        a: "Yes. It runs in your browser with no account required.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo se calcula el IMC con kg y cm?",
        a: "IMC = kg ÷ (cm ÷ 100)². Ejemplo: 80 kg y 170 cm → 80 / 1,70² ≈ 27,7.",
      },
      {
        q: "¿Qué IMC es normal?",
        a: "En adultos, la OMS ubica el rango normal entre 18,5 y 24,9.",
      },
      {
        q: "¿Hay calculadora de IMC online gratis?",
        a: "Sí. Esta herramienta calcula el IMC y la categoría en el navegador, sin registro.",
      },
      {
        q: "¿El IMC sirve para niños?",
        a: "No de la misma forma: en menores se usan percentiles por edad y sexo.",
      },
    ],
  },

  "tiempo-lectura": {
    metaTitle: "Reading Time Calculator — Words to Minutes Online | UtiliHub",
    metaTitleEs: "Calculadora de tiempo de lectura online — palabras a minutos | UtiliHub",
    metaDescription:
      "Estimate how long a text takes to read. Paste words, get minutes at a realistic WPM. Free reading time calculator, no signup.",
    metaDescriptionEs:
      "Estimá cuánto tarda leer un texto. Pegá las palabras y obtené minutos a un ritmo realista. Calculadora de tiempo de lectura gratis, sin registro.",
    about: [
      "Reading time is usually words ÷ words-per-minute. Many tools default near 200–250 WPM for adult silent reading; technical text is slower.",
      "Paste a draft to plan articles, scripts, or study sessions. Counting runs locally in the browser.",
      "Adjust expectations for skimming vs careful reading — the estimate is a planning aid, not a stopwatch.",
    ],
    aboutEs: [
      "El tiempo de lectura suele ser palabras ÷ palabras por minuto. Muchas herramientas usan cerca de 200–250 ppm en lectura silenciosa adulta; el texto técnico es más lento.",
      "Pegá un borrador para planificar artículos, guiones o estudio. El conteo corre en el navegador.",
      "Ajustá la expectativa si leés en diagonal o con mucho detalle: es una ayuda de planificación, no un cronómetro exacto.",
    ],
    steps: [
      "Paste or type the text.",
      "Review word count and estimated minutes.",
      "Trim or expand the draft if needed.",
    ],
    stepsEs: [
      "Pegá o escribí el texto.",
      "Revisá el conteo de palabras y los minutos estimados.",
      "Recortá o ampliá el borrador si hace falta.",
    ],
    faq: [
      {
        q: "How is reading time calculated?",
        a: "Typically total words divided by an assumed reading speed (e.g. ~200 words per minute).",
      },
      {
        q: "Is my text uploaded?",
        a: "No. Estimation runs locally in your browser.",
      },
      {
        q: "Why does another tool show different minutes?",
        a: "Different default WPM or word-splitting rules change the result slightly.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo se calcula el tiempo de lectura?",
        a: "En general: total de palabras ÷ ritmo (p. ej. ~200 palabras por minuto).",
      },
      {
        q: "¿Se sube el texto?",
        a: "No. El cálculo es local en tu navegador.",
      },
      {
        q: "¿Por qué otro sitio da minutos distintos?",
        a: "Cambian el ritmo por defecto o la forma de contar palabras.",
      },
      {
        q: "¿Hay calculadora de tiempo de lectura gratis?",
        a: "Sí. Esta herramienta estima minutos sin registro ni instalación.",
      },
    ],
  },

};
