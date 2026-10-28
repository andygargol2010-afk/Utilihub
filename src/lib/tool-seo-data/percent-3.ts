// TOOL_SEO_OVERRIDES_PERCENT part 3 — split out of ../tool-seo-overrides-percent.ts on 2026-10-28.
// Add new entries in the smallest file of this folder; never rewrite files wholesale.
import type { ToolSeoOverridePercent } from "../tool-seo-overrides-percent";

export const TOOL_SEO_OVERRIDES_PERCENT_3: Record<string, ToolSeoOverridePercent> = {
  "markup-vs-margen": {
    metaTitle: "Markup vs Margin Converter — Cost Markup ↔ Price Margin | UtiliHub",
    metaTitleEs: "Conversor markup vs margen — sobre costo ↔ sobre precio | UtiliHub",
    metaDescription:
      "Convert markup on cost to margin on selling price and back. Avoid the classic 50% markup ≠ 50% margin error.",
    metaDescriptionEs:
      "Convertí markup sobre costo a margen sobre precio de venta y viceversa. Evitá el error clásico 50% ≠ 50%.",
    about: [
      "Markup divides profit by cost; margin divides profit by selling price. They only match at 0%.",
      "A 50% markup equals a 33.33% margin. Teams that mix the terms misprice products.",
      "Toggle the input mode to convert whichever figure you were given.",
    ],
    aboutEs: [
      "El markup divide la ganancia por el costo; el margen, por el precio de venta. Solo coinciden en 0%.",
      "Un markup del 50% equivale a un margen del 33,33%. Mezclar términos desordena el precio.",
      "Cambiá el modo de entrada según el dato que te hayan pasado.",
    ],
    steps: [
      "Select whether you know markup % or margin %.",
      "Enter that percentage.",
      "Read the equivalent value on the other definition.",
    ],
    stepsEs: [
      "Elegí si conocés el markup % o el margen %.",
      "Ingresá ese porcentaje.",
      "Leé el valor equivalente en la otra definición.",
    ],
    faq: [
      { q: "Which do retailers use?", a: "Financial reporting usually focuses on margin; purchasing talks often start from markup." },
      { q: "Margin near 100%?", a: "Markup grows without bound as margin approaches 100% (cost near zero)." },
    ],
    faqEs: [
      { q: "¿Qué usan los comercios?", a: "Los reportes financieros suelen hablar de margen; las compras, de markup." },
      { q: "¿Margen cerca de 100%?", a: "El markup crece sin techo cuando el margen se acerca a 100% (costo casi cero)." },
    ],
  },
};
