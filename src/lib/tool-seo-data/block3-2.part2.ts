// Part 2 of 3 — entries of TOOL_SEO_OVERRIDES_BLOCK3_2, split from block3-2.ts on 2026-11-04. Add new entries in the smallest part.
import type { ToolSeoOverrideBlock3 } from "../tool-seo-overrides-block3";

export const TOOL_SEO_OVERRIDES_BLOCK3_2_PART2: Record<string, ToolSeoOverrideBlock3> = {
  "uuid-generator": {
    metaTitle: "UUID Generator — Random UUID v4 Online | UtiliHub",
    metaTitleEs: "Generador de UUID v4 online | UtiliHub",
    metaDescription:
      "Generate random UUID v4 identifiers in your browser for APIs, databases, and testing. Free, no signup.",
    metaDescriptionEs:
      "Generá identificadores UUID v4 al azar en el navegador para APIs, bases de datos y testing. Gratis, sin registro.",
    about: [
      "A UUID (Universally Unique Identifier) is a 128-bit value usually shown as 36 characters with hyphens. Version 4 UUIDs are random and widely used as primary keys and correlation IDs.",
      "This generator uses browser cryptographic randomness when available so IDs are suitable for development and many production patterns.",
      "UUIDs are unique with extremely high probability—they are not secret tokens. Do not treat them as passwords.",
    ],
    aboutEs: [
      "Un UUID es un valor de 128 bits, suele mostrarse en 36 caracteres con guiones. El UUID v4 es aleatorio y se usa como clave primaria o ID de correlación.",
      "Este generador usa aleatoriedad criptográfica del navegador cuando está disponible, apto para desarrollo y muchos usos en producción.",
      "Los UUID son únicos con altísima probabilidad, no son secretos. No los uses como contraseñas.",
    ],
    steps: [
      "Click generate to create a new UUID v4.",
      "Copy the value into your code or database.",
      "Generate again whenever you need another ID.",
    ],
    stepsEs: [
      "Generá un UUID v4 nuevo.",
      "Copiá el valor a tu código o base de datos.",
      "Volvé a generar cada vez que necesites otro ID.",
    ],
    faq: [
      {
        q: "UUID v4 vs v1?",
        a: "v1 can embed time and node info; v4 is random. Most modern apps prefer v4 unless they need sortable time-based IDs.",
      },
      {
        q: "Can two UUIDs collide?",
        a: "Theoretically yes, practically vanishingly rare for v4 at normal volumes.",
      },
    ],
    faqEs: [
      {
        q: "¿UUID v4 o v1?",
        a: "v1 puede incluir tiempo y nodo; v4 es aleatorio. La mayoría de apps modernas prefieren v4 salvo que necesiten IDs ordenables por tiempo.",
      },
      {
        q: "¿Pueden colisionar dos UUID?",
        a: "En teoría sí; en la práctica es extremadamente raro en v4 a volúmenes normales.",
      },
    ],
  },
};
