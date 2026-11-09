import { useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function HourlyRateTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [annual, setAnnual] = useState("60000");
  const [hours, setHours] = useState("40");
  const [weeks, setWeeks] = useState("52");
  const [copied, setCopied] = useState(false);

  const a = parseFloat(annual) || 0;
  const h = parseFloat(hours) || 0;
  const w = parseFloat(weeks) || 0;
  const totalHours = h * w;
  const valid = a >= 0 && h > 0 && w > 0;
  const hourly = valid && totalHours > 0 ? a / totalHours : 0;
  const monthly = hourly * (h * 52 / 12);

  const result = valid
    ? es
      ? `Tarifa horaria: ${hourly.toFixed(2)} | Mensual aprox: ${monthly.toFixed(2)}`
      : `Hourly rate: ${hourly.toFixed(2)} | Approx monthly: ${monthly.toFixed(2)}`
    : es
      ? "Horas y semanas deben ser mayores que 0"
      : "Hours and weeks must be greater than 0";

  async function copy() {
    if (!valid) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  function reset() {
    setAnnual("60000");
    setHours("40");
    setWeeks("52");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-2">
        <p className="text-sm text-muted-foreground">{es ? "Tarifa horaria" : "Hourly rate"}</p>
        <p className="text-3xl font-semibold">{valid ? hourly.toFixed(2) : "—"}</p>
        {valid && (
          <p className="text-sm text-muted-foreground">
            {es ? `Total horas/año: ${totalHours.toFixed(0)} | Mensual ~${monthly.toFixed(2)}` : `Total hours/year: ${totalHours.toFixed(0)} | Monthly ~${monthly.toFixed(2)}`}
          </p>
        )}
        {!valid && <p className="text-sm text-amber-600">{es ? "Ingresá horas y semanas > 0" : "Enter hours and weeks > 0"}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Salario anual" : "Annual salary"}</span>
          <input type="number" value={annual} onChange={(e) => setAnnual(e.target.value)} className={fieldClass} min="0" step="1000" />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Horas por semana" : "Hours per week"}</span>
          <input type="number" value={hours} onChange={(e) => setHours(e.target.value)} className={fieldClass} min="1" step="1" />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Semanas por año" : "Weeks per year"}</span>
          <input type="number" value={weeks} onChange={(e) => setWeeks(e.target.value)} className={fieldClass} min="1" step="1" />
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy} disabled={!valid}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar resultado" : "Copy result"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>{es ? "Reiniciar" : "Reset"}</button>
      </div>

      <div className="text-sm text-muted-foreground space-y-1">
        <p>{es ? "Ejemplo 1: 60000 anual, 40 h/sem, 52 sem → ~28.85/h" : "Example 1: 60000 annual, 40 h/wk, 52 wks → ~28.85/h"}</p>
        <p>{es ? "Ejemplo 2: 40000 anual, 30 h/sem, 50 sem → ~26.67/h" : "Example 2: 40000 annual, 30 h/wk, 50 wks → ~26.67/h"}</p>
      </div>
    </div>
  );
}
