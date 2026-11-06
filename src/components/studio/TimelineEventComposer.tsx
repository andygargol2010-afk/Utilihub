import { useCallback, useEffect, useState } from "react";

type EventItem = {
  id: string;
  title: string;
  desc: string;
  date?: string;
  tag?: string;
};

const LABELS = {
  en: {
    add: "Add event",
    title: "Title",
    desc: "Description",
    date: "Date (optional)",
    tag: "Tag (optional)",
    up: "Move up",
    down: "Move down",
    remove: "Remove",
    timeline: "Live timeline",
    empty: "Add events to see the timeline",
    events: "Events",
  },
  es: {
    add: "Añadir evento",
    title: "Título",
    desc: "Descripción",
    date: "Fecha (opcional)",
    tag: "Etiqueta (opcional)",
    up: "Subir",
    down: "Bajar",
    remove: "Eliminar",
    timeline: "Línea de tiempo en vivo",
    empty: "Añade eventos para ver la línea de tiempo",
    events: "Eventos",
  },
};

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function encode(events: EventItem[]) {
  try {
    return btoa(unescape(encodeURIComponent(JSON.stringify(events))));
  } catch {
    return "";
  }
}

function decode(s: string | null): EventItem[] | null {
  if (!s) return null;
  try {
    const json = decodeURIComponent(escape(atob(s)));
    const arr = JSON.parse(json);
    if (Array.isArray(arr) && arr.every((e) => e && typeof e.title === "string")) return arr;
    return null;
  } catch {
    return null;
  }
}

export function TimelineEventComposer({ locale }: { locale: "en" | "es" }) {
  const t = LABELS[locale];
  const [events, setEvents] = useState<EventItem[]>(() => {
    if (typeof window === "undefined") return [];
    const p = new URLSearchParams(window.location.search);
    return decode(p.get("tl")) ?? [];
  });
  const [form, setForm] = useState({ title: "", desc: "", date: "", tag: "" });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (events.length) url.searchParams.set("tl", encode(events));
    else url.searchParams.delete("tl");
    window.history.replaceState({}, "", url.toString());
  }, [events]);

  const add = useCallback(() => {
    const title = form.title.trim();
    if (!title) return;
    setEvents((prev) => [
      ...prev,
      { id: uid(), title, desc: form.desc.trim(), date: form.date.trim() || undefined, tag: form.tag.trim() || undefined },
    ]);
    setForm({ title: "", desc: "", date: "", tag: "" });
  }, [form]);

  const move = (idx: number, dir: -1 | 1) => {
    setEvents((prev) => {
      const next = [...prev];
      const j = idx + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[idx], next[j]] = [next[j], next[idx]];
      return next;
    });
  };

  const remove = (id: string) => setEvents((prev) => prev.filter((e) => e.id !== id));

  const height = Math.max(200, events.length * 80 + 40);

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-card p-4">
        <h2 className="mb-3 text-lg font-semibold">{t.add}</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm">
            {t.title}
            <input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="mt-1 w-full rounded border px-2 py-1.5"
              aria-required
            />
          </label>
          <label className="text-sm">
            {t.date}
            <input
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              className="mt-1 w-full rounded border px-2 py-1.5"
              placeholder="2026-01-15"
            />
          </label>
          <label className="text-sm sm:col-span-2">
            {t.desc}
            <textarea
              value={form.desc}
              onChange={(e) => setForm((f) => ({ ...f, desc: e.target.value }))}
              className="mt-1 w-full rounded border px-2 py-1.5"
              rows={2}
            />
          </label>
          <label className="text-sm">
            {t.tag}
            <input
              value={form.tag}
              onChange={(e) => setForm((f) => ({ ...f, tag: e.target.value }))}
              className="mt-1 w-full rounded border px-2 py-1.5"
            />
          </label>
        </div>
        <button
          type="button"
          onClick={add}
          disabled={!form.title.trim()}
          className="mt-3 rounded bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50"
        >
          {t.add}
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-2 text-lg font-semibold">{t.events}</h2>
          {events.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t.empty}</p>
          ) : (
            <ul className="space-y-2">
              {events.map((ev, i) => (
                <li key={ev.id} className="flex items-start gap-2 rounded border p-2 text-sm">
                  <div className="flex-1">
                    <strong>{ev.title}</strong>
                    {ev.date && <span className="ml-2 text-xs text-muted-foreground">{ev.date}</span>}
                    {ev.tag && <span className="ml-2 rounded bg-accent px-1 text-xs">{ev.tag}</span>}
                    {ev.desc && <p className="mt-1 text-muted-foreground">{ev.desc}</p>}
                  </div>
                  <div className="flex flex-col gap-1">
                    <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label={t.up} className="rounded bg-accent px-2 py-1 text-xs disabled:opacity-30">↑</button>
                    <button type="button" onClick={() => move(i, 1)} disabled={i === events.length - 1} aria-label={t.down} className="rounded bg-accent px-2 py-1 text-xs disabled:opacity-30">↓</button>
                    <button type="button" onClick={() => remove(ev.id)} aria-label={t.remove} className="rounded bg-destructive/10 px-2 py-1 text-xs">✕</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h2 className="mb-2 text-lg font-semibold">{t.timeline}</h2>
          <svg viewBox={`0 0 300 ${height}`} className="w-full max-w-md rounded border bg-muted/20" role="img" aria-label={t.timeline}>
            {events.length > 0 && (
              <line x1="40" y1="20" x2="40" y2={height - 20} stroke="currentColor" strokeWidth="2" className="text-primary" />
            )}
            {events.map((ev, i) => {
              const y = 30 + i * 70;
              return (
                <g key={ev.id}>
                  <circle cx="40" cy={y} r="8" fill="currentColor" className="text-primary" />
                  <text x="60" y={y - 8} fontSize="12" fontWeight="bold" fill="currentColor">{ev.title.slice(0, 28)}</text>
                  {ev.date && <text x="60" y={y + 6} fontSize="10" fill="currentColor" opacity="0.7">{ev.date}</text>}
                  {ev.tag && <text x="60" y={y + 18} fontSize="9" fill="currentColor" opacity="0.6">{ev.tag}</text>}
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}
