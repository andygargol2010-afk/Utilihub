import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function SentencesPerParagraphCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [sentences, setSentences] = useState("10");
  const [paragraphs, setParagraphs] = useState("2");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const s = parseFloat(sentences);
    const p = parseFloat(paragraphs);
    if (!Number.isFinite(s) || !Number.isFinite(p) || s <= 0 || p <= 0 || Math.abs(s) > 1e9 || Math.abs(p) > 1e9) return null;
    const avg = s / p;
    return {
      avg: Math.round(avg * 100) / 100,
      sentences: s,
      paragraphs: p,
    };
  }, [sentences, paragraphs]);

  async function copy() {
    if (!result) return;
    const text = es
      ? `${result.sentences} oraciones / ${result.paragraphs} párrafos → ${result.avg} oraciones por párrafo`
      : `${result.sentences} sentences / ${result.paragraphs} paragraphs → ${result.avg} sentences per paragraph`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setSentences("10");
    setParagraphs("2");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Oraciones por párrafo" : "Sentences per paragraph"}</p>
        {result ? (
          <div className="space-y-1">
            <p className="text-3xl font-semibold">{result.avg}</p>
            <p className="text-sm text-muted-foreground">
              {es ? `${result.sentences} oraciones · ${result.paragraphs} párrafos` : `${result.sentences} sentences · ${result.paragraphs} paragraphs`}
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Introduce oraciones y párrafos > 0" : "Enter sentences and paragraphs > 0"}
          </p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Número de oraciones" : "Number of sentences"}</span>
        <input
          type="number"
          value={sentences}
          onChange={(e) => setSentences(e.target.value)}
          className={fieldClass}
          placeholder={es ? "Ej. 10" : "e.g. 10"}
          min="0"
          step="any"
        />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Número de párrafos" : "Number of paragraphs"}</span>
        <input
          type="number"
          value={paragraphs}
          onChange={(e) => setParagraphs(e.target.value)}
          className={fieldClass}
          placeholder={es ? "Ej. 2" : "e.g. 2"}
          min="0"
          step="any"
        />
      </label>

      <p className="text-sm text-muted-foreground">
        {es
          ? "Promedio = oraciones ÷ párrafos. Útil para analizar estilo de escritura y legibilidad."
          : "Average = sentences ÷ paragraphs. Useful for analyzing writing style and readability."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "10 oraciones, 2 párrafos → 5" : "10 sentences, 2 paragraphs → 5"}</p>
        <p>{es ? "15 oraciones, 5 párrafos → 3" : "15 sentences, 5 paragraphs → 3"}</p>
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
          <a href={es ? "/es/contador-oraciones" : "/contador-oraciones"} className="underline">
            {es ? "Contador de oraciones" : "Sentence counter"}
          </a>
          {" · "}
          <a href={es ? "/es/contador-parrafos" : "/contador-parrafos"} className="underline">
            {es ? "Contador de párrafos" : "Paragraph counter"}
          </a>
        </p>
      </div>
    </div>
  );
}
