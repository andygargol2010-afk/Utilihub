import { useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

function formatMoney(n: number, locale: Locale) {
  return n.toLocaleString(locale === "es" ? "es-ES" : "en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function BillSplitTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [total, setTotal] = useState("85.40");
  const [tipPct, setTipPct] = useState("15");
  const [people, setPeople] = useState("4");
  const [roundTo, setRoundTo] = useState("0.01");
  const [copied, setCopied] = useState(false);

  const totalNum = Math.max(0, parseFloat(total) || 0);
  const tipNum = Math.max(0, parseFloat(tipPct) || 0);
  const peopleNum = Math.max(1, Math.floor(parseFloat(people) || 1));
  const tipAmount = totalNum * (tipNum / 100);
  const grandTotal = totalNum + tipAmount;
  const rawShare = grandTotal / peopleNum;

  let share = rawShare;
  const step = parseFloat(roundTo) || 0.01;
  if (step > 0.01) {
    share = Math.round(rawShare / step) * step;
  }

  const summary = es
    ? `Total con propina: ${formatMoney(grandTotal, "es")} · ${peopleNum} personas · ${formatMoney(share, "es")} c/u`
    : `Total with tip: ${formatMoney(grandTotal, "en")} · ${peopleNum} people · ${formatMoney(share, "en")} each`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setTotal("85.40");
    setTipPct("15");
    setPeople("4");
    setRoundTo("0.01");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Por persona" : "Per person"}</p>
        <p className="text-3xl font-semibold">{formatMoney(share, locale)}</p>
        <p className="text-sm">
          {es ? "Total con propina" : "Total with tip"}: {formatMoney(grandTotal, locale)} · {es ? "Propina" : "Tip"}:{" "}
          {formatMoney(tipAmount, locale)}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Total de la cuenta" : "Bill total"}</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={total}
            onChange={(e) => setTotal(e.target.value)}
            className={fieldClass}
          />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Propina (%)" : "Tip (%)"}</span>
          <input
            type="number"
            min="0"
            step="1"
            value={tipPct}
            onChange={(e) => setTipPct(e.target.value)}
            className={fieldClass}
          />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Personas" : "People"}</span>
          <input
            type="number"
            min="1"
            step="1"
            value={people}
            onChange={(e) => setPeople(e.target.value)}
            className={fieldClass}
          />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Redondear a" : "Round to"}</span>
          <select value={roundTo} onChange={(e) => setRoundTo(e.target.value)} className={fieldClass}>
            <option value="0.01">0.01</option>
            <option value="0.50">0.50</option>
            <option value="1">1.00</option>
          </select>
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar resumen" : "Copy summary"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
    </div>
  );
}
