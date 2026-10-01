import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_VAT: Record<string, ToolSeoOverride> = {
  "quitar-iva": {
    metaTitle: "Remove VAT from a price — net and tax | UtiliHub",
    metaTitleEs: "Quitar IVA del precio — neto e impuesto | UtiliHub",
    metaDescription:
      "Extract the price without VAT and the tax amount from an inclusive total. Presets for 21%, 19%, 16%, and 10.5%. Free in the browser.",
    metaDescriptionEs:
      "Calculá el precio sin IVA y el impuesto de un total con IVA incluido. Tasas de 21%, 19%, 16% y 10,5%. Gratis en el navegador.",
    about: [
      "Enter a price that already includes VAT and the rate charged on the invoice. The net price is the gross amount divided by 1 plus the rate.",
      "Use Add VAT when you start from a net price. Existing purchase-tax tools only cover that direction; this one is built for inclusive prices.",
    ],
    aboutEs: [
      "Ingresá un precio que ya incluye IVA y la tasa de la factura. El neto es el bruto dividido por 1 más la tasa.",
      "Usá Sumar IVA si partís de un precio neto. La herramienta de impuesto de compra solo cubre esa dirección; esta está pensada para precios con IVA incluido.",
    ],
    steps: [
      "Choose Remove VAT or Add VAT.",
      "Enter the price and pick a preset rate, or type a custom percentage.",
      "Read the net price, the VAT amount, and the gross total. Copy the result if you need it on an invoice.",
    ],
    stepsEs: [
      "Elegí Quitar IVA o Sumar IVA.",
      "Ingresá el precio y elegí una tasa, o escribí un porcentaje propio.",
      "Revisá el neto, el IVA y el total. Copiá el resultado si lo vas a pasar a una factura.",
    ],
    faq: [
      {
        q: "How is VAT removed from an inclusive price?",
        a: "Net = gross / (1 + rate). At 21%, a price of 121 becomes 100 net and 21 of VAT.",
      },
      {
        q: "Which rate should I use?",
        a: "Use the rate printed on the receipt. Presets cover common general and reduced rates in Argentina, Spain, Chile, Colombia, and Mexico. They are not tax advice.",
      },
      {
        q: "Is the price uploaded?",
        a: "No. The calculation runs in the browser.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo se quita el IVA de un precio incluido?",
        a: "Neto = bruto / (1 + tasa). Al 21%, un precio de 121 queda en 100 neto y 21 de IVA.",
      },
      {
        q: "¿Qué tasa uso?",
        a: "La que figura en el comprobante. Los atajos cubren tasas generales y reducidas habituales de Argentina, España, Chile, Colombia y México. No es asesoramiento fiscal.",
      },
      {
        q: "¿Se envía el precio?",
        a: "No. El cálculo se hace en el navegador.",
      },
    ],
  },
};
