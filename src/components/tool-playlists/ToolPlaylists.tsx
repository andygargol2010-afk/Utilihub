import { useEffect, useMemo, useState } from "react";
import { findPlaylist, resolveAll, type Locale } from "@/lib/tool-playlists/logic";

const T = {
  en: {
    pick: "Choose a playlist",
    steps: "steps",
    step: "Step",
    why: "Why this step",
    open: "Open",
    back: "All playlists",
    start: "View playlist",
    nav: "Playlists",
  },
  es: {
    pick: "Elige una lista",
    steps: "pasos",
    step: "Paso",
    why: "Por qué este paso",
    open: "Abrir",
    back: "Todas las listas",
    start: "Ver lista",
    nav: "Listas",
  },
} as const;

const btn =
  "motion-reduce:transform-none motion-reduce:transition-none inline-flex min-h-[44px] items-center justify-center rounded-xl px-5 font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500";

export function ToolPlaylists({ locale }: { locale: Locale }) {
  const t = T[locale];
  const lists = useMemo(() => resolveAll(locale), [locale]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("p");
    if (findPlaylist(p, locale)) setActiveId(p);
  }, [locale]);

  const select = (id: string | null) => {
    setActiveId(id);
    window.history.replaceState(null, "", `${window.location.pathname}${id ? `?p=${id}` : ""}`);
  };

  const active = findPlaylist(activeId, locale);

  if (active) {
    return (
      <section aria-labelledby="pl-title">
        <button type="button" onClick={() => select(null)} className={`${btn} border border-border bg-card`}>
          ← {t.back}
        </button>
        <h2 id="pl-title" className="mt-5 text-2xl font-black tracking-tight">
          <span aria-hidden="true">{active.emoji} </span>
          {active.title}
        </h2>
        <p className="mt-1 text-muted-foreground">{active.goal}</p>
        <ol className="mt-5 space-y-3">
          {active.steps.map((s, i) => (
            <li key={`${s.target}-${i}`} className="rounded-2xl border border-border bg-card p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-500">
                {t.step} {i + 1}
              </p>
              <p className="mt-1 text-lg font-bold">{s.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                <span className="font-semibold">{t.why}:</span> {s.why}
              </p>
              <a href={s.path} className={`${btn} mt-3 bg-cyan-500 text-black`}>
                {t.open} →
              </a>
            </li>
          ))}
        </ol>
      </section>
    );
  }

  return (
    <section aria-labelledby="pl-pick">
      <h2 id="pl-pick" className="text-lg font-bold">{t.pick}</h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {lists.map((p) => (
          <li key={p.id}>
            <button
              type="button"
              onClick={() => select(p.id)}
              className="motion-reduce:transform-none motion-reduce:transition-none block min-h-[44px] w-full rounded-2xl border border-border bg-card p-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500"
            >
              <span className="text-2xl" aria-hidden="true">{p.emoji}</span>
              <span className="mt-1 block text-lg font-bold">{p.title}</span>
              <span className="mt-1 block text-sm text-muted-foreground">{p.goal}</span>
              <span className="mt-2 block text-xs font-bold uppercase tracking-[0.18em] text-cyan-500">
                {p.steps.length} {t.steps}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
