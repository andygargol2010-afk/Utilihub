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
  fibonacci: {
    metaTitle: "Fibonacci Calculator — F(n) and Partial Sum | UtiliHub",
    metaTitleEs: "Calculadora Fibonacci — F(n) y suma parcial | UtiliHub",
    metaDescription:
      "Compute the nth Fibonacci number and the sum F(0)+…+F(n). Free Fibonacci sequence tool.",
    metaDescriptionEs:
      "Calculá el n-ésimo número de Fibonacci y la suma F(0)+…+F(n). Herramienta gratis.",
    about: [
      "Fibonacci numbers satisfy F(n)=F(n−1)+F(n−2) with F(0)=0, F(1)=1.",
      "The partial sum identity Σ F(k) from 0 to n equals F(n+2)−1.",
      "Appears in algorithms, phyllotaxis models, and combinatorics.",
    ],
    aboutEs: [
      "Los números de Fibonacci cumplen F(n)=F(n−1)+F(n−2) con F(0)=0, F(1)=1.",
      "La suma parcial Σ F(k) de 0 a n vale F(n+2)−1.",
      "Aparecen en algoritmos, modelos biológicos y combinatoria.",
    ],
    steps: ["Enter n ≥ 0.", "Read F(n) and the sum.", "Prefer n ≤ 70 for exact integer display."],
    stepsEs: ["Ingresá n ≥ 0.", "Leé F(n) y la suma.", "Preferí n ≤ 70 para enteros exactos."],
    faq: [
      { q: "F(0) or F(1) start?", a: "This tool uses F(0)=0, F(1)=1." },
      { q: "Large n?", a: "Beyond ~70, JavaScript uses floating-point approximation." },
    ],
    faqEs: [
      { q: "¿Empieza en F(0) o F(1)?", a: "Usamos F(0)=0, F(1)=1." },
      { q: "¿n grande?", a: "Más allá de ~70, JavaScript usa aproximación flotante." },
    ],
  },
  "sucesion-aritmetica": {
    metaTitle: "Arithmetic Sequence Calculator — nth Term & Sum | UtiliHub",
    metaTitleEs: "Calculadora sucesión aritmética — término n y suma | UtiliHub",
    metaDescription:
      "Find aₙ = a₁+(n−1)d and Sₙ = n/2·(2a₁+(n−1)d). Free arithmetic sequence and series tool.",
    metaDescriptionEs:
      "Obtené aₙ = a₁+(n−1)d y Sₙ = n/2·(2a₁+(n−1)d). Sucesión y serie aritmética gratis.",
    about: [
      "Arithmetic sequences change by a constant difference d each step.",
      "Closed forms give any term and the sum without listing every value.",
      "Standard in algebra courses and financial arithmetic progressions.",
    ],
    aboutEs: [
      "Las sucesiones aritméticas cambian con una diferencia constante d.",
      "Las fórmulas cerradas dan cualquier término y la suma sin listar todo.",
      "Estándar en álgebra y progresiones financieras simples.",
    ],
    steps: ["Enter a₁, d, and n ≥ 1.", "Calculate aₙ and Sₙ.", "Negative d is allowed for decreasing sequences."],
    stepsEs: ["Ingresá a₁, d y n ≥ 1.", "Calculá aₙ y Sₙ.", "d negativo vale para sucesiones decrecientes."],
    faq: [
      { q: "Is n 1-based?", a: "Yes — the first term is n=1." },
      { q: "Sum formula?", a: "Sₙ = n/2 · (first + last) works too." },
    ],
    faqEs: [
      { q: "¿n empieza en 1?", a: "Sí: el primer término es n=1." },
      { q: "¿Fórmula de la suma?", a: "También Sₙ = n/2 · (primero + último)." },
    ],
  },
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
