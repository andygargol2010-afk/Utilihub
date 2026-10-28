// TOOL_SEO_OVERRIDES_BLOCK3 part 2 — split out of ../tool-seo-overrides-block3.ts on 2026-10-28.
// Add new entries in the smallest file of this folder; never rewrite files wholesale.
import type { ToolSeoOverrideBlock3 } from "../tool-seo-overrides-block3";

export const TOOL_SEO_OVERRIDES_BLOCK3_2: Record<string, ToolSeoOverrideBlock3> = {
  "conversor-de-peso": {
    metaTitle: "Weight Converter — kg, lb, oz Online | UtiliHub",
    metaTitleEs: "Conversor de peso kg libras onzas | UtiliHub",
    metaDescription:
      "Convert kilograms, pounds, ounces, grams, and stones. Free weight (mass) converter in your browser.",
    metaDescriptionEs:
      "Convertí kilogramos, libras, onzas, gramos y stones. Conversor de peso gratis en el navegador.",
    about: [
      "Everyday weight converters actually convert mass units: kilogram, gram, pound, ounce, and stone. Cooking, shipping, and gym logs all switch between metric and imperial.",
      "Factors follow international definitions (e.g. 1 lb = 0.45359237 kg). Enter a value in one unit and read the others.",
      "For legal trade or pharmacy dosing, confirm the precision and regulations that apply in your country.",
    ],
    aboutEs: [
      "Los conversores de peso cotidianos convierten unidades de masa: kilogramo, gramo, libra, onza y stone. Cocina, envíos y gym pasan del métrico al imperial.",
      "Los factores siguen definiciones internacionales (p. ej. 1 lb = 0.45359237 kg). Ingresá un valor en una unidad y leé el resto.",
      "En comercio legal o dosificación, confirmá la precisión y la norma de tu país.",
    ],
    steps: [
      "Enter the amount you know.",
      "Choose source and target units.",
      "Copy the converted value.",
    ],
    stepsEs: [
      "Ingresá el monto que conocés.",
      "Elegí unidad de origen y destino.",
      "Copiá el valor convertido.",
    ],
    faq: [
      {
        q: "How many pounds in a kilogram?",
        a: "About 2.20462 pounds per kilogram.",
      },
      {
        q: "What is a stone?",
        a: "A British unit equal to 14 pounds, still used for body weight in some regions.",
      },
    ],
    faqEs: [
      {
        q: "¿Cuántas libras es un kilo?",
        a: "Aproximadamente 2.20462 libras por kilogramo.",
      },
      {
        q: "¿Qué es un stone?",
        a: "Una unidad británica de 14 libras, aún usada para el peso corporal en algunas regiones.",
      },
    ],
  },

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

  "url-encode": {
    metaTitle: "URL Encode — Percent-Encode Online | UtiliHub",
    metaTitleEs: "Codificar URL online (percent-encode) | UtiliHub",
    metaDescription:
      "Percent-encode text for query strings and safe URLs. Free URL encoder in your browser.",
    metaDescriptionEs:
      "Codificá texto para query strings y URLs seguras. Encoder de URL gratis en el navegador.",
    about: [
      "URL encoding (percent-encoding) replaces reserved characters with %HH sequences so query parameters and path segments travel safely.",
      "Spaces often become %20 (or + in some form encodings). Always encode user input before placing it in a URL.",
      "Encoding is local and reversible with a URL decoder—it is not encryption.",
    ],
    aboutEs: [
      "La codificación de URL (percent-encoding) reemplaza caracteres reservados por secuencias %HH para que parámetros y paths viajen seguros.",
      "Los espacios suelen pasar a %20 (o + en algunos formularios). Codificá siempre el input del usuario antes de meterlo en una URL.",
      "La codificación es local y reversible con un decoder: no es cifrado.",
    ],
    steps: [
      "Paste the text or parameter value.",
      "Encode and copy the result.",
      "Insert it into your query string or path.",
    ],
    stepsEs: [
      "Pegá el texto o valor del parámetro.",
      "Codificá y copiá el resultado.",
      "Insertalo en el query string o path.",
    ],
    faq: [
      {
        q: "When should I encode?",
        a: "Any time user-controlled or special characters go into a URL—spaces, &, =, non-ASCII, etc.",
      },
      {
        q: "%20 vs + for spaces?",
        a: "In the query component, application/x-www-form-urlencoded often uses +. Path segments typically use %20.",
      },
    ],
    faqEs: [
      {
        q: "¿Cuándo codificar?",
        a: "Cuando metés input del usuario o caracteres especiales en una URL: espacios, &, =, no ASCII, etc.",
      },
      {
        q: "¿%20 o + para espacios?",
        a: "En query, form-urlencoded suele usar +. En paths suele usarse %20.",
      },
    ],
  },

};
