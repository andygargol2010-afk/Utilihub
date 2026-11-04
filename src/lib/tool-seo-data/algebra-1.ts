// TOOL_SEO_OVERRIDES_ALGEBRA part 1 — split out of ../tool-seo-overrides-algebra.ts on 2026-10-28.
// Add new entries in the smallest file of this folder; never rewrite files wholesale.
import type { ToolSeoOverrideAlgebra } from "../tool-seo-overrides-algebra";
import { TOOL_SEO_OVERRIDES_ALGEBRA_1_PART1 } from "./algebra-1.part1";
import { TOOL_SEO_OVERRIDES_ALGEBRA_1_PART2 } from "./algebra-1.part2";


export const TOOL_SEO_OVERRIDES_ALGEBRA_1: Record<string, ToolSeoOverrideAlgebra> = {
  ...TOOL_SEO_OVERRIDES_ALGEBRA_1_PART1,
  ...TOOL_SEO_OVERRIDES_ALGEBRA_1_PART2,
  "completar-cuadrado": {
    metaTitle: "Completing the Square Calculator — Vertex Form | UtiliHub",
    metaTitleEs: "Calculadora completar el cuadrado — forma vértice | UtiliHub",
    metaDescription:
      "Rewrite ax²+bx+c as a(x−h)²+k and read the vertex (h,k). Free completing-the-square tool.",
    metaDescriptionEs:
      "Reescribí ax²+bx+c como a(x−h)²+k y leé el vértice (h,k). Herramienta gratis para completar el cuadrado.",
    about: [
      "Completing the square turns standard form into vertex form so the vertex and min/max are obvious.",
      "Works for any a ≠ 0, including non-monic leading coefficients.",
      "Used in graphing, optimization intros, and deriving the quadratic formula.",
    ],
    aboutEs: [
      "Completar el cuadrado pasa de forma estándar a forma vértice para ver el extremo de un vistazo.",
      "Funciona con cualquier a ≠ 0, incluido el coeficiente principal distinto de 1.",
      "Se usa en gráficas, optimización introductoria y en la derivación de la fórmula cuadrática.",
    ],
    steps: [
      "Enter a, b, and c.",
      "Read vertex form and (h, k).",
      "Confirm a ≠ 0.",
    ],
    stepsEs: [
      "Ingresá a, b y c.",
      "Leé la forma vértice y (h, k).",
      "Confirmá que a ≠ 0.",
    ],
    faq: [
      { q: "What is (h, k)?", a: "The vertex of the parabola in vertex form a(x−h)²+k." },
      { q: "Minimum or maximum?", a: "Minimum when a > 0, maximum when a < 0." },
    ],
    faqEs: [
      { q: "¿Qué es (h, k)?", a: "El vértice de la parábola en la forma a(x−h)²+k." },
      { q: "¿Mínimo o máximo?", a: "Mínimo si a > 0, máximo si a < 0." },
    ],
  },
  "sistema-ecuaciones-2x2": {
    metaTitle: "2×2 System of Equations Solver — Cramer’s Rule | UtiliHub",
    metaTitleEs: "Resolutor de sistema 2×2 — regla de Cramer | UtiliHub",
    metaDescription:
      "Solve a₁x+b₁y=c₁ and a₂x+b₂y=c₂. Unique solution, parallel lines, or infinite solutions diagnosed.",
    metaDescriptionEs:
      "Resolvé a₁x+b₁y=c₁ y a₂x+b₂y=c₂. Solución única, paralelas o infinitas soluciones diagnosticadas.",
    about: [
      "A 2×2 linear system has a unique solution when the coefficient determinant is non-zero.",
      "Cramer’s rule returns x and y directly; singular cases report parallel or coincident lines.",
      "Common in mixture problems, break-even analysis, and first linear-algebra exercises.",
    ],
    aboutEs: [
      "Un sistema lineal 2×2 tiene solución única cuando el determinante de coeficientes no es cero.",
      "La regla de Cramer devuelve x e y; los casos singulares reportan paralelas o la misma recta.",
      "Común en mezclas, punto de equilibrio y primeros ejercicios de álgebra lineal.",
    ],
    steps: [
      "Enter six coefficients: a₁,b₁,c₁ and a₂,b₂,c₂.",
      "Calculate x and y (or the singularity message).",
      "Check units match the problem context.",
    ],
    stepsEs: [
      "Ingresá seis coeficientes: a₁,b₁,c₁ y a₂,b₂,c₂.",
      "Calculá x e y (o el mensaje de singularidad).",
      "Verificá que las unidades coincidan con el problema.",
    ],
    faq: [
      { q: "No solution?", a: "Parallel distinct lines — inconsistent system." },
      { q: "Infinite solutions?", a: "Both equations describe the same line." },
    ],
    faqEs: [
      { q: "¿Sin solución?", a: "Rectas paralelas distintas — sistema inconsistente." },
      { q: "¿Infinitas soluciones?", a: "Ambas ecuaciones describen la misma recta." },
    ],
  },
};
