import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function DueDateCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const today = new Date();
  const defaultLmp = new Date(today.getFullYear(), today.getMonth() - 2, 1);
  const defaultStr = defaultLmp.toISOString().slice(0, 10);

  const [lmpStr, setLmpStr] = useState(defaultStr);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (!lmpStr) return null;
    const lmp = new Date(lmpStr + "T00:00:00");
    if (isNaN(lmp.getTime()) || lmp > today) return null;
    const due = addDays(lmp, 280);
    const weeks = Math.floor((today.getTime() - lmp.getTime()) / (1000 * 60 * 60 * 24 * 7));
    return { due, weeks: Math.max(0, weeks) };
  }, [lmpStr, today]);

  async function copy() {
    if (!result) return;
    const textOut = es
      ? `Fecha probable de parto: ${result.due.toLocaleDateString()}. Semanas de gestación aproximadas: ${result.weeks}.`
      : `Estimated due date: ${result.due.toLocaleDateString()}. Approximate gestational weeks: ${result.weeks}.`;
    try {
      await navigator.clipboard.writeText(textOut);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setLmpStr(defaultStr);
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Fecha probable de parto" : "Estimated due date"}</p>
        {result ? (
          <>
            <p className="text-3xl font-semibold">{result.due.toLocaleDateString()}</p>
            <p className="text-sm text-muted-foreground">
              {es
                ? `Semanas de gestación aproximadas: ${result.weeks}`
                : `Approximate gestational weeks: ${result.weeks}`}
            </p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Ingresá una fecha de última regla válida en el pasado" : "Enter a valid past last menstrual period date"}</p>
        )}
      </div>

      <div className="grid gap-4">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Primer día de la última menstruación (FUM)" : "First day of last menstrual period (LMP)"}</span>
          <input type="date" value={lmpStr} onChange={(e) => setLmpStr(e.target.value)} className={fieldClass} max={today.toISOString().slice(0, 10)} />
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy} disabled={!result}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar resultado" : "Copy result"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
    </div>
  );
}
