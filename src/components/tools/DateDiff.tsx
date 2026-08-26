import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const DAY = 86_400_000;
const iso = (date: Date) => date.toISOString().slice(0, 10);
const utcDate = (value: string) => new Date(`${value}T00:00:00Z`);

/** Adds calendar months while clamping the day to the last valid day. */
function addMonths(date: Date, months: number) {
  const result = new Date(date);
  const targetMonth = result.getUTCMonth() + months;
  result.setUTCDate(1);
  result.setUTCMonth(targetMonth);
  const lastDay = new Date(Date.UTC(result.getUTCFullYear(), result.getUTCMonth() + 1, 0)).getUTCDate();
  result.setUTCDate(Math.min(date.getUTCDate(), lastDay));
  return result;
}

function ymd(from: Date, to: Date) {
  const totalMonths = (to.getUTCFullYear() - from.getUTCFullYear()) * 12 + (to.getUTCMonth() - from.getUTCMonth());
  let months = totalMonths;
  let anchor = addMonths(from, months);
  if (anchor > to) {
    months -= 1;
    anchor = addMonths(from, months);
  }
  const years = Math.floor(months / 12);
  months %= 12;
  const days = Math.round((to.getTime() - anchor.getTime()) / DAY);
  return { years, months, days };
}

function weekdays(from: Date, to: Date, inclusive: boolean) {
  let business = 0, weekend = 0;
  const cur = new Date(from);
  const end = new Date(to.getTime() + (inclusive ? DAY : 0));
  while (cur < end) {
    const day = cur.getUTCDay();
    day === 0 || day === 6 ? weekend++ : business++;
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  return { business, weekend };
}

export default function DateDiff() {
  const today = new Date();
  const [start, setStart] = useState(iso(today));
  const [end, setEnd] = useState(iso(new Date(today.getTime() + 30 * DAY)));
  const [inclusive, setInclusive] = useState(false);
  const result = useMemo(() => {
    const first = utcDate(start), second = utcDate(end);
    if (Number.isNaN(first.getTime()) || Number.isNaN(second.getTime())) return null;
    const [from, to] = first <= second ? [first, second] : [second, first];
    const total = Math.round((to.getTime() - from.getTime()) / DAY);
    return { total, countedDays: total + (inclusive ? 1 : 0), weeks: Math.floor(total / 7), rest: total % 7, ...ymd(from, to), ...weekdays(from, to, inclusive) };
  }, [start, end, inclusive]);

  return <div className="space-y-6">
    <div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><Label htmlFor="dd-start">Fecha de inicio</Label><Input id="dd-start" type="date" value={start} onChange={(e) => setStart(e.target.value)} /></div><div className="space-y-2"><Label htmlFor="dd-end">Fecha de fin</Label><Input id="dd-end" type="date" value={end} onChange={(e) => setEnd(e.target.value)} /></div></div>
    <label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={inclusive} onChange={(e) => setInclusive(e.target.checked)} className="size-4 rounded" /> Contar también el día inicial y el final</label>
    {result && <div aria-live="polite" className="space-y-4">
      <div className="rounded-xl bg-surface p-5"><p className="text-sm text-muted-foreground">Diferencia entre fechas</p><p className="font-mono text-3xl font-semibold">{result.countedDays.toLocaleString("es-AR")} días</p><p className="mt-1 text-sm text-muted-foreground">{result.years} años, {result.months} meses y {result.days} días de calendario</p></div>
      <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[["Semanas completas", `${result.weeks} (+${result.rest} d)`], ["Días laborables", result.business.toLocaleString("es-AR")], ["Fin de semana", result.weekend.toLocaleString("es-AR")], ["Días contados", result.countedDays.toLocaleString("es-AR")]].map(([key, value]) => <div key={key} className="rounded-xl border border-border p-4"><dt className="text-xs uppercase tracking-wide text-muted-foreground">{key}</dt><dd className="mt-1 font-mono text-xl font-semibold">{value}</dd></div>)}</dl>
      <div className="rounded-xl border border-border/70 p-4 text-sm text-muted-foreground"><p className="font-semibold text-foreground">Nota sobre días laborables</p><p className="mt-1">Se consideran laborables de lunes a viernes. No se descuentan feriados porque dependen del país, provincia o ciudad.</p></div>
    </div>}
  </div>;
}
