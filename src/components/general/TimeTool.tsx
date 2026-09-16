import { useEffect, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";
import { getToolShowcase } from "@/lib/tool-showcase";
import { showcaseUi } from "@/lib/showcase-ui";

const iso = (d: Date) => d.toISOString().slice(0, 10);
const parseDate = (s: string) => {
  const d = new Date(`${s}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
};
const pad = (n: number) => String(n).padStart(2, "0");
const formatMs = (ms: number) => {
  const total = Math.floor(ms / 1000);
  const s = total % 60;
  const m = Math.floor(total / 60) % 60;
  const h = Math.floor(total / 3600);
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
};
const TIMER_SLUGS = new Set(["cronometro", "temporizador", "temporizador-cocina", "pomodoro"]);

export function TimeTool({ tool, locale = "en" }: { tool: GeneralTool; locale?: "en" | "es" }) {
  const es = locale === "es";
  const showcase = getToolShowcase(tool.slug);
  const ui = showcaseUi(showcase?.accent);
  const premium = Boolean(showcase);
  const [date, setDate] = useState(iso(new Date()));
  const [date2, setDate2] = useState(iso(new Date(Date.now() + 86400000)));
  const [hours, setHours] = useState("00:00");
  const [hours2, setHours2] = useState("01:00");
  const [days, setDays] = useState("1");
  const [target, setTarget] = useState("");
  const [remaining, setRemaining] = useState(0);
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [startedAt, setStartedAt] = useState(0);
  const [seconds, setSeconds] = useState(tool.slug === "pomodoro" ? 1500 : 60);
  const [out, setOut] = useState("");

  const inputClass = ui?.field ?? "h-11 w-full rounded-xl border bg-background px-3";
  const displayClass = ui?.display ?? "rounded-xl border bg-muted/30 p-4 text-center font-mono text-2xl";
  const primaryBtn = ui?.btn ?? "rounded-xl bg-primary px-4 py-2 font-bold text-primary-foreground";
  const secondaryBtn = ui?.btnSecondary ?? "rounded-xl border px-4 py-2";
  const outClass = ui?.out ?? "block rounded-xl border bg-muted/30 p-4";

  useEffect(() => {
    if (tool.slug !== "cuenta-regresiva" || !running) return;
    const id = window.setInterval(() => {
      const ms = Math.max(0, new Date(target).getTime() - Date.now());
      setRemaining(ms);
      if (ms === 0) setRunning(false);
    }, 100);
    return () => window.clearInterval(id);
  }, [tool.slug, running, target]);

  useEffect(() => {
    if (!TIMER_SLUGS.has(tool.slug) || !running) return;
    const id = window.setInterval(() => {
      if (tool.slug === "cronometro") {
        setElapsed(Date.now() - startedAt);
      } else {
        setSeconds((s) => {
          if (s <= 1) {
            setRunning(false);
            return 0;
          }
          return s - 1;
        });
      }
    }, 100);
    return () => window.clearInterval(id);
  }, [tool.slug, running, startedAt]);

  const run = () => {
    setOut("");
    const d1 = parseDate(date);
    const d2 = parseDate(date2);
    if (tool.slug === "edad-exacta") {
      if (!d1) {
        setOut(es ? "Fecha no válida." : "Invalid date.");
        return;
      }
      const now = new Date();
      let y = now.getFullYear() - d1.getFullYear();
      let m = now.getMonth() - d1.getMonth();
      let day = now.getDate() - d1.getDate();
      if (day < 0) {
        m -= 1;
        day += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
      }
      if (m < 0) {
        y -= 1;
        m += 12;
      }
      setOut(es ? `${y} años, ${m} meses, ${day} días` : `${y} years, ${m} months, ${day} days`);
      return;
    }
    if (tool.slug === "dias-entre-fechas" || tool.slug === "dias-laborables") {
      if (!d1 || !d2) {
        setOut(es ? "Fechas no válidas." : "Invalid dates.");
        return;
      }
      const a = d1 < d2 ? d1 : d2;
      const b = d1 < d2 ? d2 : d1;
      let count = 0;
      const cur = new Date(a);
      while (cur <= b) {
        const wd = cur.getDay();
        if (tool.slug === "dias-entre-fechas" || (wd !== 0 && wd !== 6)) count += 1;
        cur.setDate(cur.getDate() + 1);
      }
      if (tool.slug === "dias-entre-fechas") count = Math.round((b.getTime() - a.getTime()) / 86400000);
      setOut(`${count} ${es ? (tool.slug === "dias-laborables" ? "días laborables" : "días") : tool.slug === "dias-laborables" ? "weekdays" : "days"}`);
      return;
    }
    if (tool.slug === "sumar-dias") {
      if (!d1) {
        setOut(es ? "Fecha no válida." : "Invalid date.");
        return;
      }
      const n = Number(days);
      if (!Number.isFinite(n)) {
        setOut(es ? "Número de días no válido." : "Invalid number of days.");
        return;
      }
      const r = new Date(d1);
      r.setDate(r.getDate() + Math.trunc(n));
      setOut(iso(r));
      return;
    }
    if (tool.slug === "diferencia-horas") {
      const [h1, m1] = hours.split(":").map(Number);
      const [h2, m2] = hours2.split(":").map(Number);
      if ([h1, m1, h2, m2].some((x) => !Number.isFinite(x))) {
        setOut(es ? "Horas no válidas." : "Invalid times.");
        return;
      }
      let mins = h2 * 60 + m2 - (h1 * 60 + m1);
      if (mins < 0) mins += 24 * 60;
      setOut(`${Math.floor(mins / 60)}h ${mins % 60}m`);
      return;
    }
    setOut(es ? "Introduce los datos." : "Enter the data.");
  };

  if (tool.slug === "cronometro") {
    return (
      <div className="space-y-4">
        <div className={displayClass}>{formatMs(elapsed)}</div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={primaryBtn}
            onClick={() => {
              if (!running) {
                setStartedAt(Date.now() - elapsed);
                setRunning(true);
              }
            }}
          >
            {es ? "Iniciar" : "Start"}
          </button>
          <button type="button" className={secondaryBtn} onClick={() => setRunning(false)}>
            {es ? "Pausa" : "Pause"}
          </button>
          <button
            type="button"
            className={secondaryBtn}
            onClick={() => {
              setRunning(false);
              setElapsed(0);
              setStartedAt(0);
            }}
          >
            {es ? "Reiniciar" : "Reset"}
          </button>
        </div>
      </div>
    );
  }

  if (TIMER_SLUGS.has(tool.slug)) {
    return (
      <div className="space-y-4">
        <div className={displayClass}>{formatMs(seconds * 1000)}</div>
        <input
          type="number"
          min={1}
          value={seconds}
          onChange={(e) => setSeconds(Math.max(1, Number(e.target.value) || 1))}
          className={inputClass}
          disabled={running}
        />
        <div className="flex flex-wrap gap-2">
          <button type="button" className={primaryBtn} onClick={() => setRunning(true)} disabled={running || seconds <= 0}>
            {es ? "Iniciar" : "Start"}
          </button>
          <button type="button" className={secondaryBtn} onClick={() => setRunning(false)}>
            {es ? "Pausa" : "Pause"}
          </button>
          <button
            type="button"
            className={secondaryBtn}
            onClick={() => {
              setRunning(false);
              setSeconds(tool.slug === "pomodoro" ? 1500 : 60);
            }}
          >
            {es ? "Reiniciar" : "Reset"}
          </button>
        </div>
      </div>
    );
  }

  if (tool.slug === "cuenta-regresiva") {
    return (
      <div className="space-y-4">
        <input
          type="datetime-local"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          className={inputClass}
        />
        <div className={displayClass}>{formatMs(remaining)}</div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={primaryBtn}
            onClick={() => {
              if (!target) return;
              setRemaining(Math.max(0, new Date(target).getTime() - Date.now()));
              setRunning(true);
            }}
          >
            {es ? "Iniciar" : "Start"}
          </button>
          <button type="button" className={secondaryBtn} onClick={() => setRunning(false)}>
            {es ? "Pausa" : "Pause"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <label className="block space-y-1">
        <span className="text-sm font-medium">{es ? "Fecha" : "Date"}</span>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
      </label>
      {(tool.slug === "dias-entre-fechas" || tool.slug === "dias-laborables") && (
        <label className="block space-y-1">
          <span className="text-sm font-medium">{es ? "Segunda fecha" : "Second date"}</span>
          <input type="date" value={date2} onChange={(e) => setDate2(e.target.value)} className={inputClass} />
        </label>
      )}
      {tool.slug === "sumar-dias" && (
        <label className="block space-y-1">
          <span className="text-sm font-medium">{es ? "Días a sumar" : "Days to add"}</span>
          <input type="number" value={days} onChange={(e) => setDays(e.target.value)} className={inputClass} />
        </label>
      )}
      {tool.slug === "diferencia-horas" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <input type="time" value={hours} onChange={(e) => setHours(e.target.value)} className={inputClass} />
          <input type="time" value={hours2} onChange={(e) => setHours2(e.target.value)} className={inputClass} />
        </div>
      )}
      <button type="button" className={primaryBtn} onClick={run}>
        {es ? "Calcular" : "Calculate"}
      </button>
      {out && <output className={outClass}>{out}</output>}
    </div>
  );
}
