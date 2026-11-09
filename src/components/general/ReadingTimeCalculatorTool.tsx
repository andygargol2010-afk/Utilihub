import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function ReadingTimeCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [words, setWords] = useState("500");
  const [wpm, setWpm] = useState("250");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const w = parseFloat(words);
    const s = parseFloat(wpm);
    if (isNaN(w) || isNaN(s) || w < 0 || s <= 0 || s > 1000 || w > 1000000) return null;
    const minutes = w / s;
    const mins = Math.floor(minutes);
    const secs = Math.round((minutes - mins) * 60);
    const display = secs === 60 ? `${mins + 1} min` : mins === 0 ? `${secs} sec` : `${mins} min ${secs} sec`;
    return {
      minutes: Math.round(minutes * 100) / 100,
      display,
    };
  }, [words, wpm]);

  async function copy() {
    if (!result) return;
    const textOut = es
      ? `Tiempo de lectura: ${result.display} (${result.minutes} min)`
      : `Reading time: ${result.display} (${result.minutes} min)`;
    try {
      await navigator.clipboard.writeText(textOut);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setWords("500");
    setWpm("250");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Tiempo de lectura estimado" : "Estimated reading time"}</p>
        {result ? (
          <p className="text-3xl font-semibold">{result.display}</p>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Palabras ≥ 0 y velocidad > 0 (máx 1000)" : "Words ≥ 0 and speed > 0 (max 1000)"}
          </p>
        )}
      </div>

      <div className="grid gap-4">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Número de palabras" : "Word count"}</span>
          <input type="number" step="1" min="0" value={words} onChange={(e) => setWords(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Velocidad (palabras por minuto)" : "Speed (words per minute)"}</span>
          <input type="number" step="1" min="1" value={wpm} onChange={(e) => setWpm(e.target.value)} className={fieldClass} />
        </label>
      </div>

      <p className="text-sm text-muted-foreground">
        {es ? "Fórmula: minutos = palabras / palabras_por_minuto. Útil para estimar tiempo de lectura de artículos." : "Formula: minutes = words / words_per_minute. Useful for estimating article reading time."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "500 palabras a 250 ppm → 2 min" : "500 words at 250 wpm → 2 min"}</p>
        <p>{es ? "1200 palabras a 200 ppm → 6 min" : "1200 words at 200 wpm → 6 min"}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar resultado" : "Copy result"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>

      <div className="text-sm text-muted-foreground space-y-1">
        <p className="font-medium">{es ? "Herramientas relacionadas" : "Related tools"}</p>
        <p>
          <a href={es ? "/es/calculadora-oraciones-por-parrafo" : "/calculadora-oraciones-por-parrafo"} className="underline">
            {es ? "Calculadora de oraciones por párrafo" : "Sentences per paragraph calculator"}
          </a>
          {" · "}
          <a href={es ? "/es/contador-de-palabras" : "/contador-de-palabras"} className="underline">
            {es ? "Contador de palabras" : "Word counter"}
          </a>
        </p>
      </div>
    </div>
  );
}
