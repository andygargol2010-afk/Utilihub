// TOOL_SEO_OVERRIDES_ARITHMETIC part 1 — split out of ../tool-seo-overrides-arithmetic.ts on 2026-10-28.
// Add new entries in the smallest file of this folder; never rewrite files wholesale.
import type { ToolSeoOverrideArithmetic } from "../tool-seo-overrides-arithmetic";
import { TOOL_SEO_OVERRIDES_ARITHMETIC_1_PART1 } from "./arithmetic-1.part1";
import { TOOL_SEO_OVERRIDES_ARITHMETIC_1_PART2 } from "./arithmetic-1.part2";


export const TOOL_SEO_OVERRIDES_ARITHMETIC_1: Record<string, ToolSeoOverrideArithmetic> = {
  ...TOOL_SEO_OVERRIDES_ARITHMETIC_1_PART1,
  ...TOOL_SEO_OVERRIDES_ARITHMETIC_1_PART2,
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
};
