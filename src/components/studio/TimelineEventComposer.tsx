import { useState, useMemo } from "react";
import { Plus, ArrowUp, ArrowDown, Trash2 } from "lucide-react";

type EventItem = {
  id: string;
  title: string;
  description: string;
  date?: string;
  tag?: string;
};

export function TimelineEventComposer({ locale = "en" }: { locale?: "en" | "es" }) {
  const isEs = locale === "es";
  const [events, setEvents] = useState<EventItem[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [tag, setTag] = useState("");

  const t = isEs
    ? {
        heading: "Compositor de Línea de Tiempo",
        subtitle: "Añade eventos, reordénalos y ve la línea de tiempo en vivo.",
        titleLabel: "Título",
        descLabel: "Descripción",
        dateLabel: "Fecha (opcional)",
        tagLabel: "Etiqueta (opcional)",
        add: "Añadir evento",
        reorder: "Reordenar",
        empty: "Añade al menos un evento para ver la línea de tiempo.",
        events: "Eventos",
      }
    : {
        heading: "Timeline Event Composer",
        subtitle: "Add events, reorder them, and see the live timeline.",
        titleLabel: "Title",
        descLabel: "Description",
        dateLabel: "Date (optional)",
        tagLabel: "Tag (optional)",
        add: "Add event",
        reorder: "Reorder",
        empty: "Add at least one event to see the timeline.",
        events: "Events",
      };

  const addEvent = () => {
    if (!title.trim()) return;
    const newEvent: EventItem = {
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      date: date.trim() || undefined,
      tag: tag.trim() || undefined,
    };
    setEvents((prev) => [...prev, newEvent]);
    setTitle("");
    setDescription("");
    setDate("");
    setTag("");
  };

  const move = (index: number, dir: -1 | 1) => {
    const next = [...events];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setEvents(next);
  };

  const remove = (id: string) => setEvents((prev) => prev.filter((e) => e.id !== id));

  const timelineHeight = Math.max(200, events.length * 80);

  const svgLines = useMemo(() => {
    if (events.length < 2) return null;
    const points = events.map((_, i) => 40 + i * 70);
    return points.slice(0, -1).map((y, i) => (
      <line
        key={i}
        x1={40}
        y1={y}
        x2={40}
        y2={points[i + 1]}
        stroke="currentColor"
        strokeWidth={2}
        className="text-primary/60"
      />
    ));
  }, [events]);

  return (
    <div className="container-page py-6 sm:py-8 max-w-4xl mx-auto">
      <header className="mb-6">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{t.heading}</h1>
        <p className="mt-2 text-muted-foreground">{t.subtitle}</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="space-y-4">
          <div className="space-y-3 rounded-2xl border border-border/70 bg-card/50 p-4">
            <label className="block text-sm font-semibold">
              {t.titleLabel}
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                placeholder={isEs ? "Ej. Lanzamiento" : "E.g. Launch"}
              />
            </label>
            <label className="block text-sm font-semibold">
              {t.descLabel}
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                rows={2}
                placeholder={isEs ? "Breve descripción" : "Short description"}
              />
            </label>
            <div className="grid grid-cols-2 gap-2">
              <label className="block text-sm font-semibold">
                {t.dateLabel}
                <input
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  placeholder="2026"
                />
              </label>
              <label className="block text-sm font-semibold">
                {t.tagLabel}
                <input
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  placeholder={isEs ? "hito" : "milestone"}
                />
              </label>
            </div>
            <button
              onClick={addEvent}
              disabled={!title.trim()}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
            >
              <Plus className="size-4" /> {t.add}
            </button>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-bold">{t.events}</h2>
            {events.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t.empty}</p>
            ) : (
              <ul className="space-y-2">
                {events.map((ev, i) => (
                  <li key={ev.id} className="flex items-center gap-2 rounded-lg border border-border/60 bg-background p-3 text-sm">
                    <span className="flex-1">
                      <strong>{ev.title}</strong>
                      {ev.date && <span className="ml-2 text-xs text-muted-foreground">{ev.date}</span>}
                      {ev.tag && <span className="ml-2 rounded-full bg-accent px-2 py-0.5 text-xs">{ev.tag}</span>}
                      {ev.description && <p className="mt-1 text-muted-foreground">{ev.description}</p>}
                    </span>
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => move(i, -1)}
                        disabled={i === 0}
                        aria-label={isEs ? "Subir" : "Move up"}
                        className="rounded p-1 hover:bg-accent disabled:opacity-30"
                      >
                        <ArrowUp className="size-4" />
                      </button>
                      <button
                        onClick={() => move(i, 1)}
                        disabled={i === events.length - 1}
                        aria-label={isEs ? "Bajar" : "Move down"}
                        className="rounded p-1 hover:bg-accent disabled:opacity-30"
                      >
                        <ArrowDown className="size-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => remove(ev.id)}
                      aria-label={isEs ? "Eliminar" : "Remove"}
                      className="rounded p-1 text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold">{isEs ? "Línea de tiempo en vivo" : "Live timeline"}</h2>
          {events.length === 0 ? (
            <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-border text-sm text-muted-foreground">
              {t.empty}
            </div>
          ) : (
            <div className="overflow-auto rounded-2xl border border-border/70 bg-card/30 p-4">
              <svg
                width="100%"
                height={timelineHeight}
                viewBox={`0 0 300 ${timelineHeight}`}
                className="mx-auto max-w-sm"
                aria-label={isEs ? "Línea de tiempo" : "Timeline"}
              >
                {svgLines}
                {events.map((ev, i) => {
                  const y = 40 + i * 70;
                  return (
                    <g key={ev.id}>
                      <circle cx={40} cy={y} r={8} className="fill-primary" />
                      <text x={60} y={y - 8} className="fill-foreground text-sm font-semibold">
                        {ev.title}
                      </text>
                      {ev.date && (
                        <text x={60} y={y + 8} className="fill-muted-foreground text-xs">
                          {ev.date}
                        </text>
                      )}
                      {ev.description && (
                        <text x={60} y={y + 22} className="fill-muted-foreground text-xs" width={220}>
                          {ev.description.slice(0, 40)}{ev.description.length > 40 ? "…" : ""}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
