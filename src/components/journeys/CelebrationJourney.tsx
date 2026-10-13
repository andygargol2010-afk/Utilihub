import { useMemo, useState, useEffect, useCallback } from "react";

type Occasion = "birthday" | "wedding" | "baby" | "graduation" | "party";
type Locale = "en" | "es";

const OCCASIONS: Occasion[] = ["birthday", "wedding", "baby", "graduation", "party"];

const LABELS = {
  en: {
    step1: "Step 1: Occasion & Guests",
    step2: "Step 2: Budget Breakdown",
    step3: "Step 3: Checklist",
    step4: "Step 4: Invite Preview",
    occasion: "Occasion",
    guests: "Number of guests",
    birthday: "Birthday",
    wedding: "Wedding",
    baby: "Baby shower",
    graduation: "Graduation",
    party: "Party",
    budget: "Budget",
    food: "Food & drinks",
    decor: "Decorations",
    gifts: "Gifts",
    venue: "Venue",
    total: "Total",
    checklist: "Tasks",
    addTask: "Add task",
    invite: "Invite card",
    host: "Host name",
    date: "Date",
    message: "Message",
    share: "Share link",
    copied: "Copied!",
    continue: "Continue",
    back: "Back",
    live: "Live preview",
    dragHint: "Drag to reorder",
  },
  es: {
    step1: "Paso 1: Ocasión e invitados",
    step2: "Paso 2: Desglose de presupuesto",
    step3: "Paso 3: Lista de tareas",
    step4: "Paso 4: Vista previa de invitación",
    occasion: "Ocasión",
    guests: "Número de invitados",
    birthday: "Cumpleaños",
    wedding: "Boda",
    baby: "Baby shower",
    graduation: "Graduación",
    party: "Fiesta",
    budget: "Presupuesto",
    food: "Comida y bebida",
    decor: "Decoración",
    gifts: "Regalos",
    venue: "Lugar",
    total: "Total",
    checklist: "Tareas",
    addTask: "Añadir tarea",
    invite: "Tarjeta de invitación",
    host: "Nombre del anfitrión",
    date: "Fecha",
    message: "Mensaje",
    share: "Compartir enlace",
    copied: "¡Copiado!",
    continue: "Continuar",
    back: "Volver",
    live: "Vista previa en vivo",
    dragHint: "Arrastra para reordenar",
  },
} as const;

function parseInitial(locale: Locale) {
  if (typeof window === "undefined") return null;
  const p = new URLSearchParams(window.location.search);
  return {
    step: Math.min(4, Math.max(1, Number(p.get("s")) || 1)),
    occasion: (OCCASIONS.includes(p.get("o") as Occasion) ? p.get("o") : "birthday") as Occasion,
    guests: Math.min(100, Math.max(1, Number(p.get("g")) || 20)),
    food: Number(p.get("f")) || 300,
    decor: Number(p.get("d")) || 100,
    gifts: Number(p.get("gi")) || 150,
    venue: Number(p.get("v")) || 200,
    host: p.get("h") || "Alex",
    date: p.get("dt") || "2026-12-15",
    message: p.get("m") || (locale === "es" ? "¡Ven a celebrar con nosotros!" : "Join us to celebrate!"),
    tasks: (p.get("tk") || "Send invites|Buy cake|Book venue").split("|").filter(Boolean),
  };
}

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
  const [tasks, setTasks] = useState(initial?.tasks ?? ["Send invites", "Buy cake", "Book venue"]);
  const [newTask, setNewTask] = useState("");
  const [host, setHost] = useState(initial?.host ?? "Alex");
  const [date, setDate] = useState(initial?.date ?? "2026-12-15");
  const [message, setMessage] = useState(initial?.message ?? (locale === "es" ? "¡Ven a celebrar con nosotros!" : "Join us to celebrate!"));
  const [copied, setCopied] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  const total = useMemo(() => food + decor + gifts + venue, [food, decor, gifts, venue]);
  const pct = (n: number) => (total ? Math.round((n / total) * 100) : 0);

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
      tk: tasks.join("|"),
    });
    const url = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, "", url);
  }, [step, occasion, guests, food, decor, gifts, venue, host, date, message, tasks]);

  useEffect(() => {
    syncUrl();
  }, [syncUrl]);

  const addTask = () => {
    if (newTask.trim()) {
      setTasks((prev) => [...prev, newTask.trim()]);
      setNewTask("");
    }
  };

  const removeTask = (i: number) => setTasks((prev) => prev.filter((_, idx) => idx !== i));

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
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Progress */}
      <div className="flex gap-2 text-sm font-semibold">
        {[1, 2, 3, 4].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setStep(n)}
            className={`rounded-full px-4 py-1.5 transition ${step === n ? "bg-primary text-primary-foreground" : "bg-accent hover:bg-accent/80"}`}
          >
            {n}
          </button>
        ))}
      </div>

      {step === 1 && (
        <section className="space-y-4 rounded-2xl border border-border/70 bg-surface p-6">
          <h2 className="text-lg font-bold">{t.step1}</h2>
          <div>
            <p className="text-sm font-medium">{t.occasion}</p>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {OCCASIONS.map((o) => (
                <button
                  key={o}
                  type="button"
                  onClick={() => setOccasion(o)}
                  className={`rounded-xl border px-3 py-2 text-sm font-semibold transition ${occasion === o ? "border-primary bg-accent text-primary" : "border-border hover:border-primary/40"}`}
                >
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
        <section className="space-y-4 rounded-2xl border border-border/70 bg-surface p-6">
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
            <div className="mt-2 space-y-2 text-xs">
              {[
                [t.food, food],
                [t.decor, decor],
                [t.gifts, gifts],
                [t.venue, venue],
              ].map(([label, val]) => (
                <div key={label}>
                  <div className="flex justify-between"><span>{label}</span><span>{pct(val as number)}%</span></div>
                  <div className="h-2 overflow-hidden rounded bg-muted"><div className="h-full bg-primary" style={{ width: `${pct(val as number)}%` }} /></div>
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
        <section className="space-y-4 rounded-2xl border border-border/70 bg-surface p-6">
          <h2 className="text-lg font-bold">{t.step3}</h2>
          <p className="text-xs text-muted-foreground">{t.dragHint}</p>
          <ul className="space-y-2">
            {tasks.map((task, i) => (
              <li
                key={i}
                draggable
                onDragStart={() => onDragStart(i)}
                onDragOver={(e) => onDragOver(e, i)}
                onDragEnd={onDragEnd}
                className={`flex items-center justify-between rounded border px-3 py-2 text-sm cursor-move ${dragIdx === i ? "opacity-50" : ""}`}
              >
                <span>{task}</span>
                <button type="button" onClick={() => removeTask(i)} className="text-destructive text-xs">×</button>
              </li>
            ))}
          </ul>
          <div className="flex gap-2">
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
        <section className="space-y-4 rounded-2xl border border-border/70 bg-surface p-6">
          <h2 className="text-lg font-bold">{t.step4}</h2>
          <div className="space-y-3">
            <label className="block text-sm">{t.host}<input value={host} onChange={(e) => setHost(e.target.value)} className="mt-1 w-full rounded border px-3 py-2" /></label>
            <label className="block text-sm">{t.date}<input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 w-full rounded border px-3 py-2" /></label>
            <label className="block text-sm">{t.message}<textarea value={message} onChange={(e) => setMessage(e.target.value)} className="mt-1 w-full rounded border px-3 py-2" rows={2} /></label>
          </div>
          <div className="rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-accent to-background p-6 text-center shadow-lg">
            <p className="text-xs uppercase tracking-wider text-primary">{t[occasion]}</p>
            <h3 className="mt-2 text-2xl font-black">{host}</h3>
            <p className="mt-1 text-sm">{date}</p>
            <p className="mt-3 text-base">{message}</p>
            <p className="mt-2 text-xs text-muted-foreground">{guests} {t.guests.toLowerCase()} · ${total}</p>
          </div>
          <button type="button" onClick={share} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
            {copied ? t.copied : t.share}
          </button>
          <button type="button" onClick={() => setStep(3)} className="text-sm font-semibold text-muted-foreground underline">{t.back}</button>
        </section>
      )}

      <p className="text-xs text-muted-foreground">{t.live}</p>
    </div>
  );
}
