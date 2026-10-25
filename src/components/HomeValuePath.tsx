import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, ArrowRight } from "lucide-react";

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

const VALUE_STEPS: ValueStep[] = [
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
];

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
  const isEs = locale === "es";

  useEffect(() => {
    setExplored(loadExplored());
  }, []);

  const count = VALUE_STEPS.filter((s) => explored.has(s.id)).length;
  const total = VALUE_STEPS.length;

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
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-violet-600">
              {isEs ? "Ruta de valor" : "Value Path"}
            </p>
            <h2 id="value-path-title" className="mt-1 text-lg font-black">
              {isEs ? "Explorá 3 experiencias destacadas" : "Explore 3 featured experiences"}
            </h2>
          </div>
          <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs font-bold text-violet-700 dark:text-violet-300">
            {count} {isEs ? "de" : "of"} {total} {isEs ? "exploradas" : "explored"}
          </span>
        </div>
        <ol className="grid gap-3 sm:grid-cols-3">
          {VALUE_STEPS.map((step, i) => {
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
                      ? "border-emerald-500/40 bg-emerald-500/5"
                      : "border-border bg-background hover:border-primary/40"
                  } focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary`}
                  data-event="value-path-click"
                  data-exp={step.id}
                  data-step={i + 1}
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="grid size-6 place-items-center rounded-full bg-primary/10 text-[11px] font-black text-primary">
                      {i + 1}
                    </span>
                    {done && <CheckCircle2 className="size-4 text-emerald-600" aria-hidden />}
                  </div>
                  <h3 className="text-sm font-bold leading-snug group-hover:text-primary">{title}</h3>
                  <p className="mt-1 flex-1 text-xs text-muted-foreground">{short}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-primary">
                    {cta} <ArrowRight className="size-3" />
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
