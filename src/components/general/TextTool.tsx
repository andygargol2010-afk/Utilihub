import { useState } from "react";
import type { GeneralTool } from "@/lib/general/types";
import { getToolShowcase } from "@/lib/tool-showcase";
import { showcaseUi } from "@/lib/showcase-ui";
import { processGapText, GAP_TEXT_SLUGS } from "@/lib/general/gap-text-ops";
import { words } from "./TextTool.part1";
import { process, lines } from "./TextTool.part2";

export function TextTool({ tool, locale = "en" }: { tool: GeneralTool; locale?: "en" | "es" }) {
  const [text, setText] = useState("");
  const [second, setSecond] = useState("");
  const [replacement, setReplacement] = useState("");
  const [out, setOut] = useState("");
  const [error, setError] = useState("");
  const es = locale === "es";
  const showcase = getToolShowcase(tool.slug);
  const ui = showcaseUi(showcase?.accent);
  const needsSecond = ["buscar-reemplazar", "diferencia-textos", "anagramas"].includes(tool.slug);

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
