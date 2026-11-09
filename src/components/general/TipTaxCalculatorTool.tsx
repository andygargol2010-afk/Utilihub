import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function TipTaxCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [subtotal, setSubtotal] = useState("50");
  const [taxPct, setTaxPct] = useState("8");
  const [tipPct, setTipPct] = useState("15");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const s = parseFloat(subtotal);
    const tax = parseFloat(taxPct);
    const tip = parseFloat(tipPct);
    if (isNaN(s) || isNaN(tax) || isNaN(tip) || s < 0 || tax < 0 || tip < 0) return null;
    const taxAmount = s * (tax / 100);
    const afterTax = s + taxAmount;
    const tipAmount = afterTax * (tip / 100);
    const total = afterTax + tipAmount;
    return {
      taxAmount: Math.round(taxAmount * 100) / 100,
      tipAmount: Math.round(tipAmount * 100) / 100,
      total: Math.round(total * 100) / 100,
    };
  }, [subtotal, taxPct, tipPct]);

  async function copy() {
    if (!result) return;
    const textOut = es
      ? `Impuesto: ${result.taxAmount} | Propina: ${result.tipAmount} | Total: ${result.total}`
      : `Tax: ${result.taxAmount} | Tip: ${result.tipAmount} | Total: ${result.total}`;
    try {
      await navigator.clipboard.writeText(textOut);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setSubtotal("50");
    setTaxPct("8");
    setTipPct("15");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Total con impuesto y propina" : "Total with tax and tip"}</p>
        {result ? (
          <>
            <p className="text-3xl font-semibold">{result.total}</p>
            <p className="text-sm">{es ? `Impuesto: ${result.taxAmount} · Propina: ${result.tipAmount}` : `Tax: ${result.taxAmount} · Tip: ${result.tipAmount}`}</p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Introduce valores válidos" : "Enter valid values"}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Subtotal" : "Subtotal"}</span>
          <input type="number" step="any" min="0" value={subtotal} onChange={(e) => setSubtotal(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Impuesto (%)" : "Tax (%)"}</span>
          <input type="number" step="any" min="0" value={taxPct} onChange={(e) => setTaxPct(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Propina (%)" : "Tip (%)"}</span>
          <input type="number" step="any" min="0" value={tipPct} onChange={(e) => setTipPct(e.target.value)} className={fieldClass} />
        </label>
      </div>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "50 + 8% impuesto + 15% propina → total 62.10" : "50 + 8% tax + 15% tip → total 62.10"}</p>
        <p>{es ? "100 + 10% impuesto + 18% propina → total 129.80" : "100 + 10% tax + 18% tip → total 129.80"}</p>
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
