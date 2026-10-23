import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

function calculateMode(numbers: number[]): { modes: number[]; message: string } | null {
  if (numbers.length === 0) return null;
  const freq: Record<number, number> = {};
  for (const n of numbers) {
    freq[n] = (freq[n] || 0) + 1;
  }
  let maxFreq = 0;
  for (const f of Object.values(freq)) {
    if (f > maxFreq) maxFreq = f;
  }
  if (maxFreq === 1) return { modes: [], message: "no-mode" };
  const modes = Object.keys(freq).map(Number).filter(k => freq[k] === maxFreq).sort((a, b) => a - b);
  return { modes, message: modes.length > 1 ? "multi" : "single" };
}

export function ModeCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [input, setInput] = useState("1, 2, 2, 3, 3, 3");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const parts = input.split(/[,\s]+/).map(s => s.trim()).filter(Boolean);
    const nums = parts.map(Number).filter(n => !isNaN(n) && isFinite(n));
    if (nums.length === 0) return null;
    return calculateMode(nums);
  }, [input]);

  async function copy() {
    if (!result || result.modes.length === 0) return;
    try {
      await navigator.clipboard.writeText(result.modes.join(", "));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { setCopied(false); }
  }

  function reset() {
    setInput("1, 2, 2, 3, 3, 3"); setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Moda" : "Mode"}</p>
        {result ? (
          result.modes.length > 0 ? (
            <p className="text-3xl font-semibold">{result.modes.join(", ")} {result.message === "multi" ? (es ? "(multimodal)" : "(multimodal)") : ""}</p>
          ) : (
            <p className="text-sm text-muted-foreground">{es ? "No hay moda (todos únicos)" : "No mode (all unique)"}</p>
          )
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Ingresa números válidos" : "Enter valid numbers"}</p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Números (separados por coma o espacio)" : "Numbers (comma or space separated)"}</span>
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} className={fieldClass} placeholder="1, 2, 2, 3" />
      </label>

      <p className="text-sm text-muted-foreground">
        {es ? "Encuentra el valor o valores más frecuentes en la lista." : "Find the most frequent value(s) in the list."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "1, 2, 2, 3, 3, 3 → 3" : "1, 2, 2, 3, 3, 3 → 3"}</p>
        <p>{es ? "5, 5, 7, 7, 9 → 5, 7 (multimodal)" : "5, 5, 7, 7, 9 → 5, 7 (multimodal)"}</p>
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
