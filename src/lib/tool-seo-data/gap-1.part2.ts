// Part 2 of 3 — entries of TOOL_SEO_OVERRIDES_GAP_1, split from gap-1.ts on 2026-11-04. Add new entries in the smallest part.
import type { ToolSeoOverride } from "../tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_GAP_1_PART2: Record<string, ToolSeoOverride> = {  "texto-binario": {
    metaTitle: "Text to Binary Converter — UTF-8 Online | UtiliHub",
    metaTitleEs: "Conversor de texto a binario — UTF-8 online | UtiliHub",
    metaDescription: "Convert text to UTF-8 binary and binary back to text. Works offline in the browser. Free and private.",
    metaDescriptionEs: "Convertí texto a binario UTF-8 y binario a texto. Funciona offline en el navegador. Gratis y privado.",
    about: [
      "Encode any string as 8-bit UTF-8 binary groups, or decode a stream of 0s and 1s back into readable text.",
      "Binary input must be a multiple of 8 bits. Spaces between bytes are optional.",
    ],
    aboutEs: [
      "Codificá cualquier cadena como grupos binarios UTF-8 de 8 bits, o decodificá un flujo de 0 y 1 a texto legible.",
      "La entrada binaria debe ser múltiplo de 8 bits. Los espacios entre bytes son opcionales.",
    ],
    steps: ["Enter text or binary (0/1).", "Press Process.", "Copy the output."],
    stepsEs: ["Ingresá texto o binario (0/1).", "Pulsá Procesar.", "Copiá el resultado."],
    faq: [
      { q: "What encoding is used?", a: "UTF-8, so emojis and non-Latin scripts work when encoding text to binary." },
      { q: "Why did I get an error on binary input?", a: "Length must be a multiple of 8. Incomplete bytes are rejected." },
    ],
    faqEs: [
      { q: "¿Qué codificación usa?", a: "UTF-8, así que emojis y scripts no latinos funcionan al pasar de texto a binario." },
      { q: "¿Por qué falla mi binario?", a: "La longitud debe ser múltiplo de 8. Los bytes incompletos se rechazan." },
    ],
  },
};
