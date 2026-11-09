// TOOL_SEO_OVERRIDES_BLOCK3 part 1 — split out of ../tool-seo-overrides-block3.ts on 2026-10-28.
// Add new entries in the smallest file of this folder; never rewrite files wholesale.
import type { ToolSeoOverrideBlock3 } from "../tool-seo-overrides-block3";
import { TOOL_SEO_OVERRIDES_BLOCK3_1_PART1 } from "./block3-1.part1";
import { TOOL_SEO_OVERRIDES_BLOCK3_1_PART2 } from "./block3-1.part2";


export const TOOL_SEO_OVERRIDES_BLOCK3_1: Record<string, ToolSeoOverrideBlock3> = {
  ...TOOL_SEO_OVERRIDES_BLOCK3_1_PART1,
  ...TOOL_SEO_OVERRIDES_BLOCK3_1_PART2,

  "json-a-csv": {
    metaTitle: "JSON to CSV Converter — Free Online | UtiliHub",
    metaTitleEs: "Convertir JSON a CSV online | UtiliHub",
    metaDescription:
      "Convert a JSON array of objects to CSV in your browser. Export tabular data without uploading files.",
    metaDescriptionEs:
      "Convertí un array JSON de objetos a CSV en el navegador. Exportá datos tabulares sin subir archivos.",
    about: [
      "JSON arrays of flat objects map cleanly to CSV rows: object keys become column headers and each object becomes a row.",
      "Nested objects or arrays need flattening or special handling—this tool targets simple, table-shaped JSON common in exports and APIs.",
      "Conversion is local so sensitive spreadsheets never leave your device during the transform step.",
    ],
    aboutEs: [
      "Los arrays JSON de objetos planos mapean bien a filas CSV: las claves son columnas y cada objeto una fila.",
      "Objetos anidados o arrays requieren aplanarlos; esta herramienta apunta a JSON tabular simple de exports y APIs.",
      "La conversión es local: planillas sensibles no salen de tu dispositivo en este paso.",
    ],
    steps: [
      "Paste a JSON array of objects.",
      "Convert to CSV.",
      "Copy or download the CSV for Excel or Sheets.",
    ],
    stepsEs: [
      "Pegá un array JSON de objetos.",
      "Convertí a CSV.",
      "Copiá o descargá el CSV para Excel o Sheets.",
    ],
    faq: [
      {
        q: "What shape of JSON works best?",
        a: "An array of objects with the same keys, e.g. [{\"name\":\"Ada\",\"age\":36}, …]. Deep nesting may need preprocessing.",
      },
      {
        q: "Are commas escaped?",
        a: "CSV fields that contain commas should be quoted. Check the output if your data has special characters.",
      },
    ],
    faqEs: [
      {
        q: "¿Qué forma de JSON funciona mejor?",
        a: "Un array de objetos con las mismas claves, p. ej. [{\"name\":\"Ada\",\"age\":36}, …]. El anidado profundo puede requerir preprocess.",
      },
      {
        q: "¿Se escapan las comas?",
        a: "Los campos con comas deberían ir entre comillas. Revisá la salida si hay caracteres especiales.",
      },
    ],
  },

};
