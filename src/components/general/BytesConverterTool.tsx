import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.max(0, Math.floor(Math.log(bytes) / Math.log(k)));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function BytesConverterTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [input, setInput] = useState("1048576");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const n = parseFloat(input);
    if (isNaN(n) || n < 0 || n > 1e15) return null;
    return { human: formatBytes(n) };
  }, [input]);

  async function copy() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.human);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { setCopied(false); }
  }

  function reset() {
    setInput("1048576"); setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Tamaño legible" : "Human-readable size"}</p>
        {result ? (
          <p className="text-3xl font-semibold">{result.human}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Bytes ≥ 0 requeridos" : "Bytes ≥ 0 required"}</p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Bytes" : "Bytes"}</span>
        <input type="number" step="any" min="0" value={input} onChange={(e) => setInput(e.target.value)} className={fieldClass} />
      </label>

      <p className="text-sm text-muted-foreground">
        {es ? "Convierte bytes a B/KB/MB/GB/TB (base 1024)" : "Converts bytes to B/KB/MB/GB/TB (base 1024)"}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "1 048 576 bytes → 1 MB" : "1 048 576 bytes → 1 MB"}</p>
        <p>{es ? "1 073 741 824 bytes → 1 GB" : "1 073 741 824 bytes → 1 GB"}</p>
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
