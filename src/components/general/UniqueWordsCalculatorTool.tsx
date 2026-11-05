import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base min-h-[120px]";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function UniqueWordsCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [text, setText] = useState("hello world hello unique words calculator");
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    const cleaned = text.trim();
    if (!cleaned) return null;
    const words = cleaned.split(/\s+/).filter(Boolean);
    const total = words.length;
    const uniqueSet = new Set(words.map((w) => w.toLowerCase().replace(/[^\wáéíóúñ]/gi, "")));
    const unique = uniqueSet.size;
    const ratio = total > 0 ? (unique / total) * 100 : 0;
    return { unique, total, ratio: ratio.toFixed(1) };
  }, [text]);

  async function copy() {
    if (!stats) return;
    const out = es
      ? `Palabras únicas: ${stats.unique} / ${stats.total} (${stats.ratio}%)`
      : `Unique words: ${stats.unique} / ${stats.total} (${stats.ratio}%)`;
    try {
      await navigator.clipboard.writeText(out);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setText("hello world hello unique words calculator");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Palabras únicas" : "Unique words"}</p>
        {stats ? (
          <>
            <p className="text-2xl font-semibold font-mono">{stats.unique}</p>
            <p className="text-sm text-muted-foreground">
              {es ? `Total: ${stats.total} · Ratio: ${stats.ratio}%` : `Total: ${stats.total} · Ratio: ${stats.ratio}%`}
            </p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Pega texto para calcular" : "Paste text to calculate"}</p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Texto" : "Text"}</span>
        <textarea value={text} onChange={(e) => setText(e.target.value)} className={fieldClass} rows={5} />
      </label>

      <p className="text-sm text-muted-foreground">
        {es ? "Separa por espacios. Únicas = case-insensitive, sin puntuación básica." : "Split on whitespace. Unique = case-insensitive, basic punctuation stripped."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "“hello world hello” → 2 únicas / 3 total (66.7%)" : "“hello world hello” → 2 unique / 3 total (66.7%)"}</p>
        <p>{es ? "“El gato negro saltó sobre el gato blanco” → 5 únicas / 7 total" : "“The black cat jumped over the black cat” → 5 unique / 7 total"}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy} disabled={!stats}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar" : "Copy"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>

      <p className="text-xs text-muted-foreground">
        {es ? "Relacionado: contador-lineas, calculadora-longitud-promedio-palabra" : "Related: contador-lineas, calculadora-longitud-promedio-palabra"}
      </p>
    </div>
  );
}
