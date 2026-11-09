import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function AverageWordLengthCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [text, setText] = useState("The quick brown fox jumps over the lazy dog");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const trimmed = text.trim();
    if (!trimmed) return null;
    const words = trimmed.split(/\s+/).filter(w => w.length > 0);
    if (words.length === 0) return null;
    const totalChars = words.reduce((sum, w) => sum + w.length, 0);
    const avg = totalChars / words.length;
    return {
      avg: Math.round(avg * 100) / 100,
      words: words.length,
      chars: totalChars,
    };
  }, [text]);

  async function copy() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(`${result.avg}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setText("The quick brown fox jumps over the lazy dog");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Longitud promedio" : "Average length"}</p>
        {result ? (
          <div>
            <p className="text-3xl font-semibold">{result.avg}</p>
            <p className="text-sm text-muted-foreground">
              {es ? `${result.words} palabras, ${result.chars} caracteres` : `${result.words} words, ${result.chars} characters`}
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Introduce texto con al menos una palabra" : "Enter text with at least one word"}
          </p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Texto" : "Text"}</span>
        <textarea
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className={fieldClass}
          placeholder={es ? "Escribe o pega tu texto aquí" : "Type or paste your text here"}
        />
      </label>

      <p className="text-sm text-muted-foreground">
        {es ? "Calcula el número promedio de caracteres por palabra (sin espacios)." : "Calculates the average number of characters per word (excluding spaces)."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "\"hello world\" → 5.0 (10 caracteres / 2 palabras)" : "\"hello world\" → 5.0 (10 characters / 2 words)"}</p>
        <p>{es ? "\"a bb ccc\" → 2.0 (6 / 3)" : "\"a bb ccc\" → 2.0 (6 / 3)"}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar resultado" : "Copy result"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
    </div>
  );
}
