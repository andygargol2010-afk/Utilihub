import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function LetterFrequencyCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [text, setText] = useState("Hello World");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (!text || text.trim().length === 0) return null;
    const counts: Record<string, number> = {};
    for (const ch of text.toLowerCase()) {
      if (ch >= "a" && ch <= "z") {
        counts[ch] = (counts[ch] || 0) + 1;
      }
    }
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    if (total === 0) return null;
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return { sorted, total };
  }, [text]);

  async function copy() {
    if (!result) return;
    const textOut = result.sorted.map(([l, c]) => `${l.toUpperCase()}: ${c}`).join(", ");
    try {
      await navigator.clipboard.writeText(textOut);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setText("Hello World");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Frecuencia de letras" : "Letter frequency"}</p>
        {result ? (
          <div className="space-y-1">
            <p className="text-sm">{es ? `Total letras: ${result.total}` : `Total letters: ${result.total}`}</p>
            <p className="text-base font-medium">{result.sorted.map(([l, c]) => `${l.toUpperCase()}: ${c}`).join(" · ")}</p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Texto con letras requerido" : "Text with letters required"}</p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Texto" : "Text"}</span>
        <textarea rows={4} value={text} onChange={(e) => setText(e.target.value)} className={fieldClass} />
      </label>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "Hello → H:1 E:1 L:2 O:1" : "Hello → H:1 E:1 L:2 O:1"}</p>
        <p>{es ? "The quick brown → T:1 H:1 E:1 Q:1 U:1 I:1 C:1 K:1 B:1 R:1 O:1 W:1 N:1" : "The quick brown → T:1 H:1 E:1 Q:1 U:1 I:1 C:1 K:1 B:1 R:1 O:1 W:1 N:1"}</p>
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
