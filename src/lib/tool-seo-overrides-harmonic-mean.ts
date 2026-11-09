import type { ToolSeoOverride } from "./tool-seo-overrides";

/** SEO override for the harmonic mean calculator (matematicas) — bilingual, non-generic. */
export const TOOL_SEO_OVERRIDES_HARMONIC_MEAN: Record<string, ToolSeoOverride> = {
  "calculadora-media-armonica": {
    metaTitle: "Harmonic Mean Calculator — n / Σ(1/x) for Rates & Speeds | UtiliHub",
    metaTitleEs: "Calculadora de media armónica — n / Σ(1/x) para tasas y velocidades | UtiliHub",
    metaDescription:
      "Free harmonic mean calculator. Formula: H = n / Σ(1/x). Ideal for averaging speeds over equal distances or rates. Instant, browser-only, no signup.",
    metaDescriptionEs:
      "Calcula la media armónica de una lista de números positivos con la fórmula H = n / Σ(1/x). Ideal para velocidades y tasas. Gratis, sin registro y al instante.",
    about: [
      "The harmonic mean is H = n / Σ(1/x_i): the number of values divided by the sum of their reciprocals.",
      "It is the correct average for rates over equal segments, such as round-trip speed over the same distance.",
      "It only accepts positive numbers and is always ≤ the arithmetic mean of the same values.",
    ],
    aboutEs: [
      "La media armónica es H = n / Σ(1/x_i): la cantidad de valores dividida por la suma de sus inversos.",
      "Es el promedio correcto para tasas sobre tramos iguales, como la velocidad de ida y vuelta sobre la misma distancia.",
      "Solo admite números positivos y siempre es ≤ que la media aritmética de los mismos valores.",
    ],
    steps: [
      "Enter two or more positive numbers, separated by commas or spaces.",
      "The harmonic mean updates instantly as you type.",
      "Copy the result or compare it with the arithmetic mean shown alongside.",
    ],
    stepsEs: [
      "Ingresá dos o más números positivos, separados por comas o espacios.",
      "La media armónica se actualiza al instante mientras escribís.",
      "Copiá el resultado o comparalo con la media aritmética que se muestra junto al valor.",
    ],
    faq: [
      {
        q: "What is the harmonic mean?",
        a: "H = n / Σ(1/x_i). It is the appropriate average for rates, speeds, or ratios (e.g. average speed over equal distances). Only defined for positive numbers.",
      },
      {
        q: "How does it differ from the arithmetic mean?",
        a: "The arithmetic mean treats values equally. The harmonic mean gives more weight to smaller values and is always ≤ the arithmetic mean for positive numbers.",
      },
      {
        q: "When should I use the harmonic mean?",
        a: "Use it when averaging rates over equal segments: speed over the same distance there and back, price per unit over equal spending, or work rates combined.",
      },
    ],
    faqEs: [
      {
        q: "¿Qué es la media armónica?",
        a: "H = n / Σ(1/x_i). Es el promedio adecuado para tasas, velocidades o razones (por ejemplo, la velocidad media sobre distancias iguales). Solo está definida para números positivos.",
      },
      {
        q: "¿En qué se diferencia de la media aritmética?",
        a: "La media aritmética trata los valores por igual. La media armónica da más peso a los valores pequeños y siempre es ≤ que la media aritmética para números positivos.",
      },
      {
        q: "¿Cuándo debo usar la media armónica?",
        a: "Para promediar tasas sobre tramos iguales: velocidad de ida y vuelta sobre la misma distancia, precio por unidad con gasto igual, o ritmos de trabajo combinados.",
      },
    ],
  },
};
