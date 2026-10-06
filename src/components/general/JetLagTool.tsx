import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";
import { laPreset, londonPreset, parseClock, planJetLag } from "@/lib/general/jetlag";

type Locale = "en" | "es";

const inputClass = "h-11 w-full rounded-xl border bg-background px-3 text-base";
const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

export function JetLagTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const preset = londonPreset();
  const [originOffset, setOriginOffset] = useState(preset.originOffset);
  const [destOffset, setDestOffset] = useState(preset.destOffset);
  const [bedtime, setBedtime] = useState(preset.bedtime);
  const [daysBefore, setDaysBefore] = useState(preset.daysBefore);
  const [east, setEast] = useState(preset.east);
  const [west, setWest] = useState(preset.west);
  const [copied, setCopied] = useState(false);

  const plan = useMemo(() => {
    const bedtimeMinutes = parseClock(bedtime);
    if (bedtimeMinutes == null) return planJetLag({ originOffset: Number.NaN, destOffset: 0, bedtimeMinutes: 0, daysBefore: 0, eastHoursPerDay: 1, westHoursPerDay: 1 });
    return planJetLag({
      originOffset: originOffset.trim() === "" ? Number.NaN : Number(originOffset),
      destOffset: destOffset.trim() === "" ? Number.NaN : Number(destOffset),
      bedtimeMinutes,
      daysBefore: daysBefore.trim() === "" ? Number.NaN : Number(daysBefore),
      eastHoursPerDay: east.trim() === "" ? Number.NaN : Number(east),
      westHoursPerDay: west.trim() === "" ? Number.NaN : Number(west),
    });
  }, [originOffset, destOffset, bedtime, daysBefore, east, west]);

  const summary = useMemo(() => {
    if (!plan.ok) return "";
    const dir = plan.direction === "east" ? (es ? "este" : "east") : plan.direction === "west" ? (es ? "oeste" : "west") : es ? "sin desfase" : "no shift";
    const lines = plan.days.map((day) => `${es ? "Día" : "Day"} ${day.day}: ${day.bedtimeLabel} (${day.shiftHours > 0 ? "+" : ""}${day.shiftHours} h)`);
    return [`${es ? "Desfase" : "Shift"}: ${plan.shiftHours} h ${dir}`, `${es ? "Cama objetivo" : "Target bedtime"}: ${plan.targetBedtime}`, ...lines, `${es ? "Pendiente" : "Remaining"}: ${plan.remainingHours} h`].join("\n");
  }, [plan, es]);

  async function copyResult() {
    if (!summary) return;
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  function apply(next: ReturnType<typeof londonPreset>) {
    setOriginOffset(next.originOffset);
    setDestOffset(next.destOffset);
    setBedtime(next.bedtime);
    setDaysBefore(next.daysBefore);
    setEast(next.east);
    setWest(next.west);
  }

  const errorText = !plan.ok
    ? plan.error === "negative-days"
      ? es ? "Los días previos no pueden ser negativos." : "Days before the flight cannot be negative."
      : plan.error === "range"
        ? es ? "Offsets entre −12 y +14. La hora es HH:MM. El tope diario es 0–4 h." : "Offsets must be −12 to +14. Time is HH:MM. Daily cap is 0–4 h."
        : es ? "Completá números válidos. Vacío o NaN no arma el plan." : "Enter valid numbers. Empty or NaN does not build a plan."
    : "";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button type="button" className={buttonClass} onClick={() => apply(londonPreset())}>{es ? "Nueva York → Londres" : "New York → London"}</button>
        <button type="button" className={buttonClass} onClick={() => apply(laPreset())}>{es ? "Nueva York → Los Ángeles" : "New York → Los Angeles"}</button>
        <button type="button" className={buttonClass} onClick={() => apply({ originOffset: "", destOffset: "", bedtime: "", daysBefore: "", east: "1", west: "1.5" })}>{es ? "Reiniciar" : "Reset"}</button>
        <button type="button" className={buttonClass} onClick={copyResult} disabled={!plan.ok}>{copied ? (es ? "Copiado" : "Copied") : es ? "Copiar plan" : "Copy plan"}</button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block space-y-1 text-sm"><span>{es ? "UTC origen (h)" : "Origin UTC (h)"}</span><input className={inputClass} inputMode="decimal" value={originOffset} onChange={(e) => setOriginOffset(e.target.value)} /></label>
        <label className="block space-y-1 text-sm"><span>{es ? "UTC destino (h)" : "Destination UTC (h)"}</span><input className={inputClass} inputMode="decimal" value={destOffset} onChange={(e) => setDestOffset(e.target.value)} /></label>
        <label className="block space-y-1 text-sm"><span>{es ? "Hora de cama habitual" : "Usual bedtime"}</span><input className={inputClass} inputMode="numeric" placeholder="23:00" value={bedtime} onChange={(e) => setBedtime(e.target.value)} /></label>
        <label className="block space-y-1 text-sm"><span>{es ? "Días antes del vuelo" : "Days before the flight"}</span><input className={inputClass} inputMode="numeric" value={daysBefore} onChange={(e) => setDaysBefore(e.target.value)} /></label>
        <label className="block space-y-1 text-sm"><span>{es ? "Tope este (h/día)" : "East cap (h/day)"}</span><input className={inputClass} inputMode="decimal" value={east} onChange={(e) => setEast(e.target.value)} /></label>
        <label className="block space-y-1 text-sm"><span>{es ? "Tope oeste (h/día)" : "West cap (h/day)"}</span><input className={inputClass} inputMode="decimal" value={west} onChange={(e) => setWest(e.target.value)} /></label>
      </div>
      {errorText ? <p className="text-sm text-destructive">{errorText}</p> : null}
      {plan.ok ? (
        <div className="space-y-2 rounded-xl border p-3 text-sm">
          <p>{es ? "Desfase plegado a (−12, 12]" : "Shift folded into (−12, 12]"}: <strong>{plan.shiftHours} h</strong> · {plan.direction === "east" ? (es ? "adelantar (este)" : "advance (east)") : plan.direction === "west" ? (es ? "atrasar (oeste)" : "delay (west)") : es ? "sin cambio" : "no change"}</p>
          <p>{es ? "Cama objetivo en origen" : "Target bedtime on the origin clock"}: <strong>{plan.targetBedtime}</strong> · {es ? "pendiente al llegar" : "still to shift on arrival"}: <strong>{plan.remainingHours} h</strong></p>
          <ul className="space-y-1">
            {plan.days.map((day) => (
              <li key={day.day}>{es ? "Día" : "Day"} {day.day}: {day.bedtimeLabel} ({day.shiftHours > 0 ? "+" : ""}{day.shiftHours} h)</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
