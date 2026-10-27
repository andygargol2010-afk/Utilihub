import type { ToolSeoOverride } from "./tool-seo-overrides";

/**
 * SEO rank pass #2: another 5 high-intent tools.
 * Spread after RANK5 so these win on their slugs.
 * Restored 2026-10-27 after accidental PLACEHOLDER wipe.
 */
export const TOOL_SEO_OVERRIDES_RANK6: Record<string, ToolSeoOverride> = {
  "calculadora-imc": {
    metaTitle: "BMI Calculator Free — kg & cm, WHO Categories | UtiliHub",
    metaTitleEs: "Calculadora de IMC gratis — kg y cm, categorías OMS | UtiliHub",
    metaDescription:
      "Free BMI calculator with kg and cm. Instant WHO-style category. Private, no signup.",
    metaDescriptionEs:
      "Calculadora de IMC gratis con kg y cm. Categoría tipo OMS al instante. Privada, sin registro.",
    about: ["BMI from weight and height with standard category bands."],
    aboutEs: ["IMC a partir de peso y altura con bandas estándar."],
    steps: ["Enter weight and height.", "Read BMI and category."],
    stepsEs: ["Ingresá peso y altura.", "Leé el IMC y la categoría."],
    faq: [{ q: "Formula?", a: "BMI = kg / (m × m)." }],
    faqEs: [{ q: "¿Fórmula?", a: "IMC = kg / (m × m)." }],
  },
  "calculadora-tiempo-lectura": {
    metaTitle: "Reading Time Calculator — Words to Minutes Online | UtiliHub",
    metaTitleEs: "Calculadora de tiempo de lectura — palabras a minutos | UtiliHub",
    metaDescription:
      "Convert word count to reading time at your WPM. Free estimate for posts, speeches, books and scripts.",
    metaDescriptionEs:
      "Convertí palabras a tiempo de lectura según tus PPM. Estimación gratis para textos y guiones.",
    about: ["Estimates reading time from word count and words-per-minute."],
    aboutEs: ["Estima tiempo de lectura según palabras y PPM."],
    steps: ["Enter words or paste text.", "Set WPM.", "Read minutes."],
    stepsEs: ["Ingresá palabras o pegá texto.", "Definí PPM.", "Leé los minutos."],
    faq: [{ q: "Default WPM?", a: "Often about 200 for silent adult reading." }],
    faqEs: [{ q: "¿PPM por defecto?", a: "Suele usarse ~200 para lectura silenciosa adulta." }],
  },
  "generador-de-contrasenas": {
    metaTitle: "Password Generator Free — Strong Random Passwords Online | UtiliHub",
    metaTitleEs: "Generador de contraseñas gratis — seguras y aleatorias | UtiliHub",
    metaDescription:
      "Generate strong random passwords in your browser. Adjust length and character sets. Free, no signup.",
    metaDescriptionEs:
      "Generá contraseñas aleatorias fuertes en el navegador. Largo y juegos de caracteres. Gratis.",
    about: ["Client-side random password generation with configurable options."],
    aboutEs: ["Generación local de contraseñas aleatorias configurable."],
    steps: ["Choose length and options.", "Generate.", "Copy."],
    stepsEs: ["Elegí largo y opciones.", "Generá.", "Copiá."],
    faq: [{ q: "Is it uploaded?", a: "No. Generation stays in the browser." }],
    faqEs: [{ q: "¿Se sube?", a: "No. Todo queda en el navegador." }],
  },
  "calculadora-de-porcentajes": {
    metaTitle: "Percentage Calculator — Of, Change & Discount | UtiliHub",
    metaTitleEs: "Calculadora de porcentaje — de, cambio y descuento | UtiliHub",
    metaDescription:
      "Find % of a number, what % X is of Y, and % change or discount. Free percentage calculator with clear formulas, no signup.",
    metaDescriptionEs:
      "Calculá el % de un número, qué % es X de Y, y el cambio o descuento porcentual. Fórmulas claras, gratis, sin registro.",
    about: [
      "Covers the three everyday percentage cases: part of a whole, reverse percentage, and change between two values.",
    ],
    aboutEs: [
      "Cubre los tres casos habituales: parte de un total, porcentaje inverso y cambio entre dos valores.",
    ],
    steps: ["Choose the calculation type.", "Enter the two numbers.", "Read the result and formula."],
    stepsEs: ["Elegí el tipo de cálculo.", "Ingresá los dos números.", "Leé el resultado y la fórmula."],
    faq: [{ q: "How do I calculate a discount?", a: "Use percentage change from the original price to the final price." }],
    faqEs: [{ q: "¿Cómo calculo un descuento?", a: "Usá el cambio porcentual entre el precio original y el final." }],
  },
  "media-aritmetica": {
    metaTitle: "Average Calculator Free — Arithmetic Mean Online | UtiliHub",
    metaTitleEs: "Calculadora de promedio — media aritmética online | UtiliHub",
    metaDescription:
      "Calculate the arithmetic mean of a list of numbers. Free average calculator in your browser, no signup.",
    metaDescriptionEs:
      "Calculá la media aritmética de una lista de números. Promedio gratis en el navegador, sin registro.",
    about: ["The arithmetic mean is the sum of values divided by how many values you have."],
    aboutEs: ["La media aritmética es la suma de valores dividida por la cantidad de valores."],
    steps: ["Enter numbers.", "Read the mean."],
    stepsEs: ["Ingresá números.", "Leé la media."],
    faq: [{ q: "Average vs mean?", a: "In everyday use average usually means the arithmetic mean." }],
    faqEs: [{ q: "¿Promedio o media?", a: "En el uso diario, promedio suele ser la media aritmética." }],
  },
};
