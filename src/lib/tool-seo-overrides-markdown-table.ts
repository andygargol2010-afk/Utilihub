import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_MARKDOWN_TABLE: Record<string, ToolSeoOverride> = {
  "generador-tabla-markdown": {
    metaTitle: "CSV to Markdown Table Generator — Local, Pipe Escape | UtiliHub",
    metaTitleEs: "CSV a tabla Markdown: local, escapa pipes | UtiliHub",
    metaDescription:
      "Convert CSV or semicolon text into a GitHub-flavored Markdown table. Flour,500 and Water,320 become two body rows. Pipes are escaped. Nothing is uploaded.",
    metaDescriptionEs:
      "Convertí CSV o texto con punto y coma en una tabla Markdown de GitHub. Flour,500 y Water,320 quedan en dos filas. Los pipes se escapan. No se sube nada.",
    about: [
      "READMEs and issue comments want a Markdown table, not a spreadsheet. This generator keeps the conversion in the browser.",
      "CSV to JSON already parses rows. This writes GitHub-flavored table syntax, including the separator row, and escapes pipe characters so a cell cannot break the table.",
      "Auto delimiter prefers semicolon when a Spanish export has more semicolons than commas. Uneven rows are padded and warned, not dropped.",
    ],
    aboutEs: [
      "Un README o un comentario de issue pide tabla Markdown, no una hoja de cálculo. Este generador hace la conversión en el navegador.",
      "CSV a JSON ya parsea filas. Esto escribe la sintaxis de tabla de GitHub, con la fila separadora, y escapa los pipes para que una celda no rompa la tabla.",
      "El delimitador automático elige punto y coma si una exportación en español tiene más punto y coma que comas. Las filas desiguales se rellenan y se avisan, no se tiran.",
    ],
    steps: [
      "Paste CSV, semicolon, or tab-separated rows.",
      "Keep the header row, or turn it off to invent col 1 labels.",
      "Copy the Markdown table.",
    ],
    stepsEs: [
      "Pegá filas CSV, con punto y coma o separadas por tab.",
      "Dejá la fila de encabezado, o apagala para inventar etiquetas col 1.",
      "Copiá la tabla Markdown.",
    ],
    faq: [
      { q: "What does Flour,500 produce?", a: "The sample name,qty / Flour,500 / Water,320 becomes a 2-column table with two body rows. The header stays name and qty. No warning is raised." },
      { q: "How is a pipe inside a cell handled?", a: "A cell a|b is written as a\\|b. Newlines inside a quoted cell become spaces so the table stays one row per record." },
      { q: "Does a Spanish semicolon export work?", a: "Yes. producto;precio and Café;2,50 with auto delimiter uses semicolon, so the comma in 2,50 stays inside the price cell." },
    ],
    faqEs: [
      { q: "¿Qué produce Flour,500?", a: "La muestra name,qty / Flour,500 / Water,320 queda en una tabla de 2 columnas y dos filas de cuerpo. El encabezado sigue siendo name y qty. No hay aviso." },
      { q: "¿Cómo se trata un pipe dentro de una celda?", a: "La celda a|b se escribe a\\|b. Los saltos de línea dentro de una celda entre comillas pasan a espacios para que la tabla siga con una fila por registro." },
      { q: "¿Funciona una exportación española con punto y coma?", a: "Sí. producto;precio y Café;2,50 con delimitador automático usa punto y coma, así la coma de 2,50 queda dentro de la celda de precio." },
    ],
  },
};
