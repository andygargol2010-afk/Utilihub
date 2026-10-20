"use client";

import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { PLAYGROUNDS, playgroundPath, playgroundName, type PlaygroundLocale } from "@/lib/playgrounds/next-step";

const STORAGE_KEY = "utilihub-return-streak-v1";

type StreakData = {
  lastVisit: number;
  streak: number;
  longestStreak: number;
  totalVisits: number;
  visits: Record<string, number>; // id -> last timestamp
  visitDates: string[]; // YYYY-MM-DD, recent days
};

const POPULAR = PLAYGROUNDS.slice(0, 10);

const MILESTONES = [3, 7, 14, 30] as const;

function todayKey(): string {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function loadData(): StreakData {
  if (typeof window === "undefined")
    return { lastVisit: 0, streak: 0, longestStreak: 0, totalVisits: 0, visits: {}, visitDates: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { lastVisit: 0, streak: 0, longestStreak: 0, totalVisits: 0, visits: {}, visitDates: [] };
    const parsed = JSON.parse(raw);
    return {
      lastVisit: parsed.lastVisit ?? 0,
      streak: parsed.streak ?? 0,
      longestStreak: parsed.longestStreak ?? parsed.streak ?? 0,
      totalVisits: parsed.totalVisits ?? 0,
      visits: parsed.visits ?? {},
      visitDates: Array.isArray(parsed.visitDates) ? parsed.visitDates : [],
    };
  } catch {
    return { lastVisit: 0, streak: 0, longestStreak: 0, totalVisits: 0, visits: {}, visitDates: [] };
  }
}

function saveData(data: StreakData) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

function isSameDay(a: number, b: number) {
  const da = new Date(a);
  const db = new Date(b);
  return da.getFullYear() === db.getFullYear() && da.getMonth() === db.getMonth() && da.getDate() === db.getDate();
}

function daysBetween(a: number, b: number) {
  return Math.floor(Math.abs(a - b) / 86400000);
}

function nextMilestone(streak: number): number | null {
  for (const m of MILESTONES) {
    if (streak < m) return m;
  }
  return null;
}

function getWeekDays(): Date[] {
  const days: Date[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(d);
  }
  return days;
}

export function ReturnStreakBoard({ locale = "en" }: { locale?: PlaygroundLocale }) {
  const [data, setData] = useState<StreakData>({
    lastVisit: 0,
    streak: 0,
    longestStreak: 0,
    totalVisits: 0,
    visits: {},
    visitDates: [],
  });
  const [shareMsg, setShareMsg] = useState("");
  const es = locale === "es";

  useEffect(() => {
    const now = Date.now();
    const prev = loadData();
    let streak = prev.streak;
    if (prev.lastVisit === 0) {
      streak = 1;
    } else if (!isSameDay(prev.lastVisit, now)) {
      const gap = daysBetween(prev.lastVisit, now);
      streak = gap === 1 ? prev.streak + 1 : 1;
    }
    const longestStreak = Math.max(prev.longestStreak, streak);
    const totalVisits = (prev.totalVisits ?? 0) + 1;
    const today = todayKey();
    const visitDates = prev.visitDates.includes(today)
      ? prev.visitDates
      : [...prev.visitDates, today].slice(-30); // keep last 30
    const next: StreakData = {
      ...prev,
      lastVisit: now,
      streak,
      longestStreak,
      totalVisits,
      visits: { ...prev.visits, "return-streak-board": now },
      visitDates,
    };
    saveData(next);
    setData(next);
  }, []);

  const dueThreshold = 3;

  const sortedPopular = useMemo(() => {
    return [...POPULAR].sort((a, b) => {
      const la = data.visits[a.id] ?? 0;
      const lb = data.visits[b.id] ?? 0;
      const da = la === 0 ? Infinity : daysBetween(la, Date.now());
      const db = lb === 0 ? Infinity : daysBetween(lb, Date.now());
      return db - da; // most overdue first
    });
  }, [data.visits]);

  const uniqueVisited = Object.keys(data.visits).length;
  const suggested = sortedPopular[0];
  const target = nextMilestone(data.streak);
  const prevMilestone =
    target === null
      ? MILESTONES[MILESTONES.length - 1]
      : MILESTONES[MILESTONES.indexOf(target as (typeof MILESTONES)[number]) - 1] ?? 0;
  const progressPct =
    target === null
      ? 100
      : Math.min(100, Math.round(((data.streak - prevMilestone) / (target - prevMilestone)) * 100));

  const weekDays = getWeekDays();
  const visitedToday = data.lastVisit > 0 && isSameDay(data.lastVisit, Date.now());
  const dateSet = new Set(data.visitDates);

  async function shareStreak() {
    const text = es
      ? `¡Llevo ${data.streak} días seguidos en mi racha de retorno en UtiliHub! 🔥`
      : `I'm on a ${data.streak}-day return streak on UtiliHub! 🔥`;
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: es ? "Mi racha UtiliHub" : "My UtiliHub streak", text, url });
        setShareMsg(es ? "¡Compartido!" : "Shared!");
      } catch {
        setShareMsg(es ? "Cancelado" : "Cancelled");
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${text} ${url}`);
        setShareMsg(es ? "Copiado al portapapeles" : "Copied to clipboard");
      } catch {
        setShareMsg(es ? "No se pudo copiar" : "Could not copy");
      }
    }
    setTimeout(() => setShareMsg(""), 2500);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border/60 bg-surface/40 p-4 sm:p-6">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-500">
          {es ? "Racha de retorno" : "Return streak"}
        </p>
        <div className="mt-1 flex items-center gap-3">
          <h2 className="text-2xl font-black">
            {data.streak} {es ? "días seguidos" : "day streak"}
          </h2>
          <span
            className="relative text-2xl"
            style={{ filter: "drop-shadow(0 0 6px rgba(34,211,238,0.6))" }}
          >
            🔥
            <span className="absolute inset-0 animate-ping opacity-40">🔥</span>
          </span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {es
            ? `Mejor: ${data.longestStreak} días · Visitas totales: ${data.totalVisits}. Todo en tu navegador.`
            : `Best: ${data.longestStreak} days · Total visits: ${data.totalVisits}. Everything stays in your browser.`}
        </p>

        <button
          type="button"
          onClick={shareStreak}
          className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-600 transition hover:bg-cyan-500/20 dark:text-cyan-400"
        >
          {es ? "Compartir racha" : "Share streak"}
          {shareMsg && <span className="text-[10px] font-normal">· {shareMsg}</span>}
        </button>

        {/* Week streak calendar - accurate */}
        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold text-muted-foreground">
            {es ? "Esta semana" : "This week"}
          </p>
          <div className="flex justify-between gap-1">
            {weekDays.map((d, i) => {
              const key = d.toISOString().slice(0, 10);
              const isToday = isSameDay(d.getTime(), Date.now());
              const active = dateSet.has(key);
              return (
                <div key={i} className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-[10px] uppercase text-muted-foreground">
                    {d.toLocaleDateString(es ? "es" : "en", { weekday: "narrow" })}
                  </span>
                  <div
                    className={`h-8 w-full max-w-[2.5rem] rounded-lg border transition ${
                      isToday
                        ? "border-cyan-500 bg-cyan-500/20 ring-1 ring-cyan-400/50"
                        : active
                          ? "border-cyan-400/60 bg-cyan-400/15"
                          : "border-border/40 bg-border/10"
                    }`}
                  >
                    {active && (
                      <div className="mx-auto mt-2 h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {!visitedToday && data.streak > 0 && (
            <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
              {es
                ? "Racha en riesgo — visitá hoy para mantenerla."
                : "Streak at risk — visit today to keep it."}
            </p>
          )}
        </div>

        {/* Streak pulse chain */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {Array.from({ length: Math.min(data.streak, 14) }).map((_, i) => (
            <span
              key={i}
              className="h-2.5 w-2.5 rounded-full bg-cyan-400/80 animate-pulse"
              style={{ animationDelay: `${i * 80}ms`, animationDuration: "1.8s" }}
            />
          ))}
          {data.streak > 14 && (
            <span className="text-xs text-muted-foreground">+{data.streak - 14}</span>
          )}
        </div>

        {/* Milestone progress */}
        <div className="mt-4">
          <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {target === null
                ? es
                  ? "Todos los hitos alcanzados"
                  : "All milestones reached"
                : es
                  ? `Próximo hito: ${target} días`
                  : `Next milestone: ${target} days`}
            </span>
            <span>{progressPct}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-border/40">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-amber-400 transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {MILESTONES.map((m) => {
              const unlocked = data.streak >= m || data.longestStreak >= m;
              return (
                <span
                  key={m}
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    unlocked
                      ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                      : "bg-border/30 text-muted-foreground"
                  }`}
                >
                  {unlocked ? "★" : "○"} {m}d
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Suggested next hero */}
      {suggested && (
        <Link
          to={playgroundPath(suggested, locale)}
          className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-amber-500/40 bg-amber-500/5 p-4 transition hover:border-amber-500/70 sm:p-5"
        >
          <div
            className="pointer-events-none absolute -inset-4 rounded-full bg-amber-400/20 opacity-50 animate-ping"
            style={{ animationDuration: "2s" }}
          />
          <span className="relative text-3xl">{suggested.emoji}</span>
          <div className="relative min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-600 dark:text-amber-400">
              {es ? "Sugerido para volver" : "Suggested next"}
            </p>
            <h3 className="truncate text-base font-bold sm:text-lg">{playgroundName(suggested, locale)}</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {(() => {
                const last = data.visits[suggested.id] ?? 0;
                const daysAgo = last === 0 ? null : daysBetween(last, Date.now());
                if (es) {
                  return daysAgo === null ? "Nunca visitado — tocá para empezar" : `Hace ${daysAgo}d — tocá para retomar`;
                }
                return daysAgo === null ? "Never visited — tap to start" : `${daysAgo}d ago — tap to resume`;
              })()}
            </p>
          </div>
          <span className="relative shrink-0 text-sm font-semibold text-amber-600 group-hover:translate-x-0.5 dark:text-amber-400">
            →
          </span>
        </Link>
      )}

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {es ? "Experiencias visitadas" : "Experiences visited"}: {uniqueVisited}
        </span>
        <span>{es ? "Ordenadas por urgencia" : "Sorted by urgency"}</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {sortedPopular.map((p) => {
          const last = data.visits[p.id] ?? 0;
          const due = last === 0 || daysBetween(last, Date.now()) >= dueThreshold;
          const href = playgroundPath(p, locale);
          const daysAgo = last === 0 ? null : daysBetween(last, Date.now());
          const isSuggested = suggested?.id === p.id;
          return (
            <Link
              key={p.id}
              to={href}
              className={`group relative overflow-hidden rounded-2xl border p-4 transition hover:border-primary/50 ${
                due ? "border-amber-500/50 bg-amber-500/5" : "border-border/60 bg-surface/30"
              } ${isSuggested ? "ring-1 ring-amber-400/40" : ""}`}
            >
              <div
                className={`pointer-events-none absolute -inset-2 rounded-full opacity-40 ${
                  due ? "animate-ping bg-amber-400" : "bg-cyan-400/30"
                }`}
                style={{ animationDuration: due ? "1.6s" : "2.4s" }}
              />
              {due && (
                <div
                  className="pointer-events-none absolute -inset-4 rounded-full border-2 border-amber-400/30 opacity-50 animate-ping"
                  style={{ animationDuration: "2.2s", animationDelay: "0.3s" }}
                />
              )}
              <div className="relative">
                <span className="text-2xl">{p.emoji}</span>
                <h3 className="mt-2 text-sm font-bold">{playgroundName(p, locale)}</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {due
                    ? es
                      ? daysAgo === null
                        ? "Due para volver"
                        : `Due (${daysAgo}d)`
                      : daysAgo === null
                        ? "Due to return"
                        : `Due (${daysAgo}d)`
                    : es
                      ? "Reciente"
                      : "Recent"}
                </p>
                {due && (
                  <p className="mt-1 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                    {es ? "Bonus de retorno" : "Resume bonus"}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground">
        {es
          ? "Sugerencia: abrí el más atrasado para reforzar tu racha visual."
          : "Suggestion: open the most overdue to reinforce your visual streak."}
      </p>
    </div>
  );
}
