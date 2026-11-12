// TOOL_SEO_OVERRIDES part 04 — split out of ../tool-seo-overrides.ts on 2026-10-28.
// Add new entries in the smallest file of this folder; never rewrite files wholesale.
import type { ToolSeoOverride } from "../tool-seo-overrides";
import { TOOL_SEO_OVERRIDES_ATTENDANCE } from "../tool-seo-overrides-attendance";
import { TOOL_SEO_OVERRIDES_HOURS } from "../tool-seo-overrides-hours";
import { TOOL_SEO_OVERRIDES_HARMONIC_MEAN } from "../tool-seo-overrides-harmonic-mean";
import { TOOL_SEO_OVERRIDES_SYLLABLES } from "../tool-seo-overrides-syllables";
import { TOOL_SEO_OVERRIDES_TEMPERATURE } from "../tool-seo-overrides-temperature";
import { TOOL_SEO_OVERRIDES_TRIP_FUEL } from "../tool-seo-overrides-trip-fuel";
import { TOOL_SEO_OVERRIDES_GSC_QUERIES } from "../tool-seo-overrides-gsc-queries";
import { TOOL_SEO_OVERRIDES_REFERENCE } from "../tool-seo-overrides-reference";
import { TOOL_SEO_OVERRIDES_WORK } from "../tool-seo-overrides-work";
import { TOOL_SEO_OVERRIDES_POWER } from "../tool-seo-overrides-power";

export const TOOL_SEO_OVERRIDES_PART_04: Record<string, ToolSeoOverride> = {
  "calculadora-bac": {
    metaTitle: "BAC Calculator — Estimate Blood Alcohol Content | UtiliHub",
    metaTitleEs: "Calculadora de alcoholemia (BAC) — fórmula de Widmark | UtiliHub",
    metaDescription:
      "Free BAC estimator. Enter number of standard drinks, body weight, gender and hours since first drink. Approximate Widmark calculation in the browser.",
    metaDescriptionEs:
      "Calculadora de alcoholemia gratis (BAC). Ingresá bebidas estándar, peso, sexo y horas desde la primera bebida para estimar el BAC con la fórmula de Widmark. Cálculo local, sin registro.",
    about: [
      "The BAC calculator estimates blood alcohol content with the Widmark formula from the number of standard drinks, body weight, gender, and hours elapsed since the first drink.",
      "The result is an approximation only: real BAC depends on food, metabolism, and drinking pace. Never use it to decide whether you can drive.",
    ],
    aboutEs: [
      "La calculadora de alcoholemia estima el BAC con la fórmula de Widmark a partir de bebidas estándar, peso corporal, sexo y horas transcurridas desde la primera bebida.",
      "El resultado es solo una aproximación: el BAC real depende de la comida, el metabolismo y el ritmo de consumo. Nunca lo uses para decidir si podés conducir.",
    ],
    steps: [
      "Enter how many standard drinks you had, your body weight, and your gender.",
      "Enter the hours elapsed since your first drink.",
      "Read the estimated BAC and the safety note; remember it is an estimate, not a measurement.",
    ],
    stepsEs: [
      "Ingresá cuántas bebidas estándar tomiste, tu peso corporal y tu sexo.",
      "Ingresá las horas transcurridas desde la primera bebida.",
      "Leé el BAC estimado y la advertencia: es un estimado, no una medición.",
    ],
    faq: [
      {
        q: "How accurate is this?",
        a: "This is a rough estimate only. Real BAC depends on many factors. Never use it to decide if you can drive.",
      },
      {
        q: "What is a standard drink?",
        a: "Approximately 14 grams of pure alcohol (one beer, one glass of wine, or one shot).",
      },
    ],
    faqEs: [
      {
        q: "¿Qué tan preciso es el resultado?",
        a: "Es solo un estimado aproximado. El BAC real depende de muchos factores. Nunca lo uses para decidir si podés conducir.",
      },
      {
        q: "¿Qué es una bebida estándar?",
        a: "Aproximadamente 14 gramos de alcohol puro (una cerveza, una copa de vino o un trago).",
      },
    ],
  },
  "generador-codigo-qr": {
    metaTitle: "QR Code Generator — Create QR codes online free | UtiliHub",
    metaTitleEs: "Generador de código QR gratis — crear QR de texto o URL | UtiliHub",
    metaDescription:
      "Free online QR code generator. Enter text or a URL to generate a QR code instantly and download it as PNG. No signup, runs in your browser.",
    metaDescriptionEs:
      "Generador de código QR gratis: escribí texto o una URL y descargá el QR en PNG al instante. Sin registro, todo se genera en tu navegador.",
    about: [
      "A QR code encodes text, a URL, a phone number, or a short message in a square pattern any phone camera can scan.",
      "This generator builds the QR locally in your browser and lets you download it as a PNG image ready to print or share.",
    ],
    aboutEs: [
      "Un código QR codifica texto, una URL, un número de teléfono o un mensaje corto en un patrón que cualquier cámara de celular puede escanear.",
      "Este generador crea el QR localmente en tu navegador y te permite descargarlo como imagen PNG lista para imprimir o compartir.",
    ],
    steps: [
      "Type or paste the text or URL you want to encode.",
      "The QR updates instantly; scan it with a phone to test it.",
      "Download it as PNG or share it wherever you need it.",
    ],
    stepsEs: [
      "Escribí o pegá el texto o la URL que querés codificar.",
      "El QR se actualiza al instante; escanealo con un celular para probarlo.",
      "Descargalo como PNG o compartilo donde lo necesites.",
    ],
    faq: [
      {
        q: "What can I encode in a QR code?",
        a: "Any text, URL, phone number, or short message. Very long text produces a denser QR that is harder to scan.",
      },
      {
        q: "Do QR codes expire?",
        a: "No. A static QR stores the content in the pattern itself, so it works forever and needs no server.",
      },
      {
        q: "Is the QR generated locally?",
        a: "Yes. The QR is created entirely in your browser and nothing is uploaded.",
      },
    ],
    faqEs: [
      {
        q: "¿Qué puedo codificar en un código QR?",
        a: "Cualquier texto, URL, número de teléfono o mensaje corto. Un texto muy largo genera un QR más denso y difícil de escanear.",
      },
      {
        q: "¿Vencen los códigos QR?",
        a: "No. Un QR estático guarda el contenido en el propio patrón, así que funciona siempre y no necesita servidor.",
      },
      {
        q: "¿El QR se genera localmente?",
        a: "Sí. El código se crea por completo en tu navegador y no se sube ningún dato.",
      },
    ],
  },
  ...TOOL_SEO_OVERRIDES_ATTENDANCE,
  ...TOOL_SEO_OVERRIDES_HOURS,
  ...TOOL_SEO_OVERRIDES_HARMONIC_MEAN,
  ...TOOL_SEO_OVERRIDES_SYLLABLES,
  ...TOOL_SEO_OVERRIDES_TEMPERATURE,
  ...TOOL_SEO_OVERRIDES_TRIP_FUEL,
  ...TOOL_SEO_OVERRIDES_GSC_QUERIES,
  ...TOOL_SEO_OVERRIDES_REFERENCE,
  ...TOOL_SEO_OVERRIDES_WORK,
  ...TOOL_SEO_OVERRIDES_POWER,
};
