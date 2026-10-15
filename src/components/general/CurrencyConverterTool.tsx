import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-2 text-sm";
const buttonClass = "h-10 rounded-xl border px-3 text-sm font-medium hover:bg-muted";
const primaryBtn = `${buttonClass} bg-primary text-primary-foreground`;

export function CurrencyConverterTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [amount, setAmount] = useState(100);
  const [rate, setRate] = useState(1.1);
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (rate <= 0) return null;
    const converted = amount * rate;
    return { converted, formatted: converted.toFixed(2) };
  }, [amount, rate]);

  function copy() {
    if (!result) return;
    const text = es
      ? `${amount} ${from} = ${result.formatted} ${to} (tasa ${rate})`
      : `${amount} ${from} = ${result.formatted} ${to} (rate ${rate})`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  function reset() {
    setAmount(100);
    setRate(1.1);
    setFrom("USD");
    setTo("EUR");
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="block space-y-1 text-sm">
          <span className="font-medium">{es ? "Cantidad" : "Amount"}</span>
          <input
            type="number"
            min={0}
            step="any"
            value={amount}
            onChange={(e) => setAmount(Math.max(0, Number(e.target.value) || 0))}
            className={fieldClass}
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span className="font-medium">{es ? "Tasa de cambio" : "Exchange rate"}</span>
          <input
            type="number"
            min={0}
            step="any"
            value={rate}
            onChange={(e) => setRate(Math.max(0, Number(e.target.value) || 0))}
            className={fieldClass}
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span className="font-medium">{es ? "De" : "From"}</span>
          <input
            type="text"
            value={from}
            onChange={(e) => setFrom(e.target.value.toUpperCase())}
            className={fieldClass}
            maxLength={5}
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span className="font-medium">{es ? "A" : "To"}</span>
          <input
            type="text"
            value={to}
            onChange={(e) => setTo(e.target.value.toUpperCase())}
            className={fieldClass}
            maxLength={5}
          />
        </label>
      </div>
      {result && (
        <div className="rounded-xl border bg-muted/30 p-4">
          <p className="text-sm font-medium">{es ? "Resultado" : "Result"}</p>
          <p className="text-2xl font-semibold mt-1">{result.formatted} {to}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {es ? `Tasa: 1 ${from} = ${rate} ${to}` : `Rate: 1 ${from} = ${rate} ${to}`}
          </p>
        </div>
      )}
      <div className="flex gap-2">
        <button type="button" className={primaryBtn} onClick={copy} disabled={!result}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar resultado" : "Copy result"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
      <p className="text-xs text-muted-foreground">
        {es
          ? "Ingresa la cantidad y la tasa de cambio para convertir entre monedas. La tasa debe ser el valor de 1 unidad de la moneda origen en la moneda destino."
          : "Enter the amount and exchange rate to convert between currencies. The rate is the value of 1 unit of the source currency in the target currency."}
      </p>
    </div>
  );
}
