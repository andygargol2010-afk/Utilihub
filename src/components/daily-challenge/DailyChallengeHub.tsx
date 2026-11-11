import { useCallback, useEffect, useMemo, useState } from "react";
import { GAMES, gameName } from "@/lib/games/catalog";
import {
  clearLeft,
  computeStreaks,
  countDone,
  markLeft,
  readLeft,
  weekdayOf,
  dayKeyOf,
  formatCountdown,
  lastDays,
  msUntilNext,
  pickForDay,
  pickPath,
  readDone,
  writeDone,
  type DoneMap,
} from "@/lib/daily-challenge/logic";

type Locale = "en" | "es";

const T = {
  en: {
    today: "Today's challenge",
    play: "Play now",
    markDone: "Mark as done",
    undo: "Undo",
    doneToday: "Done today ✔",
    pending: "Not done yet",
    streak: "Current streak",
    best: "Best streak",
    days: "days",
    next: "Next challenge in",
    calendar: "Last 28 days",
    doneDay: "completed",
    missedDay: "not completed",
    announceDone: "Challenge marked as done. Streak:",
    announceUndo: "Challenge marked as not done.",
    hint: "Play the game, then come back and mark it as done. Everything stays on this device.",
    welcomeBack: "Welcome back! Did you reach today's goal?",
    yesDone: "Yes, mark it done",
    notYet: "Not yet",
    summary: "completed in the last 28 days",
    weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  },
  es: {
    today: "Reto de hoy",
    play: "Jugar ahora",
    markDone: "Marcar como hecho",
    undo: "Deshacer",
    doneToday: "Hecho hoy ✔",
    pending: "Aún sin completar",
    streak: "Racha actual",
    best: "Mejor racha",
    days: "días",
    next: "Próximo reto en",
    calendar: "Últimos 28 días",
    doneDay: "completado",
    missedDay: "sin completar",
    announceDone: "Reto marcado como hecho. Racha:",
    announceUndo: "Reto marcado como no hecho.",
    hint: "Jugá el juego, volvé y marcá el reto como hecho. Todo queda guardado en este dispositivo.",
    welcomeBack: "¡Bienvenido de vuelta! ¿Lograste el objetivo de hoy?",
    yesDone: "Sí, marcar como hecho",
    notYet: "Todavía no",
    summary: "completados en los últimos 28 días",
    weekdays: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
  },
} as const;

export function DailyChallengeHub({ locale }: { locale: Locale }) {
  const t = T[locale];
  const [now, setNow] = useState<number | null>(null);
  const [done, setDone] = useState<DoneMap>({});
  const [announce, setAnnounce] = useState("");
  const [returned, setReturned] = useState(false);

  useEffect(() => {
    setDone(readDone());
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    const check = () => {
      const left = readLeft();
      if (left && left.dayKey === dayKeyOf(Date.now())) setReturned(true);
    };
    check();
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        setDone(readDone());
        check();
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("pageshow", check);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("pageshow", check);
    };
  }, []);

  const today = now === null ? null : dayKeyOf(now);
  const pick = useMemo(() => (today ? pickForDay(today) : null), [today]);
  const streaks = useMemo(() => (today ? computeStreaks(done, today) : { current: 0, best: 0 }), [done, today]);
  const strip = useMemo(() => (today ? lastDays(today, 28) : []), [today]);
  const isDone = Boolean(today && done[today]);

  const toggle = useCallback(() => {
    if (!today || !pick) return;
    const next = { ...done };
    if (next[today]) {
      delete next[today];
      setAnnounce(t.announceUndo);
    } else {
      next[today] = pick.game.slug;
      setAnnounce(`${t.announceDone} ${computeStreaks(next, today).current}`);
    }
    setDone(next);
    writeDone(next);
  }, [done, pick, t, today]);

  const confirmReturn = useCallback(
    (ok: boolean) => {
      clearLeft();
      setReturned(false);
      if (ok && pick && today && !done[today]) toggle();
    },
    [done, pick, today, toggle],
  );

  if (now === null || !pick || !today) {
    return <div className="min-h-[360px] rounded-2xl border border-border bg-card" aria-busy="true" />;
  }

  const goal = locale === "es" ? pick.goalEs : pick.goalEn;
  const label = gameName(pick.game, locale);

  return (
    <section className="space-y-5" aria-label={t.today}>
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-500">{t.today} · {today}</p>
        <div className="mt-3 flex items-center gap-4">
          <span className="text-5xl" aria-hidden="true">{pick.game.emoji}</span>
          <div className="min-w-0">
            <h2 className="text-2xl font-black tracking-tight">{label}</h2>
            <p className="mt-1 text-muted-foreground">{goal}</p>
          </div>
        </div>
        <p className="mt-3 text-sm font-semibold" data-testid="daily-status">{isDone ? t.doneToday : t.pending}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href={pickPath(pick, locale)}
            onClick={() => markLeft(today, pick.game.slug)}
            className="inline-flex min-h-11 items-center rounded-xl bg-primary px-5 py-2 font-bold text-primary-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {t.play}
          </a>
          <button
            type="button"
            onClick={toggle}
            className="inline-flex min-h-11 items-center rounded-xl border border-border px-5 py-2 font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {isDone ? t.undo : t.markDone}
          </button>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">{t.hint}</p>
      </div>

      {returned && !isDone ? (
        <div className="rounded-2xl border border-cyan-500/50 bg-cyan-500/10 p-4" role="alert">
          <p className="font-semibold">{t.welcomeBack}</p>
          <div className="mt-3 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => confirmReturn(true)}
              className="inline-flex min-h-11 items-center rounded-xl bg-primary px-5 py-2 font-bold text-primary-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {t.yesDone}
            </button>
            <button
              type="button"
              onClick={() => confirmReturn(false)}
              className="inline-flex min-h-11 items-center rounded-xl border border-border px-5 py-2 font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {t.notYet}
            </button>
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-3 gap-3 text-center">
        <Stat label={t.streak} value={`${streaks.current} ${t.days}`} />
        <Stat label={t.best} value={`${streaks.best} ${t.days}`} />
        <Stat label={t.next} value={formatCountdown(msUntilNext(now))} />
      </div>

      <div className="rounded-2xl border border-border bg-card p-4">
        <h3 className="text-sm font-bold">{t.calendar}</h3>
        <p className="mt-1 text-xs text-muted-foreground">{countDone(done, strip)}/28 {t.summary}</p>
        <div className="mt-3 grid grid-cols-7 gap-1.5 text-center text-[10px] font-semibold uppercase text-muted-foreground" aria-hidden="true">
          {Array.from({ length: 7 }, (_, i) => (
            <span key={i}>{t.weekdays[(weekdayOf(strip[0] ?? today) + i) % 7]}</span>
          ))}
        </div>
        <ul className="mt-1.5 grid grid-cols-7 gap-1.5" aria-label={t.calendar}>
          {strip.map((d) => {
            const slug = done[d];
            const ok = Boolean(slug);
            const emoji = slug ? GAMES.find((g) => g.slug === slug)?.emoji : undefined;
            return (
              <li
                key={d}
                title={`${d} — ${ok ? t.doneDay : t.missedDay}`}
                aria-label={`${d}: ${ok ? t.doneDay : t.missedDay}`}
                className={`flex aspect-square items-center justify-center rounded-md border text-sm ${ok ? "border-emerald-500 bg-emerald-500/20" : "border-border bg-muted"} ${d === today ? "ring-2 ring-cyan-500" : ""}`}
              >
                <span aria-hidden="true">{emoji ?? ""}</span>
              </li>
            );
          })}
        </ul>
      </div>

      <p className="sr-only" role="status" aria-live="polite">{announce}</p>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card px-2 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-base font-black tabular-nums sm:text-lg">{value}</p>
    </div>
  );
}
