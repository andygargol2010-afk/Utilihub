// Part 2 of 3 — entries of TOOL_SEO_OVERRIDES_BASE_A_1, split from base-a-1.ts on 2026-11-04. Add new entries in the smallest part.
import type { ToolSeoOverrideBase } from "../tool-seo-overrides-base-a";

export const TOOL_SEO_OVERRIDES_BASE_A_1_PART2: Record<string, ToolSeoOverrideBase> = {
  "calculadora-propina-impuesto": {
    metaTitleEs: "Calculadora de propina e impuesto — total de la cuenta | UtiliHub",
    metaDescriptionEs:
      "Calculá la propina, el impuesto y el total a pagar a partir del subtotal, el % de impuesto y el % de propina. Gratis, en el navegador, sin registro.",
    about: [],
    steps: [],
    faq: [],
    faqEs: [
      {
        q: "¿Cómo se calculan la propina y el impuesto?",
        a: "Impuesto = subtotal × (% de impuesto ÷ 100). Propina = (subtotal + impuesto) × (% de propina ÷ 100). El total es la suma de los tres.",
      },
      {
        q: "¿Sobre qué base se aplica la propina?",
        a: "Por defecto se aplica sobre el monto con impuesto incluido (subtotal + impuesto). Ajustá los porcentajes si preferís propinar sobre el subtotal sin impuesto.",
      },
      {
        q: "¿La calculadora de propina e impuesto es gratis?",
        a: "Sí. Funciona en el navegador sin registro y no sube ningún dato a un servidor.",
      },
    ],
  },
};
