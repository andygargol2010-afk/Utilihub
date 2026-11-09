// TOOL_SEO_OVERRIDES_GAP part 3 — split out of ../tool-seo-overrides-gap.ts on 2026-10-28.
// Add new entries in the smallest file of this folder; never rewrite files wholesale.
import type { ToolSeoOverride } from "../tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_GAP_3: Record<string, ToolSeoOverride> = {
  "estimador-entropia-contrasena": {
    metaTitle: "Password Entropy Calculator — Pool & Shannon Bits | UtiliHub",
    metaTitleEs: "Calculadora de entropía de contraseña — Bits de pool y Shannon | UtiliHub",
    metaDescription:
      "Estimate password entropy in the browser from charset pool and Shannon bits. Tr0ub4dor&3 scores about 72.3 pool bits. Free, local, no signup.",
    metaDescriptionEs:
      "Estimá la entropía de una contraseña en el navegador con bits de pool y de Shannon. Tr0ub4dor&3 da unos 72,3 bits de pool. Gratis, local, sin registro.",
    about: [
      "Type or paste a password to score it locally: charset pool bits (length × log2 of the pool) and Shannon bits from repeated characters.",
      "Pool bits are an upper bound for random passwords; a dictionary phrase can be much weaker than the formula suggests.",
    ],
    aboutEs: [
      "Escribí o pegá una contraseña para puntuarla en local: bits de pool (largo × log2 del conjunto) y bits de Shannon según caracteres repetidos.",
      "Los bits de pool son un límite superior para contraseñas aleatorias; una frase de diccionario puede ser mucho más débil de lo que sugiere la fórmula.",
    ],
    steps: [
      "Type or paste the password.",
      "Read pool bits, Shannon bits, and the strength band.",
      "Clear the field when you are done.",
    ],
    stepsEs: [
      "Escribí o pegá la contraseña.",
      "Mirá los bits de pool, los de Shannon y la banda de fuerza.",
      "Borrá el campo al terminar.",
    ],
    faq: [
      { q: "How are pool bits computed?", a: "Length × log2(charset pool): lowercase 26, uppercase 26, digits 10, symbols 33, space 1." },
      { q: "Is my password uploaded?", a: "No. Counting runs locally in your browser; nothing is sent or stored." },
    ],
    faqEs: [
      { q: "¿Cómo se calculan los bits de pool?", a: "Largo × log2(conjunto): minúsculas 26, mayúsculas 26, dígitos 10, símbolos 33, espacio 1." },
      { q: "¿Se sube mi contraseña?", a: "No. El conteo corre en local en tu navegador; no se envía ni se guarda nada." },
    ],
  },
};
