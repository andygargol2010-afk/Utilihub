// Part 1 of 3 — entries of TOOL_SEO_OVERRIDES_BLOCK3_1, split from block3-1.ts on 2026-11-04. Add new entries in the smallest part.
import type { ToolSeoOverrideBlock3 } from "../tool-seo-overrides-block3";

export const TOOL_SEO_OVERRIDES_BLOCK3_1_PART1: Record<string, ToolSeoOverrideBlock3> = {  "base64-decode": {
    metaTitle: "Base64 Decode — Decode to Text Online | UtiliHub",
    metaTitleEs: "Decodificar Base64 a texto online | UtiliHub",
    metaDescription:
      "Decode Base64 to plain text in your browser. Free Base64 decoder for tokens, payloads, and data URLs. No upload.",
    metaDescriptionEs:
      "Decodificá Base64 a texto plano en el navegador. Decoder gratis para tokens, payloads y data URLs. Sin subir archivos.",
    about: [
      "Base64 decoding reverses the encoding step: a 64-character alphabet is mapped back to the original bytes or text. Developers use it for tokens, email attachments, and data URLs.",
      "This tool decodes locally in your browser. If the input is not valid Base64, you should see an error instead of corrupted output.",
      "Decoding is not decryption. Anyone with the string can recover the original data—do not rely on Base64 to hide secrets.",
    ],
    aboutEs: [
      "Decodificar Base64 invierte la codificación: el alfabeto de 64 caracteres vuelve a bytes o texto. Se usa en tokens, adjuntos y data URLs.",
      "Esta herramienta decodifica en local. Si la entrada no es Base64 válido, debería mostrar error y no un resultado corrupto.",
      "Decodificar no es descifrar. Cualquiera con la cadena puede recuperar los datos: no uses Base64 para ocultar secretos.",
    ],
    steps: [
      "Paste the Base64 string.",
      "Decode to readable text.",
      "Copy the result into your editor or API client.",
    ],
    stepsEs: [
      "Pegá la cadena Base64.",
      "Decodificá a texto legible.",
      "Copiá el resultado a tu editor o cliente de API.",
    ],
    faq: [
      {
        q: "Why do I get an error?",
        a: "Common causes: missing padding (=), line breaks, or characters outside the Base64 alphabet. Clean the string and try again.",
      },
      {
        q: "Can it decode images?",
        a: "If the payload is binary, you may see garbled text. For images, use a data-URL or a dedicated image decoder.",
      },
    ],
    faqEs: [
      {
        q: "¿Por qué da error?",
        a: "Suele faltar el padding (=), haber saltos de línea o caracteres fuera del alfabeto. Limpiá la cadena e intentá de nuevo.",
      },
      {
        q: "¿Sirve para imágenes?",
        a: "Si el payload es binario, el texto puede verse raro. Para imágenes usá data-URL o un decoder específico.",
      },
    ],
  },
};
