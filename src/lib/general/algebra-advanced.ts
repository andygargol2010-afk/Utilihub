import type { GeneralTool } from "./types";

const base = (
  slug: string,
  name: string,
  summary: string,
  about: string[],
  steps: string[],
  faq: { q: string; a: string }[],
  keywords: string[],
): GeneralTool => ({
  slug,
  name,
  title: `${name} free online | UtiliHub`,
  description: summary,
  summary,
  category: "matematicas",
  kind: "number",
  keywords,
  about,
  steps,
  faq,
  config: { mode: "algebra-advanced" },
});

export const ALGEBRA_ADVANCED_TOOLS: GeneralTool[] = [
  base(
    "formula-cuadratica",
    "Quadratic formula calculator",
    "Solve ax² + bx + c = 0 with the quadratic formula and see both roots, discriminant, and nature of solutions.",
    [
      "The quadratic formula x = (−b ± √(b² − 4ac)) / (2a) finds roots of any second-degree polynomial with a ≠ 0.",
      "This tool reports both solutions (when they exist in the reals), the discriminant, and whether roots are real and distinct, repeated, or complex.",
      "Use it for homework checks, projectile equations, and any model that reduces to a parabola crossing the x-axis.",
    ],
    [
      "Enter coefficients a, b, and c from ax² + bx + c = 0.",
      "Calculate to see roots and discriminant.",
      "If a is zero, the equation is linear — use a linear solver instead.",
    ],
    [
      { q: "What if the discriminant is negative?", a: "There are no real roots. The tool shows the complex conjugate pair using i." },
      { q: "Does order of a, b, c matter?", a: "Yes — a is the x² coefficient, b the x coefficient, c the constant term." },
    ],
    ["quadratic formula", "solve quadratic equation", "fórmula cuadrática"],
  ),
  base(
    "discriminante",
    "Discriminant calculator",
    "Compute Δ = b² − 4ac and classify the number of real roots of a quadratic.",
    [
      "The discriminant alone tells you the root structure without fully solving: positive → two real roots, zero → one repeated root, negative → no real roots.",
      "Useful when you only need nature of solutions (graphing, multiple-choice exams) rather than the exact x values.",
      "Requires the same a, b, c as the quadratic formula tool.",
    ],
    [
      "Enter a, b, and c.",
      "Read Δ and the classification message.",
      "Open the quadratic formula tool if you need the actual roots.",
    ],
    [
      { q: "Is discriminant only for quadratics?", a: "In school algebra, yes — this calculator is for second-degree polynomials." },
      { q: "Can a be zero?", a: "Then it is not a quadratic; discriminant is not defined in that sense." },
    ],
    ["discriminant calculator", "b² − 4ac", "discriminante"],
  ),
  base(
    "completar-cuadrado",
    "Completing the square calculator",
    "Rewrite ax² + bx + c into vertex form a(x − h)² + k and show the steps of completing the square.",
    [
      "Completing the square converts standard form into vertex form so you can read the vertex (h, k) and minimum/maximum at a glance.",
      "The tool shows the completed-square expression and the vertex coordinates.",
      "Common in calculus prep, graphing parabolas, and deriving the quadratic formula itself.",
    ],
    [
      "Enter a, b, and c.",
      "Review the vertex form and (h, k).",
      "Check a ≠ 0 so the expression is truly quadratic.",
    ],
    [
      { q: "What is vertex form?", a: "a(x − h)² + k, where (h, k) is the parabola’s vertex." },
      { q: "Does it work when a ≠ 1?", a: "Yes — the tool factors a out before completing the square." },
    ],
    ["completing the square", "vertex form", "completar el cuadrado"],
  ),
  base(
    "sistema-ecuaciones-2x2",
    "System of 2 equations calculator",
    "Solve a 2×2 linear system a₁x + b₁y = c₁, a₂x + b₂y = c₂ by elimination (Cramer’s rule).",
    [
      "Two linear equations in two unknowns have a unique solution when the coefficient determinant is non-zero.",
      "The tool returns x and y, or reports parallel (no solution) / coincident (infinite solutions) lines.",
      "Standard for break-even models, mixture problems, and intro linear algebra.",
    ],
    [
      "Enter a₁, b₁, c₁ for the first equation and a₂, b₂, c₂ for the second.",
      "Calculate to get x and y.",
      "If the system is singular, read the diagnostic message.",
    ],
    [
      { q: "Method used?", a: "Cramer’s rule / determinants — equivalent to elimination for 2×2 systems." },
      { q: "What if both lines are the same?", a: "Infinite solutions; every point on the line works." },
    ],
    ["system of equations", "2x2 linear system", "sistema de ecuaciones"],
  ),
  base(
    "foil-binomios",
    "FOIL binomial expander",
    "Expand (ax + b)(cx + d) with FOIL and show the resulting quadratic polynomial.",
    [
      "FOIL multiplies First, Outer, Inner, Last terms of two binomials to produce a quadratic.",
      "The tool expands fully and combines like terms into Ax² + Bx + C form.",
      "Handy for checking distribution before factoring or graphing.",
    ],
    [
      "Enter a, b for the first binomial and c, d for the second.",
      "Calculate to see the expanded polynomial.",
      "Compare with factoring tools when going the opposite direction.",
    ],
    [
      { q: "Only linear binomials?", a: "This version multiplies two degree-1 binomials of the form (ax+b)(cx+d)." },
      { q: "Can coefficients be negative?", a: "Yes — negatives are fully supported." },
    ],
    ["FOIL calculator", "expand binomials", "multiplicar binomios"],
  ),
  base(
    "factorizar-trinomio",
    "Factor trinomial calculator",
    "Factor x² + bx + c (monic) into (x + p)(x + q) when integer factors exist.",
    [
      "For monic trinomials, factoring seeks two numbers that multiply to c and add to b.",
      "When integer factors exist, the tool returns (x + p)(x + q). Otherwise it reports that no integer factor pair was found.",
      "Pairs with the FOIL tool for expand ↔ factor practice.",
    ],
    [
      "Enter b and c for x² + bx + c (leading coefficient 1).",
      "Calculate to get the factored form if possible.",
      "Use the quadratic formula tool when roots are not integers.",
    ],
    [
      { q: "Only monic trinomials?", a: "This first version assumes a = 1. Non-monic factoring can be added later." },
      { q: "What if it does not factor over the integers?", a: "You will see a clear message; try the quadratic formula for exact roots." },
    ],
    ["factor trinomial", "factoring calculator", "factorizar trinomio"],
  ),
  base(
    "pendiente-dos-puntos",
    "Slope from two points calculator",
    "Compute the slope m = (y₂ − y₁) / (x₂ − x₁) and the line equation through two points.",
    [
      "Slope measures rise over run between two points on a line.",
      "The tool also writes the point-slope form and slope-intercept form when possible.",
      "Vertical lines (undefined slope) are detected and reported explicitly.",
    ],
    [
      "Enter (x₁, y₁) and (x₂, y₂).",
      "Read slope m and the line equation.",
      "If x₁ = x₂, the line is vertical — slope is undefined.",
    ],
    [
      { q: "Undefined slope?", a: "When x coordinates match, the line is vertical; there is no finite m." },
      { q: "Horizontal line?", a: "y coordinates match → m = 0 and y = constant." },
    ],
    ["slope calculator", "slope from two points", "pendiente entre dos puntos"],
  ),
];
