import { useState } from "react";
import type { GeneralTool } from "@/lib/general/types";
import { getToolShowcase } from "@/lib/tool-showcase";
import { showcaseUi } from "@/lib/showcase-ui";
import { processGapText, GAP_TEXT_SLUGS } from "@/lib/general/gap-text-ops";

const words = (text: string) => (text.trim() ? text.trim().split(/\s+/).length : 0);
const lines = (text: string) => (text ? text.split(/\r?\n/).length : 0);
const sentences = (text: string) => text.match(/[^.!?]+[.!?]+/g)?.length ?? (text.trim() ? 1 : 0);
const paragraphs = (text: string) => text.split(/\r?\n\s*\r?\n/).map((x) => x.trim()).filter(Boolean).length;
const wordsToCase = (text: string) => text.trim().split(/[^\p{L}\p{N}]+/u).filter(Boolean);

function process(slug: string, text: string, second: string, replacement: string) {
  switch (slug) {
    case "contador-de-caracteres":
      return `With spaces: ${text.length}\nWithout spaces: ${text.replace(/\s/g, "").length}`;
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
      return text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi)?.join("\n") ?? "No emails found.";
    case "extraer-urls":
      return text.match(/https?:\/\/[^\s]+/gi)?.join("\n") ?? "No URLs found.";
    case "texto-a-csv": {
      const rows = text.split(/\r?\n/).map((l) => l.split(/\t|,/));
      if (!rows.length) return "";
      const cols = Math.max(...rows.map((r) => r.length));
      if (rows.some((r) => r.length !== cols)) throw new Error("All rows must have the same number of columns.");
      return rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n");
    }
    default:
      throw new Error(`Text tool not implemented: ${slug}`);
  }
}

export function TextTool({ tool, locale = "en" }: { tool: GeneralTool; locale?: "en" | "es" }) {
  const es = locale === "es";
  const showcase = getToolShowcase(tool.slug);
  const ui = showcaseUi(showcase?.accent);
  const needsSecond = ["buscar-reemplazar", "diferencia-textos", "anagramas"].includes(tool.slug);
  const [text, setText] = useState("");
  const [second, setSecond] = useState("");
  const [replacement, setReplacement] = useState("");
  const [out, setOut] = useState("");
  const [error, setError] = useState("");

  const run = () => {
    try {
      setError("");
      if (GAP_TEXT_SLUGS.has(tool.slug)) {
        setOut(processGapText(tool.slug, text, second, locale));
      } else {
        setOut(process(tool.slug, text, second, replacement));
      }
    } catch (e) {
      setOut("");
      const message = e instanceof Error ? e.message : "Could not process the text.";
      const translated =
        {
          "Enter the text you want to find.": "Introduce el texto que quieres buscar.",
          "No numbers found.": "No se encontraron números.",
          "No emails found.": "No se encontraron correos electrónicos.",
          "No URLs found.": "No se encontraron URL.",
          "Enter CSV content.": "Introduce el contenido CSV.",
          "All rows must have the same number of columns.": "Todas las filas deben tener el mismo número de columnas.",
          "Enter text or Morse code.": "Introduce texto o código Morse.",
          "Enter text or binary.": "Introduce texto o binario.",
          "Enter some text with words.": "Introduce un texto con palabras.",
          "Enter a longer text (a few sentences).": "Introduce un texto más largo (varias oraciones).",
          "Enter two words or phrases.": "Introduce dos palabras o frases.",
          "Enter some text.": "Introduce un texto.",
          "Enter digits only.": "Ingresá solo dígitos.",
          "Binary must be groups of 0/1 with length multiple of 8.": "El binario debe ser grupos de 0/1 con longitud múltiplo de 8.",
        }[message] ?? message;
      setError(es ? translated : message);
    }
  };

  const labels = es
    ? {
        input: "Texto de entrada",
        find: "Texto que buscar",
        second: "Segundo texto",
        replacement: "Texto de reemplazo",
        placeholder: "Escribe o pega aquí…",
        remove: "Déjalo vacío para eliminar el texto encontrado",
        process: "Procesar",
        stats: `${words(text)} palabras · ${text.length} caracteres · ${lines(text)} líneas`,
      }
    : {
        input: "Input text",
        find: "Text to find",
        second: "Second text",
        replacement: "Replacement text",
        placeholder: "Type or paste here…",
        remove: "Leave empty to remove the found text",
        process: "Process",
        stats: `${words(text)} words · ${text.length} characters · ${lines(text)} lines`,
      };

  const fieldClass = ui?.fieldTall ?? "min-h-40 w-full rounded-xl border bg-background p-4";
  const btnClass = ui?.btn ?? "rounded-xl bg-primary px-4 py-2 font-bold text-primary-foreground";

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-semibold">{labels.input}</label>
        <textarea value={text} onChange={(e) => setText(e.target.value)} className={fieldClass} placeholder={labels.placeholder} />
      </div>
      {needsSecond && (
        <div>
          <label className="mb-2 block text-sm font-semibold">{tool.slug === "buscar-reemplazar" ? labels.find : labels.second}</label>
          <textarea value={second} onChange={(e) => setSecond(e.target.value)} className={fieldClass.replace("min-h-44", "min-h-28").replace("min-h-40", "min-h-24")} />
        </div>
      )}
      {tool.slug === "buscar-reemplazar" && (
        <div>
          <label className="mb-2 block text-sm font-semibold">{labels.replacement}</label>
          <textarea value={replacement} onChange={(e) => setReplacement(e.target.value)} className={fieldClass.replace("min-h-44", "min-h-28").replace("min-h-40", "min-h-24")} placeholder={labels.remove} />
        </div>
      )}
      <p className="text-xs text-muted-foreground">{labels.stats}</p>
      <button type="button" onClick={run} className={btnClass}>
        {labels.process}
      </button>
      {error && <p role="alert" className="rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm">{error}</p>}
      {out && (
        <output className={`block whitespace-pre-wrap break-words rounded-2xl border p-4 ${ui ? `${ui.out} text-[15px] font-medium` : "bg-muted/30"}`}>
          {out}
        </output>
      )}
    </div>
  );
}
