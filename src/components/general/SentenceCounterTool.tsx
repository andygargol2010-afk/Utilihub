import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base min-h-[120px]";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function SentenceCounterTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [text, setText] = useState("Hello world. This is a test! How many sentences?");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (!text.trim()) return { count: 0 };
    const sentences = text.split(/[.!?]+\s*/).filter(s => s.trim().length > 0);
    return { count: sentences.length };
  }, [text]);

  async function copy() {
    const textOut = es ? `Oraciones: ${result.count}` : `Sentences: ${result.count}`;
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
        <p className="text-sm text-muted-foreground">{es ? "Número de oraciones" : "Number of sentences"}</p>
        <p className="text-3xl font-semibold">{result.count}</p>
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Texto" : "Text"}</span>
        <textarea value={text} onChange={(e) => setText(e.target.value)} className={fieldClass} />
      </label>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "\"Hola. Mundo!\" → 2" : "\"Hello. World!\" → 2"}</p>
        <p>{es ? "Texto vacío → 0" : "Empty text → 0"}</p>
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
