// Part 1 of 3 — entries of TOOL_SEO_OVERRIDES_ARITHMETIC_1, split from arithmetic-1.ts on 2026-11-04. Add new entries in the smallest part.
import type { ToolSeoOverrideArithmetic } from "../tool-seo-overrides-arithmetic";

export const TOOL_SEO_OVERRIDES_ARITHMETIC_1_PART1: Record<string, ToolSeoOverrideArithmetic> = {  "factorizacion-prima": {
    metaTitle: "Prime Factorization Calculator — Factor Tree Online | UtiliHub",
    metaTitleEs: "Calculadora de factorización prima — árbol de factores | UtiliHub",
    metaDescription:
      "Factor any integer ≥ 2 into primes with exponents (360 = 2³ × 3² × 5). Free prime factor tool.",
    metaDescriptionEs:
      "Factorizá cualquier entero ≥ 2 en primos con exponentes (360 = 2³ × 3² × 5). Gratis.",
    about: [
      "Prime factorization expresses a number as a product of primes raised to powers.",
      "Essential for LCM, GCD, simplifying fractions, and radicals.",
      "Results show the compact product form and a count of distinct primes.",
    ],
    aboutEs: [
      "La factorización prima escribe un número como producto de primos elevados a potencias.",
      "Clave para MCM, MCD, simplificar fracciones y radicales.",
      "El resultado muestra el producto compacto y cuántos primos distintos hay.",
    ],
    steps: ["Enter an integer n ≥ 2.", "Calculate the prime factorization.", "Use the check line to confirm the product."],
    stepsEs: ["Ingresá un entero n ≥ 2.", "Calculá la factorización prima.", "Usá la línea de verificación para confirmar el producto."],
    faq: [
      { q: "Is 1 allowed?", a: "No — 1 is not a product of primes." },
      { q: "Large numbers?", a: "Very large inputs may be slow in the browser." },
    ],
    faqEs: [
      { q: "¿Se permite el 1?", a: "No: 1 no es producto de primos." },
      { q: "¿Números grandes?", a: "Entradas muy grandes pueden ser lentas en el navegador." },
    ],
  },
};
