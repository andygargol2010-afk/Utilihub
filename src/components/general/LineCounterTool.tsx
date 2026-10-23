import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base min-h-[120px]";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function LineCounterTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [text, setText] = useState("Hello\nWorld\n\nLine 4");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (text.length > 100000) return null;
    const lines = text.split(/\r\n|\r|\n/);
    const nonEmpty = lines.filter((l) => l.trim().length > 0).length;
    return { total: lines.length, nonEmpty };
  }, [text]);

  async function copy() {
    if (!result) return;
    const textOut = `${result.total}`;
    try {
      await navigator.clipboard.writeText(textOut);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setText("Hello\nWorld\n\nLine 4");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Líneas" : "Lines"}</p>
        {result ? (
          <>
            <p className="text-3xl font-semibold">{result.total}</p>
            <p className="text-sm text-muted-foreground">{es ? `No vacías: ${result.nonEmpty}` : `Non-empty: ${result.nonEmpty}`}</p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Texto demasiado largo" : "Text too long"}</p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Texto" : "Text"}</span>
        <textarea value={text} onChange={(e) => setText(e.target.value)} className={fieldClass} />
      </label>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? ""Hello\\nWorld" → 2 líneas" : ""Hello\\nWorld" → 2 lines"}</p>
        <p>{es ? "Texto vacío → 1 línea" : "Empty text → 1 line"}</p>
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
