import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";
import { formatMs, parseBpm } from "@/lib/general/bpm-delay";

type Locale = "en" | "es";

const inputClass = "h-11 w-full rounded-xl border bg-background px-3 text-base";
const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

export function BpmDelayTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [raw, setRaw] = useState("120");
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => parseBpm(raw), [raw]);

  const statusText = (() => {
    if (result.status === "empty") return es ? "Escribí un BPM entre 20 y 300." : "Type a BPM between 20 and 300.";
    if (result.status === "invalid") return es ? "Usá un número entre 20 y 300." : "Use a number between 20 and 300.";
    return es ? `${result.bpm} BPM · negra ${formatMs(result.quarterMs ?? 0)} ms` : `${result.bpm} BPM · quarter ${formatMs(result.quarterMs ?? 0)} ms`;
  })();

  const summary = [
    result.bpm == null ? (es ? "Sin tempo" : "No tempo") : `${result.bpm} BPM`,
    result.hz == null ? "" : `${result.hz.toFixed(2)} Hz`,
    ...result.rows.map((row) => `${es ? row.es : row.en}: ${formatMs(row.ms)} ms`),
  ]
    .filter(Boolean)
    .join("\n");

  async function copy() {
    if (result.status !== "ok") return;
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="space-y-4">
      <label className="block space-y-1 text-sm">
        <span>{es ? "Tempo (BPM)" : "Tempo (BPM)"}</span>
        <input
          className={inputClass}
          inputMode="decimal"
          autoComplete="off"
          spellCheck={false}
          value={raw}
          onChange={(event) => setRaw(event.target.value)}
        />
      </label>
      <div className="flex flex-wrap gap-2">
        {["90", "120", "140"].map((preset) => (
          <button key={preset} type="button" className={buttonClass} onClick={() => setRaw(preset)}>
            {preset}
          </button>
        ))}
        <button type="button" className={buttonClass} onClick={copy}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar" : "Copy"}
        </button>
        <button type="button" className={buttonClass} onClick={() => setRaw("120")}>
          {es ? "Restablecer" : "Reset"}
        </button>
      </div>
      <div className="rounded-2xl border p-4 text-sm">
        <p className="font-medium">{statusText}</p>
        {result.status === "ok" ? (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[16rem] text-left">
              <thead>
                <tr className="text-muted-foreground">
                  <th className="py-1 font-medium">{es ? "Figura" : "Note"}</th>
                  <th className="py-1 font-medium">ms</th>
                </tr>
              </thead>
              <tbody>
                {result.rows.map((row) => (
                  <tr key={row.id} className="border-t">
                    <td className="py-1.5">{es ? row.es : row.en}</td>
                    <td className="py-1.5 tabular-nums">{formatMs(row.ms)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-3 text-muted-foreground">{result.hz?.toFixed(2)} Hz</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
