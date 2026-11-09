import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";
import { type Locale } from "./TimeOfDayDifferenceCalculatorTool.part1";
import { parseTime, fieldClass, buttonClass } from "./TimeOfDayDifferenceCalculatorTool.part2";

export function TimeOfDayDifferenceCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("17:00");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const a = parseTime(start);
    const b = parseTime(end);
    if (!a || !b) return { error: es ? "Formato HH:MM inválido (00:00–23:59)" : "Invalid HH:MM format (00:00–23:59)" };
    let mins = (b.h * 60 + b.m) - (a.h * 60 + a.m);
    let overnight = false;
    if (mins < 0) {
      mins += 24 * 60;
      overnight = true;
    }
    if (mins === 0) return { error: es ? "Los horarios son iguales" : "Times are identical" };
    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;
    return { hours, minutes, totalMins: mins, overnight, a, b };
  }, [start, end, es]);

  async function copy() {
    if (!result || "error" in result) return;
    const text = es
      ? `${start} → ${end}${result.overnight ? " (+1 día)" : ""}: ${result.hours} h ${result.minutes} min`
      : `${start} → ${end}${result.overnight ? " (+1 day)" : ""}: ${result.hours} h ${result.minutes} min`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setStart("09:00");
    setEnd("17:00");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Diferencia de tiempo" : "Time difference"}</p>
        {result && !("error" in result) ? (
          <div className="space-y-1">
            <p className="text-lg font-semibold">{result.hours} h {result.minutes} min</p>
            <p className="text-sm text-muted-foreground">
              {result.totalMins} min{result.overnight ? (es ? " (incluye día siguiente)" : " (includes next day)") : ""}
            </p>
          </div>
        ) : result && "error" in result ? (
          <p className="text-sm text-destructive">{result.error}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Introduce horarios válidos" : "Enter valid times"}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Hora inicio (HH:MM)" : "Start time (HH:MM)"}</span>
          <input type="text" value={start} onChange={(e) => setStart(e.target.value)} className={fieldClass} placeholder="09:00" />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Hora fin (HH:MM)" : "End time (HH:MM)"}</span>
          <input type="text" value={end} onChange={(e) => setEnd(e.target.value)} className={fieldClass} placeholder="17:00" />
        </label>
      </div>

      <p className="text-sm text-muted-foreground">
        {es
          ? "Formato 24 h. Si la hora fin es anterior a la de inicio, se asume el día siguiente (turnos nocturnos)."
          : "24-hour format. If end is earlier than start, next day is assumed (overnight shifts)."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "09:00 → 17:00 = 8 h 0 min" : "09:00 → 17:00 = 8 h 0 min"}</p>
        <p>{es ? "22:30 → 06:15 = 7 h 45 min (overnight)" : "22:30 → 06:15 = 7 h 45 min (overnight)"}</p>
      </div>

      <div className="text-sm space-y-1">
        <p className="font-medium">{es ? "Herramientas relacionadas" : "Related tools"}</p>
        <p>
          <a href={es ? "/es/herramientas/calculadora-horas-a-decimal" : "/tools/calculadora-horas-a-decimal"} className="underline text-primary">
            {es ? "Horas a decimal" : "Hours to decimal"}
          </a>
          {" · "}
          <a href={es ? "/es/herramientas/conversor-zonas-horarias" : "/tools/conversor-zonas-horarias"} className="underline text-primary">
            {es ? "Conversor de zonas horarias" : "Timezone converter"}
          </a>
        </p>
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
