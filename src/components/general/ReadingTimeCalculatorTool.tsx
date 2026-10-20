import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function ReadingTimeCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [words, setWords] = useState("1500");
  const [wpm, setWpm] = useState("220");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const w = parseFloat(words);
    const speed = parseFloat(wpm);
    if ([w, speed].some(isNaN) || w <= 0 || speed <= 0 || w > 1000000 || speed > 1000) return null;
    const minutes = w / speed;
    const totalSeconds = Math.round(minutes * 60);
    const min = Math.floor(totalSeconds / 60);
    const sec = totalSeconds % 60;
    return { min, sec, minutes: Math.round(minutes * 10) / 10 };
  }, [words, wpm]);

  async function copy() {
    if (!result) return;
    const textOut = es
      ? `Tiempo de lectura: ${result.min} min ${result.sec} s`
      : `Reading time: ${result.min} min ${result.sec} s`;
    try {
      await navigator.clipboard.writeText(textOut);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setWords("1500");
    setWpm("220");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Tiempo estimado de lectura" : "Estimated reading time"}</p>
        {result ? (
          <p className="text-3xl font-semibold">{result.min} min {result.sec} s</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Introduce valores válidos > 0" : "Enter valid values > 0"}</p>
        )}
        {result && (
          <p className="text-sm text-muted-foreground">
            {es ? `≈ ${result.minutes} minutos` : `≈ ${result.minutes} minutes`}
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Número de palabras" : "Word count"}</span>
          <input type="number" step="1" min="1" value={words} onChange={(e) => setWords(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Palabras por minuto" : "Words per minute"}</span>
          <input type="number" step="1" min="1" value={wpm} onChange={(e) => setWpm(e.target.value)} className={fieldClass} />
        </label>
      </div>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "1500 palabras a 220 ppm → 6 min 49 s" : "1500 words at 220 wpm → 6 min 49 s"}</p>
        <p>{es ? "500 palabras a 200 ppm → 2 min 30 s" : "500 words at 200 wpm → 2 min 30 s"}</p>
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
