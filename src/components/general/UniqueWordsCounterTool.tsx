import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base min-h-[140px]";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

function countUnique(text: string) {
  const words = text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s'-]/gu, " ")
    .split(/\s+/)
    .filter((w) => w.length > 0);
  const set = new Set(words);
  return { total: words.length, unique: set.size };
}

export function UniqueWordsCounterTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [text, setText] = useState(
    es
      ? "El gato negro saltó. El gato blanco miró. Gato y perro."
      : "The black cat jumped. The white cat looked. Cat and dog.",
  );
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => countUnique(text), [text]);

  async function copy() {
    const textOut = es
      ? `Palabras únicas: ${result.unique} (total ${result.total})`
      : `Unique words: ${result.unique} (total ${result.total})`;
    try {
      await navigator.clipboard.writeText(textOut);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setText(
      es
        ? "El gato negro saltó. El gato blanco miró. Gato y perro."
        : "The black cat jumped. The white cat looked. Cat and dog.",
    );
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Palabras únicas" : "Unique words"}</p>
        <p className="text-3xl font-semibold">{result.unique}</p>
        <p className="text-sm text-muted-foreground">
          {es ? `Total de palabras: ${result.total}` : `Total words: ${result.total}`}
        </p>
      </div>

      <div className="grid gap-4">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Texto" : "Text"}</span>
          <textarea value={text} onChange={(e) => setText(e.target.value)} className={fieldClass} rows={6} />
        </label>
      </div>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? '"gato gato perro" → 2 únicas (3 total)' : '"cat cat dog" → 2 unique (3 total)'}</p>
        <p>{es ? "Mayúsculas y puntuación se normalizan" : "Case and punctuation are normalized"}</p>
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
