import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_CONTRAST: Record<string, ToolSeoOverride> = {
  "validador-contraste": {
    metaTitle: "WCAG Contrast Checker — AA and AAA Ratio | UtiliHub",
    metaTitleEs: "Validador de contraste WCAG — ratio AA y AAA | UtiliHub",
    metaDescription:
      "Check WCAG 2 contrast from two hex colors. Ratio is (L1+0.05)/(L2+0.05). AA is 4.5:1 normal and 3:1 large.",
    metaDescriptionEs:
      "Comprobá el contraste WCAG 2 de dos hex. El ratio es (L1+0.05)/(L2+0.05). AA es 4.5:1 normal y 3:1 grande.",
    about: [
      "WCAG 2 contrast uses relative luminance, not a simple brightness subtract. The ratio is (lighter + 0.05) / (darker + 0.05).",
      "Normal text needs 4.5:1 for AA and 7:1 for AAA. Large text (18 pt, or 14 pt bold) and UI components need 3:1 for AA.",
      "Excel can compare hex digits, but it does not linearize sRGB or show a live text preview. This check stays in the browser.",
    ],
    aboutEs: [
      "El contraste WCAG 2 usa luminancia relativa, no una resta de brillo. El ratio es (más claro + 0.05) / (más oscuro + 0.05).",
      "El texto normal pide 4.5:1 para AA y 7:1 para AAA. El texto grande (18 pt, o 14 pt negrita) y los componentes UI piden 3:1 para AA.",
      "Excel compara dígitos hex, pero no linealiza sRGB ni muestra una vista previa. Esta comprobación queda en el navegador.",
    ],
    steps: [
      "Enter text and background as #RGB or #RRGGBB. Blank, text, and short hex values are rejected.",
      "Load body text, borderline gray, or failing red.",
      "Read the ratio and AA/AAA badges. If normal AA fails, use the suggested text color.",
      "Copy the pair or reset. Nothing is uploaded.",
    ],
    stepsEs: [
      "Ingresá texto y fondo como #RGB o #RRGGBB. Vacío, texto y hex cortos se rechazan.",
      "Cargá texto de cuerpo, gris límite o rojo que falla.",
      "Leé el ratio y las insignias AA/AAA. Si falla AA normal, usá el color de texto sugerido.",
      "Copiá el par o reiniciá. No se sube nada.",
    ],
    faq: [
      {
        q: "What is black #000000 on white #FFFFFF?",
        a: "21.00:1. Relative luminance is 0 and 1, so (1+0.05)/(0+0.05) = 21. It passes AA and AAA for normal and large text.",
      },
      {
        q: "What is #767676 on white, and #FF6B6B on white?",
        a: "#767676 on #FFFFFF is about 4.54:1, so AA normal passes and AAA normal (7:1) fails. #FF6B6B on #FFFFFF is about 2.78:1 and fails AA normal and large.",
      },
      {
        q: "Which formula and units are used?",
        a: "sRGB channels are linearized (≤0.04045 divide by 12.92, else ((c+0.055)/1.055)^2.4). L = 0.2126 R + 0.7152 G + 0.0722 B. The ratio is unitless.",
      },
      {
        q: "What happens with empty, zero, negative, or NaN?",
        a: "Both fields empty is an error. #000 is valid black, not a numeric zero. A minus sign, words, or NaN are invalid hex. Alpha hex is rejected; use opaque #RRGGBB.",
      },
    ],
    faqEs: [
      {
        q: "¿Cuánto es negro #000000 sobre blanco #FFFFFF?",
        a: "21.00:1. La luminancia relativa es 0 y 1, así que (1+0.05)/(0+0.05) = 21. Pasa AA y AAA en texto normal y grande.",
      },
      {
        q: "¿Cuánto es #767676 sobre blanco y #FF6B6B sobre blanco?",
        a: "#767676 sobre #FFFFFF es unos 4.54:1: pasa AA normal y falla AAA normal (7:1). #FF6B6B sobre #FFFFFF es unos 2.78:1 y falla AA normal y grande.",
      },
      {
        q: "¿Qué fórmula y unidades se usan?",
        a: "Los canales sRGB se linealizan (≤0.04045 se divide por 12.92; si no, ((c+0.055)/1.055)^2.4). L = 0.2126 R + 0.7152 G + 0.0722 B. El ratio no tiene unidad.",
      },
      {
        q: "¿Qué pasa con vacío, cero, negativo o NaN?",
        a: "Los dos campos vacíos son un error. #000 es negro válido, no un cero numérico. Un signo menos, palabras o NaN no son hex válido. El hex con alfa se rechaza; usá #RRGGBB opaco.",
      },
    ],
  },
};
