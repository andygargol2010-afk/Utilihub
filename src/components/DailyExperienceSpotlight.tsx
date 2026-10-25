import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Share2 } from "lucide-react";
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
  accent: string;
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
    accent: "amber",
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
    accent: "sky",
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
    accent: "fuchsia",
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
    accent: "violet",
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
    accent: "emerald",
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
    accent: "rose",
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

function hoursUntilMidnight(): number {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return Math.max(1, Math.ceil((midnight.getTime() - now.getTime()) / (1000 * 60 * 60)));
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
  const [hoursLeft, setHoursLeft] = useState(24);
  const isEs = locale === "es";

  useEffect(() => {
    const dayIdx = getDayIndex();
    const doy = getDayOfYear();
    setDayOfYear(doy);
    setHoursLeft(hoursUntilMidnight());
    let selected = POOL[dayIdx];
    const last = loadLast();
    if (last === selected.id && POOL.length > 1) {
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
  const accent = exp.accent;

  const handleShareTrack = () => {
    trackEvent("spotlight-share", { id: exp.id, locale, day: dayOfYear });
  };

  const borderClass = `border-${accent}-500/50`;
  const bgFrom = `from-${accent}-500/15`;
  const bgTo = `to-${accent === "amber" ? "violet" : accent}-500/8`;
  const textAccent = `text-${accent}-600`;
  const badgeBg = `bg-${accent}-500/20`;
  const badgeText = `text-${accent}-800 dark:text-${accent}-300`;
  const btnBg = `bg-${accent}-600`;
  const btnHover = `hover:bg-${accent}-700`;
  const btnOutline = `focus-visible:outline-${accent}-500`;
  const shareBorder = `border-${accent}-500/50`;

  return (
    <section className="container-page py-4" aria-labelledby="spotlight-title">
      <div className={`rounded-2xl border-2 ${borderClass} bg-gradient-to-br ${bgFrom} ${bgTo} p-4 sm:p-5 shadow-md`}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className={`text-xs font-bold uppercase tracking-[0.14em] ${textAccent}`}>
                {isEs ? "Destacado del día" : "Daily Spotlight"}
              </p>
              <span className={`inline-flex items-center rounded-full ${badgeBg} px-2.5 py-0.5 text-[10px] font-black ${badgeText}`}>
                {isEs ? "HOY" : "TODAY"} · D{dayOfYear}
              </span>
            </div>
            <h2 id="spotlight-title" className="mt-1 text-lg font-black tracking-tight">
              {title}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{teaser}</p>
            <p className="mt-1 text-xs font-medium text-muted-foreground/90">
              {isEs
                ? `Rota en ~${hoursLeft}h · ¡Comparte y trae a un amigo!`
                : `Rotates in ~${hoursLeft}h · Share and bring a friend!`}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Link
                to={path}
                className={`inline-flex items-center gap-1.5 rounded-xl ${btnBg} px-5 py-2.5 text-sm font-bold text-white shadow-sm ${btnHover} focus-visible:outline focus-visible:outline-2 ${btnOutline}`}
                data-event="spotlight-click"
                data-exp={exp.id}
                onClick={() => trackEvent("spotlight-click", { id: exp.id, locale, day: dayOfYear })}
              >
                {cta} <ArrowRight className="size-4" />
              </Link>
              <div onClick={handleShareTrack} className="inline-flex">
                <ExperienceShareButton
                  title={title}
                  url={fullUrl}
                  locale={locale}
                  variant="button"
                  className={`${shareBorder} font-semibold`}
                />
              </div>
            </div>
          </div>
          <Sparkles className={`size-9 ${textAccent} opacity-80 shrink-0`} aria-hidden />
        </div>
      </div>
    </section>
  );
}
