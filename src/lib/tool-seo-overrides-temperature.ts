import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_TEMPERATURE: Record<string, ToolSeoOverride> = {
  "conversor-temperatura": {
    metaTitle: "Temperature Converter — Celsius, Fahrenheit, Kelvin | UtiliHub",
    metaTitleEs: "Conversor de temperatura gratis — Celsius, Fahrenheit y Kelvin | UtiliHub",
    metaDescription:
      "Free temperature converter: °C, °F and K. Instant formulas (C↔F↔K). Examples: 0 °C = 32 °F, 100 °C = 212 °F. No signup, in your browser.",
    metaDescriptionEs:
      "Conversor de temperatura online gratis: °C, °F y K. Fórmulas al instante. Ejemplos: 0 °C = 32 °F, 100 °C = 212 °F. Sin registro, en el navegador.",
    about: [
      "A temperature converter changes the same thermal reading between Celsius (°C), Fahrenheit (°F), and Kelvin (K). The physical temperature does not change — only the scale.",
      "Standard formulas: °F = °C × 9/5 + 32; °C = (°F − 32) × 5/9; K = °C + 273.15. Absolute zero is 0 K = −273.15 °C = −459.67 °F.",
      "Common anchors: water freezes at 0 °C / 32 °F / 273.15 K and boils (at standard pressure) at 100 °C / 212 °F / 373.15 K. Room temperature is often near 20–22 °C (68–72 °F).",
      "Conversion runs only in your browser. Nothing is uploaded. Pair this with the dew-point or heat-index tools when humidity matters, not only the scale.",
    ],
    aboutEs: [
      "Un conversor de temperatura pasa la misma lectura térmica entre Celsius (°C), Fahrenheit (°F) y Kelvin (K). No cambia el calor físico: solo la escala.",
      "Fórmulas estándar: °F = °C × 9/5 + 32; °C = (°F − 32) × 5/9; K = °C + 273,15. El cero absoluto es 0 K = −273,15 °C = −459,67 °F.",
      "Referencias habituales: el agua congela a 0 °C / 32 °F / 273,15 K y hierve (a presión normal) a 100 °C / 212 °F / 373,15 K. Ambiente típico: unos 20–22 °C (68–72 °F).",
      "El cálculo es local en el navegador. Combiná con punto de rocío o sensación térmica cuando también importe la humedad, no solo la escala.",
    ],
    steps: [
      "Enter a number and choose the source scale (°C, °F, or K).",
      "Pick the target scale.",
      "Read the converted value; copy if needed.",
      "Check the formula and example table on the page.",
    ],
    stepsEs: [
      "Ingresá un número y elegí la escala de origen (°C, °F o K).",
      "Elegí la escala de destino.",
      "Leé el valor convertido; copiá si hace falta.",
      "Revisá la fórmula y la tabla de ejemplos en la página.",
    ],
    faq: [
      {
        q: "How do I convert Celsius to Fahrenheit?",
        a: "°F = (°C × 9/5) + 32. Example: 20 °C → 68 °F.",
      },
      {
        q: "How do I convert Fahrenheit to Celsius?",
        a: "°C = (°F − 32) × 5/9. Example: 68 °F → 20 °C.",
      },
      {
        q: "How do I convert Celsius to Kelvin?",
        a: "K = °C + 273.15. Example: 0 °C → 273.15 K.",
      },
      {
        q: "What is absolute zero?",
        a: "0 K = −273.15 °C = −459.67 °F. It is the lower limit of the thermodynamic temperature scale.",
      },
      {
        q: "Is this temperature converter free?",
        a: "Yes. It runs in your browser with no account required.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo paso de Celsius a Fahrenheit?",
        a: "°F = (°C × 9/5) + 32. Ejemplo: 20 °C → 68 °F.",
      },
      {
        q: "¿Cómo paso de Fahrenheit a Celsius?",
        a: "°C = (°F − 32) × 5/9. Ejemplo: 68 °F → 20 °C.",
      },
      {
        q: "¿Cómo paso de Celsius a Kelvin?",
        a: "K = °C + 273,15. Ejemplo: 0 °C → 273,15 K.",
      },
      {
        q: "¿Qué es el cero absoluto?",
        a: "0 K = −273,15 °C = −459,67 °F. Es el límite inferior de la escala termodinámica.",
      },
      {
        q: "¿Hay conversor de temperatura online gratis?",
        a: "Sí. Esta herramienta convierte °C, °F y K en el navegador sin registro.",
      },
    ],
  },
};
