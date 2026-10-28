// TOOL_SEO_OVERRIDES_ALGEBRA part 2 — split out of ../tool-seo-overrides-algebra.ts on 2026-10-28.
// Add new entries in the smallest file of this folder; never rewrite files wholesale.
import type { ToolSeoOverrideAlgebra } from "../tool-seo-overrides-algebra";

export const TOOL_SEO_OVERRIDES_ALGEBRA_2: Record<string, ToolSeoOverrideAlgebra> = {
  "foil-binomios": {
    metaTitle: "FOIL Calculator — Expand (ax+b)(cx+d) | UtiliHub",
    metaTitleEs: "Calculadora FOIL — expandir (ax+b)(cx+d) | UtiliHub",
    metaDescription:
      "Multiply two binomials with FOIL and combine like terms into Ax²+Bx+C. Free binomial expander.",
    metaDescriptionEs:
      "Multiplicá dos binomios con FOIL y combiná términos semejantes en Ax²+Bx+C. Expansor gratis.",
    about: [
      "FOIL expands First, Outer, Inner, Last products of two linear binomials.",
      "The result is a quadratic polynomial ready for graphing or factoring practice.",
      "Negative coefficients are supported without extra steps.",
    ],
    aboutEs: [
      "FOIL multiplica Primer, Exterior, Interior y Último término de dos binomios lineales.",
      "El resultado es un polinomio cuadrático listo para graficar o practicar factorización.",
      "Los coeficientes negativos están soportados sin pasos extra.",
    ],
    steps: [
      "Enter a,b for the first binomial and c,d for the second.",
      "Calculate the expanded Ax²+Bx+C form.",
      "Use factoring tools to go the other direction.",
    ],
    stepsEs: [
      "Ingresá a,b del primer binomio y c,d del segundo.",
      "Calculá la forma expandida Ax²+Bx+C.",
      "Usá herramientas de factorización para el camino inverso.",
    ],
    faq: [
      { q: "Higher-degree factors?", a: "This tool targets two degree-1 binomials only." },
      { q: "Order of binomials?", a: "Multiplication is commutative — order does not change the product." },
    ],
    faqEs: [
      { q: "¿Factores de mayor grado?", a: "Esta herramienta solo multiplica dos binomios de grado 1." },
      { q: "¿Orden de los binomios?", a: "La multiplicación es conmutativa: el producto no cambia." },
    ],
  },
  "factorizar-trinomio": {
    metaTitle: "Factor Trinomial Calculator — x²+bx+c | UtiliHub",
    metaTitleEs: "Calculadora factorizar trinomio — x²+bx+c | UtiliHub",
    metaDescription:
      "Factor monic trinomials into (x+p)(x+q) when integer pairs exist. Free factoring practice tool.",
    metaDescriptionEs:
      "Factorizá trinomios mónicos en (x+p)(x+q) cuando hay pares enteros. Práctica de factorización gratis.",
    about: [
      "Integer factoring of x²+bx+c looks for p and q with p+q=b and p·q=c.",
      "If no integer pair exists, the tool says so clearly — use the quadratic formula for exact roots.",
      "Pairs with the FOIL expander for expand ↔ factor drills.",
    ],
    aboutEs: [
      "La factorización entera de x²+bx+c busca p y q con p+q=b y p·q=c.",
      "Si no hay par entero, se informa con claridad: usá la fórmula cuadrática para raíces exactas.",
      "Se combina con el expansor FOIL para practicar expandir ↔ factorizar.",
    ],
    steps: [
      "Enter integer b and c for x²+bx+c.",
      "Calculate to get (x+p)(x+q) when possible.",
      "Fall back to quadratic roots if factoring fails.",
    ],
    stepsEs: [
      "Ingresá enteros b y c para x²+bx+c.",
      "Calculá (x+p)(x+q) cuando sea posible.",
      "Si no factoriza, pasá a las raíces cuadráticas.",
    ],
    faq: [
      { q: "Leading coefficient not 1?", a: "This version is monic (a=1). Non-monic support can come later." },
      { q: "No integer factors?", a: "You will see an explicit message; roots may still exist as irrationals." },
    ],
    faqEs: [
      { q: "¿Coeficiente principal distinto de 1?", a: "Esta versión es mónica (a=1). El caso general puede agregarse después." },
      { q: "¿Sin factores enteros?", a: "Verás un mensaje claro; igual pueden existir raíces irracionales." },
    ],
  },
  "pendiente-dos-puntos": {
    metaTitle: "Slope From Two Points Calculator — m and Line Equation | UtiliHub",
    metaTitleEs: "Calculadora de pendiente entre dos puntos — m y ecuación | UtiliHub",
    metaDescription:
      "Find slope m=(y₂−y₁)/(x₂−x₁) plus point-slope and slope-intercept forms. Detects vertical lines.",
    metaDescriptionEs:
      "Obtené m=(y₂−y₁)/(x₂−x₁) más las formas punto-pendiente y pendiente-ordenada. Detecta rectas verticales.",
    about: [
      "Slope is rise over run between two distinct points on a line.",
      "The tool also writes point-slope and y=mx+b forms when the slope is defined.",
      "Matching x-coordinates produce a vertical line with undefined slope.",
    ],
    aboutEs: [
      "La pendiente es el cociente de subida entre corrida entre dos puntos de una recta.",
      "También escribe las formas punto-pendiente y y=mx+b cuando m está definida.",
      "Si las x coinciden, la recta es vertical y la pendiente es indefinida.",
    ],
    steps: [
      "Enter (x₁,y₁) and (x₂,y₂).",
      "Calculate slope and line equations.",
      "Watch for the vertical-line case when x₁=x₂.",
    ],
    stepsEs: [
      "Ingresá (x₁,y₁) y (x₂,y₂).",
      "Calculá la pendiente y las ecuaciones de la recta.",
      "Atención al caso vertical cuando x₁=x₂.",
    ],
    faq: [
      { q: "Horizontal line?", a: "Equal y values → m = 0 and y equals that constant." },
      { q: "Undefined slope?", a: "Equal x values → vertical line x = constant." },
    ],
    faqEs: [
      { q: "¿Recta horizontal?", a: "Igual y → m = 0 e y constante." },
      { q: "¿Pendiente indefinida?", a: "Igual x → recta vertical x = constante." },
    ],
  },
};
