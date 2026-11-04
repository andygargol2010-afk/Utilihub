// TOOL_SEO_OVERRIDES_BLOCK3 part 2 — split out of ../tool-seo-overrides-block3.ts on 2026-10-28.
// Add new entries in the smallest file of this folder; never rewrite files wholesale.
import type { ToolSeoOverrideBlock3 } from "../tool-seo-overrides-block3";
import { TOOL_SEO_OVERRIDES_BLOCK3_2_PART1 } from "./block3-2.part1";
import { TOOL_SEO_OVERRIDES_BLOCK3_2_PART2 } from "./block3-2.part2";


export const TOOL_SEO_OVERRIDES_BLOCK3_2: Record<string, ToolSeoOverrideBlock3> = {
  ...TOOL_SEO_OVERRIDES_BLOCK3_2_PART1,
  ...TOOL_SEO_OVERRIDES_BLOCK3_2_PART2,

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
