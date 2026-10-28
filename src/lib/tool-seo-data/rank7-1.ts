// TOOL_SEO_OVERRIDES_RANK7 part 1 — split out of ../tool-seo-overrides-rank7.ts on 2026-10-28.
// Add new entries in the smallest file of this folder; never rewrite files wholesale.
import type { ToolSeoOverride } from "../tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_RANK7_1: Record<string, ToolSeoOverride> = {
  "calculadora-de-fechas": {
    metaTitle: "Date Difference Calculator — Days Between Two Dates | UtiliHub",
    metaTitleEs: "Calculadora de diferencia de fechas online — días entre dos fechas | UtiliHub",
    metaDescription:
      "Calculate days, weeks, months, years and business days between two dates. Free date difference calculator, no signup.",
    metaDescriptionEs:
      "Calculá días, semanas, meses, años y días hábiles entre dos fechas. Calculadora de diferencia de fechas gratis, sin registro.",
    about: [
      "A date difference tool measures the interval between two calendar dates. It can report total days, weeks, months, years, and often business days (Monday–Friday).",
      "Leap years are included because the calculation uses the real Gregorian calendar. Local public holidays are usually not subtracted — they vary by country.",
      "Useful for contracts, project deadlines, pregnancy weeks, and “how many days until” planning.",
    ],
    aboutEs: [
      "Una calculadora de diferencia de fechas mide el intervalo entre dos fechas del calendario. Puede mostrar días totales, semanas, meses, años y días hábiles (lunes a viernes).",
      "Los años bisiestos se tienen en cuenta porque se usa el calendario gregoriano real. Los feriados locales no suelen restarse: cambian por país y región.",
      "Útil para contratos, plazos de proyectos, semanas de embarazo y planificar “cuántos días faltan”.",
    ],
    steps: [
      "Select the start date.",
      "Select the end date.",
      "Read days, weeks, months and business days.",
    ],
    stepsEs: [
      "Elegí la fecha de inicio.",
      "Elegí la fecha de fin.",
      "Leé días, semanas, meses y días hábiles.",
    ],
    faq: [
      {
        q: "How do I calculate days between two dates?",
        a: "Pick start and end dates; the tool counts the interval. If you need the end day included as a full day, add one to total days.",
      },
      {
        q: "Does it subtract holidays?",
        a: "No. Business days here mean Monday–Friday only, not country-specific holidays.",
      },
      {
        q: "Does it handle leap years?",
        a: "Yes. February 29 is included when it falls in the range.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo calcular los días entre dos fechas?",
        a: "Elegí fecha inicio y fin; la herramienta cuenta el intervalo. Si necesitás contar el día final como día completo, sumá uno al total de días.",
      },
      {
        q: "¿Resta feriados?",
        a: "No. Los días hábiles aquí son lunes a viernes, sin feriados locales.",
      },
      {
        q: "¿Tiene en cuenta años bisiestos?",
        a: "Sí. El 29 de febrero se incluye cuando cae en el rango.",
      },
      {
        q: "¿Hay calculadora de diferencia de fechas online gratis?",
        a: "Sí. Esta calcula días y desglose en el navegador, sin registro.",
      },
    ],
  },

  "conversor-de-temperatura": {
    metaTitle: "Temperature Converter — °C, °F and Kelvin Free | UtiliHub",
    metaTitleEs: "Conversor de temperatura online gratis — °C, °F y Kelvin | UtiliHub",
    metaDescription:
      "Convert Celsius, Fahrenheit and Kelvin instantly with formulas shown. Free temperature converter, no signup.",
    metaDescriptionEs:
      "Convertí Celsius, Fahrenheit y Kelvin al instante, con las fórmulas a la vista. Conversor de temperatura gratis, sin registro.",
    about: [
      "Temperature conversion uses fixed formulas: °F = °C × 9/5 + 32; K = °C + 273.15; and the inverse relations.",
      "Type a value in any scale and the other two update. Handy for cooking, weather, science and travel.",
      "All math runs in the browser — no account required.",
    ],
    aboutEs: [
      "La conversión de temperatura usa fórmulas fijas: °F = °C × 9/5 + 32; K = °C + 273,15; y las relaciones inversas.",
      "Escribí un valor en cualquier escala y las otras dos se actualizan. Útil para cocina, clima, ciencia y viajes.",
      "Todo el cálculo corre en el navegador, sin cuenta.",
    ],
    steps: [
      "Enter the temperature you know.",
      "Read the other two scales.",
      "Check the formula under the converter if needed.",
    ],
    stepsEs: [
      "Ingresá la temperatura que conocés.",
      "Leé las otras dos escalas.",
      "Revisá la fórmula debajo del conversor si hace falta.",
    ],
    faq: [
      {
        q: "How do I convert Celsius to Fahrenheit?",
        a: "°F = °C × 9/5 + 32. Example: 100 °C → 212 °F.",
      },
      {
        q: "What is 100 °F in Celsius?",
        a: "(100 − 32) × 5/9 ≈ 37.78 °C.",
      },
      {
        q: "How do I convert Celsius to Kelvin?",
        a: "K = °C + 273.15. Example: 0 °C → 273.15 K.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo pasar de Celsius a Fahrenheit?",
        a: "°F = °C × 9/5 + 32. Ejemplo: 100 °C → 212 °F.",
      },
      {
        q: "¿Cuánto es 100 °F en Celsius?",
        a: "(100 − 32) × 5/9 ≈ 37,78 °C.",
      },
      {
        q: "¿Cómo pasar de Celsius a Kelvin?",
        a: "K = °C + 273,15. Ejemplo: 0 °C → 273,15 K.",
      },
      {
        q: "¿Hay conversor de temperatura online gratis?",
        a: "Sí. Este convierte °C, °F y K en el navegador, sin registro.",
      },
    ],
  },

};
