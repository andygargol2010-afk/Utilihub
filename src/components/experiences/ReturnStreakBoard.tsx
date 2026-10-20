"use client";

import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { PLAYGROUNDS, playgroundPath, playgroundName, type PlaygroundLocale } from "@/lib/playgrounds/next-step";

const STORAGE_KEY = "utilihub-return-streak-v1";

type StreakData = {
  lastVisit: number;
  streak: number;
  longestStreak: number;
  visits: Record<string, number>; // id -> last timestamp
};

const POPULAR = PLAYGROUNDS.slice(0, 8);

function loadData(): StreakData {
  if (typeof window === "undefined") return { lastVisit: 0, streak: 0, longestStreak: 0, visits: {} };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { lastVisit: 0, streak: 0, longestStreak: 0, visits: {} };
    const parsed = JSON.parse(raw);
    return {
      lastVisit: parsed.lastVisit ?? 0,
      streak: parsed.streak ?? 0,
      longestStreak: parsed.longestStreak ?? parsed.streak ?? 0,
      visits: parsed.visits ?? {},
    };
  } catch {
    return { lastVisit: 0, streak: 0, longestStreak: 0, visits: {} };
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

export function ReturnStreakBoard({ locale = "en" }: { locale?: PlaygroundLocale }) {
  const [data, setData] = useState<StreakData>({ lastVisit: 0, streak: 0, longestStreak: 0, visits: {} });
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
    const next: StreakData = {
      ...prev,
      lastVisit: now,
      streak,
      longestStreak,
      visits: { ...prev.visits, "return-streak-board": now },
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

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border/60 bg-surface/40 p-4 sm:p-6">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-500">
          {es ? "Racha de retorno" : "Return streak"}
        </p>
        <h2 className="mt-1 text-2xl font-black">
          {data.streak} {es ? "días seguidos" : "day streak"}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {es
            ? `Mejor: ${data.longestStreak} días. Volvé cada día. Todo en tu navegador.`
            : `Best: ${data.longestStreak} days. Return daily. Everything stays in your browser.`}
        </p>
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
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{es ? "Experiencias visitadas" : "Experiences visited"}: {uniqueVisited}</span>
        <span>{es ? "Ordenadas por urgencia" : "Sorted by urgency"}</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {sortedPopular.map((p) => {
          const last = data.visits[p.id] ?? 0;
          const due = last === 0 || daysBetween(last, Date.now()) >= dueThreshold;
          const href = playgroundPath(p, locale);
          const daysAgo = last === 0 ? null : daysBetween(last, Date.now());
          return (
            <Link
              key={p.id}
              to={href}
              className={`group relative overflow-hidden rounded-2xl border p-4 transition hover:border-primary/50 ${
                due ? "border-amber-500/50 bg-amber-500/5" : "border-border/60 bg-surface/30"
              }`}
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
