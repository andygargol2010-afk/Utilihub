// TOOL_SEO_OVERRIDES_GROWTH_A part 2 — split out of ../tool-seo-overrides-growth-a.ts on 2026-10-28.
// Add new entries in the smallest file of this folder; never rewrite files wholesale.
import type { ToolSeoOverrideGrowth } from "../tool-seo-overrides-growth";

export const TOOL_SEO_OVERRIDES_GROWTH_A_2: Record<string, ToolSeoOverrideGrowth> = {
  "jwt-decoder": {
    metaTitle: "JWT Decoder — Inspect Header & Payload | UtiliHub",
    metaTitleEs: "Decodificador JWT — header y payload | UtiliHub",
    metaDescription:
      "Decode a JSON Web Token to view header and payload claims. Does not verify signatures—for debugging only.",
    metaDescriptionEs:
      "Decodificá un JSON Web Token para ver claims del header y del payload. No verifica firmas: solo depuración.",
    about: [
      "A JWT has three Base64URL parts: header, payload, and signature. This tool decodes the first two so you can inspect claims like sub, exp, and iss.",
      "Signature verification is intentionally omitted. Never paste production secrets or assume a decoded token is trusted.",
      "Decoding happens in the browser. Treat tokens as sensitive: they can include personal data in the payload.",
    ],
    aboutEs: [
      "Un JWT tiene tres partes Base64URL: header, payload y firma. Esta tool decodifica las dos primeras para inspeccionar claims como sub, exp e iss.",
      "La verificación de firma se omite a propósito. No pegues secretos de producción ni asumas que un token decodificado es de confianza.",
      "La decodificación ocurre en el navegador. Tratá los tokens como sensibles: el payload puede incluir datos personales.",
    ],
    steps: [
      "Paste the full JWT string.",
      "Decode header and payload JSON.",
      "Check exp/nbf times and scopes—verify the signature in your backend, not here.",
    ],
    stepsEs: [
      "Pegá el JWT completo.",
      "Decodificá el JSON de header y payload.",
      "Revisá exp/nbf y scopes—verificá la firma en tu backend, no aquí.",
    ],
    faq: [
      {
        q: "Why is the signature not checked?",
        a: "Verification needs the issuer’s secret or public key. A public page must not imply that a decoded token is authentic.",
      },
      {
        q: "Invalid token errors?",
        a: "Usually a truncated string, missing dots, or non-JSON after decode. Copy the token again without line breaks.",
      },
    ],
    faqEs: [
      {
        q: "¿Por qué no se verifica la firma?",
        a: "Hace falta el secreto o la clave pública del emisor. Una página pública no debe sugerir que el token decodificado es auténtico.",
      },
      {
        q: "¿Error de token inválido?",
        a: "Suele ser una cadena cortada, sin puntos, o no-JSON al decodificar. Volvé a copiar el token sin saltos de línea.",
      },
    ],
  },

  "numeros-romanos": {
    metaTitle: "Roman Numerals Converter — Arabic ↔ Roman | UtiliHub",
    metaTitleEs: "Conversor de números romanos ↔ arábigos | UtiliHub",
    metaDescription:
      "Convert integers 1–3999 to Roman numerals and back. Supports subtractive notation (IV, IX, XL, CM).",
    metaDescriptionEs:
      "Convertí enteros 1–3999 a números romanos y viceversa. Notación sustractiva (IV, IX, XL, CM).",
    about: [
      "Classical Roman numerals use I, V, X, L, C, D, and M. Subtractive pairs like IV (4) and CM (900) keep strings shorter.",
      "This converter covers 1 through 3999, the usual range for clocks, outlines, and historical dates without overline notation.",
      "Unicode “Roman” characters in some fonts are different symbols—this tool uses plain ASCII letters I–M.",
    ],
    aboutEs: [
      "Los números romanos clásicos usan I, V, X, L, C, D y M. Pares sustractivos como IV (4) y CM (900) acortan la escritura.",
      "El conversor cubre del 1 al 3999, el rango habitual en relojes, índices y fechas históricas sin notación con barra.",
      "Algunas fuentes usan caracteres Unicode distintos; aquí se usan letras ASCII I–M.",
    ],
    steps: [
      "Enter an Arabic number or a Roman string.",
      "Choose mode (to Roman or to Arabic).",
      "Read the conversion result.",
    ],
    stepsEs: [
      "Ingresá un número arábigo o una cadena romana.",
      "Elegí el modo (a romano o a arábigo).",
      "Leé el resultado de la conversión.",
    ],
    faq: [
      {
        q: "Why stop at 3999?",
        a: "Larger values traditionally need overlines or other marks not standardized in plain text.",
      },
      {
        q: "Is IIII valid for 4?",
        a: "Clocks sometimes use IIII, but standard written form is IV. This tool follows the standard subtractive form.",
      },
    ],
    faqEs: [
      {
        q: "¿Por qué hasta 3999?",
        a: "Valores mayores suelen requerir barras u otras marcas poco estables en texto plano.",
      },
      {
        q: "¿IIII vale para el 4?",
        a: "En relojes a veces se usa IIII, pero la forma escrita estándar es IV. Esta tool sigue la forma sustractiva.",
      },
    ],
  },

  fracciones: {
    metaTitle: "Fraction Calculator — Add Subtract Multiply Divide | UtiliHub",
    metaTitleEs: "Calculadora de fracciones — suma resta producto cociente | UtiliHub",
    metaDescription:
      "Add, subtract, multiply, or divide two fractions and simplify the result to lowest terms.",
    metaDescriptionEs:
      "Sumá, restá, multiplicá o dividí dos fracciones y simplificá el resultado a términos mínimos.",
    about: [
      "Fraction arithmetic uses common denominators for addition/subtraction and cross-multiplication rules for products and quotients.",
      "Results are reduced with the greatest common divisor so 2/4 becomes 1/2 automatically.",
      "Useful for homework checks, recipe scaling, and quick ratios without a full CAS.",
    ],
    aboutEs: [
      "La aritmética de fracciones usa denominadores comunes en suma/resta y reglas de producto y cociente.",
      "El resultado se reduce con el máximo común divisor: 2/4 pasa a 1/2.",
      "Sirve para deberes, recetas y ratios rápidos sin un sistema algebraico completo.",
    ],
    steps: [
      "Enter numerators and denominators for both fractions.",
      "Choose the operation code (add, subtract, multiply, divide).",
      "Read the simplified fraction and decimal form.",
    ],
    stepsEs: [
      "Ingresá numeradores y denominadores de ambas fracciones.",
      "Elegí la operación (suma, resta, producto, división).",
      "Leé la fracción simplificada y su forma decimal.",
    ],
    faq: [
      {
        q: "Zero denominators?",
        a: "They are rejected. A fraction must have a non-zero denominator.",
      },
      {
        q: "Mixed numbers?",
        a: "Convert mixed numbers to improper fractions first (e.g. 1 1/2 → 3/2).",
      },
    ],
    faqEs: [
      {
        q: "¿Denominador cero?",
        a: "Se rechaza. Toda fracción necesita denominador distinto de cero.",
      },
      {
        q: "¿Números mixtos?",
        a: "Convertí primero a fracción impropia (p. ej. 1 1/2 → 3/2).",
      },
    ],
  },
};
