import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function IvaCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [net, setNet] = useState("100");
  const [rate, setRate] = useState("21");
  const [mode, setMode] = useState<"add" | "extract">("add");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const n = parseFloat(net);
    const r = parseFloat(rate);
    if (!Number.isFinite(n) || !Number.isFinite(r) || n < 0 || r < 0 || r > 100 || Math.abs(n) > 1e12) return null;
    if (mode === "add") {
      const tax = n * (r / 100);
      const total = n + tax;
      return { tax: Math.round(tax * 100) / 100, total: Math.round(total * 100) / 100, base: n };
    }
    const base = n / (1 + r / 100);
    const tax = n - base;
    return { tax: Math.round(tax * 100) / 100, total: n, base: Math.round(base * 100) / 100 };
  }, [net, rate, mode]);

  async function copy() {
    if (!result) return;
    const text = es
      ? `Base: ${result.base} | IVA: ${result.tax} | Total: ${result.total}`
      : `Base: ${result.base} | Tax: ${result.tax} | Total: ${result.total}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setNet("100");
    setRate("21");
    setMode("add");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Resultado IVA / impuesto" : "VAT / sales tax result"}</p>
        {result ? (
          <div className="space-y-1">
            <p className="text-3xl font-semibold">{result.total}</p>
            <p className="text-sm text-muted-foreground">
              {es
                ? `Base: ${result.base} · IVA (${rate}%): ${result.tax}`
                : `Base: ${result.base} · Tax (${rate}%): ${result.tax}`}
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Introduce importe y tasa válidos (0–100%)" : "Enter valid amount and rate (0–100%)"}
          </p>
        )}
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          className={`${buttonClass} ${mode === "add" ? "bg-primary text-primary-foreground" : ""}`}
          onClick={() => setMode("add")}
        >
          {es ? "Sumar IVA" : "Add tax"}
        </button>
        <button
          type="button"
          className={`${buttonClass} ${mode === "extract" ? "bg-primary text-primary-foreground" : ""}`}
          onClick={() => setMode("extract")}
        >
          {es ? "Extraer IVA" : "Extract tax"}
        </button>
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">
          {mode === "add"
            ? es
              ? "Importe sin IVA"
              : "Amount before tax"
            : es
              ? "Importe con IVA"
              : "Amount with tax"}
        </span>
        <input
          type="number"
          value={net}
          onChange={(e) => setNet(e.target.value)}
          className={fieldClass}
          placeholder={es ? "Ej. 100" : "e.g. 100"}
        />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Tasa IVA (%)" : "Tax rate (%)"}</span>
        <input
          type="number"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
          className={fieldClass}
          placeholder={es ? "Ej. 21" : "e.g. 21"}
        />
      </label>

      <p className="text-sm text-muted-foreground">
        {es
          ? "Calcula el IVA o impuesto sobre ventas: suma al precio neto o extrae del precio bruto."
          : "Calculate VAT or sales tax: add to net price or extract from gross price."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "100 € + 21% → total 121 € (IVA 21 €)" : "100 + 21% → total 121 (tax 21)"}</p>
        <p>{es ? "121 € con 21% → base 100 € (IVA 21 €)" : "121 with 21% → base 100 (tax 21)"}</p>
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
