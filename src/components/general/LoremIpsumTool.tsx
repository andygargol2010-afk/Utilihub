import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const LOREM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

const WORDS = LOREM.split(/\s+/);

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function LoremIpsumTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [mode, setMode] = useState<"paragraphs" | "words">("paragraphs");
  const [count, setCount] = useState("3");
  const [copied, setCopied] = useState(false);

  const text = useMemo(() => {
    const n = Math.max(1, Math.min(20, parseInt(count, 10) || 1));
    if (mode === "paragraphs") {
      return Array.from({ length: n }, () => LOREM).join("\n\n");
    }
    const needed = n;
    const result: string[] = [];
    let i = 0;
    while (result.length < needed) {
      result.push(WORDS[i % WORDS.length]);
      i++;
    }
    return result.join(" ") + ".";
  }, [mode, count]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setMode("paragraphs");
    setCount("3");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Modo" : "Mode"}</span>
          <select value={mode} onChange={(e) => setMode(e.target.value as typeof mode)} className={fieldClass}>
            <option value="paragraphs">{es ? "Párrafos" : "Paragraphs"}</option>
            <option value="words">{es ? "Palabras" : "Words"}</option>
          </select>
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Cantidad" : "Count"}</span>
          <input
            type="number"
            min="1"
            max="20"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            className={fieldClass}
          />
        </label>
      </div>

      <div className="rounded-2xl border bg-muted/30 p-6">
        <p className="whitespace-pre-wrap text-sm leading-relaxed">{text}</p>
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
