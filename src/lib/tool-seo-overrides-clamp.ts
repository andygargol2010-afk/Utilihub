import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_CLAMP: Record<string, ToolSeoOverride> = {
  "generador-css-clamp": {
    metaTitle: "CSS clamp() Generator for Fluid Type | UtiliHub",
    metaTitleEs: "Generador CSS clamp() para tipografía fluida | UtiliHub",
    metaDescription:
      "Generate font-size: clamp() from a minimum and maximum size and viewport. 16px at 320px to 24px at 1200px becomes clamp(1rem, 0.8182rem + 0.0568vw, 1.5rem). In the browser.",
    metaDescriptionEs:
      "Generá font-size: clamp() desde un tamaño mínimo y máximo y el viewport. 16px a 320px y 24px a 1200px dan clamp(1rem, 0.8182rem + 0.0568vw, 1.5rem). En el navegador.",
    about: [
      "clamp() locks a floor and a ceiling and lets the middle term scale with the viewport. The slope is (max − min) ÷ (max viewport − min viewport).",
      "Sizes are converted to rem with the root you enter (16px by default) so the line respects user font scaling. The vw term stays in vw.",
      "A minimum larger than the maximum, a zero or inverted viewport span, and a non-positive root are rejected. Empty fields do not invent a declaration.",
    ],
    aboutEs: [
      "clamp() fija un piso y un techo y deja que el término del medio escale con el viewport. La pendiente es (máx − mín) ÷ (viewport máx − viewport mín).",
      "Los tamaños pasan a rem con la raíz que indiques (16px por defecto) para respetar el escalado del usuario. El término vw queda en vw.",
      "Un mínimo mayor que el máximo, un tramo de viewport nulo o invertido, y una raíz no positiva se rechazan. Los campos vacíos no inventan una declaración.",
    ],
    steps: [
      "Enter the minimum and maximum font size in pixels, and the viewport range where the type should scale.",
      "Set the root font size if it is not 16px.",
      "Copy the clamp() declaration. Nothing is uploaded.",
    ],
    stepsEs: [
      "Ingresá el tamaño mínimo y máximo en píxeles, y el rango de viewport donde debe escalar.",
      "Ajustá la raíz si no es 16px.",
      "Copiá la declaración clamp(). No se sube nada.",
    ],
    faq: [
      { q: "What does 16px at 320px to 24px at 1200px produce?", a: "With a 16px root: font-size: clamp(1rem, 0.8182rem + 0.0568vw, 1.5rem); It is 16px at 320px wide and 24px at 1200px." },
      { q: "Why rem instead of px in the clamp?", a: "rem follows the user's root font size. The vw coefficient is still derived from the pixel slope so the endpoints stay put." },
      { q: "What if the minimum size is larger than the maximum?", a: "The tool rejects it. clamp() needs the floor at or below the ceiling, and the viewport span must be positive." },
    ],
    faqEs: [
      { q: "¿Qué da 16px a 320px y 24px a 1200px?", a: "Con raíz de 16px: font-size: clamp(1rem, 0.8182rem + 0.0568vw, 1.5rem); Son 16px a 320px de ancho y 24px a 1200px." },
      { q: "¿Por qué rem y no px dentro del clamp?", a: "rem sigue el tamaño de raíz del usuario. El coeficiente vw sale de la pendiente en píxeles para que los extremos no se muevan." },
      { q: "¿Qué pasa si el mínimo es mayor que el máximo?", a: "La herramienta lo rechaza. clamp() necesita el piso igual o menor que el techo, y el tramo de viewport tiene que ser positivo." },
    ],
  },
};
