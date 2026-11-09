import type { ToolSeoOverride } from "./tool-seo-overrides";
import { TOOL_SEO_OVERRIDES_GOOGLE_PATHS_PART1 } from "./tool-seo-overrides-google-paths.part1";
import { TOOL_SEO_OVERRIDES_GOOGLE_PATHS_PART2 } from "./tool-seo-overrides-google-paths.part2";


/** SEO for paths that already get ≥2 Google visits (Analytics). */
export const TOOL_SEO_OVERRIDES_GOOGLE_PATHS: Record<string, ToolSeoOverride> = {
  ...TOOL_SEO_OVERRIDES_GOOGLE_PATHS_PART1,
  ...TOOL_SEO_OVERRIDES_GOOGLE_PATHS_PART2,
  "generador-numero-aleatorio": {
    metaTitle: "Random Number Generator — Integer between min and max | UtiliHub",
    metaTitleEs: "Generador de número aleatorio — entre mínimo y máximo | UtiliHub",
    metaDescription:
      "Generate a random integer between two bounds. Fair uniform pick in the browser. Free, no signup.",
    metaDescriptionEs:
      "Generá un número entero aleatorio entre dos límites. Sorteo uniforme en el navegador. Gratis, sin registro.",
    about: [
      "Enter a minimum and maximum (inclusive). The tool picks a uniform random integer in that range.",
      "Useful for raffles, classroom picks, dice ranges, and quick samples without a spreadsheet.",
    ],
    aboutEs: [
      "Ingresá un mínimo y un máximo (incluidos). La herramienta elige un entero aleatorio uniforme en ese rango.",
      "Útil para sorteos, elegir en clase, rangos tipo dado y muestras rápidas sin una hoja de cálculo.",
    ],
    steps: ["Set minimum and maximum.", "Generate to get a random integer.", "Generate again for a new value."],
    stepsEs: ["Definí mínimo y máximo.", "Generá para obtener un entero aleatorio.", "Volvé a generar para otro valor."],
    faq: [
      { q: "Is max inclusive?", a: "Yes—both ends of the range can appear." },
      { q: "Is it cryptographically secure?", a: "No. It uses the browser PRNG for everyday picks, not security tokens." },
    ],
    faqEs: [
      { q: "¿El máximo está incluido?", a: "Sí: ambos extremos del rango pueden salir." },
      { q: "¿Es criptográficamente seguro?", a: "No. Usa el PRNG del navegador para sorteos cotidianos, no para tokens de seguridad." },
    ],
  },
};
