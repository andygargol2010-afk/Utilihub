import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function WordsPerMinuteCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [words, setWords] = useState("200");
  const [minutes, setMinutes] = useState("4");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const w = parseFloat(words);
    const m = parseFloat(minutes);
    if (isNaN(w) || isNaN(m) || w < 0 || m <= 0 || w > 1e6 || m > 1e4) return null;
    const wpm = w / m;
    return { wpm: wpm.toFixed(1) };
  }, [words, minutes]);

  async function copy() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.wpm);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setWords("200");
    setMinutes("4");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Palabras por minuto" : "Words per minute"}</p>
        {result ? (
          <p className="text-3xl font-semibold">{result.wpm}</p>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Palabras ≥ 0 y minutos > 0 requeridos" : "Words ≥ 0 and minutes > 0 required"}
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Palabras" : "Words"}</span>
          <input type="number" step="any" min="0" value={words} onChange={(e) => setWords(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Minutos" : "Minutes"}</span>
          <input type="number" step="any" min="0.01" value={minutes} onChange={(e) => setMinutes(e.target.value)} className={fieldClass} />
        </label>
      </div>

      <p className="text-sm text-muted-foreground">
        {es ? "Fórmula: WPM = palabras / minutos" : "Formula: WPM = words / minutes"}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "200 palabras en 4 min → 50.0" : "200 words in 4 min → 50.0"}</p>
        <p>{es ? "400 palabras en 5 min → 80.0" : "400 words in 5 min → 80.0"}</p>
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
