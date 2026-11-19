import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { type Locale, type CategoryId, CATEGORIES } from "./GoalProgressJourney.part1";

const CATEGORY_RECS: Record<CategoryId, { label: Record<Locale, string>; href: string }[]> = {
  learn: [
    { label: { en: "Color Harmony Journey", es: "Jornada Armonía de Color" }, href: "/journeys/color-harmony" },
    { label: { en: "Population Dynamics Simulator", es: "Simulador Dinámica de Población" }, href: "/simulators/population-dynamics" },
  ],
  habit: [
    { label: { en: "Celebration Journey", es: "Jornada de Celebración" }, href: "/journeys/celebration" },
    { label: { en: "Paper Airplane Kit", es: "Kit de Avión de Papel" }, href: "/kits/paper-airplane" },
  ],
  save: [
    { label: { en: "Simple Interest Calculator", es: "Calculadora Interés Simple" }, href: "/tools/calculadora-interes-simple" },
    { label: { en: "Goal Progress (other category)", es: "Progreso de Objetivo (otra categoría)" }, href: "/journeys/goal-progress" },
  ],
  fitness: [
    { label: { en: "Calories Burned Calculator", es: "Calculadora Calorías Quemadas" }, href: "/tools/calculadora-calorias-quemadas" },
    { label: { en: "Simple Circuit Kit", es: "Kit de Circuito Simple" }, href: "/kits/simple-circuit" },
  ],
};

export function GoalProgressJourney({ locale }: { locale: Locale }) {
  const progressRef = useRef<HTMLDivElement>(null);
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
  const [choices, setChoices] = useState<Record<string, string>>(() => {
    if (typeof window === "undefined") return {};
    try {
      const raw = new URLSearchParams(window.location.search).get("ch");
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
    if (Object.keys(choices).length) {
      url.searchParams.set("ch", encodeURIComponent(JSON.stringify(choices)));
    } else {
      url.searchParams.delete("ch");
    }
    window.history.replaceState({}, "", url.toString());
  }, [categoryId, checked, choices]);

  useEffect(() => {
    if (category && progressRef.current) {
      progressRef.current.focus();
    }
  }, [category]);

  const toggle = useCallback((key: string) => {
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const setChoice = useCallback((stageId: string, value: string) => {
    setChoices((prev) => ({ ...prev, [stageId]: value }));
  }, []);

  const reset = () => {
    setCategoryId(null);
    setChecked({});
    setChoices({});
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

  const downloadPng = () => {
    if (!category || !allDone) return;
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 560;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, 800, 560);
    ctx.fillStyle = "#22d3ee";
    ctx.font = "bold 32px system-ui, sans-serif";
    ctx.fillText(locale === "es" ? "Recorrido completado" : "Journey complete", 40, 80);
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "24px system-ui, sans-serif";
    ctx.fillText(category.name[locale], 40, 140);
    ctx.font = "20px system-ui, sans-serif";
    ctx.fillText(`${progressPct}% · ${doneCount}/${totalItems}`, 40, 190);
    const choiceSummary = Object.keys(choices).length
      ? (locale === "es" ? "Elecciones: " : "Choices: ") + Object.values(choices).slice(0, 3).join(", ")
      : "";
    if (choiceSummary) {
      ctx.font = "16px system-ui, sans-serif";
      ctx.fillText(choiceSummary, 40, 230);
    }
    ctx.fillStyle = "#94a3b8";
    ctx.font = "16px system-ui, sans-serif";
    ctx.fillText("UtiliHub · Goal Progress Journey", 40, 480);
    const link = document.createElement("a");
    link.download = `goal-progress-${categoryId}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  if (!category) {
    return (
      <div className="space-y-6 max-w-2xl" role="region" aria-label={locale === "es" ? "Selector de categoría" : "Category selector"}>
        <p className="text-lg">
          {locale === "es"
            ? "Elige una categoría de objetivo para empezar tu recorrido."
            : "Choose a goal category to start your journey."}
        </p>
        <div className="grid gap-3 sm:grid-cols-2" role="listbox" aria-label={locale === "es" ? "Categorías" : "Categories"}>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategoryId(c.id)}
              className="min-h-12 rounded-xl border border-border bg-card p-4 text-left font-medium hover:bg-accent/50 focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label={c.name[locale]}
            >
              {c.name[locale]}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const recs = CATEGORY_RECS[category.id] || [];

  return (
    <div className="space-y-5 max-w-2xl sm:space-y-6" role="main">
      <div ref={progressRef} tabIndex={-1} className="outline-none">
        <p className="text-sm font-semibold text-primary" id="journey-title">{category.name[locale]}</p>
        <div className="mt-2 flex items-center gap-3">
          <div
            className="h-3 flex-1 overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-valuenow={progressPct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-labelledby="journey-title"
            aria-live="polite"
          >
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="text-sm font-bold tabular-nums" aria-hidden="true">{progressPct}%</span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {doneCount} / {totalItems} {locale === "es" ? "pasos" : "steps"}
        </p>
      </div>

      {category.stages.map((stage, si) => {
        const choiceKey = stage.id;
        const selected = choices[choiceKey] || "";
        const branchedTip =
          selected === "short"
            ? locale === "es"
              ? "Sesiones cortas y frecuentes funcionan mejor."
              : "Short frequent sessions work better."
            : selected === "deep"
              ? locale === "es"
                ? "Bloques más largos cuando tengas foco."
                : "Longer blocks when you have focus."
              : stage.tip[locale];
        return (
          <div key={stage.id} className="rounded-2xl border border-border bg-card p-3 shadow-sm sm:p-4" role="group" aria-labelledby={`stage-${stage.id}`}>
            <h3 className="font-bold" id={`stage-${stage.id}`}>
              {si + 1}. {stage.title[locale]}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">{branchedTip}</p>
            <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label={locale === "es" ? "Estilo de etapa" : "Stage style"}>
              <button
                type="button"
                onClick={() => setChoice(choiceKey, "short")}
                className={`min-h-9 rounded-lg px-3 py-1 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary ${selected === "short" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}
                aria-pressed={selected === "short"}
              >
                {locale === "es" ? "Corto" : "Short"}
              </button>
              <button
                type="button"
                onClick={() => setChoice(choiceKey, "deep")}
                className={`min-h-9 rounded-lg px-3 py-1 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary ${selected === "deep" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}
                aria-pressed={selected === "deep"}
              >
                {locale === "es" ? "Profundo" : "Deep"}
              </button>
            </div>
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
        );
      })}

      {allDone && (
        <div className="rounded-2xl border border-primary/40 bg-accent/40 p-4 text-center sm:p-5" role="region" aria-label={locale === "es" ? "Completado" : "Completed"}>
          <h2 className="text-xl font-black">
            {locale === "es" ? "¡Recorrido completado!" : "Journey complete!"}
          </h2>
          <p className="mt-2 text-muted-foreground">
            {locale === "es"
              ? "Has marcado todos los pasos. Comparte tu tarjeta o enlace."
              : "You checked every step. Share your card or link."}
          </p>
          {recs.length > 0 && (
            <div className="mt-4 text-left">
              <p className="text-sm font-semibold">
                {locale === "es" ? "Herramientas relacionadas:" : "Related tools:"}
              </p>
              <ul className="mt-2 space-y-1">
                {recs.map((r, i) => (
                  <li key={i}>
                    <a
                      href={locale === "es" && r.href.startsWith("/journeys") ? r.href.replace("/journeys", "/es/jornadas") : r.href}
                      className="text-sm text-primary underline-offset-2 hover:underline"
                    >
                      {r.label[locale]}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={downloadPng}
              className="min-h-11 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {locale === "es" ? "Descargar PNG" : "Download PNG"}
            </button>
            <button
              type="button"
              onClick={copyLink}
              className="min-h-11 rounded-lg bg-secondary px-4 py-2.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary"
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
              className="min-h-11 rounded-lg bg-accent px-4 py-2.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {locale === "es" ? "Empezar otro" : "Start another"}
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={reset}
        className="min-h-10 rounded-lg bg-secondary px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
      >
        {locale === "es" ? "Cambiar categoría" : "Change category"}
      </button>
    </div>
  );
}
