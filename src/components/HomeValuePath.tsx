import { useEffect, useState, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, ArrowRight, Sparkles, RefreshCw } from "lucide-react";

interface ValueStep {
  id: string;
  pathEn: string;
  pathEs: string;
  titleEn: string;
  titleEs: string;
  ctaEn: string;
  ctaEs: string;
  shortEn: string;
  shortEs: string;
}

const EXPERIENCE_POOL: ValueStep[] = [
  {
    id: "aurora-particle-playground",
    pathEn: "/aurora-particle-playground",
    pathEs: "/es/aurora-particle-playground",
    titleEn: "Aurora Particles",
    titleEs: "Partículas Aurora",
    ctaEn: "Explore bloom",
    ctaEs: "Explorar bloom",
    shortEn: "Multi-mode trails & attractors",
    shortEs: "Estelas multi-modo y atractores",
  },
  {
    id: "n-body-gravity-sim",
    pathEn: "/n-body-gravity-sim",
    pathEs: "/es/n-body-gravity-sim",
    titleEn: "N-Body Gravity",
    titleEs: "Gravedad N-Cuerpos",
    ctaEn: "Simulate orbits",
    ctaEs: "Simular órbitas",
    shortEn: "Live gravity + presets",
    shortEs: "Gravedad en vivo + presets",
  },
  {
    id: "neon-layer-composer",
    pathEn: "/neon-layer-composer",
    pathEs: "/es/neon-layer-composer",
    titleEn: "Neon Layers",
    titleEs: "Capas Neón",
    ctaEn: "Draw glow",
    ctaEs: "Dibujar glow",
    shortEn: "Freehand bloom & symmetry",
    shortEs: "Bloom a mano alzada y simetría",
  },
  {
    id: "prism-trail-composer",
    pathEn: "/studio/prism-trail-composer",
    pathEs: "/es/studio/compositor-estela-prisma",
    titleEn: "Prism Trail",
    titleEs: "Estela Prisma",
    ctaEn: "Trail rainbow",
    ctaEs: "Estela arcoíris",
    shortEn: "Rainbow prism trails",
    shortEs: "Estelas prisma arcoíris",
  },
  {
    id: "color-cascade-fusion",
    pathEn: "/color-cascade-fusion",
    pathEs: "/es/color-cascade-fusion",
    titleEn: "Color Cascade",
    titleEs: "Cascada de Color",
    ctaEn: "Fuse colors",
    ctaEs: "Fusionar colores",
    shortEn: "Adjacent fusion + combos",
    shortEs: "Fusión adyacente + combos",
  },
  {
    id: "aura-card-share",
    pathEn: "/aura-card",
    pathEs: "/es/aura-card",
    titleEn: "Aura Card",
    titleEs: "Carta Aura",
    ctaEn: "Compose share",
    ctaEs: "Componer compartir",
    shortEn: "Shareable particles + quotes",
    shortEs: "Partículas y citas compartibles",
  },
];

function pickRandomSteps(n = 3): ValueStep[] {
  const shuffled = [...EXPERIENCE_POOL];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, n);
}

const STORAGE_KEY = "utilihub-value-path-explored";

function loadExplored(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return new Set(Array.isArray(arr) ? arr.filter((x) => typeof x === "string") : []);
  } catch {
    return new Set();
  }
}

function saveExplored(set: Set<string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
  } catch {
    /* ignore */
  }
}

interface Props {
  locale: "en" | "es";
}

export function HomeValuePath({ locale }: Props) {
  const [explored, setExplored] = useState<Set<string>>(new Set());
  const [steps, setSteps] = useState<ValueStep[]>(() => pickRandomSteps());
  const isEs = locale === "es";

  useEffect(() => {
    setExplored(loadExplored());
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

  return (
    <section className="container-page py-6" aria-labelledby="value-path-title">
      <div className="rounded-2xl border border-border/60 bg-card/40 p-4 sm:p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-violet-600">
              {isEs ? "Ruta de valor" : "Value Path"}
            </p>
            <h2 id="value-path-title" className="mt-1 text-lg font-black">
              {isEs ? "Explorá 3 experiencias destacadas" : "Explore 3 featured experiences"}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={refresh}
              className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-semibold hover:bg-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
              data-event="value-path-refresh"
              title={isEs ? "Nueva ruta aleatoria" : "New random path"}
            >
              <RefreshCw className="size-3.5" aria-hidden />
              {isEs ? "Nueva" : "New"}
            </button>
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${
                complete
                  ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                  : "bg-violet-500/10 text-violet-700 dark:text-violet-300"
              }`}
            >
              {count} {isEs ? "de" : "of"} {total} {isEs ? "exploradas" : "explored"}
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
          aria-label={isEs ? "Progreso de la ruta" : "Value path progress"}
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
            {isEs
              ? "¡Ruta completa! Ya exploraste las 3 experiencias destacadas."
              : "Path complete! You explored all 3 featured experiences."}
          </div>
        )}

        <ol className="grid gap-3 sm:grid-cols-3">
          {steps.map((step, i) => {
            const done = explored.has(step.id);
            const path = isEs ? step.pathEs : step.pathEn;
            const title = isEs ? step.titleEs : step.titleEn;
            const cta = isEs ? step.ctaEs : step.ctaEn;
            const short = isEs ? step.shortEs : step.shortEn;
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
                        {isEs ? "Hecho" : "Done"}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold leading-snug group-hover:text-primary">{title}</h3>
                  <p className="mt-1 flex-1 text-xs text-muted-foreground">{short}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-primary">
                    {done ? (isEs ? "Volver a explorar" : "Explore again") : cta}{" "}
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
