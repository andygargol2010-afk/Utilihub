import { useEffect, useState, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, ArrowRight, Sparkles, RefreshCw } from "lucide-react";
import { type ValueStep } from "./HomeValuePath.part1";
import { type Props, EXPERIENCE_POOL, loadExplored, pickRandomSteps, saveExplored } from "./HomeValuePath.part2";

export function HomeValuePath({ locale }: Props) {
  const [explored, setExplored] = useState<Set<string>>(new Set());
  // Deterministic first render so SSR and hydration match (React #418); shuffle after mount.
  const [steps, setSteps] = useState<ValueStep[]>(() => EXPERIENCE_POOL.slice(0, 3));
  const isEs = locale === "es";
  const isPt = locale === "pt";

  useEffect(() => {
    setExplored(loadExplored());
    setSteps(pickRandomSteps());
  }, []);

  const refresh = useCallback(() => {
    setSteps(pickRandomSteps());
  }, []);

  const count = steps.filter((s) => explored.has(s.id)).length;
  const total = steps.length;
  const complete = count >= total;
  const progressPct = Math.round((count / total) * 100);

  const mark = (id: string) => {
    setExplored((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      saveExplored(next);
      return next;
    });
  };

  const pathLabel = isPt ? "Rota de valor" : isEs ? "Ruta de valor" : "Value Path";
  const title = isPt ? "Explore 3 experiências em destaque" : isEs ? "Explorá 3 experiencias destacadas" : "Explore 3 featured experiences";
  const newLabel = isPt ? "Nova" : isEs ? "Nueva" : "New";
  const newTitle = isPt ? "Nova rota aleatória" : isEs ? "Nueva ruta aleatoria" : "New random path";
  const ofLabel = isPt ? "de" : isEs ? "de" : "of";
  const exploredLabel = isPt ? "exploradas" : isEs ? "exploradas" : "explored";
  const progressAria = isPt ? "Progresso da rota" : isEs ? "Progreso de la ruta" : "Value path progress";
  const completeMsg = isPt
    ? "Rota completa! Você explorou as 3 experiências em destaque."
    : isEs
    ? "¡Ruta completa! Ya exploraste las 3 experiencias destacadas."
    : "Path complete! You explored all 3 featured experiences.";
  const doneLabel = isPt ? "Feito" : isEs ? "Hecho" : "Done";
  const againLabel = isPt ? "Explorar novamente" : isEs ? "Volver a explorar" : "Explore again";

  return (
    <section className="container-page py-6" aria-labelledby="value-path-title">
      <div className="rounded-2xl border border-border/60 bg-card/40 p-4 sm:p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-violet-600">
              {pathLabel}
            </p>
            <h2 id="value-path-title" className="mt-1 text-lg font-black">
              {title}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={refresh}
              className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-semibold hover:bg-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
              data-event="value-path-refresh"
              title={newTitle}
            >
              <RefreshCw className="size-3.5" aria-hidden />
              {newLabel}
            </button>
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${
                complete
                  ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                  : "bg-violet-500/10 text-violet-700 dark:text-violet-300"
              }`}
            >
              {count} {ofLabel} {total} {exploredLabel}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div
          className="mb-4 h-1.5 overflow-hidden rounded-full bg-border/60"
          role="progressbar"
          aria-valuenow={count}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-label={progressAria}
        >
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              complete ? "bg-emerald-500" : "bg-violet-500"
            }`}
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {complete && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-3 py-2 text-xs font-semibold text-emerald-800 dark:text-emerald-200">
            <Sparkles className="size-3.5 shrink-0" aria-hidden />
            {completeMsg}
          </div>
        )}

        <ol className="grid gap-3 sm:grid-cols-3">
          {steps.map((step, i) => {
            const done = explored.has(step.id);
            const path = isPt ? step.pathPt : isEs ? step.pathEs : step.pathEn;
            const title = isPt ? step.titlePt : isEs ? step.titleEs : step.titleEn;
            const cta = isPt ? step.ctaPt : isEs ? step.ctaEs : step.ctaEn;
            const short = isPt ? step.shortPt : isEs ? step.shortEs : step.shortEn;
            return (
              <li key={step.id} className="relative">
                <Link
                  to={path}
                  onClick={() => mark(step.id)}
                  className={`group flex h-full flex-col rounded-xl border p-4 transition hover:-translate-y-0.5 ${
                    done
                      ? "border-emerald-500/40 bg-emerald-500/5 shadow-sm"
                      : "border-border bg-background hover:border-primary/40 hover:shadow-sm"
                  } focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary`}
                  data-event="value-path-click"
                  data-exp={step.id}
                  data-step={i + 1}
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span
                      className={`grid size-6 place-items-center rounded-full text-[11px] font-black ${
                        done
                          ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      {done ? <CheckCircle2 className="size-3.5" aria-hidden /> : i + 1}
                    </span>
                    {done && (
                      <span className="text-[10px] font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                        {doneLabel}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold leading-snug group-hover:text-primary">{title}</h3>
                  <p className="mt-1 flex-1 text-xs text-muted-foreground">{short}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-primary">
                    {done ? againLabel : cta}{" "}
                    <ArrowRight className="size-3 transition group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
