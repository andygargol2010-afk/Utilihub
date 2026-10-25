import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { ExperienceShareButton } from "@/components/ExperienceShareButton";
import { trackEvent } from "@/lib/analytics";

interface SpotlightExp {
  id: string;
  pathEn: string;
  pathEs: string;
  titleEn: string;
  titleEs: string;
  teaserEn: string;
  teaserEs: string;
  ctaEn: string;
  ctaEs: string;
}

const POOL: SpotlightExp[] = [
  {
    id: "aurora-particle-playground",
    pathEn: "/aurora-particle-playground",
    pathEs: "/es/aurora-particle-playground",
    titleEn: "Aurora Particles",
    titleEs: "Partículas Aurora",
    teaserEn: "Multi-mode bloom trails with attractors and emitters.",
    teaserEs: "Estelas bloom multi-modo con atractores y emisores.",
    ctaEn: "Launch Aurora",
    ctaEs: "Lanzar Aurora",
  },
  {
    id: "n-body-gravity-sim",
    pathEn: "/n-body-gravity",
    pathEs: "/es/n-body-gravity",
    titleEn: "N-Body Gravity",
    titleEs: "Gravedad N-Cuerpos",
    teaserEn: "Live gravitational dynamics with presets and trails.",
    teaserEs: "Dinámica gravitatoria en vivo con presets y estelas.",
    ctaEn: "Simulate Gravity",
    ctaEs: "Simular Gravedad",
  },
  {
    id: "neon-layer-composer",
    pathEn: "/neon-layer-composer",
    pathEs: "/es/neon-layer-composer",
    titleEn: "Neon Layers",
    titleEs: "Capas Neón",
    teaserEn: "Freehand neon canvas with bloom, symmetry and particles.",
    teaserEs: "Lienzo neón a mano alzada con bloom, simetría y partículas.",
    ctaEn: "Compose Neon",
    ctaEs: "Componer Neón",
  },
  {
    id: "prism-trail-composer",
    pathEn: "/studio/prism-trail-composer",
    pathEs: "/es/studio/compositor-estela-prisma",
    titleEn: "Prism Trail",
    titleEs: "Estela Prisma",
    teaserEn: "Rainbow prism trails with continuous glow.",
    teaserEs: "Estelas prisma arcoíris con glow continuo.",
    ctaEn: "Trail Prism",
    ctaEs: "Estela Prisma",
  },
  {
    id: "color-cascade-fusion",
    pathEn: "/color-cascade-fusion",
    pathEs: "/es/color-cascade-fusion",
    titleEn: "Color Cascade",
    titleEs: "Cascada de Color",
    teaserEn: "Adjacent color fusion and combo cascades.",
    teaserEs: "Fusión de colores adyacentes y cascadas combo.",
    ctaEn: "Fuse Colors",
    ctaEs: "Fusionar Colores",
  },
  {
    id: "aura-card-share",
    pathEn: "/aura-card",
    pathEs: "/es/aura-card",
    titleEn: "Aura Card",
    titleEs: "Carta Aura",
    teaserEn: "Shareable particle cards with quotes and schemes.",
    teaserEs: "Cartas de partículas compartibles con citas y esquemas.",
    ctaEn: "Compose Aura",
    ctaEs: "Componer Aura",
  },
];

const STORAGE_KEY = "utilihub-spotlight-last";

function getDayIndex(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const day = Math.floor(diff / (1000 * 60 * 60 * 24));
  return day % POOL.length;
}

function getDayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function loadLast(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function saveLast(id: string) {
  try {
    localStorage.setItem(STORAGE_KEY, id);
  } catch {
    /* ignore */
  }
}

interface Props {
  locale: "en" | "es";
}

export function DailyExperienceSpotlight({ locale }: Props) {
  const [exp, setExp] = useState<SpotlightExp | null>(null);
  const [dayOfYear, setDayOfYear] = useState(0);
  const isEs = locale === "es";

  useEffect(() => {
    const dayIdx = getDayIndex();
    const doy = getDayOfYear();
    setDayOfYear(doy);
    let selected = POOL[dayIdx];
    const last = loadLast();
    if (last === selected.id && POOL.length > 1) {
      // Avoid consecutive same if possible
      selected = POOL[(dayIdx + 1) % POOL.length];
    }
    setExp(selected);
    saveLast(selected.id);
    trackEvent("spotlight-view", { id: selected.id, locale, day: doy });
  }, [locale]);

  if (!exp) return null;

  const path = isEs ? exp.pathEs : exp.pathEn;
  const title = isEs ? exp.titleEs : exp.titleEn;
  const teaser = isEs ? exp.teaserEs : exp.teaserEn;
  const cta = isEs ? exp.ctaEs : exp.ctaEn;
  const fullUrl = typeof window !== "undefined" ? `${window.location.origin}${path}` : path;

  const handleShareTrack = () => {
    trackEvent("spotlight-share", { id: exp.id, locale, day: dayOfYear });
  };

  return (
    <section className="container-page py-4" aria-labelledby="spotlight-title">
      <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-br from-amber-500/10 to-violet-500/5 p-4 sm:p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-amber-600">
                {isEs ? "Destacado del día" : "Daily Spotlight"}
              </p>
              <span className="inline-flex items-center rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-400">
                D{dayOfYear}
              </span>
            </div>
            <h2 id="spotlight-title" className="mt-1 text-lg font-black">
              {title}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{teaser}</p>
            <p className="mt-1 text-xs text-muted-foreground/80">
              {isEs ? "Rota cada día · ¡Comparte la experiencia!" : "Rotates daily · Share the experience!"}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Link
                to={path}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-4 py-2 text-sm font-bold text-white hover:bg-amber-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-500"
                data-event="spotlight-click"
                data-exp={exp.id}
                onClick={() => trackEvent("spotlight-click", { id: exp.id, locale, day: dayOfYear })}
              >
                {cta} <ArrowRight className="size-4" />
              </Link>
              <div onClick={handleShareTrack}>
                <ExperienceShareButton
                  title={title}
                  url={fullUrl}
                  locale={locale}
                  variant="button"
                  className="border-amber-500/40"
                />
              </div>
            </div>
          </div>
          <Sparkles className="size-8 text-amber-500/70 shrink-0" aria-hidden />
        </div>
      </div>
    </section>
  );
}
