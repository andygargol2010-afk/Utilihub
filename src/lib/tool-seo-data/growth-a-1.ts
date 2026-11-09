// TOOL_SEO_OVERRIDES_GROWTH_A part 1 — split out of ../tool-seo-overrides-growth-a.ts on 2026-10-28.
// Add new entries in the smallest file of this folder; never rewrite files wholesale.
import type { ToolSeoOverrideGrowth } from "../tool-seo-overrides-growth";
import { TOOL_SEO_OVERRIDES_GROWTH_A_1_PART1 } from "./growth-a-1.part1";
import { TOOL_SEO_OVERRIDES_GROWTH_A_1_PART2 } from "./growth-a-1.part2";


export const TOOL_SEO_OVERRIDES_GROWTH_A_1: Record<string, ToolSeoOverrideGrowth> = {
  ...TOOL_SEO_OVERRIDES_GROWTH_A_1_PART1,
  ...TOOL_SEO_OVERRIDES_GROWTH_A_1_PART2,

  "generador-qr": {
    metaTitle: "QR Code Generator — Free Text & URL QR | UtiliHub",
    metaTitleEs: "Generador de código QR gratis (texto y URL) | UtiliHub",
    metaDescription:
      "Create a QR code from a URL, Wi‑Fi hint, or plain text. Download-ready image for print and screens.",
    metaDescriptionEs:
      "Creá un código QR a partir de una URL, texto o dato simple. Imagen lista para imprimir o mostrar en pantalla.",
    about: [
      "QR codes store a short string—usually a link, phone number, or plain message—that phones can open with the camera.",
      "Keep payloads short for reliable scanning. Very long URLs or dense text need larger printed size and good contrast.",
      "This generator produces an image you can screenshot or save. For production packaging, test scan distance and print resolution.",
    ],
    aboutEs: [
      "Un código QR guarda una cadena corta—suele ser un enlace, teléfono o mensaje—que el celular abre con la cámara.",
      "Mantené el contenido corto para un escaneo fiable. URLs largas necesitan más tamaño impreso y buen contraste.",
      "El generador produce una imagen que podés guardar. En packaging de producto, probá distancia de lectura y resolución de impresión.",
    ],
    steps: [
      "Paste the text or URL to encode.",
      "Generate the QR image.",
      "Save or print and test with a phone camera.",
    ],
    stepsEs: [
      "Pegá el texto o la URL a codificar.",
      "Generá la imagen QR.",
      "Guardá o imprimí y probá con la cámara del celular.",
    ],
    faq: [
      {
        q: "Dynamic vs static QR?",
        a: "This tool builds a static code for the text you enter. Redirect analytics need a short-link service in front of the URL.",
      },
      {
        q: "Wi‑Fi QR format?",
        a: "Many phones accept WIFI:T:WPA;S:NetworkName;P:password;; as the payload—enter that string if you need a join code.",
      },
    ],
    faqEs: [
      {
        q: "¿QR dinámico o estático?",
        a: "Esta tool genera un código estático con el texto que ingresás. Analítica de redirección requiere un acortador delante de la URL.",
      },
      {
        q: "¿Formato Wi‑Fi?",
        a: "Muchos celulares aceptan WIFI:T:WPA;S:NombreRed;P:clave;; como contenido—usá esa cadena si querés un código para unirse a la red.",
      },
    ],
  },

};
