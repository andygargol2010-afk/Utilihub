import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_AC: Record<string, ToolSeoOverride> = {
  "calculadora-btu": {
    metaTitle: "Air conditioner size calculator — BTU and frigorías | UtiliHub",
    metaTitleEs: "Calculadora de BTU y frigorías para aire acondicionado | UtiliHub",
    metaDescription:
      "Estimate split AC size from room area, ceiling height, sun, windows, and people. Free BTU, frigorías, and kW estimate in the browser.",
    metaDescriptionEs:
      "Estimá el aire split según el ambiente, la altura, el sol, las ventanas y las personas. Resultado en BTU, frigorías y kW, gratis en el navegador.",
    about: [
      "This is a room-size estimate for a single split, not a Manual J load calculation. It starts from floor area and ceiling height, then adjusts for sun, insulation, windows, extra people, and a kitchen.",
      "Frigorías/h are the unit often printed on equipment in Argentina and other Spanish-speaking markets. BTU/h and kW are shown from the same estimate so you can match a label in either system.",
    ],
    aboutEs: [
      "Es una estimación por tamaño de ambiente para un split, no un cálculo de carga Manual J. Parte de la superficie y la altura, y ajusta sol, aislación, ventanas, personas de más y cocina.",
      "Las frigorías/h son la unidad que suele figurar en equipos de Argentina y otros mercados de habla hispana. BTU/h y kW salen de la misma estimación para comparar con la ficha.",
    ],
    steps: [
      "Measure the room in meters and set the ceiling height.",
      "Choose sun, insulation, windows, people, and whether the room is a kitchen.",
      "Read the estimated load and the next common split size, rounded up.",
    ],
    stepsEs: [
      "Medí el ambiente en metros e indicá la altura del techo.",
      "Elegí sol, aislación, ventanas, personas y si el ambiente es una cocina.",
      "Revisá la carga estimada y el split comercial siguiente, redondeado hacia arriba.",
    ],
    faq: [
      {
        q: "Is this a professional cooling load?",
        a: "No. It is a practical sizing estimate. Odd layouts, lots of glass, or a very hot climate still need a technician.",
      },
      {
        q: "Why round up to a catalog size?",
        a: "Splits are sold in steps such as 9,000, 12,000, 18,000, and 24,000 BTU/h. The suggestion is the smallest common size that covers the estimate.",
      },
      {
        q: "Are the measurements uploaded?",
        a: "No. The estimate runs locally in the browser.",
      },
    ],
    faqEs: [
      {
        q: "¿Es un cálculo profesional de carga térmica?",
        a: "No. Es una estimación práctica. Plantas raras, mucho vidrio o un clima muy caluroso siguen necesitando un técnico.",
      },
      {
        q: "¿Por qué redondea a un tamaño de catálogo?",
        a: "Los splits se venden en escalones como 9.000, 12.000, 18.000 y 24.000 BTU/h. La sugerencia es el tamaño habitual más chico que cubre la estimación.",
      },
      {
        q: "¿Se envían las medidas?",
        a: "No. El cálculo se hace en el navegador.",
      },
    ],
  },
};
