// TOOL_SEO_OVERRIDES_BLOCK4 part 2 — split out of ../tool-seo-overrides-block4.ts on 2026-10-28.
// Add new entries in the smallest file of this folder; never rewrite files wholesale.
import type { ToolSeoOverrideBlock4 } from "../tool-seo-overrides-block4";

export const TOOL_SEO_OVERRIDES_BLOCK4_2: Record<string, ToolSeoOverrideBlock4> = {
  "url-decode": {
    metaTitle: "URL Decode — Percent-Decode Online | UtiliHub",
    metaTitleEs: "Decodificar URL online | UtiliHub",
    metaDescription:
      "Decode percent-encoded URLs and query strings back to readable text. Free URL decoder.",
    metaDescriptionEs:
      "Decodificá URLs y query strings con percent-encoding a texto legible. Decoder de URL gratis.",
    about: [
      "URL decoding reverses percent-encoding: sequences like %20 become spaces and %2F becomes /.",
      "Use it when you paste an encoded query parameter and need the original value for debugging or documentation.",
      "Decoding is local and is not decryption—anyone can decode the same string.",
    ],
    aboutEs: [
      "Decodificar URL invierte el percent-encoding: secuencias como %20 vuelven a espacios y %2F a /.",
      "Úsalo cuando pegás un parámetro codificado y necesitás el valor original para depurar o documentar.",
      "La decodificación es local y no es descifrado: cualquiera puede decodificar la misma cadena.",
    ],
    steps: [
      "Paste the encoded string.",
      "Decode to plain text.",
      "Copy the readable result.",
    ],
    stepsEs: [
      "Pegá la cadena codificada.",
      "Decodificá a texto plano.",
      "Copiá el resultado legible.",
    ],
    faq: [
      {
        q: "Invalid % sequences?",
        a: "Malformed encodings can throw errors or leave characters unchanged depending on the decoder strictness.",
      },
      {
        q: "Plus signs?",
        a: "In some form encodings + means space. If needed, replace + with %20 before decoding.",
      },
    ],
    faqEs: [
      {
        q: "¿Secuencias % inválidas?",
        a: "Una codificación mal formada puede dar error o dejar caracteres igual según el decoder.",
      },
      {
        q: "¿Signos +?",
        a: "En algunos formularios + significa espacio. Si hace falta, reemplazá + por %20 antes de decodificar.",
      },
    ],
  },
};
