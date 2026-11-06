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
    sharePng: "Download PNG",
    copyUrl: "Copy link",
    copied: "Copied!",
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
    sharePng: "Descargar PNG",
    copyUrl: "Copiar enlace",
    copied: "¡Copiado!",
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
  const [copied, setCopied] = useState(false);

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

  const sharePng = useCallback(() => {
    if (events.length === 0) return;
    const canvas = document.createElement("canvas");
    const scale = 2;
    const w = 600;
    const h = Math.max(400, 80 + events.length * 90);
    canvas.width = w * scale;
    canvas.height = h * scale;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(scale, scale);

    // Background
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, w, h);

    // Header branding
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, 0, w, 60);
    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 20px system-ui, sans-serif";
    const title = locale === "es" ? "Compositor de Línea de Tiempo" : "Timeline Event Composer";
    ctx.fillText(title, 20, 28);
    ctx.font = "12px system-ui, sans-serif";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("utilihub.com", 20, 48);

    // Timeline line
    const lineX = 80;
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(lineX, 80);
    ctx.lineTo(lineX, h - 40);
    ctx.stroke();

    // Events
    events.forEach((ev, i) => {
      const y = 100 + i * 85;
      // Dot
      ctx.beginPath();
      ctx.arc(lineX, y, 8, 0, Math.PI * 2);
      ctx.fillStyle = "#60a5fa";
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Text
      ctx.fillStyle = "#f1f5f9";
      ctx.font = "bold 14px system-ui, sans-serif";
      ctx.fillText(ev.title.slice(0, 40), lineX + 24, y - 6);
      if (ev.date) {
        ctx.font = "11px system-ui, sans-serif";
        ctx.fillStyle = "#94a3b8";
        ctx.fillText(ev.date, lineX + 24, y + 10);
      }
      if (ev.tag) {
        ctx.font = "10px system-ui, sans-serif";
        ctx.fillStyle = "#a5b4fc";
        ctx.fillText(ev.tag, lineX + 24, y + 24);
      }
      if (ev.desc) {
        ctx.font = "11px system-ui, sans-serif";
        ctx.fillStyle = "#cbd5e1";
        const desc = ev.desc.slice(0, 50);
        ctx.fillText(desc, lineX + 24, y + 38);
      }
    });

    // Footer
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, h - 30, w, 30);
    ctx.fillStyle = "#64748b";
    ctx.font = "11px system-ui, sans-serif";
    ctx.fillText(`${events.length} events · UtiliHub`, 20, h - 10);

    const link = document.createElement("a");
    link.download = locale === "es" ? "linea-tiempo-utilihub.png" : "timeline-utilihub.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, [events, locale]);

  const copyUrl = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, []);

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
          {events.length > 0 && (
            <div className="mt-3 flex gap-2">
              <button type="button" onClick={sharePng} className="rounded bg-primary px-3 py-1.5 text-sm text-primary-foreground">
                {t.sharePng}
              </button>
              <button type="button" onClick={copyUrl} className="rounded bg-accent px-3 py-1.5 text-sm">
                {copied ? t.copied : t.copyUrl}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
