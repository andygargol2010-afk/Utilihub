// Part 2 of 3 — entries of TOOL_SEO_OVERRIDES_SEQUENCE, split from tool-seo-overrides-sequence.ts on 2026-11-04. Add new entries in the smallest part.
import type { ToolSeoOverrideSequence } from "./tool-seo-overrides-sequence";

export const TOOL_SEO_OVERRIDES_SEQUENCE_PART2: Record<string, ToolSeoOverrideSequence> = {  "sucesion-aritmetica": {
    metaTitle: "Arithmetic Sequence Calculator — nth Term & Sum | UtiliHub",
    metaTitleEs: "Calculadora sucesión aritmética — término n y suma | UtiliHub",
    metaDescription:
      "Find aₙ = a₁+(n−1)d and Sₙ = n/2·(2a₁+(n−1)d). Free arithmetic sequence and series tool.",
    metaDescriptionEs:
      "Obtené aₙ = a₁+(n−1)d y Sₙ = n/2·(2a₁+(n−1)d). Sucesión y serie aritmética gratis.",
    about: [
      "Arithmetic sequences change by a constant difference d each step.",
      "Closed forms give any term and the sum without listing every value.",
      "Standard in algebra courses and financial arithmetic progressions.",
    ],
    aboutEs: [
      "Las sucesiones aritméticas cambian con una diferencia constante d.",
      "Las fórmulas cerradas dan cualquier término y la suma sin listar todo.",
      "Estándar en álgebra y progresiones financieras simples.",
    ],
    steps: ["Enter a₁, d, and n ≥ 1.", "Calculate aₙ and Sₙ.", "Negative d is allowed for decreasing sequences."],
    stepsEs: ["Ingresá a₁, d y n ≥ 1.", "Calculá aₙ y Sₙ.", "d negativo vale para sucesiones decrecientes."],
    faq: [
      { q: "Is n 1-based?", a: "Yes — the first term is n=1." },
      { q: "Sum formula?", a: "Sₙ = n/2 · (first + last) works too." },
    ],
    faqEs: [
      { q: "¿n empieza en 1?", a: "Sí: el primer término es n=1." },
      { q: "¿Fórmula de la suma?", a: "También Sₙ = n/2 · (primero + último)." },
    ],
  },
};
