import { useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base min-h-[140px]";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function WordCounterTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [text, setText] = useState("The quick brown fox jumps over the lazy dog. It is a classic sentence.");
  const [copied, setCopied] = useState(false);

  const chars = text.length;
  const charsNoSpace = text.replace(/\s/g, "").length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length;

  const result = es
    ? `Palabras: ${words} | Caracteres: ${chars} | Sin espacios: ${charsNoSpace} | Oraciones: ${sentences} | Párrafos: ${paragraphs}`
    : `Words: ${words} | Characters: ${chars} | No spaces: ${charsNoSpace} | Sentences: ${sentences} | Paragraphs: ${paragraphs}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  function reset() {
    setText("");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div><p className="text-2xl font-semibold">{words}</p><p className="text-xs text-muted-foreground">{es ? "Palabras" : "Words"}</p></div>
        <div><p className="text-2xl font-semibold">{chars}</p><p className="text-xs text-muted-foreground">{es ? "Caracteres" : "Characters"}</p></div>
        <div><p className="text-2xl font-semibold">{charsNoSpace}</p><p className="text-xs text-muted-foreground">{es ? "Sin espacios" : "No spaces"}</p></div>
        <div><p className="text-2xl font-semibold">{sentences}</p><p className="text-xs text-muted-foreground">{es ? "Oraciones" : "Sentences"}</p></div>
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Texto" : "Text"}</span>
        <textarea value={text} onChange={(e) => setText(e.target.value)} className={fieldClass} placeholder={es ? "Pega o escribe texto..." : "Paste or type text..."} />
      </label>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar resultado" : "Copy result"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>{es ? "Limpiar" : "Clear"}</button>
      </div>

      <div className="text-sm text-muted-foreground space-y-1">
        <p>{es ? "Ejemplo 1: «Hola mundo» → 2 palabras, 10 caracteres" : "Example 1: «Hello world» → 2 words, 11 characters"}</p>
        <p>{es ? "Ejemplo 2: texto vacío → 0 en todas las métricas" : "Example 2: empty text → 0 across all metrics"}</p>
      </div>
    </div>
  );
}
