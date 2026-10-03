import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_POOL: Record<string, ToolSeoOverride> = {
  "calculadora-piscina": {
    metaTitle: "Pool Volume Calculator — Liters and Gallons | UtiliHub",
    metaTitleEs: "Calculadora de piscina — litros y galones | UtiliHub",
    metaDescription:
      "Estimate rectangular, round, or oval pool volume in liters, cubic meters, and US or UK gallons. Optional chlorine dose and pump turnover. Free, in the browser.",
    metaDescriptionEs:
      "Estimá el volumen de una piscina rectangular, redonda u oval en litros, metros cúbicos y galones. Dosis de cloro y tiempo de recirculación opcionales. Gratis, en el navegador.",
    about: [
      "Enter the shape and the water dimensions. Rectangular volume is length × width × average depth. A round pool uses π × radius² × depth. An oval uses π × (length ÷ 2) × (width ÷ 2) × depth.",
      "Average depth is the mean of the shallow and deep ends. If the pool has one depth, leave the deep end equal to the shallow end. Feet are converted to meters before the volume is shown in liters and gallons.",
      "The chlorine line is a labeled rule of thumb to raise free chlorine by the ppm you enter, using common strengths (6% or 12.5% liquid, 65% cal-hypo, 90% trichlor). It is not a dosing prescription: test the water and follow the product label.",
      "Nothing is uploaded. Very large or zero dimensions are rejected so a typo does not look like a real pool.",
    ],
    aboutEs: [
      "Ingresá la forma y las medidas del agua. El volumen rectangular es largo × ancho × profundidad media. Una piscina redonda usa π × radio² × profundidad. Una oval usa π × (largo ÷ 2) × (ancho ÷ 2) × profundidad.",
      "La profundidad media es el promedio del lado playo y el lado hondo. Si la pileta tiene una sola profundidad, dejá el lado hondo igual al playo. Los pies se convierten a metros antes de mostrar litros y galones.",
      "La línea de cloro es una regla orientativa para subir el cloro libre los ppm que indiques, con concentraciones habituales (líquido 6% o 12,5%, hipoclorito cálcico 65%, tricloro 90%). No es una receta: medí el agua y seguí la etiqueta del producto.",
      "No se sube nada. Se rechazan medidas nulas o enormes para que un error de tipeo no parezca una piscina real.",
    ],
    steps: [
      "Choose rectangular, round, or oval, and meters or feet.",
      "Enter length or diameter, width when needed, and shallow and deep depths.",
      "Optionally set a chlorine raise in ppm and a product, or a pump flow for one turnover.",
      "Review liters, gallons, surface area, dose, and copy the summary.",
    ],
    stepsEs: [
      "Elegí rectangular, redonda u oval, y metros o pies.",
      "Ingresá largo o diámetro, ancho si hace falta, y profundidades playa y honda.",
      "Opcional: suba de cloro en ppm y producto, o caudal de bomba para una recirculación.",
      "Revisá litros, galones, superficie, dosis y copiá el resumen.",
    ],
    faq: [
      {
        q: "How is average depth calculated?",
        a: "It is (shallow + deep) ÷ 2. That matches a simple slope. Benches, steps, and spas are not subtracted.",
      },
      {
        q: "Which gallon is used?",
        a: "Both. US gallon is 3.785 liters. UK gallon is 4.546 liters. Liters and cubic meters are shown as well.",
      },
      {
        q: "Is the chlorine amount exact?",
        a: "No. It uses common ounces-per-10,000-gallons factors and scales with your volume and ppm. Always follow the label and a water test.",
      },
      {
        q: "Does the calculation leave the browser?",
        a: "No. Dimensions and the dose stay on your device.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo se calcula la profundidad media?",
        a: "Es (playa + hondo) ÷ 2. Sirve para una pendiente simple. No resta escalones, bancos ni hidromasaje.",
      },
      {
        q: "¿Qué galón se usa?",
        a: "Los dos. El galón US equivale a 3,785 litros. El galón UK a 4,546 litros. También se muestran litros y metros cúbicos.",
      },
      {
        q: "¿La dosis de cloro es exacta?",
        a: "No. Usa factores habituales de onzas por cada 10.000 galones y los escala con tu volumen y los ppm. Seguí la etiqueta y un test de agua.",
      },
      {
        q: "¿El cálculo sale del navegador?",
        a: "No. Las medidas y la dosis quedan en tu dispositivo.",
      },
    ],
  },
};
