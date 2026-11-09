import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base min-h-[120px]";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function WordFrequencyCounterTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (!text.trim()) return null;
    const words = text.toLowerCase().match(/[a-zà-ÿ0-9]+/gi) || [];
    const freq: Record<string, number> = {};
    words.forEach((w) => { freq[w] = (freq[w] || 0) + 1; });
    const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 10);
    return { total: words.length, unique: Object.keys(freq).length, top: sorted };
  }, [text]);

  async function copy() {
    if (!result) return;
    const textOut = result.top.map(([w, c]) => `${w}: ${c}`).join("\n");
    try {
      await navigator.clipboard.writeText(textOut);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setText("");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Frecuencia de palabras" : "Word frequency"}</p>
        {result ? (
          <div className="space-y-1 text-sm">
            <p>{es ? `Total: ${result.total}, únicas: ${result.unique}` : `Total: ${result.total}, unique: ${result.unique}`}</p>
            <ul className="list-disc pl-5">
              {result.top.map(([w, c]) => <li key={w}>{w}: {c}</li>)}
            </ul>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Pega texto para analizar" : "Paste text to analyze"}</p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Texto" : "Text"}</span>
        <textarea value={text} onChange={(e) => setText(e.target.value)} className={fieldClass} placeholder={es ? "Pega tu texto aquí..." : "Paste your text here..."} />
      </label>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? '"hola hola mundo" → hola:2, mundo:1' : '"hello hello world" → hello:2, world:1'}</p>
        <p>{es ? "Texto vacío → sin resultado" : "Empty text → no result"}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar top" : "Copy top"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
    </div>
  );
}
