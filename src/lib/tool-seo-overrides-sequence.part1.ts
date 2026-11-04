// Part 1 of 3 — entries of TOOL_SEO_OVERRIDES_SEQUENCE, split from tool-seo-overrides-sequence.ts on 2026-11-04. Add new entries in the smallest part.
import type { ToolSeoOverrideSequence } from "./tool-seo-overrides-sequence";

export const TOOL_SEO_OVERRIDES_SEQUENCE_PART1: Record<string, ToolSeoOverrideSequence> = {  fibonacci: {
    metaTitle: "Fibonacci Calculator — F(n) and Partial Sum | UtiliHub",
    metaTitleEs: "Calculadora Fibonacci — F(n) y suma parcial | UtiliHub",
    metaDescription:
      "Compute the nth Fibonacci number and the sum F(0)+…+F(n). Free Fibonacci sequence tool.",
    metaDescriptionEs:
      "Calculá el n-ésimo número de Fibonacci y la suma F(0)+…+F(n). Herramienta gratis.",
    about: [
      "Fibonacci numbers satisfy F(n)=F(n−1)+F(n−2) with F(0)=0, F(1)=1.",
      "The partial sum identity Σ F(k) from 0 to n equals F(n+2)−1.",
      "Appears in algorithms, phyllotaxis models, and combinatorics.",
    ],
    aboutEs: [
      "Los números de Fibonacci cumplen F(n)=F(n−1)+F(n−2) con F(0)=0, F(1)=1.",
      "La suma parcial Σ F(k) de 0 a n vale F(n+2)−1.",
      "Aparecen en algoritmos, modelos biológicos y combinatoria.",
    ],
    steps: ["Enter n ≥ 0.", "Read F(n) and the sum.", "Prefer n ≤ 70 for exact integer display."],
    stepsEs: ["Ingresá n ≥ 0.", "Leé F(n) y la suma.", "Preferí n ≤ 70 para enteros exactos."],
    faq: [
      { q: "F(0) or F(1) start?", a: "This tool uses F(0)=0, F(1)=1." },
      { q: "Large n?", a: "Beyond ~70, JavaScript uses floating-point approximation." },
    ],
    faqEs: [
      { q: "¿Empieza en F(0) o F(1)?", a: "Usamos F(0)=0, F(1)=1." },
      { q: "¿n grande?", a: "Más allá de ~70, JavaScript usa aproximación flotante." },
    ],
  },
};
