// Part 2 of 3 — entries of TOOL_SEO_OVERRIDES_BASE_B, split from tool-seo-overrides-base-b.ts on 2026-11-04. Add new entries in the smallest part.
import type { ToolSeoOverrideBase } from "./tool-seo-overrides-base-a";

export const TOOL_SEO_OVERRIDES_BASE_B_PART2: Record<string, ToolSeoOverrideBase> = {
  "base64-encode": {
    metaTitle: "Base64 Encode — Text to Base64 Online | UtiliHub",
    metaTitleEs: "Codificar Base64 online gratis | UtiliHub",
    metaDescription:
      "Encode text to Base64 in your browser for tokens, data URLs, and safe transport. Free Base64 encoder.",
    metaDescriptionEs:
      "Codificá texto a Base64 en el navegador para tokens, data URLs y transporte seguro. Encoder Base64 gratis.",
    about: [
      "Base64 represents binary or text data using a 64-character alphabet so it can travel safely in JSON, URLs, and text protocols.",
      "This encoder converts your input to Base64 locally. Decoding is available as a separate tool when you need the reverse operation.",
      "Base64 is encoding, not encryption: anyone can decode it. Do not treat it as a way to hide secrets.",
    ],
    aboutEs: [
      "Base64 representa datos con un alfabeto de 64 caracteres para enviarlos en JSON, URLs y protocolos de texto.",
      "Este encoder convierte tu entrada a Base64 en local. La operación inversa está en la herramienta de decode.",
      "Base64 es codificación, no cifrado: cualquiera puede decodificarlo. No sirve para ocultar secretos.",
    ],
    steps: [
      "Paste the text to encode.",
      "Copy the Base64 output.",
      "Use it in headers, data URLs, or APIs as needed.",
    ],
    stepsEs: [
      "Pegá el texto a codificar.",
      "Copiá la salida Base64.",
      "Usala en headers, data URLs o APIs.",
    ],
    faq: [
      {
        q: "Why does Base64 output look longer?",
        a: "Encoding expands size by roughly 33% because every 3 bytes become 4 characters.",
      },
      {
        q: "Is Base64 secure?",
        a: "No. It is reversible encoding. Use proper encryption or hashing when you need secrecy or integrity.",
      },
    ],
    faqEs: [
      {
        q: "¿Por qué el Base64 es más largo?",
        a: "La codificación aumenta el tamaño ~33%: cada 3 bytes pasan a 4 caracteres.",
      },
      {
        q: "¿Base64 es seguro?",
        a: "No. Es reversible. Para secreto o integridad usá cifrado o hash adecuados.",
      },
    ],
  },
};
