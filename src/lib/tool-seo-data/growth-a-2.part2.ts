// Part 2 of 3 — entries of TOOL_SEO_OVERRIDES_GROWTH_A_2, split from growth-a-2.ts on 2026-11-04. Add new entries in the smallest part.
import type { ToolSeoOverrideGrowth } from "../tool-seo-overrides-growth";

export const TOOL_SEO_OVERRIDES_GROWTH_A_2_PART2: Record<string, ToolSeoOverrideGrowth> = {
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
};
