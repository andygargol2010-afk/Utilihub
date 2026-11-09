import { useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

function randomUuid(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  // fallback
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function UuidGeneratorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [uuids, setUuids] = useState<string[]>(() => [randomUuid()]);
  const [count, setCount] = useState("1");
  const [copied, setCopied] = useState(false);

  function generate() {
    const n = Math.max(1, Math.min(20, parseInt(count, 10) || 1));
    const list = Array.from({ length: n }, () => randomUuid());
    setUuids(list);
    setCopied(false);
  }

  async function copyAll() {
    const text = uuids.join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setUuids([randomUuid()]);
    setCount("1");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "UUID(s) generados" : "Generated UUID(s)"}</p>
        <div className="space-y-1 font-mono text-sm break-all">
          {uuids.map((u, i) => (
            <p key={i}>{u}</p>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Cantidad" : "Count"}</span>
          <input type="number" value={count} onChange={(e) => setCount(e.target.value)} className="w-24 rounded-xl border bg-background px-3 py-3 text-base" min="1" max="20" />
        </label>
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={generate}>
          {es ? "Generar" : "Generate"}
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copyAll}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar todo" : "Copy all"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
    </div>
  );
}
