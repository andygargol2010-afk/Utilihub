import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function AttendancePercentageCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [total, setTotal] = useState("20");
  const [attended, setAttended] = useState("18");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const t = parseFloat(total);
    const a = parseFloat(attended);
    if (!Number.isFinite(t) || !Number.isFinite(a) || t <= 0 || a < 0 || a > t) return null;
    const pct = (a / t) * 100;
    return { pct: Math.round(pct * 100) / 100 };
  }, [total, attended]);

  async function copy() {
    if (!result) return;
    const text = es
      ? `Asistencia: ${result.pct}% (${attended}/${total})`
      : `Attendance: ${result.pct}% (${attended}/${total})`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setTotal("20");
    setAttended("18");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Porcentaje de asistencia" : "Attendance percentage"}</p>
        {result ? (
          <p className="text-3xl font-semibold">{result.pct}%</p>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Total > 0, asistidas 0–total" : "Total > 0, attended 0–total"}
          </p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Clases totales" : "Total classes"}</span>
        <input type="number" value={total} onChange={(e) => setTotal(e.target.value)} className={fieldClass} placeholder="20" />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Clases asistidas" : "Classes attended"}</span>
        <input type="number" value={attended} onChange={(e) => setAttended(e.target.value)} className={fieldClass} placeholder="18" />
      </label>

      <p className="text-sm text-muted-foreground">
        {es ? "Calcula el porcentaje de asistencia a clases o reuniones." : "Calculate attendance percentage for classes or meetings."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "20 totales, 18 asistidas → 90%" : "20 total, 18 attended → 90%"}</p>
        <p>{es ? "30 totales, 25 asistidas → 83.33%" : "30 total, 25 attended → 83.33%"}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar" : "Copy"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
    </div>
  );
}
