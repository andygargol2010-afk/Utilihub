// Part 2 of 3 — entries of TOOL_SEO_OVERRIDES_ALGEBRA_1, split from algebra-1.ts on 2026-11-04. Add new entries in the smallest part.
import type { ToolSeoOverrideAlgebra } from "../tool-seo-overrides-algebra";

export const TOOL_SEO_OVERRIDES_ALGEBRA_1_PART2: Record<string, ToolSeoOverrideAlgebra> = {  discriminante: {
    metaTitle: "Discriminant Calculator — Δ = b² − 4ac | UtiliHub",
    metaTitleEs: "Calculadora de discriminante — Δ = b² − 4ac | UtiliHub",
    metaDescription:
      "Compute the quadratic discriminant and classify two, one, or zero real roots without fully solving.",
    metaDescriptionEs:
      "Calculá el discriminante de una cuadrática y clasificá dos, una o cero raíces reales sin resolver del todo.",
    about: [
      "Δ = b² − 4ac decides the nature of quadratic roots before you extract square roots.",
      "Positive → two distinct real roots; zero → repeated root; negative → complex pair.",
      "Fast for multiple-choice and graphing intuition when exact roots are optional.",
    ],
    aboutEs: [
      "Δ = b² − 4ac decide la naturaleza de las raíces antes de extraer raíces cuadradas.",
      "Positivo → dos raíces reales; cero → raíz repetida; negativo → par complejo.",
      "Rápido para opciones múltiples e intuición gráfica cuando no necesitás las raíces exactas.",
    ],
    steps: [
      "Enter a, b, and c.",
      "Read Δ and the classification.",
      "Use the quadratic formula tool for explicit roots.",
    ],
    stepsEs: [
      "Ingresá a, b y c.",
      "Leé Δ y la clasificación.",
      "Usá la fórmula cuadrática si necesitás las raíces explícitas.",
    ],
    faq: [
      { q: "Only for quadratics?", a: "Yes — this calculator targets ax²+bx+c with a ≠ 0." },
      { q: "a = 0?", a: "Then the expression is not quadratic; discriminant does not apply." },
    ],
    faqEs: [
      { q: "¿Solo cuadráticas?", a: "Sí: apunta a ax²+bx+c con a ≠ 0." },
      { q: "¿a = 0?", a: "Ya no es cuadrática; el discriminante no aplica." },
    ],
  },
};
