import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";
type Mode = "extract" | "add";

const inputClass = "h-11 w-full rounded-xl border bg-background px-3 text-base";

const PRESETS = [
  { rate: "21", es: "21% general (AR/ES)", en: "21% standard (AR/ES)" },
  { rate: "10.5", es: "10,5% reducido (AR)", en: "10.5% reduced (AR)" },
  { rate: "19", es: "19% (CL/CO)", en: "19% (CL/CO)" },
  { rate: "16", es: "16% (MX)", en: "16% (MX)" },
  { rate: "10", es: "10% reducido", en: "10% reduced" },
];

function parseNum(value: string) {
  const n = Number(String(value).trim().replace(",", "."));
  return Number.isFinite(n) ? n : NaN;
}

function money(amount: number, currency: string, locale: Locale) {
  const formatted = amount.toLocaleString(locale === "es" ? "es-AR" : "en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return currency ? `${currency} ${formatted}` : formatted;
}

export function VatExtractorTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [mode, setMode] = useState<Mode>("extract");
  const [price, setPrice] = useState("1210");
  const [rate, setRate] = useState("21");
  const [currency, setCurrency] = useState("$");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const amount = parseNum(price);
    const taxRate = parseNum(rate);
    if (Number.isNaN(amount) || Number.isNaN(taxRate)) {
      return { error: es ? "Ingresá un precio y una tasa válidos." : "Enter a valid price and rate." };
    }
    if (amount < 0) {
      return { error: es ? "El precio no puede ser negativo." : "Price cannot be negative." };
    }
    if (taxRate < 0 || taxRate >= 100) {
      return { error: es ? "La tasa tiene que estar entre 0 y 100, sin incluir 100." : "Rate must be between 0 and 100, not including 100." };
    }
    const factor = taxRate / 100;
    if (mode === "extract") {
      const net = amount / (1 + factor);
      const vat = amount - net;
      return { net, vat, gross: amount, rate: taxRate };
    }
    const vat = amount * factor;
    const gross = amount + vat;
    return { net: amount, vat, gross, rate: taxRate };
  }, [es, mode, price, rate]);

  const summary = useMemo(() => {
    if ("error" in result) return result.error;
    const netLabel = es ? "Precio sin IVA" : "Price without VAT";
    const vatLabel = es ? "IVA" : "VAT";
    const grossLabel = es ? "Precio con IVA" : "Price with VAT";
    return [
      `${netLabel}: ${money(result.net, currency, locale)}`,
      `${vatLabel} (${result.rate}%): ${money(result.vat, currency, locale)}`,
      `${grossLabel}: ${money(result.gross, currency, locale)}`,
    ].join("\n");
  }, [currency, es, locale, result]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {es
          ? "Sacá el neto y el IVA de un precio con impuesto incluido, o sumá el IVA a un precio neto."
          : "Pull the net amount and VAT out of a tax-inclusive price, or add VAT to a net price."}
      </p>
      <div className="flex flex-wrap gap-2" role="group" aria-label={es ? "Dirección del cálculo" : "Calculation direction"}>
        {(
          [
            ["extract", es ? "Quitar IVA" : "Remove VAT"],
            ["add", es ? "Sumar IVA" : "Add VAT"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            className={`min-h-11 rounded-full border px-4 text-sm font-medium ${mode === value ? "border-primary bg-accent text-primary" : "bg-background"}`}
            onClick={() => setMode(value)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm font-medium">
            {mode === "extract" ? (es ? "Precio con IVA" : "Price with VAT") : es ? "Precio sin IVA" : "Price without VAT"}
          </span>
          <input className={inputClass} inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} />
        </label>
        <label className="space-y-1">
          <span className="text-sm font-medium">{es ? "Moneda (etiqueta)" : "Currency label"}</span>
          <input className={inputClass} value={currency} maxLength={8} onChange={(e) => setCurrency(e.target.value)} />
        </label>
      </div>
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">{es ? "Tasa de IVA" : "VAT rate"}</legend>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.rate}
              type="button"
              className={`min-h-11 rounded-full border px-4 text-sm font-medium ${rate === preset.rate ? "border-primary bg-accent text-primary" : "bg-background"}`}
              onClick={() => setRate(preset.rate)}
            >
              {es ? preset.es : preset.en}
            </button>
          ))}
        </div>
        <label className="block space-y-1">
          <span className="text-sm font-medium">{es ? "Tasa personalizada (%)" : "Custom rate (%)"}</span>
          <input className={inputClass} inputMode="decimal" value={rate} onChange={(e) => setRate(e.target.value)} />
        </label>
      </fieldset>
      <div className="rounded-2xl border bg-card p-4" aria-live="polite">
        {"error" in result ? (
          <p className="text-sm text-destructive">{result.error}</p>
        ) : (
          <dl className="grid gap-3 sm:grid-cols-3">
            <div>
              <dt className="text-xs text-muted-foreground">{es ? "Precio sin IVA" : "Price without VAT"}</dt>
              <dd className="text-lg font-semibold">{money(result.net, currency, locale)}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">{es ? "IVA" : "VAT"}</dt>
              <dd className="text-lg font-semibold">{money(result.vat, currency, locale)}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">{es ? "Precio con IVA" : "Price with VAT"}</dt>
              <dd className="text-lg font-semibold">{money(result.gross, currency, locale)}</dd>
            </div>
          </dl>
        )}
      </div>
      <button type="button" className="min-h-11 rounded-xl border px-4 text-sm font-medium" onClick={copy}>
        {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar resultado" : "Copy result"}
      </button>
    </div>
  );
}
