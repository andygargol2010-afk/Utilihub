import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

function compute(text: string): { words: number; sentences: number; avg: number } | { error: string } {
  const trimmed = text.trim();
  if (!trimmed) return { error: "empty" };
  const sentences = trimmed.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  if (sentences.length === 0) return { error: "no-sentences" };
  const words = trimmed.split(/\s+/).filter((w) => w.length > 0).length;
  const avg = words / sentences.length;
  return { words, sentences: sentences.length, avg };
}

export function WordsPerSentenceCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [text, setText] = useState("Hello world. This is a test sentence.");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const r = compute(text);
    if ("error" in r) {
      if (r.error === "empty") return { error: es ? "Pega un texto" : "Paste some text" };
      return { error: es ? "No se detectaron oraciones" : "No sentences detected" };
    }
    return r;
  }, [text, es]);

  async function copy() {
    if (!result || "error" in result) return;
    const t = es
      ? `${result.avg.toFixed(1)} palabras/oración (${result.words} palabras, ${result.sentences} oraciones)`
      : `${result.avg.toFixed(1)} words/sentence (${result.words} words, ${result.sentences} sentences)`;
    try {
      await navigator.clipboard.writeText(t);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setText("Hello world. This is a test sentence.");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Resultado" : "Result"}</p>
        {result && !("error" in result) ? (
          <div className="space-y-1">
            <p className="text-2xl font-semibold">{result.avg.toFixed(1)}</p>
            <p className="text-sm text-muted-foreground">
              {es
                ? `${result.words} palabras en ${result.sentences} oraciones`
                : `${result.words} words in ${result.sentences} sentences`}
            </p>
          </div>
        ) : result && "error" in result ? (
          <p className="text-sm text-destructive">{result.error}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Pega un texto" : "Paste text"}</p>
        )}
      </div>

      <div className="grid gap-4">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Texto" : "Text"}</span>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className={`${fieldClass} min-h-[120px]`}
            placeholder={es ? "Pega tu texto aquí..." : "Paste your text here..."}
          />
        </label>
      </div>

      <p className="text-sm text-muted-foreground">
        {es
          ? "Las oraciones se dividen por . ! ? . Los espacios múltiples se normalizan."
          : "Sentences are split on . ! ? . Multiple spaces are normalized."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "\"Hello world. This is a test.\" → 2.5" : "\"Hello world. This is a test.\" → 2.5"}</p>
        <p>{es ? "Texto largo con varias oraciones → promedio calculado" : "Longer text with several sentences → calculated average"}</p>
      </div>

      <div className="text-sm space-y-1">
        <p className="font-medium">{es ? "Herramientas relacionadas" : "Related tools"}</p>
        <p>
          <a href={es ? "/es/herramientas/contador-de-palabras" : "/tools/word-counter"} className="underline text-primary">
            {es ? "Contador de palabras" : "Word counter"}
          </a>
          {" · "}
          <a href={es ? "/es/herramientas/calculadora-tiempo-de-lectura" : "/tools/reading-time"} className="underline text-primary">
            {es ? "Tiempo de lectura" : "Reading time"}
          </a>
        </p>
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
