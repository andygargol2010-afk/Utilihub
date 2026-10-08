import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_JSON_TS: Record<string, ToolSeoOverride> = {
  "json-a-typescript": {
    metaTitle: "JSON to TypeScript Interface Generator — Local | UtiliHub",
    metaTitleEs: "JSON a interfaz TypeScript: local, sin subir datos | UtiliHub",
    metaDescription:
      "Paste a JSON sample and get TypeScript interfaces. {\"id\":1,\"name\":\"Ada\"} becomes an Item interface. Nested objects and null arrays stay typed. Nothing is uploaded.",
    metaDescriptionEs:
      "Pegá un JSON de muestra y obtené interfaces TypeScript. {\"id\":1,\"name\":\"Ada\"} queda como interfaz Item. Objetos anidados y arrays con null siguen tipados. No se sube nada.",
    about: [
      "A sample payload is faster than writing interfaces by hand. This generator infers types in the browser from one JSON value.",
      "JSON to CSV already walks rows. This names nested objects, unions nulls in arrays, and quotes keys that are not valid identifiers.",
      "An empty array becomes unknown[]. Invalid JSON stops with an error instead of a partial interface.",
    ],
    aboutEs: [
      "Un payload de muestra es más rápido que escribir interfaces a mano. Este generador infiere tipos en el navegador a partir de un JSON.",
      "JSON a CSV ya recorre filas. Esto nombra objetos anidados, une null en arrays y pone comillas en claves que no son identificadores válidos.",
      "Un array vacío queda unknown[]. Un JSON inválido se detiene con error en lugar de una interfaz a medias.",
    ],
    steps: [
      "Paste a JSON object or array.",
      "Set the root name and whether null fields are optional.",
      "Copy the TypeScript interfaces.",
    ],
    stepsEs: [
      "Pegá un objeto o array JSON.",
      "Elegí el nombre raíz y si los null son opcionales.",
      "Copiá las interfaces TypeScript.",
    ],
    faq: [
      { q: "What does {\"id\":1,\"name\":\"Ada\"} produce?", a: "An exported interface Item with id: number and name: string. No warning is raised." },
      { q: "How are tags with null typed?", a: "The sample tags: [\"math\", null] becomes (string | null)[]. Turn on null as optional to drop the null union on object fields, not inside arrays." },
      { q: "What if the JSON is invalid?", a: "The generator shows an invalid JSON error and does not emit an interface. An empty box shows a paste error." },
    ],
    faqEs: [
      { q: "¿Qué produce {\"id\":1,\"name\":\"Ada\"}?", a: "Una interfaz exportada Item con id: number y name: string. No hay aviso." },
      { q: "¿Cómo se tipa un array con null?", a: "La muestra tags: [\"math\", null] queda (string | null)[]. Activar null como opcional saca la unión null en campos de objeto, no dentro de arrays." },
      { q: "¿Qué pasa si el JSON es inválido?", a: "El generador muestra error de JSON inválido y no emite interfaz. Una caja vacía muestra error de pegado." },
    ],
  },
};
