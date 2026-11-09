import { TOOL_SEO_OVERRIDES_SEQUENCE_PART1 } from "./tool-seo-overrides-sequence.part1";
import { TOOL_SEO_OVERRIDES_SEQUENCE_PART2 } from "./tool-seo-overrides-sequence.part2";
/** Unique SEO for sequence-suite calculators. */

export type ToolSeoOverrideSequence = {
  metaTitle?: string;
  metaTitleEs?: string;
  metaDescription?: string;
  metaDescriptionEs?: string;
  about: string[];
  aboutEs?: string[];
  steps: string[];
  stepsEs?: string[];
  faq: { q: string; a: string }[];
  faqEs?: { q: string; a: string }[];
};

export const TOOL_SEO_OVERRIDES_SEQUENCE: Record<string, ToolSeoOverrideSequence> = {
  ...TOOL_SEO_OVERRIDES_SEQUENCE_PART1,
  ...TOOL_SEO_OVERRIDES_SEQUENCE_PART2,
  "sucesion-geometrica": {
    metaTitle: "Geometric Sequence Calculator — nth Term & Series Sum | UtiliHub",
    metaTitleEs: "Calculadora sucesión geométrica — término n y suma | UtiliHub",
    metaDescription:
      "Compute aₙ = a₁·rⁿ⁻¹ and geometric series sum Sₙ. Handles r=1. Free geometric sequence tool.",
    metaDescriptionEs:
      "Calculá aₙ = a₁·rⁿ⁻¹ y la suma de la serie geométrica Sₙ. Incluye r=1. Gratis.",
    about: [
      "Geometric sequences multiply by a constant ratio r each step.",
      "The finite geometric series sum has a closed form for r≠1.",
      "Models compound growth, decay, and recursive scaling.",
    ],
    aboutEs: [
      "Las sucesiones geométricas se multiplican por una razón constante r.",
      "La suma finita tiene fórmula cerrada si r≠1.",
      "Modelan crecimiento compuesto, decaimiento y escalas recursivas.",
    ],
    steps: ["Enter a₁, r, and n ≥ 1.", "Calculate aₙ and Sₙ.", "Avoid extreme |r|ⁿ that overflow."],
    stepsEs: ["Ingresá a₁, r y n ≥ 1.", "Calculá aₙ y Sₙ.", "Evitá |r|ⁿ extremos que desborden."],
    faq: [
      { q: "r = 1?", a: "Then aₙ = a₁ and Sₙ = n·a₁." },
      { q: "Infinite series?", a: "This tool sums the first n terms only." },
    ],
    faqEs: [
      { q: "¿r = 1?", a: "Entonces aₙ = a₁ y Sₙ = n·a₁." },
      { q: "¿Serie infinita?", a: "Esta herramienta solo suma los primeros n términos." },
    ],
  },
  "suma-naturales-cuadrados": {
    metaTitle: "Sum of Naturals & Squares Calculator — Closed Formulas | UtiliHub",
    metaTitleEs: "Calculadora suma de naturales y cuadrados — fórmulas cerradas | UtiliHub",
    metaDescription:
      "n(n+1)/2 and n(n+1)(2n+1)/6 for the sum of the first n naturals and squares. Free formula tool.",
    metaDescriptionEs:
      "n(n+1)/2 y n(n+1)(2n+1)/6 para la suma de los primeros n naturales y cuadrados. Gratis.",
    about: [
      "Gauss’s formula sums 1 through n in constant time.",
      "The sum of squares formula is a standard discrete-math identity.",
      "Ideal for checking homework and induction examples.",
    ],
    aboutEs: [
      "La fórmula de Gauss suma 1 hasta n en tiempo constante.",
      "La suma de cuadrados es una identidad clásica de matemática discreta.",
      "Ideal para verificar deberes y ejemplos de inducción.",
    ],
    steps: ["Enter n ≥ 0.", "Read both closed-form results.", "Try small n to verify by hand."],
    stepsEs: ["Ingresá n ≥ 0.", "Leé ambos resultados de fórmula cerrada.", "Probá n chicos para verificar a mano."],
    faq: [
      { q: "Sum of cubes?", a: "That equals [n(n+1)/2]² — not included here yet." },
      { q: "n = 0?", a: "Both sums are 0." },
    ],
    faqEs: [
      { q: "¿Suma de cubos?", a: "Vale [n(n+1)/2]² — aún no está en esta tool." },
      { q: "¿n = 0?", a: "Ambas sumas son 0." },
    ],
  },
};
