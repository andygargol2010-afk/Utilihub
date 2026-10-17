import { useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function TipCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [bill, setBill] = useState("100");
  const [percent, setPercent] = useState("15");
  const [people, setPeople] = useState("1");
  const [copied, setCopied] = useState(false);

  const billNum = Math.max(0, parseFloat(bill) || 0);
  const percentNum = Math.max(0, parseFloat(percent) || 0);
  const peopleNum = Math.max(1, parseInt(people) || 1);

  const tip = billNum * (percentNum / 100);
  const total = billNum + tip;
  const perPerson = total / peopleNum;

  async function copy() {
    const text = es
      ? `Propina: ${tip.toFixed(2)}\nTotal: ${total.toFixed(2)}\nPor persona: ${perPerson.toFixed(2)}`
      : `Tip: ${tip.toFixed(2)}\nTotal: ${total.toFixed(2)}\nPer person: ${perPerson.toFixed(2)}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setBill("100");
    setPercent("15");
    setPeople("1");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-2">
        <p className="text-sm text-muted-foreground">{es ? "Resultados" : "Results"}</p>
        <p className="text-lg font-medium">{es ? "Propina" : "Tip"}: ${tip.toFixed(2)}</p>
        <p className="text-lg font-medium">{es ? "Total" : "Total"}: ${total.toFixed(2)}</p>
        <p className="text-lg font-medium">{es ? "Por persona" : "Per person"}: ${perPerson.toFixed(2)}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Cuenta" : "Bill"}</span>
          <input type="number" value={bill} onChange={(e) => setBill(e.target.value)} className={fieldClass} min="0" step="0.01" />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Propina %" : "Tip %"}</span>
          <input type="number" value={percent} onChange={(e) => setPercent(e.target.value)} className={fieldClass} min="0" step="1" />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Personas" : "People"}</span>
          <input type="number" value={people} onChange={(e) => setPeople(e.target.value)} className={fieldClass} min="1" step="1" />
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar resultados" : "Copy results"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
    </div>
  );
}
