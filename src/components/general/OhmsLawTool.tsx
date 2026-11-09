import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function OhmsLawTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [v, setV] = useState("");
  const [i, setI] = useState("");
  const [r, setR] = useState("");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const V = parseFloat(v);
    const I = parseFloat(i);
    const R = parseFloat(r);
    const hasV = v.trim() !== "" && !Number.isNaN(V);
    const hasI = i.trim() !== "" && !Number.isNaN(I);
    const hasR = r.trim() !== "" && !Number.isNaN(R);
    const count = [hasV, hasI, hasR].filter(Boolean).length;
    if (count !== 2) return null;
    if (!hasV && hasI && hasR) return { key: "V", value: I * R, unit: "V" };
    if (!hasI && hasV && hasR) return { key: "I", value: R !== 0 ? V / R : NaN, unit: "A" };
    if (!hasR && hasV && hasI) return { key: "R", value: I !== 0 ? V / I : NaN, unit: "Ω" };
    return null;
  }, [v, i, r]);

  const display = result && !Number.isNaN(result.value)
    ? `${result.value.toLocaleString(undefined, { maximumFractionDigits: 6 })} ${result.unit}`
    : null;

  async function copy() {
    if (!result || Number.isNaN(result.value)) return;
    const text = es
      ? `${result.key} = ${display}`
      : `${result.key} = ${display}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setV("");
    setI("");
    setR("");
    setCopied(false);
  }

  const labels = es
    ? { v: "Voltaje (V)", i: "Corriente (A)", r: "Resistencia (Ω)", result: "Resultado", enter: "Ingresá dos valores", invalid: "No se puede calcular (división por cero)", copy: "Copiar resultado", reset: "Reiniciar", copied: "Copiado" }
    : { v: "Voltage (V)", i: "Current (A)", r: "Resistance (Ω)", result: "Result", enter: "Enter any two values", invalid: "Cannot calculate (division by zero)", copy: "Copy result", reset: "Reset", copied: "Copied" };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-2">
        <p className="text-sm text-muted-foreground">{labels.result}</p>
        <p className="text-lg font-medium">
          {display ?? (result && Number.isNaN(result.value) ? labels.invalid : labels.enter)}
        </p>
        {result && !Number.isNaN(result.value) && (
          <p className="text-sm text-muted-foreground">
            {es ? `Calculando ${result.key}` : `Solving for ${result.key}`}
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{labels.v}</span>
          <input type="number" step="any" value={v} onChange={(e) => setV(e.target.value)} className={fieldClass} placeholder="12" />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{labels.i}</span>
          <input type="number" step="any" value={i} onChange={(e) => setI(e.target.value)} className={fieldClass} placeholder="0.5" />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{labels.r}</span>
          <input type="number" step="any" value={r} onChange={(e) => setR(e.target.value)} className={fieldClass} placeholder="24" />
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy} disabled={!display}>
          {copied ? labels.copied : labels.copy}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {labels.reset}
        </button>
      </div>
    </div>
  );
}
