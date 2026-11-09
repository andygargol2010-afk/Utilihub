import { useMemo, useState, useEffect, useCallback } from "react";
import { type Occasion } from "./CelebrationJourney.part1";
import { type Locale, LABELS, parseInitial, OCCASION_META, OCCASIONS } from "./CelebrationJourney.part2";

export function CelebrationJourney({ locale }: { locale: Locale }) {
  const t = LABELS[locale];
  const initial = parseInitial(locale);
  const [step, setStep] = useState(initial?.step ?? 1);
  const [occasion, setOccasion] = useState<Occasion>(initial?.occasion ?? "birthday");
  const [guests, setGuests] = useState(initial?.guests ?? 20);
  const [food, setFood] = useState(initial?.food ?? 300);
  const [decor, setDecor] = useState(initial?.decor ?? 100);
  const [gifts, setGifts] = useState(initial?.gifts ?? 150);
  const [venue, setVenue] = useState(initial?.venue ?? 200);
  const [tasks, setTasks] = useState(initial?.tasks ?? [{ text: "Send invites", done: false }, { text: "Buy cake", done: false }, { text: "Book venue", done: false }]);
  const [newTask, setNewTask] = useState("");
  const [host, setHost] = useState(initial?.host ?? "Alex");
  const [date, setDate] = useState(initial?.date ?? "2026-12-15");
  const [message, setMessage] = useState(initial?.message ?? (locale === "es" ? "¡Ven a celebrar con nosotros!" : "Join us to celebrate!"));
  const [copied, setCopied] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  const total = useMemo(() => food + decor + gifts + venue, [food, decor, gifts, venue]);
  const pct = (n: number) => (total ? Math.round((n / total) * 100) : 0);
  const perGuest = guests ? Math.round(total / guests) : 0;
  const meta = OCCASION_META[occasion];
  const progressPct = ((step - 1) / 3) * 100;
  const doneCount = tasks.filter((x) => x.done).length;

  const stepLabels = [t.step1, t.step2, t.step3, t.step4];

  const syncUrl = useCallback(() => {
    const params = new URLSearchParams({
      s: String(step),
      o: occasion,
      g: String(guests),
      f: String(food),
      d: String(decor),
      gi: String(gifts),
      v: String(venue),
      h: host,
      dt: date,
      m: message,
      tk: tasks.map((x) => x.text).join("|"),
      td: tasks.filter((x) => x.done).map((x) => x.text).join("|"),
    });
    const url = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, "", url);
  }, [step, occasion, guests, food, decor, gifts, venue, host, date, message, tasks]);

  useEffect(() => {
    syncUrl();
  }, [syncUrl]);

  const addTask = () => {
    if (newTask.trim()) {
      setTasks((prev) => [...prev, { text: newTask.trim(), done: false }]);
      setNewTask("");
    }
  };

  const removeTask = (i: number) => setTasks((prev) => prev.filter((_, idx) => idx !== i));

  const toggleTask = (i: number) => setTasks((prev) => prev.map((x, idx) => idx === i ? { ...x, done: !x.done } : x));

  const moveTask = (from: number, to: number) => {
    if (to < 0 || to >= tasks.length) return;
    setTasks((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  };

  const onDragStart = (i: number) => setDragIdx(i);
  const onDragOver = (e: React.DragEvent, i: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === i) return;
    setTasks((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIdx, 1);
      next.splice(i, 0, moved);
      return next;
    });
    setDragIdx(i);
  };
  const onDragEnd = () => setDragIdx(null);

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-2 sm:px-0">
      {/* Progress */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t.progress}</p>
          <span className="text-xs font-bold text-primary">{Math.round(progressPct)}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progressPct}%` }} />
        </div>
        <div className="flex flex-wrap gap-2 text-sm font-semibold">
          {[1, 2, 3, 4].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setStep(n)}
              className={`flex-1 min-w-[120px] rounded-full px-3 py-2 transition text-center ${step === n ? "bg-primary text-primary-foreground" : "bg-accent hover:bg-accent/80"}`}
            >
              <span className="block text-xs opacity-80">{n}</span>
              <span className="block text-xs sm:text-sm leading-tight">{stepLabels[n - 1].split(":")[1]?.trim() || stepLabels[n - 1]}</span>
            </button>
          ))}
        </div>
      </div>

      {step === 1 && (
        <section className="space-y-4 rounded-2xl border border-border/70 bg-surface p-4 sm:p-6">
          <h2 className="text-lg font-bold">{t.step1}</h2>
          <div>
            <p className="text-sm font-medium">{t.occasion}</p>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {OCCASIONS.map((o) => (
                <button
                  key={o}
                  type="button"
                  onClick={() => setOccasion(o)}
                  className={`rounded-xl border px-3 py-3 text-sm font-semibold transition flex flex-col items-center gap-1 ${occasion === o ? "border-primary bg-accent text-primary" : "border-border hover:border-primary/40"}`}
                >
                  <span className="text-2xl">{OCCASION_META[o].icon}</span>
                  {t[o]}
                </button>
              ))}
            </div>
          </div>
          <label className="block text-sm font-medium">
            {t.guests}: {guests}
            <input
              type="range"
              min={1}
              max={100}
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="mt-2 w-full"
            />
          </label>
          <div className="flex flex-wrap gap-1" aria-hidden>
            {Array.from({ length: Math.min(guests, 24) }).map((_, i) => (
              <span key={i} className="text-lg">👤</span>
            ))}
            {guests > 24 && <span className="text-sm text-muted-foreground">+{guests - 24}</span>}
          </div>
          <button type="button" onClick={() => setStep(2)} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
            {t.continue}
          </button>
        </section>
      )}

      {step === 2 && (
        <section className="space-y-4 rounded-2xl border border-border/70 bg-surface p-4 sm:p-6">
          <h2 className="text-lg font-bold">{t.step2}</h2>
          {([
            ["food", food, setFood, t.food],
            ["decor", decor, setDecor, t.decor],
            ["gifts", gifts, setGifts, t.gifts],
            ["venue", venue, setVenue, t.venue],
          ] as const).map(([key, val, set, label]) => (
            <label key={key} className="block text-sm">
              {label}: ${val}
              <input
                type="range"
                min={0}
                max={1000}
                step={10}
                value={val}
                onChange={(e) => set(Number(e.target.value))}
                className="mt-1 w-full"
              />
            </label>
          ))}
          <div className="rounded-lg bg-accent/50 p-3">
            <p className="font-bold">{t.total}: ${total}</p>
            <p className="text-xs text-muted-foreground mt-1">~${perGuest} {t.perGuest}</p>
            <div className="mt-3 space-y-2 text-xs">
              {[
                [t.food, food, "bg-emerald-500"],
                [t.decor, decor, "bg-amber-500"],
                [t.gifts, gifts, "bg-rose-500"],
                [t.venue, venue, "bg-sky-500"],
              ].map(([label, val, color]) => (
                <div key={label}>
                  <div className="flex justify-between"><span>{label}</span><span>{pct(val as number)}%</span></div>
                  <div className="h-2 overflow-hidden rounded bg-muted"><div className={`h-full ${color} transition-all`} style={{ width: `${pct(val as number)}%` }} /></div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setStep(1)} className="text-sm font-semibold text-muted-foreground underline">{t.back}</button>
            <button type="button" onClick={() => setStep(3)} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">{t.continue}</button>
          </div>
        </section>
      )}

      {step === 3 && (
        <section className="space-y-4 rounded-2xl border border-border/70 bg-surface p-4 sm:p-6">
          <h2 className="text-lg font-bold">{t.step3}</h2>
          <p className="text-xs text-muted-foreground">{t.dragHint} · {doneCount}/{tasks.length} {t.done}</p>
          <ul className="space-y-2">
            {tasks.map((task, i) => (
              <li
                key={i}
                draggable
                onDragStart={() => onDragStart(i)}
                onDragOver={(e) => onDragOver(e, i)}
                onDragEnd={onDragEnd}
                className={`flex items-center justify-between rounded border px-3 py-2 text-sm cursor-move transition ${dragIdx === i ? "opacity-50 bg-accent" : "hover:border-primary/40"} ${task.done ? "opacity-60 line-through" : ""}`}
              >
                <label className="flex items-center gap-2 flex-1 cursor-pointer">
                  <input type="checkbox" checked={task.done} onChange={() => toggleTask(i)} className="rounded" />
                  <span>{task.text}</span>
                </label>
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => moveTask(i, i - 1)} disabled={i === 0} className="text-xs px-1 disabled:opacity-30" aria-label="up">↑</button>
                  <button type="button" onClick={() => moveTask(i, i + 1)} disabled={i === tasks.length - 1} className="text-xs px-1 disabled:opacity-30" aria-label="down">↓</button>
                  <button type="button" onClick={() => removeTask(i)} className="text-destructive text-xs ml-1">×</button>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTask()}
              placeholder={t.addTask}
              className="flex-1 rounded border px-3 py-2 text-sm"
            />
            <button type="button" onClick={addTask} className="rounded bg-accent px-3 py-2 text-sm font-semibold">{t.addTask}</button>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setStep(2)} className="text-sm font-semibold text-muted-foreground underline">{t.back}</button>
            <button type="button" onClick={() => setStep(4)} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">{t.continue}</button>
          </div>
        </section>
      )}

      {step === 4 && (
        <section className="space-y-4 rounded-2xl border border-border/70 bg-surface p-4 sm:p-6">
          <h2 className="text-lg font-bold">{t.step4}</h2>
          <div className="space-y-3">
            <label className="block text-sm">{t.host}<input value={host} onChange={(e) => setHost(e.target.value)} className="mt-1 w-full rounded border px-3 py-2" /></label>
            <label className="block text-sm">{t.date}<input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 w-full rounded border px-3 py-2" /></label>
            <label className="block text-sm">{t.message}<textarea value={message} onChange={(e) => setMessage(e.target.value)} className="mt-1 w-full rounded border px-3 py-2" rows={2} /></label>
          </div>
          <div className={`rounded-2xl border-2 border-primary/30 bg-gradient-to-br ${meta.gradient} p-6 text-center text-white shadow-lg`}>
            <p className="text-4xl">{meta.icon}</p>
            <p className="mt-2 text-xs uppercase tracking-wider opacity-90">{t[occasion]}</p>
            <h3 className="mt-1 text-2xl font-black">{host}</h3>
            <p className="mt-1 text-sm opacity-90">{date}</p>
            <p className="mt-3 text-base">{message}</p>
            <p className="mt-2 text-xs opacity-80">{guests} {t.guests.toLowerCase()} · ${total} · {doneCount}/{tasks.length} {t.done}</p>
          </div>
          <button type="button" onClick={share} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
            {copied ? t.copied : t.share}
          </button>
          <button type="button" onClick={() => setStep(3)} className="text-sm font-semibold text-muted-foreground underline">{t.back}</button>
        </section>
      )}

      <p className="text-xs text-muted-foreground text-center">{t.live}</p>
    </div>
  );
}
