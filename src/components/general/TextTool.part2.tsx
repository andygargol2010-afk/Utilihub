// Part 2 of 3 — split from TextTool.tsx on 2026-11-04. Edit here; TextTool.tsx re-exports.
import { words } from "./TextTool.part1";

export const lines = (text: string) => (text ? text.split(/\r?\n/).length : 0);
export const sentences = (text: string) => text.match(/[^.!?]+[.!?]+/g)?.length ?? (text.trim() ? 1 : 0);
export const paragraphs = (text: string) => text.split(/\r?\n\s*\r?\n/).map((x) => x.trim()).filter(Boolean).length;
export const wordsToCase = (text: string) => text.trim().split(/[^\p{L}\p{N}]+/u).filter(Boolean);

export function process(slug: string, text: string, second: string, replacement: string) {
  switch (slug) {
    case "contador-de-caracteres":
      return `With spaces: ${text.length}\nWithout spaces: ${text.replace(/\s/g, "").length}`;
    case "contador-de-palabras":
      return `Words: ${words(text)}\nCharacters (with spaces): ${text.length}\nCharacters (without spaces): ${text.replace(/\s/g, "").length}\nLines: ${lines(text)}`;
    case "contador-de-lineas":
      return `Lines: ${lines(text)}`;
    case "contador-de-frases":
      return `Sentences: ${sentences(text)}`;
    case "contador-de-parrafos":
      return `Paragraphs: ${paragraphs(text)}`;
    case "mayusculas":
      return text.toUpperCase();
    case "minusculas":
      return text.toLowerCase();
    case "capitalizar":
      return text.toLowerCase().replace(/(^|[.!?]\s+|\n\s*)\p{L}/gu, (m) => m.toUpperCase());
    case "camel-case": {
      const p = wordsToCase(text);
      return p.map((x, i) => (i ? x[0].toUpperCase() + x.slice(1).toLowerCase() : x.toLowerCase())).join("");
    }
    case "pascal-case":
      return wordsToCase(text).map((x) => x[0].toUpperCase() + x.slice(1).toLowerCase()).join("");
    case "snake-case":
      return wordsToCase(text).map((x) => x.toLowerCase()).join("_");
    case "kebab-case":
      return wordsToCase(text).map((x) => x.toLowerCase()).join("-");
    case "quitar-espacios":
      return text.replace(/\s+/g, " ").trim();
    case "lineas-unicas":
      return [...new Set(text.split(/\r?\n/))].join("\n");
    case "ordenar-lineas":
      return text.split(/\r?\n/).sort((a, b) => a.localeCompare(b)).join("\n");
    case "invertir-texto":
      return [...text].reverse().join("");
    case "buscar-reemplazar":
      if (!second) throw new Error("Enter the text you want to find.");
      return text.split(second).join(replacement);
    case "extraer-numeros":
      return text.match(/[-+]?\d+(?:[.,]\d+)?/g)?.join("\n") ?? "No numbers found.";
    case "extraer-emails":
      return [...new Set(text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) ?? [])].join("\n") || "No emails found.";
    case "extraer-urls":
      return [...new Set(text.match(/https?:\/\/[^\s<]+/gi) ?? [])].join("\n") || "No URLs found.";
    case "limpiar-texto":
      return text.replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/\s+/g, " ").trim();
    case "texto-a-lista":
      return text.split(/\r?\n/).map((x) => x.trim()).filter(Boolean).join(", ");
    case "lista-a-texto":
      return text.split(",").map((x) => x.trim()).filter(Boolean).join("\n");
    case "diferencia-textos": {
      if (text === second) return "The texts are identical line by line.";
      return `Text A (${text.length} characters)\nText B (${second.length} characters)\nLength difference: ${Math.abs(text.length - second.length)} characters.`;
    }
    case "csv-a-markdown": {
      const rows = text.trim().split(/\r?\n/).map((line) => line.split(",").map((c) => c.trim()));
      if (!rows.length || !rows[0].length) throw new Error("Enter CSV content.");
      if (rows.some((r) => r.length !== rows[0].length)) throw new Error("All rows must have the same number of columns.");
      return `| ${rows[0].join(" | ")} |\n| ${rows[0].map(() => "---").join(" | ")} |\n${rows.slice(1).map((r) => `| ${r.join(" | ")} |`).join("\n")}`;
    }
    case "markdown-a-html":
      return text
        .replace(/^### (.+)$/gm, "<h3>$1</h3>")
        .replace(/^## (.+)$/gm, "<h2>$1</h2>")
        .replace(/^# (.+)$/gm, "<h1>$1</h1>")
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*([^*]+)\*/g, "<em>$1</em>")
        .replace(/\n/g, "<br>\n");
    case "html-a-texto": {
      const doc = new DOMParser().parseFromString(text, "text/html");
      return doc.body.textContent ?? "";
    }
    default:
      throw new Error(`Text tool not implemented: ${slug}`);
  }
}
