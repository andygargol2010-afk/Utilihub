import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base min-h-[120px]";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function ParagraphCounterTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [text, setText] = useState("First paragraph.\n\nSecond paragraph here.\n\nThird one.");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (!text.trim()) return { count: 0 };
    const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0);
    return { count: paragraphs.length };
  }, [text]);

  async function copy() {
    const textOut = es ? `Párrafos: ${result.count}` : `Paragraphs: ${result.count}`;
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
        <p className="text-sm text-muted-foreground">{es ? "Número de párrafos" : "Paragraph count"}</p>
        <p className="text-3xl font-semibold">{result.count}</p>
      </div>

      <div className="grid gap-4">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Texto" : "Text"}</span>
          <textarea value={text} onChange={(e) => setText(e.target.value)} className={fieldClass} rows={6} />
        </label>
      </div>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "Dos bloques separados por línea en blanco → 2" : "Two blocks separated by blank line → 2"}</p>
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
