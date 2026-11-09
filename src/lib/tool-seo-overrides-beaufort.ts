import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_BEAUFORT: Record<string, ToolSeoOverride> = {
  "conversor-escala-beaufort": {
    metaTitle: "Beaufort Scale Converter — 10 m/s to Force 5 | UtiliHub",
    metaTitleEs: "Conversor escala Beaufort — 10 m/s a fuerza 5 | UtiliHub",
    metaDescription:
      "Convert wind speed in m/s, km/h, knots, or mph to a WMO Beaufort force 0–12. Empty, invalid, and negative speeds do not invent a force. Runs in the browser.",
    metaDescriptionEs:
      "Convertí la velocidad del viento en m/s, km/h, nudos o mph a fuerza Beaufort 0–12 de la OMM. Una velocidad vacía, inválida o negativa no inventa una fuerza. Corre en el navegador.",
    about: [
      "The World Meteorological Organization Beaufort scale maps mean wind speed to forces 0 through 12. Force 12 starts at 32.7 m/s; the tool does not invent a force 13.",
      "10 m/s is force 5, a fresh breeze. 20 km/h is about 5.6 m/s, force 4, a moderate breeze.",
      "Wind chill is a different tool: it estimates feels-like temperature, not the Beaufort force of the wind.",
    ],
    aboutEs: [
      "La escala Beaufort de la Organización Meteorológica Mundial mapea la velocidad media del viento a fuerzas 0 a 12. La fuerza 12 empieza en 32,7 m/s; la herramienta no inventa una fuerza 13.",
      "10 m/s es fuerza 5, fresquito. 20 km/h son unos 5,6 m/s, fuerza 4, bonancible.",
      "La sensación térmica por viento es otra herramienta: estima la temperatura aparente, no la fuerza Beaufort del viento.",
    ],
    steps: [
      "Enter 10 and leave the unit on m/s, or use the 10 m/s example.",
      "Switch the unit to km/h and enter 20 to see force 4.",
      "Copy the force. Reset clears the speed and does not invent a result.",
    ],
    stepsEs: [
      "Ingresá 10 y dejá la unidad en m/s, o usá el ejemplo de 10 m/s.",
      "Cambiá la unidad a km/h e ingresá 20 para ver la fuerza 4.",
      "Copiá la fuerza. Reiniciar vacía la velocidad y no inventa un resultado.",
    ],
    faq: [
      {
        q: "What Beaufort force is 10 m/s?",
        a: "Force 5, a fresh breeze. The WMO band for force 5 is 8.0–10.7 m/s.",
      },
      {
        q: "What Beaufort force is 20 km/h?",
        a: "Force 4, a moderate breeze. 20 km/h is about 5.6 m/s, inside 5.5–7.9 m/s.",
      },
      {
        q: "Why is a negative speed rejected?",
        a: "Wind speed cannot be negative. The tool does not invent a force for an empty, invalid, or negative value.",
      },
    ],
    faqEs: [
      {
        q: "¿Qué fuerza Beaufort son 10 m/s?",
        a: "Fuerza 5, fresquito. La banda OMM de la fuerza 5 es 8,0–10,7 m/s.",
      },
      {
        q: "¿Qué fuerza Beaufort son 20 km/h?",
        a: "Fuerza 4, bonancible. 20 km/h son unos 5,6 m/s, dentro de 5,5–7,9 m/s.",
      },
      {
        q: "¿Por qué se rechaza una velocidad negativa?",
        a: "La velocidad del viento no puede ser negativa. La herramienta no inventa una fuerza si el valor está vacío, es inválido o es negativo.",
      },
    ],
  },
};
