import type { ToolSeoOverride } from "./tool-seo-overrides";
import { TOOL_SEO_OVERRIDES_GSC_QUERIES_PART1 } from "./tool-seo-overrides-gsc-queries.part1";
import { TOOL_SEO_OVERRIDES_GSC_QUERIES_PART2 } from "./tool-seo-overrides-gsc-queries.part2";


/** GSC top queries by impressions+clicks (2026-10-31). One cycle SEO batch. */
export const TOOL_SEO_OVERRIDES_GSC_QUERIES: Record<string, ToolSeoOverride> = {
  ...TOOL_SEO_OVERRIDES_GSC_QUERIES_PART1,
  ...TOOL_SEO_OVERRIDES_GSC_QUERIES_PART2,
  "calculadora-tiempo-de-lectura": {
    metaTitle: "Words to Minutes — Reading Time Calculator (WPM) | UtiliHub",
    metaTitleEs: "Palabras a minutos — calculadora de tiempo de lectura (PPM) | UtiliHub",
    metaDescription:
      "Words to minutes converter: estimate reading time from word count and words-per-minute. Free reading time calculator for articles and scripts.",
    metaDescriptionEs:
      "Palabras a minutos: estimá el tiempo de lectura con el número de palabras y las palabras por minuto. Calculadora gratis para artículos y guiones.",
    about: [
      "“Words to minutes” and “words to time” queries ask how long a text takes to read or speak at a given words-per-minute rate.",
      "Formula: minutes = word count ÷ WPM. Typical silent reading is about 200–250 WPM; spoken narration is often ~130–150 WPM.",
    ],
    aboutEs: [
      "Las búsquedas “words to minutes” o “palabras a minutos” preguntan cuánto tarda un texto en leerse o narrarse a cierta velocidad (palabras por minuto).",
      "Fórmula: minutos = palabras ÷ PPM. Lectura silenciosa típica: 200–250 PPM; narración hablada: ~130–150 PPM.",
    ],
    faq: [
      {
        q: "How do I convert words to minutes?",
        a: "Divide the number of words by your reading or speaking speed in words per minute. Example: 1000 words at 200 WPM ≈ 5 minutes.",
      },
      {
        q: "What WPM should I use?",
        a: "Around 200–250 for silent reading adults; slower for technical text; ~150 for spoken audio scripts.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo paso palabras a minutos?",
        a: "Dividí la cantidad de palabras por la velocidad en palabras por minuto. Ejemplo: 1000 palabras a 200 PPM ≈ 5 minutos.",
      },
      {
        q: "¿Qué PPM uso?",
        a: "Unas 200–250 para lectura silenciosa de adultos; menos en texto técnico; ~150 para guiones hablados.",
      },
    ],
  },
  "calculadora-energia-cinetica": {
    metaTitle: "Kinetic Energy Calculator — KE = ½ mv² Online | UtiliHub",
    metaTitleEs: "Calculadora de energía cinética — KE = ½ mv² online | UtiliHub",
    metaDescription:
      "Free kinetic energy calculator. Enter mass and velocity to get KE = ½mv² in joules. Instant physics tool, no signup.",
    metaDescriptionEs:
      "Calculadora de energía cinética gratis. Ingresá masa y velocidad y obtené KE = ½mv² en julios. Física al instante, sin registro.",
    about: [
      "Kinetic energy is the energy of motion: KE = ½ × mass × velocity². With mass in kg and velocity in m/s, the result is in joules (J).",
      "Use the calculator for homework, engineering estimates or quick checks without a spreadsheet.",
    ],
    aboutEs: [
      "La energía cinética es la energía del movimiento: KE = ½ × masa × velocidad². Con masa en kg y velocidad en m/s, el resultado está en julios (J).",
      "Útil para deberes, estimaciones de ingeniería o comprobaciones rápidas sin hoja de cálculo.",
    ],
    faq: [
      {
        q: "What is the kinetic energy formula?",
        a: "KE = ½ × m × v², where m is mass and v is speed. Double the speed and kinetic energy quadruples.",
      },
      {
        q: "Which units should I use?",
        a: "SI units: kilograms and meters per second yield joules. Convert other units before entering values if needed.",
      },
    ],
    faqEs: [
      {
        q: "¿Cuál es la fórmula de energía cinética?",
        a: "KE = ½ × m × v². Si duplicás la velocidad, la energía se multiplica por cuatro.",
      },
      {
        q: "¿Qué unidades uso?",
        a: "Sistema SI: kilogramos y metros por segundo dan julios. Convertí otras unidades antes de ingresar los valores.",
      },
    ],
  },
  "calculadora-horas-extras": {
    metaTitle: "Calculadora de Horas Extra Online — Pago Overtime | UtiliHub",
    metaTitleEs: "Calculadora de horas extra online — pago overtime | UtiliHub",
    metaDescription:
      "Calculadora de horas extra: ingresá tarifa, horas normales y horas extra con multiplicador 1,5x o 2x. Resultado de pago total al instante.",
    metaDescriptionEs:
      "Calculadora de horas extras online: tarifa por hora, horas normales y extra con 1,5x o 2x. Calculá el pago total al instante, sin registro.",
    about: [
      "An overtime pay calculator multiplies overtime hours by the hourly rate and a multiplier (often 1.5 for time-and-a-half or 2 for double time), then adds regular pay.",
      "Spanish searches such as “calculadora de horas extra” and “calcular valor hora extra online” expect a clear total with regular and overtime lines.",
    ],
    aboutEs: [
      "Una calculadora de horas extra multiplica las horas extra por la tarifa y un multiplicador (suele ser 1,5 o 2) y suma el pago de horas normales.",
      "Búsquedas como “calculadora de horas extra” o “calcular valor hora extra online” esperan un total claro con línea normal y línea extra.",
    ],
    faq: [
      {
        q: "¿Cómo se calcula el valor de la hora extra?",
        a: "Hora extra = tarifa horaria × multiplicador (por ejemplo 1,5). El total es (horas normales × tarifa) + (horas extra × tarifa × multiplicador).",
      },
      {
        q: "¿Puedo usar 1,5x y 2x?",
        a: "Sí. Elegí el multiplicador habitual de tu contrato o convenio.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo se calcula el valor de la hora extra?",
        a: "Hora extra = tarifa horaria × multiplicador (por ejemplo 1,5). Total = (horas normales × tarifa) + (horas extra × tarifa × multiplicador).",
      },
      {
        q: "¿Puedo usar 1,5x y 2x?",
        a: "Sí. Usá el multiplicador de tu contrato o convenio.",
      },
    ],
  },
};
