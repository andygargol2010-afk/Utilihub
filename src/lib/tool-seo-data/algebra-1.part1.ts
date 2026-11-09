// Part 1 of 3 — entries of TOOL_SEO_OVERRIDES_ALGEBRA_1, split from algebra-1.ts on 2026-11-04. Add new entries in the smallest part.
import type { ToolSeoOverrideAlgebra } from "../tool-seo-overrides-algebra";

export const TOOL_SEO_OVERRIDES_ALGEBRA_1_PART1: Record<string, ToolSeoOverrideAlgebra> = {  "formula-cuadratica": {
    metaTitle: "Quadratic Formula Calculator — Solve ax²+bx+c=0 | UtiliHub",
    metaTitleEs: "Calculadora fórmula cuadrática — resuelve ax²+bx+c=0 | UtiliHub",
    metaDescription:
      "Solve any quadratic with x = (−b ± √(b²−4ac))/(2a). See both roots, discriminant, and complex solutions when needed.",
    metaDescriptionEs:
      "Resolvé cualquier cuadrática con x = (−b ± √(b²−4ac))/(2a). Raíces, discriminante y soluciones complejas si hace falta.",
    about: [
      "The quadratic formula is the standard closed-form solution for second-degree equations with a ≠ 0.",
      "You get both roots when they are real, or the complex pair when the discriminant is negative.",
      "Ideal for checking homework, physics trajectories, and any model that reduces to a parabola.",
    ],
    aboutEs: [
      "La fórmula cuadrática es la solución cerrada estándar de ecuaciones de segundo grado con a ≠ 0.",
      "Obtenés ambas raíces reales o el par complejo si el discriminante es negativo.",
      "Ideal para deberes, trayectorias en física y modelos que reducen a una parábola.",
    ],
    steps: [
      "Enter coefficients a, b, and c.",
      "Calculate to view roots and discriminant.",
      "If a = 0, the equation is linear — not quadratic.",
    ],
    stepsEs: [
      "Ingresá los coeficientes a, b y c.",
      "Calculá para ver raíces y discriminante.",
      "Si a = 0, la ecuación es lineal, no cuadrática.",
    ],
    faq: [
      { q: "Negative discriminant?", a: "No real roots; the tool shows the complex conjugate pair with i." },
      { q: "Repeated root?", a: "When Δ = 0 you get one real root with multiplicity two." },
    ],
    faqEs: [
      { q: "¿Discriminante negativo?", a: "Sin raíces reales; se muestra el par conjugado complejo con i." },
      { q: "¿Raíz repetida?", a: "Cuando Δ = 0 hay una raíz real con multiplicidad dos." },
    ],
  },
};
