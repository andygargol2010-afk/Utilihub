import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";
import { evaluateDecibels, formatDb } from "@/lib/general/decibel";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

const EXAMPLES = ["60\n60", "70\n60", "85\n82\n78"];

export function DecibelTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [raw, setRaw] = useState(EXAMPLES[0]);
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => evaluateDecibels(raw), [raw]);

  async function copy(text: string) {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setRaw(EXAMPLES[0]);
    setCopied(false);
  }

  const status = result.status === "ok"
    ? (es ? "Suma logarítmica lista." : "Logarithmic sum ready.")
    : result.status === "empty"
      ? (es ? "Ingresá al menos un nivel en dB." : "Enter at least one level in dB.")
      : (es ? `Valor no válido: ${result.message}. Usá números entre -200 y 200.` : `Invalid value: ${result.message}. Use numbers from -200 to 200.`);

  const copyText = result.status === "ok" && result.combined != null
    ? `${formatDb(result.combined)} dB`
    : "";

  return (
    <div className="space-y-4">
      <label className="block space-y-2">
        <span className="text-sm font-medium">{es ? "Niveles (dB), uno por línea" : "Levels (dB), one per line"}</span>
        <textarea
          className={`${fieldClass} min-h-32 font-mono`}
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          autoComplete="off"
          spellCheck={false}
          placeholder="60\n60"
          aria-label={es ? "Niveles de sonido en decibelios" : "Sound levels in decibels"}
        />
      </label>
      <div className="flex flex-wrap gap-2">
        {EXAMPLES.map((ex) => (
          <button key={ex} type="button" className={buttonClass} onClick={() => setRaw(ex)}>
            {ex.replace(/\n/g, " + ")}
          </button>
        ))}
        <button type="button" className={buttonClass} onClick={reset}>{es ? "Reiniciar" : "Reset"}</button>
      </div>
      <p className="text-sm text-muted-foreground">{status}</p>
      {result.status === "ok" && result.combined != null && result.linearSum != null ? (
        <dl className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-border p-4">
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">{es ? "Nivel combinado" : "Combined level"}</dt>
            <dd className="mt-1 font-mono text-sm font-semibold">{formatDb(result.combined)} dB</dd>
          </div>
          <div className="rounded-xl border border-border p-4">
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">{es ? "Suma lineal (incorrecta)" : "Linear sum (wrong)"}</dt>
            <dd className="mt-1 font-mono text-sm font-semibold">{formatDb(result.linearSum)} dB</dd>
          </div>
        </dl>
      ) : null}
      {copyText ? (
        <button type="button" className={buttonClass} onClick={() => copy(copyText)}>
          {copied ? (es ? "Copiado" : "Copied") : (es ? "Copiar" : "Copy")}
        </button>
      ) : null}
    </div>
  );
}
