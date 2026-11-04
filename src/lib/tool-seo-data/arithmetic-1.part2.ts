// Part 2 of 3 — entries of TOOL_SEO_OVERRIDES_ARITHMETIC_1, split from arithmetic-1.ts on 2026-11-04. Add new entries in the smallest part.
import type { ToolSeoOverrideArithmetic } from "../tool-seo-overrides-arithmetic";

export const TOOL_SEO_OVERRIDES_ARITHMETIC_1_PART2: Record<string, ToolSeoOverrideArithmetic> = {  "es-primo": {
    metaTitle: "Is Prime Number Calculator — Test & Next Prime | UtiliHub",
    metaTitleEs: "Calculadora ¿es primo? — test y siguiente primo | UtiliHub",
    metaDescription:
      "Check if an integer is prime and find the next prime ≥ n or > n. Fast trial-division test.",
    metaDescriptionEs:
      "Comprobá si un entero es primo y encontrá el siguiente primo ≥ n o > n. Test rápido por división.",
    about: [
      "Primes have exactly two positive divisors: 1 and themselves.",
      "The tool labels n as prime, composite, or neither (for n ≤ 1).",
      "Next-prime helpers are useful for hashing examples and number-theory drills.",
    ],
    aboutEs: [
      "Los primos tienen exactamente dos divisores positivos: 1 y ellos mismos.",
      "La herramienta etiqueta n como primo, compuesto o ninguno (n ≤ 1).",
      "Los botones de siguiente primo sirven para ejercicios de teoría de números.",
    ],
    steps: ["Enter an integer.", "Read prime/composite status.", "Use the next-prime cards as needed."],
    stepsEs: ["Ingresá un entero.", "Leé si es primo o compuesto.", "Usá las tarjetas de siguiente primo si hace falta."],
    faq: [
      { q: "Is 2 prime?", a: "Yes — the only even prime." },
      { q: "Negatives?", a: "Primality is defined for positive integers; the tool uses |n|." },
    ],
    faqEs: [
      { q: "¿El 2 es primo?", a: "Sí: el único primo par." },
      { q: "¿Negativos?", a: "La primalidad se define en enteros positivos; se usa |n|." },
    ],
  },  "raiz-cubica": {
    metaTitle: "Cube Root Calculator — ∛x for Any Real Number | UtiliHub",
    metaTitleEs: "Calculadora de raíz cúbica — ∛x para cualquier real | UtiliHub",
    metaDescription:
      "Real cube root of any number, including negatives. Verification by cubing the result. Free ∛ tool.",
    metaDescriptionEs:
      "Raíz cúbica real de cualquier número, incluidos negativos. Verificación al elevar al cubo. Gratis.",
    about: [
      "Every real number has a unique real cube root.",
      "Negative inputs map to negative roots (∛(−8) = −2).",
      "A verification card cubes the root so you can spot rounding error.",
    ],
    aboutEs: [
      "Todo real tiene una única raíz cúbica real.",
      "Las entradas negativas dan raíces negativas (∛(−8) = −2).",
      "Una tarjeta de verificación eleva la raíz al cubo para ver el error de redondeo.",
    ],
    steps: ["Enter any real x.", "Read ∛x.", "Confirm with the root³ card."],
    stepsEs: ["Ingresá cualquier real x.", "Leé ∛x.", "Confirmá con la tarjeta root³."],
    faq: [
      { q: "Complex roots?", a: "This tool returns only the principal real root." },
      { q: "Difference from square root?", a: "Square roots of negatives are not real; cube roots are." },
    ],
    faqEs: [
      { q: "¿Raíces complejas?", a: "Solo devolvemos la raíz real principal." },
      { q: "¿Diferencia con la raíz cuadrada?", a: "La cuadrada de un negativo no es real; la cúbica sí." },
    ],
  },
};
