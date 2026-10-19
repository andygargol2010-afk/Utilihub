import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base min-h-[120px]";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

function countSyllables(text: string): number {
  if (!text.trim()) return 0;
  const words = text.toLowerCase().split(/\s+/).filter(Boolean);
  let total = 0;
  for (const word of words) {
    const cleaned = word.replace(/[^a-záéíóúüñ]/g, "");
    if (!cleaned) continue;
    const matches = cleaned.match(/[aeiouáéíóúü]+/g);
    total += matches ? matches.length : 1;
  }
  return total;
}

export function SyllableCounterTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [text, setText] = useState("Hello world");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const count = countSyllables(text);
    return { count };
  }, [text]);

  async function copy() {
    const textOut = es ? `Sílabas: ${result.count}` : `Syllables: ${result.count}`;
    try {
      await navigator.clipboard.writeText(textOut);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setText("Hello world");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Sílabas estimadas" : "Estimated syllables"}</p>
        <p className="text-3xl font-semibold">{result.count}</p>
      </div>

      <div className="grid gap-4">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Texto" : "Text"}</span>
          <textarea value={text} onChange={(e) => setText(e.target.value)} className={fieldClass} />
        </label>
      </div>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "Hello world → 3" : "Hello world → 3"}</p>
        <p>{es ? "Calculadora de sílabas → 7" : "Syllable calculator → 6"}</p>
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
