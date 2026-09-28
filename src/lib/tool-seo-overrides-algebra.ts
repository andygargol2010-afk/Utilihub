/** Unique SEO for algebra-suite calculators — no generic templates. */

export type ToolSeoOverrideAlgebra = {
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

export const TOOL_SEO_OVERRIDES_ALGEBRA: Record<string, ToolSeoOverrideAlgebra> = {
  "formula-cuadratica": {
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
  discriminante: {
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
