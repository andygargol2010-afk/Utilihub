import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_OKLCH: Record<string, ToolSeoOverride> = {
  "convertidor-oklch": {
    metaTitle: "OKLCH to Hex Converter — CSS Color 4 | UtiliHub",
    metaTitleEs: "Conversor OKLCH a hex — CSS Color 4 | UtiliHub",
    metaDescription:
      "Convert a hex color to CSS oklch() and an in-gamut oklch() back to hex. Out-of-gamut chroma does not invent a hex. Runs in the browser.",
    metaDescriptionEs:
      "Convertí un hex a oklch() de CSS y un oklch() dentro de la gama a hex. Un croma fuera de gama no inventa un hex. Corre en el navegador.",
    about: [
      "This converts between sRGB hex and CSS oklch(). It does not check WCAG contrast or build a clamp() line.",
      "Lightness is 0 to 1. A percent such as 62% is accepted and treated as 0.62.",
      "A color outside the sRGB gamut returns no hex. The tool does not clip and call it exact.",
    ],
    aboutEs: [
      "Convierte entre hex sRGB y oklch() de CSS. No mide contraste WCAG ni arma un clamp().",
      "La luminosidad va de 0 a 1. Un porcentaje como 62% se acepta y se trata como 0.62.",
      "Un color fuera de la gama sRGB no devuelve hex. La herramienta no recorta y lo da por exacto.",
    ],
    steps: [
      "Paste #0f766e or use the example.",
      "Read the oklch() line, or switch the field to an oklch() value.",
      "Copy the result. Reset clears the field.",
    ],
    stepsEs: [
      "Pegá #0f766e o usá el ejemplo.",
      "Leé la línea oklch(), o cambiá el campo a un valor oklch().",
      "Copiá el resultado. Reiniciar vacía el campo.",
    ],
    faq: [
      {
        q: "What does #0f766e become?",
        a: "oklch(0.5109 0.0861 186.4). The same line converts back to #0f766e.",
      },
      {
        q: "What happens with oklch(0.7 0.15 180)?",
        a: "It is outside sRGB. No hex is produced.",
      },
      {
        q: "Is the color uploaded?",
        a: "No. The conversion runs in the browser. Nothing is sent.",
      },
    ],
    faqEs: [
      {
        q: "¿En qué queda #0f766e?",
        a: "oklch(0.5109 0.0861 186.4). Esa misma línea vuelve a #0f766e.",
      },
      {
        q: "¿Qué pasa con oklch(0.7 0.15 180)?",
        a: "Queda fuera de sRGB. No se produce un hex.",
      },
      {
        q: "¿Se sube el color?",
        a: "No. La conversión corre en el navegador. No se envía nada.",
      },
    ],
  },
};
