import { useCallback, useEffect, useMemo, useState } from "react";
import { type Locale, type CategoryId, CATEGORIES } from "./GoalProgressJourney.part1";

export function GoalProgressJourney({ locale }: { locale: Locale }) {
  const [categoryId, setCategoryId] = useState<CategoryId | null>(() => {
    if (typeof window === "undefined") return null;
    const p = new URLSearchParams(window.location.search).get("cat");
    return (p as CategoryId) || null;
  });
  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    if (typeof window === "undefined") return {};
    try {
      const raw = new URLSearchParams(window.location.search).get("c");
      return raw ? JSON.parse(decodeURIComponent(raw)) : {};
    } catch {
      return {};
    }
  });
  const [copied, setCopied] = useState(false);

  const category = useMemo(
    () => CATEGORIES.find((c) => c.id === categoryId) || null,
    [categoryId],
  );

  const totalItems = useMemo(() => {
    if (!category) return 0;
    return category.stages.reduce((sum, s) => sum + s.items.length, 0);
  }, [category]);

  const doneCount = useMemo(() => {
    return Object.values(checked).filter(Boolean).length;
  }, [checked]);

  const progressPct = totalItems > 0 ? Math.round((doneCount / totalItems) * 100) : 0;
  const allDone = totalItems > 0 && doneCount === totalItems;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (categoryId) url.searchParams.set("cat", categoryId);
    else url.searchParams.delete("cat");
    if (Object.keys(checked).length) {
      url.searchParams.set("c", encodeURIComponent(JSON.stringify(checked)));
    } else {
      url.searchParams.delete("c");
    }
    window.history.replaceState({}, "", url.toString());
  }, [categoryId, checked]);

  const toggle = useCallback((key: string) => {
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const reset = () => {
    setCategoryId(null);
    setChecked({});
  };

  const copyLink = async () => {
    if (typeof window === "undefined") return;
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  if (!category) {
    return (
      <div className="space-y-6 max-w-2xl">
        <p className="text-lg">
          {locale === "es"
            ? "Elige una categoría de objetivo para empezar tu recorrido."
            : "Choose a goal category to start your journey."}
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategoryId(c.id)}
              className="min-h-12 rounded-xl border border-border bg-card p-4 text-left font-medium hover:bg-accent/50"
            >
              {c.name[locale]}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <p className="text-sm font-semibold text-primary">{category.name[locale]}</p>
        <div className="mt-2 flex items-center gap-3">
          <div
            className="h-3 flex-1 overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-valuenow={progressPct}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="text-sm font-bold tabular-nums">{progressPct}%</span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {doneCount} / {totalItems} {locale === "es" ? "pasos" : "steps"}
        </p>
      </div>

      {category.stages.map((stage, si) => (
        <div key={stage.id} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <h3 className="font-bold">
            {si + 1}. {stage.title[locale]}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">{stage.tip[locale]}</p>
          <ul className="mt-3 space-y-2">
            {stage.items.map((item) => {
              const key = `${stage.id}-${item.id}`;
              const isChecked = !!checked[key];
              return (
                <li key={item.id}>
                  <label className="flex min-h-10 cursor-pointer items-start gap-3 rounded-lg p-2 hover:bg-muted/50">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggle(key)}
                      className="mt-1 h-4 w-4 rounded border-border"
                      aria-label={item.text[locale]}
                    />
                    <span className={isChecked ? "line-through text-muted-foreground" : ""}>
                      {item.text[locale]}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      {allDone && (
        <div className="rounded-2xl border border-primary/40 bg-accent/40 p-5 text-center">
          <h2 className="text-xl font-black">
            {locale === "es" ? "¡Recorrido completado!" : "Journey complete!"}
          </h2>
          <p className="mt-2 text-muted-foreground">
            {locale === "es"
              ? "Has marcado todos los pasos. Comparte tu progreso o empieza otro objetivo."
              : "You checked every step. Share your progress or start another goal."}
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={copyLink}
              className="min-h-11 rounded-lg bg-secondary px-4 py-2.5 text-sm font-bold"
            >
              {copied
                ? locale === "es"
                  ? "¡Copiado!"
                  : "Copied!"
                : locale === "es"
                  ? "Copiar enlace"
                  : "Copy link"}
            </button>
            <button
              type="button"
              onClick={reset}
              className="min-h-11 rounded-lg bg-accent px-4 py-2.5 text-sm font-bold"
            >
              {locale === "es" ? "Empezar otro" : "Start another"}
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={reset}
        className="min-h-10 rounded-lg bg-secondary px-3 py-2 text-sm font-medium"
      >
        {locale === "es" ? "Cambiar categoría" : "Change category"}
      </button>
    </div>
  );
}
