import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

function toDateInputValue(d: Date) {
  return d.toISOString().slice(0, 10);
}

export function DaysUntilDateCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const today = toDateInputValue(new Date());
  const [target, setTarget] = useState(() => {
    const t = new Date();
    t.setDate(t.getDate() + 30);
    return toDateInputValue(t);
  });
  const [start, setStart] = useState(today);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (!target || !start) return null;
    const t = new Date(target + "T12:00:00");
    const s = new Date(start + "T12:00:00");
    if (isNaN(t.getTime()) || isNaN(s.getTime())) return null;
    const diffMs = t.getTime() - s.getTime();
    const days = Math.round(diffMs / (1000 * 60 * 60 * 24));
    return { days, abs: Math.abs(days), past: days < 0 };
  }, [target, start]);

  async function copy() {
    if (!result) return;
    const textOut = es
      ? result.past
        ? `Han pasado ${result.abs} días desde ${start} hasta ${target}`
        : `Faltan ${result.days} días desde ${start} hasta ${target}`
      : result.past
        ? `${result.abs} days have passed from ${start} to ${target}`
        : `${result.days} days until ${target} from ${start}`;
    try {
      await navigator.clipboard.writeText(textOut);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    const t = new Date();
    t.setDate(t.getDate() + 30);
    setTarget(toDateInputValue(t));
    setStart(today);
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Días hasta la fecha" : "Days until date"}</p>
        {result ? (
          <p className="text-3xl font-semibold">
            {result.past
              ? es
                ? `${result.abs} días atrás`
                : `${result.abs} days ago`
              : es
                ? `${result.days} días`
                : `${result.days} days`}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Elige fechas válidas" : "Choose valid dates"}</p>
        )}
      </div>

      <div className="grid gap-4">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Fecha objetivo" : "Target date"}</span>
          <input type="date" value={target} onChange={(e) => setTarget(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Fecha de inicio" : "Start date"}</span>
          <input type="date" value={start} onChange={(e) => setStart(e.target.value)} className={fieldClass} />
        </label>
      </div>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "Hoy → +30 días = 30 días" : "Today → +30 days = 30 days"}</p>
        <p>{es ? "Fecha pasada muestra “días atrás”" : "Past date shows “days ago”"}</p>
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
