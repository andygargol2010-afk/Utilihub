import { useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base font-mono text-sm";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function LineSorterTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [input, setInput] = useState("apple\nbanana\napple\ncherry\nbanana");
  const [sort, setSort] = useState(true);
  const [removeDupes, setRemoveDupes] = useState(true);
  const [trim, setTrim] = useState(true);
  const [copied, setCopied] = useState(false);

  const lines = input.split(/\r?\n/);
  let processed = lines.map((l) => (trim ? l.trim() : l)).filter((l) => l.length > 0 || !trim);
  if (removeDupes) {
    const seen = new Set<string>();
    processed = processed.filter((l) => {
      if (seen.has(l)) return false;
      seen.add(l);
      return true;
    });
  }
  if (sort) {
    processed = [...processed].sort((a, b) => a.localeCompare(b));
  }
  const result = processed.join("\n");
  const valid = input.length > 0;

  async function copy() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  function reset() {
    setInput("apple\nbanana\napple\ncherry\nbanana");
    setSort(true);
    setRemoveDupes(true);
    setTrim(true);
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-2">
        <p className="text-sm text-muted-foreground">{es ? "Resultado" : "Result"}</p>
        <pre className="text-sm whitespace-pre-wrap font-mono min-h-[60px]">{result || (es ? "(vacío)" : "(empty)")}</pre>
        <p className="text-sm text-muted-foreground">{es ? `${processed.length} líneas` : `${processed.length} lines`}</p>
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Texto (una línea por ítem)" : "Text (one item per line)"}</span>
        <textarea value={input} onChange={(e) => setInput(e.target.value)} className={fieldClass} rows={6} placeholder={es ? "Pega tu lista aquí" : "Paste your list here"} />
      </label>

      <div className="flex flex-wrap gap-4 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={sort} onChange={(e) => setSort(e.target.checked)} />
          {es ? "Ordenar A-Z" : "Sort A-Z"}
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={removeDupes} onChange={(e) => setRemoveDupes(e.target.checked)} />
          {es ? "Eliminar duplicados" : "Remove duplicates"}
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={trim} onChange={(e) => setTrim(e.target.checked)} />
          {es ? "Recortar espacios" : "Trim whitespace"}
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy} disabled={!result}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar resultado" : "Copy result"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>{es ? "Reiniciar" : "Reset"}</button>
      </div>

      <div className="text-sm text-muted-foreground space-y-1">
        <p>{es ? "Ejemplo 1: lista con dups → ordenada y sin repetir" : "Example 1: list with dups → sorted unique"}</p>
        <p>{es ? "Ejemplo 2: desactiva ordenar para mantener orden original al quitar dups" : "Example 2: uncheck sort to preserve original order when removing dups"}</p>
      </div>
    </div>
  );
}
