import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function SuccessiveDiscountCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [price, setPrice] = useState("100");
  const [d1, setD1] = useState("20");
  const [d2, setD2] = useState("10");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const p = parseFloat(price);
    const a = parseFloat(d1);
    const b = parseFloat(d2);
    if (!Number.isFinite(p) || p <= 0 || !Number.isFinite(a) || !Number.isFinite(b) || a < 0 || b < 0 || a > 100 || b > 100) return null;
    const after1 = p * (1 - a / 100);
    const final = after1 * (1 - b / 100);
    const saved = p - final;
    const effective = (saved / p) * 100;
    return {
      final: Math.round(final * 100) / 100,
      saved: Math.round(saved * 100) / 100,
      effective: Math.round(effective * 100) / 100,
    };
  }, [price, d1, d2]);

  async function copy() {
    if (!result) return;
    const text = es
      ? `Precio final: ${result.final} (ahorro ${result.saved}, efectivo ${result.effective}%)`
      : `Final price: ${result.final} (saved ${result.saved}, effective ${result.effective}%)`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setPrice("100");
    setD1("20");
    setD2("10");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Resultado" : "Result"}</p>
        {result ? (
          <div className="space-y-1">
            <p className="text-3xl font-semibold">{es ? `Precio final: ${result.final}` : `Final price: ${result.final}`}</p>
            <p className="text-lg font-medium">{es ? `Ahorro: ${result.saved} (efectivo ${result.effective}%)` : `Saved: ${result.saved} (effective ${result.effective}%)`}</p>
            <p className="text-sm text-muted-foreground">
              {es ? `final = precio × (1 - d1/100) × (1 - d2/100)` : `final = price × (1 - d1/100) × (1 - d2/100)`}
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Introduce precio > 0 y descuentos 0–100%" : "Enter price > 0 and discounts 0–100%"}
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Precio original" : "Original price"}</span>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className={fieldClass} placeholder="100" min="0" step="any" />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Descuento 1 (%)" : "Discount 1 (%)"}</span>
          <input type="number" value={d1} onChange={(e) => setD1(e.target.value)} className={fieldClass} placeholder="20" min="0" max="100" step="any" />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Descuento 2 (%)" : "Discount 2 (%)"}</span>
          <input type="number" value={d2} onChange={(e) => setD2(e.target.value)} className={fieldClass} placeholder="10" min="0" max="100" step="any" />
        </label>
      </div>

      <p className="text-sm text-muted-foreground">
        {es
          ? "Los descuentos se aplican en secuencia. Un 20% + 10% no es 30%; el segundo se calcula sobre el precio ya reducido."
          : "Discounts are applied sequentially. 20% + 10% is not 30%; the second is calculated on the already reduced price."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "100 con 20% luego 10% → 72 (ahorro 28, efectivo 28%)" : "100 with 20% then 10% → 72 (saved 28, effective 28%)"}</p>
        <p>{es ? "80 con 15% luego 5% → 64.6 (ahorro 15.4, efectivo 19.25%)" : "80 with 15% then 5% → 64.6 (saved 15.4, effective 19.25%)"}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar resultado" : "Copy result"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>

      <div className="text-sm text-muted-foreground space-y-1">
        <p className="font-medium">{es ? "Herramientas relacionadas" : "Related tools"}</p>
        <p>
          <a href={es ? "/es/calculadora-descuento" : "/calculadora-descuento"} className="underline">
            {es ? "Calculadora de descuento" : "Discount calculator"}
          </a>
          {" · "}
          <a href={es ? "/es/calculadora-porcentaje-de-numero" : "/calculadora-porcentaje-de-numero"} className="underline">
            {es ? "Calculadora de porcentaje de un número" : "Percentage of number calculator"}
          </a>
        </p>
      </div>
    </div>
  );
}
