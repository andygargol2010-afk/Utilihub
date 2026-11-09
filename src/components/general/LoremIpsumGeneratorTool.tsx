import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

const LOREM = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

function generateLorem(paragraphs: number, wordsPer?: number): string {
  const words = LOREM.split(/\s+/);
  if (wordsPer && wordsPer > 0) {
    const text = [];
    for (let i = 0; i < wordsPer; i++) text.push(words[i % words.length]);
    return text.join(" ") + ".";
  }
  return Array.from({ length: paragraphs }, () => LOREM).join("\n\n");
}

export function LoremIpsumGeneratorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [paragraphs, setParagraphs] = useState("2");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const p = parseInt(paragraphs, 10);
    if (isNaN(p) || p < 1 || p > 20) return null;
    return generateLorem(p);
  }, [paragraphs]);

  async function copy() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setParagraphs("2");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Texto Lorem Ipsum" : "Lorem Ipsum text"}</p>
        {result ? (
          <pre className="text-sm whitespace-pre-wrap">{result}</pre>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Párrafos 1–20" : "Paragraphs 1–20"}</p>
        )}
      </div>

      <div className="grid gap-4">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Número de párrafos" : "Number of paragraphs"}</span>
          <input type="number" min="1" max="20" value={paragraphs} onChange={(e) => setParagraphs(e.target.value)} className={fieldClass} />
        </label>
      </div>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "1 párrafo → un bloque estándar" : "1 paragraph → standard block"}</p>
        <p>{es ? "3 párrafos → texto más largo" : "3 paragraphs → longer text"}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar" : "Copy"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
    </div>
  );
}
