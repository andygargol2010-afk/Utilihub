/** Unique SEO for arithmetic-suite calculators — no generic templates. */

export type ToolSeoOverrideArithmetic = {
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

export const TOOL_SEO_OVERRIDES_ARITHMETIC: Record<string, ToolSeoOverrideArithmetic> = {
  "factorizacion-prima": {
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
  "es-primo": {
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
  },
  "raiz-cubica": {
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
  "multiplicacion-cruzada": {
    metaTitle: "Cross Multiplication Calculator — Solve a/b = c/d | UtiliHub",
    metaTitleEs: "Calculadora multiplicación cruzada — despejar a/b = c/d | UtiliHub",
    metaDescription:
      "Solve any term in a proportion with cross multiplication. Pick the unknown and enter the other three values.",
    metaDescriptionEs:
      "Despejá cualquier término de una proporción con multiplicación cruzada. Elegí la incógnita y completá los otros tres.",
    about: [
      "Cross multiplication converts a/b = c/d into a·d = b·c.",
      "Choose which of a, b, c, or d is unknown; the rest must be filled.",
      "Standard for rates, similar figures, and recipe scaling.",
    ],
    aboutEs: [
      "La multiplicación cruzada transforma a/b = c/d en a·d = b·c.",
      "Elegí cuál de a, b, c o d es la incógnita; el resto se completa.",
      "Clásico en tasas, figuras semejantes y escalado de recetas.",
    ],
    steps: ["Select the unknown letter.", "Enter the three known values.", "Calculate the missing term."],
    stepsEs: ["Seleccioná la letra desconocida.", "Ingresá los tres valores conocidos.", "Calculá el término faltante."],
    faq: [
      { q: "Zero denominator?", a: "Undefined — proportions need non-zero denominators in context." },
      { q: "Can values be negative?", a: "Yes, algebraically; interpret signs in your problem context." },
    ],
    faqEs: [
      { q: "¿Denominador cero?", a: "Indefinido: las proporciones requieren denominadores no nulos." },
      { q: "¿Valores negativos?", a: "Sí en álgebra; interpretá el signo según el problema." },
    ],
  },
  "division-larga": {
    metaTitle: "Long Division Calculator — Quotient & Remainder | UtiliHub",
    metaTitleEs: "Calculadora de división entera — cociente y resto | UtiliHub",
    metaDescription:
      "Integer division with quotient, remainder, and the identity dividend = q×divisor + r. Free long-division check.",
    metaDescriptionEs:
      "División entera con cociente, resto y la identidad dividendo = q×divisor + r. Comprobación gratis.",
    about: [
      "Integer division produces a quotient and a remainder.",
      "The check equation is the fastest way to verify long-division homework.",
      "This version focuses on integers; use a decimal calculator for fractional quotients.",
    ],
    aboutEs: [
      "La división entera produce cociente y resto.",
      "La ecuación de comprobación es la forma más rápida de verificar la división larga.",
      "Esta versión es para enteros; usá una calculadora decimal para cocientes fraccionarios.",
    ],
    steps: ["Enter dividend and divisor.", "Calculate quotient and remainder.", "Confirm with the check line."],
    stepsEs: ["Ingresá dividendo y divisor.", "Calculá cociente y resto.", "Confirmá con la línea de comprobación."],
    faq: [
      { q: "Divisor zero?", a: "Rejected — division by zero is undefined." },
      { q: "Decimals?", a: "Not in this tool; stick to integers." },
    ],
    faqEs: [
      { q: "¿Divisor cero?", a: "Rechazado: la división por cero no está definida." },
      { q: "¿Decimales?", a: "No en esta herramienta; solo enteros." },
    ],
  },
  "cifras-significativas": {
    metaTitle: "Significant Figures Calculator — Count & Round | UtiliHub",
    metaTitleEs: "Calculadora de cifras significativas — contar y redondear | UtiliHub",
    metaDescription:
      "Count significant figures in a written number and optionally round to N sig figs. Precision-aware tool.",
    metaDescriptionEs:
      "Contá cifras significativas en un número escrito y opcionalmente redondeá a N cifras. Herramienta de precisión.",
    about: [
      "Significant figures track measurement precision, not just decimal places.",
      "Leading zeros never count; trailing zeros depend on the decimal point or scientific notation.",
      "Enter the number exactly as written so the count matches classroom rules.",
    ],
    aboutEs: [
      "Las cifras significativas miden precisión, no solo decimales.",
      "Los ceros a la izquierda no cuentan; los finales dependen del punto decimal o de la notación científica.",
      "Escribí el número tal como aparece para que el conteo coincida con las reglas del aula.",
    ],
    steps: ["Type the number as written.", "Optionally set a target sig-fig count to round.", "Read the count and rounded value."],
    stepsEs: ["Escribí el número como aparece.", "Opcionalmente indicá a cuántas cifras redondear.", "Leé el conteo y el valor redondeado."],
    faq: [
      { q: "Is 3400 two or four sig figs?", a: "Ambiguous without a decimal or scientific notation." },
      { q: "Leading zeros in 0.0034?", a: "Not significant — only 3 and 4 count (two sig figs)." },
    ],
    faqEs: [
      { q: "¿3400 tiene dos o cuatro cifras?", a: "Ambiguo sin punto decimal o notación científica." },
      { q: "¿Ceros en 0,0034?", a: "No significativos: solo cuentan 3 y 4 (dos cifras)." },
    ],
  },
  "orden-de-magnitud": {
    metaTitle: "Order of Magnitude Calculator — Powers of Ten | UtiliHub",
    metaTitleEs: "Calculadora de orden de magnitud — potencias de diez | UtiliHub",
    metaDescription:
      "Estimate order of magnitude via log₁₀: floor power and nearest power of ten. Free Fermi-estimate helper.",
    metaDescriptionEs:
      "Estimá el orden de magnitud con log₁₀: potencia piso y potencia de diez más cercana. Ayuda para estimaciones.",
    about: [
      "Order of magnitude answers which power of ten best represents a positive quantity.",
      "log₁₀(x), floor(log₁₀), and the nearest integer power are all shown.",
      "Used in physics estimates, astronomy, and quick scale comparisons.",
    ],
    aboutEs: [
      "El orden de magnitud indica qué potencia de diez representa mejor una cantidad positiva.",
      "Se muestran log₁₀(x), el piso y la potencia entera más cercana.",
      "Usado en estimaciones de física, astronomía y escalas rápidas.",
    ],
    steps: ["Enter a positive number.", "Read log₁₀ and the power-of-ten cards.", "Compare floor vs nearest for your estimate style."],
    stepsEs: ["Ingresá un número positivo.", "Leé log₁₀ y las tarjetas de potencias de diez.", "Compará piso vs más cercana según tu criterio."],
    faq: [
      { q: "Why not zero or negative?", a: "Real log₁₀ is only defined for positive reals." },
      { q: "Floor vs nearest?", a: "Floor matches scientific-notation exponent; nearest rounds the log." },
    ],
    faqEs: [
      { q: "¿Por qué no cero o negativo?", a: "El log₁₀ real solo está definido para positivos." },
      { q: "¿Piso vs más cercana?", a: "El piso coincide con el exponente de notación científica; la otra redondea el log." },
    ],
  },
};
