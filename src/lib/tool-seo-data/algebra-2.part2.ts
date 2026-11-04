// Part 2 of 3 — entries of TOOL_SEO_OVERRIDES_ALGEBRA_2, split from algebra-2.ts on 2026-11-04. Add new entries in the smallest part.
import type { ToolSeoOverrideAlgebra } from "../tool-seo-overrides-algebra";

export const TOOL_SEO_OVERRIDES_ALGEBRA_2_PART2: Record<string, ToolSeoOverrideAlgebra> = {  "factorizar-trinomio": {
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
};
