import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function TravelBudgetCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [daily, setDaily] = useState("100");
  const [days, setDays] = useState("7");
  const [people, setPeople] = useState("2");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const d = parseFloat(daily);
    const dy = parseFloat(days);
    const p = parseFloat(people);
    if (isNaN(d) || isNaN(dy) || isNaN(p) || d < 0 || dy <= 0 || p <= 0) return null;
    const total = d * dy * p;
    return { total: Math.round(total * 100) / 100, daily: d, days: dy, people: p };
  }, [daily, days, people]);

  async function copy() {
    if (!result) return;
    const textOut = es
      ? `Total: ${result.total} (diario ${result.daily} × ${result.days} días × ${result.people} personas)`
      : `Total: ${result.total} (daily ${result.daily} × ${result.days} days × ${result.people} people)`;
    try {
      await navigator.clipboard.writeText(textOut);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setDaily("100");
    setDays("7");
    setPeople("2");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Presupuesto total" : "Total budget"}</p>
        {result ? (
          <p className="text-3xl font-semibold">{result.total}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Valores ≥ 0, días y personas > 0" : "Values ≥ 0, days & people > 0"}</p>
        )}
      </div>

      <div className="grid gap-4">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Presupuesto diario" : "Daily budget"}</span>
          <input type="number" step="any" min="0" value={daily} onChange={(e) => setDaily(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Días" : "Days"}</span>
          <input type="number" step="any" min="1" value={days} onChange={(e) => setDays(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Personas" : "People"}</span>
          <input type="number" step="any" min="1" value={people} onChange={(e) => setPeople(e.target.value)} className={fieldClass} />
        </label>
      </div>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "100 diario, 7 días, 2 personas → 1400" : "100 daily, 7 days, 2 people → 1400"}</p>
        <p>{es ? "50 diario, 3 días, 1 persona → 150" : "50 daily, 3 days, 1 person → 150"}</p>
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
