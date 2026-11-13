import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { buildSnapshot, parseSnapshot, renderShareCard, shareUrl, type ShareSnapshot } from "@/lib/daily-challenge/share";

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
    day: "day",
    emptyState: "No challenges completed yet — finish today's to start your streak.",
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
    shareTitle: "Daily Challenge streak",
    sharePng: "Download PNG",
    shareLink: "Copy link",
    shareCopied: "Link copied.",
    shareReady: "Image downloaded.",
    shareFail: "Could not create the image.",
    sharedBy: "A friend's streak",
    shareHeading: "Share your streak",
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
    day: "día",
    emptyState: "Aún no completaste ningún reto — terminá el de hoy para empezar tu racha.",
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
    shareTitle: "Racha del Reto Diario",
    sharePng: "Descargar PNG",
    shareLink: "Copiar enlace",
    shareCopied: "Enlace copiado.",
    shareReady: "Imagen descargada.",
    shareFail: "No se pudo crear la imagen.",
    sharedBy: "Racha de un amigo",
    shareHeading: "Compartí tu racha",
    weekdays: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
  },
} as const;

export function DailyChallengeHub({ locale }: { locale: Locale }) {
  const t = T[locale];
  const [now, setNow] = useState<number | null>(null);
  const [done, setDone] = useState<DoneMap>({});
  const [announce, setAnnounce] = useState("");
  const [returned, setReturned] = useState(false);
  const [shared, setShared] = useState<ShareSnapshot | null>(null);
  const yesRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setDone(readDone());
    setNow(Date.now());
    setShared(parseSnapshot(window.location.search));
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

  useEffect(() => {
    if (returned) yesRef.current?.focus();
  }, [returned]);

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

  const sharePath = locale === "es" ? "/es/reto-diario" : "/daily-challenge";
  const sharePng = useCallback(async () => {
    if (!today) return;
    const blob = await renderShareCard(buildSnapshot(done, today), {
      title: t.shareTitle, streak: t.streak, best: t.best, days: t.days, summary: t.summary,
    });
    if (!blob) return setAnnounce(t.shareFail);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "utilihub-daily-challenge.png";
    a.click();
    URL.revokeObjectURL(a.href);
    setAnnounce(t.shareReady);
  }, [done, t, today]);
  const shareLink = useCallback(async () => {
    if (!today) return;
    try {
      await navigator.clipboard.writeText(shareUrl(buildSnapshot(done, today), sharePath));
      setAnnounce(t.shareCopied);
    } catch {
      setAnnounce(t.shareFail);
    }
  }, [done, sharePath, t, today]);

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
            className="inline-flex min-h-11 items-center rounded-xl bg-primary px-5 py-2 font-bold text-primary-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none"
          >
            {t.play}
          </a>
          <button
            type="button"
            onClick={toggle}
            className="inline-flex min-h-11 items-center rounded-xl border border-border px-5 py-2 font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none"
          >
            {isDone ? t.undo : t.markDone}
          </button>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">{t.hint}</p>
      </div>

      {shared ? (
        <div className="rounded-2xl border border-emerald-500/50 bg-emerald-500/10 p-4" aria-label={t.sharedBy}>
          <p className="font-semibold">
            {t.sharedBy}: {shared.current} {t.days} · {t.best.toLowerCase()} {shared.best}
          </p>
          <p className="mt-1 text-xs text-muted-foreground" aria-hidden="true">
            {shared.bits.split("").map((c) => (c === "1" ? "🟩" : "⬛")).join("")}
          </p>
        </div>
      ) : null}

      {returned && !isDone ? (
        <div className="rounded-2xl border border-cyan-500/50 bg-cyan-500/10 p-4" role="alert">
          <p className="font-semibold">{t.welcomeBack}</p>
          <div className="mt-3 flex flex-wrap gap-3">
            <button
              ref={yesRef}
              type="button"
              onClick={() => confirmReturn(true)}
              className="inline-flex min-h-11 items-center rounded-xl bg-primary px-5 py-2 font-bold text-primary-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none"
            >
              {t.yesDone}
            </button>
            <button
              type="button"
              onClick={() => confirmReturn(false)}
              className="inline-flex min-h-11 items-center rounded-xl border border-border px-5 py-2 font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none"
            >
              {t.notYet}
            </button>
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-3 gap-3 text-center">
        <Stat label={t.streak} value={`${streaks.current} ${streaks.current === 1 ? t.day : t.days}`} />
        <Stat label={t.best} value={`${streaks.best} ${streaks.best === 1 ? t.day : t.days}`} />
        <Stat label={t.next} value={formatCountdown(msUntilNext(now))} />
      </div>

      <div className="rounded-2xl border border-border bg-card p-4">
        <h3 className="text-sm font-bold">{t.calendar}</h3>
        <p className="mt-1 text-xs text-muted-foreground">{countDone(done, strip)}/28 {t.summary}</p>
        {countDone(done, strip) === 0 ? <p className="mt-1 text-xs font-medium">{t.emptyState}</p> : null}
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

      <div className="rounded-2xl border border-border bg-card p-4">
        <h3 className="text-sm font-bold">{t.shareHeading}</h3>
        <div className="mt-3 flex flex-wrap gap-3">
          <button type="button" onClick={sharePng} className="inline-flex min-h-11 items-center rounded-xl bg-primary px-5 py-2 font-bold text-primary-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none">
            {t.sharePng}
          </button>
          <button type="button" onClick={shareLink} className="inline-flex min-h-11 items-center rounded-xl border border-border px-5 py-2 font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none">
            {t.shareLink}
          </button>
        </div>
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
