// TOOL_SEO_OVERRIDES_ARITHMETIC part 2 — split out of ../tool-seo-overrides-arithmetic.ts on 2026-10-28.
// Add new entries in the smallest file of this folder; never rewrite files wholesale.
import type { ToolSeoOverrideArithmetic } from "../tool-seo-overrides-arithmetic";

export const TOOL_SEO_OVERRIDES_ARITHMETIC_2: Record<string, ToolSeoOverrideArithmetic> = {
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
