import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_RESISTOR: Record<string, ToolSeoOverride> = {
  "decodificador-bandas-resistencia": {
    metaTitle: "Resistor Color Code Calculator — 4, 5 and 6 Bands | UtiliHub",
    metaTitleEs: "Código de colores de resistencias — 4, 5 y 6 bandas | UtiliHub",
    metaDescription:
      "Turn resistor color bands into ohms and tolerance. Brown-black-red-gold is 1 kΩ ±5%. Five and six bands include a third digit and ppm/°C. Free in the browser.",
    metaDescriptionEs:
      "Pasá las bandas de una resistencia a ohmios y tolerancia. Marrón-negro-rojo-dorado es 1 kΩ ±5%. Cinco y seis bandas suman el tercer dígito y ppm/°C. Gratis en el navegador.",
    about: [
      "Read the EIA color code for 4-band, 5-band, and 6-band resistors. Significant digits, multiplier, tolerance, and the optional temperature coefficient stay in the browser.",
      "Brown, black, red, gold is 10 × 100 Ω = 1 kΩ at ±5%. Yellow, violet, red, gold is 47 × 100 Ω = 4.7 kΩ at ±5%. Brown, black, black, red, brown is 100 × 100 Ω = 10 kΩ at ±1%.",
      "Gold and silver are multipliers or tolerances, never significant digits. A 6th band is ppm/°C (brown 100, red 50, orange 15, yellow 25, blue 10, violet 5). This does not measure a physical part.",
    ],
    aboutEs: [
      "Leé el código EIA de resistencias de 4, 5 y 6 bandas. Dígitos, multiplicador, tolerancia y el coeficiente térmico opcional se calculan en el navegador.",
      "Marrón, negro, rojo y dorado es 10 × 100 Ω = 1 kΩ al ±5%. Amarillo, violeta, rojo y dorado es 47 × 100 Ω = 4,7 kΩ al ±5%. Marrón, negro, negro, rojo y marrón es 100 × 100 Ω = 10 kΩ al ±1%.",
      "Dorado y plateado son multiplicador o tolerancia, nunca dígito. La 6.ª banda es ppm/°C (marrón 100, rojo 50, naranja 15, amarillo 25, azul 10, violeta 5). No mide una pieza física.",
    ],
    steps: [
      "Choose 4, 5, or 6 bands.",
      "Pick each band color, or use a preset for 1 kΩ ±5%, 4.7 kΩ ±5%, or 10 kΩ ±1%.",
      "Copy ohms, the tolerance window, and ppm/°C when a sixth band is set.",
    ],
    stepsEs: [
      "Elegí 4, 5 o 6 bandas.",
      "Marcá el color de cada banda, o usá un preset de 1 kΩ ±5%, 4,7 kΩ ±5% o 10 kΩ ±1%.",
      "Copiá los ohmios, la ventana de tolerancia y los ppm/°C si hay sexta banda.",
    ],
    faq: [
      { q: "What is brown black red gold?", a: "A 4-band code: 1 and 0, multiplier ×100, gold ±5%. That is 1,000 Ω, or 1 kΩ, from 950 Ω to 1,050 Ω." },
      { q: "How is a 5-band resistor different?", a: "It adds a third significant digit before the multiplier. Brown-black-black-red-brown is 100 × 100 Ω = 10 kΩ at ±1%." },
      { q: "Can gold be the first band?", a: "No. Gold and silver are rejected as significant digits. They only work as multiplier (×0.1 or ×0.01) or tolerance (±5% or ±10%)." },
      { q: "Does this test the resistor?", a: "No. It only decodes the printed color code. A meter is still needed to check a real part." },
    ],
    faqEs: [
      { q: "¿Qué es marrón negro rojo dorado?", a: "Código de 4 bandas: 1 y 0, multiplicador ×100, dorado ±5%. Son 1.000 Ω, o 1 kΩ, entre 950 Ω y 1.050 Ω." },
      { q: "¿En qué cambia una resistencia de 5 bandas?", a: "Suma un tercer dígito antes del multiplicador. Marrón-negro-negro-rojo-marrón es 100 × 100 Ω = 10 kΩ al ±1%." },
      { q: "¿Puede el dorado ser la primera banda?", a: "No. Dorado y plateado se rechazan como dígitos. Solo valen como multiplicador (×0,1 o ×0,01) o tolerancia (±5% o ±10%)." },
      { q: "¿Esto mide la resistencia?", a: "No. Solo decodifica el código impreso. Para comprobar una pieza real hace falta un multímetro." },
    ],
  },
};
