import { useState, useMemo, useRef, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Sparkles, Palette, Gamepad2, Orbit } from "lucide-react";

interface Experience {
  id: string;
  pathEn: string;
  pathEs: string;
  titleEn: string;
  titleEs: string;
  descEn: string;
  descEs: string;
  category: "playgrounds" | "studios" | "games" | "simulators";
}

const EXPERIENCES: Experience[] = [
  {
    id: "aurora-particle-playground",
    pathEn: "/aurora-particle-playground",
    pathEs: "/es/aurora-particle-playground",
    titleEn: "Aurora Particle Playground",
    titleEs: "Playground de Partículas Aurora",
    descEn: "Multi-mode bloom particles with trails, attract/repel, emitters.",
    descEs: "Partículas bloom multi-modo con estelas, atracción/repulsión, emisores.",
    category: "playgrounds",
  },
  {
    id: "neon-layer-composer",
    pathEn: "/neon-layer-composer",
    pathEs: "/es/neon-layer-composer",
    titleEn: "Neon Layer Composer",
    titleEs: "Compositor de Capas Neón",
    descEn: "Freehand multi-layer neon drawing with bloom, symmetry, particles.",
    descEs: "Dibujo neón multicapa a mano alzada con bloom, simetría, partículas.",
    category: "studios",
  },
  {
    id: "prism-trail-composer",
    pathEn: "/studio/prism-trail-composer",
    pathEs: "/es/studio/compositor-estela-prisma",
    titleEn: "Prism Trail Composer",
    titleEs: "Compositor de Estela Prisma",
    descEn: "Rainbow prism trails with bloom, mirrors, gravity.",
    descEs: "Estelas prisma arcoíris con bloom, espejos, gravedad.",
    category: "studios",
  },
  {
    id: "n-body-gravity-sim",
    pathEn: "/n-body-gravity-sim",
    pathEs: "/es/n-body-gravity-sim",
    titleEn: "N-Body Gravity Simulator",
    titleEs: "Simulador de Gravedad N-Cuerpos",
    descEn: "Add bodies, live gravity, trails, presets, zoom.",
    descEs: "Añade cuerpos, gravedad en vivo, estelas, presets, zoom.",
    category: "simulators",
  },
  {
    id: "color-cascade-fusion",
    pathEn: "/color-cascade-fusion",
    pathEs: "/es/color-cascade-fusion",
    titleEn: "Color Cascade Fusion",
    titleEs: "Fusión Cascada de Color",
    descEn: "Adjacent fusion, power-orbs, combo streaks, sounds.",
    descEs: "Fusión adyacente, orbes de poder, rachas de combo, sonidos.",
    category: "games",
  },
  {
    id: "pulse-catch",
    pathEn: "/pulse-catch",
    pathEs: "/es/pulse-catch",
    titleEn: "Pulse Catch",
    titleEs: "Atrapa el Pulso",
    descEn: "Rhythm timing game with visual pulses.",
    descEs: "Juego de ritmo con pulsos visuales.",
    category: "games",
  },
  {
    id: "solar-system-scale-explorer",
    pathEn: "/solar-system-scale-explorer",
    pathEs: "/es/solar-system-scale-explorer",
    titleEn: "Solar System Scale Explorer",
    titleEs: "Explorador de Escala del Sistema Solar",
    descEn: "Light-travel times, live scale, focus, presets.",
    descEs: "Tiempos de viaje de luz, escala en vivo, enfoque, presets.",
    category: "simulators",
  },
  {
    id: "daily-progress-constellation",
    pathEn: "/daily-progress-constellation",
    pathEs: "/es/daily-progress-constellation",
    titleEn: "Daily Progress Constellation",
    titleEs: "Constelación de Progreso Diario",
    descEn: "Canvas stars + lines for daily milestones.",
    descEs: "Estrellas y líneas de canvas para hitos diarios.",
    category: "playgrounds",
  },
  {
    id: "aura-card-share",
    pathEn: "/aura-card",
    pathEs: "/es/aura-card",
    titleEn: "Aura Card Composer",
    titleEs: "Compositor de Carta Aura",
    descEn: "Shareable aura cards with particles, bloom, quotes.",
    descEs: "Cartas aura compartibles con partículas, bloom, citas.",
    category: "studios",
  },
  {
    id: "return-streak-board",
    pathEn: "/return-streak-board",
    pathEs: "/es/return-streak-board",
    titleEn: "Return Streak Board",
    titleEs: "Tablero de Racha de Retorno",
    descEn: "Track return streaks with visual progress.",
    descEs: "Rastrea rachas de retorno con progreso visual.",
    category: "playgrounds",
  },
];

const CATEGORIES = [
  { id: "all", labelEn: "All", labelEs: "Todos" },
  { id: "playgrounds", labelEn: "Playgrounds", labelEs: "Playgrounds" },
  { id: "studios", labelEn: "Studios", labelEs: "Studios" },
  { id: "games", labelEn: "Games", labelEs: "Juegos" },
  { id: "simulators", labelEn: "Simulators", labelEs: "Simuladores" },
];

const CATEGORY_COLORS: Record<string, string> = {
  playgrounds: "from-violet-500/80 to-fuchsia-500/60",
  studios: "from-cyan-500/80 to-blue-500/60",
  games: "from-orange-500/80 to-rose-500/60",
  simulators: "from-emerald-500/80 to-teal-500/60",
};

const CATEGORY_ICONS: Record<string, typeof Sparkles> = {
  playgrounds: Sparkles,
  studios: Palette,
  games: Gamepad2,
  simulators: Orbit,
};

interface Props {
  locale: "en" | "es";
}

export function ExperienceDiscoveryRail({ locale }: Props) {
  const [category, setCategory] = useState("all");
  const [shuffleKey, setShuffleKey] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const filtered = useMemo(() => {
    const list = category === "all" ? EXPERIENCES : EXPERIENCES.filter((e) => e.category === category);
    const shuffled = [...list];
    let seed = shuffleKey + 1;
    for (let i = shuffled.length - 1; i > 0; i--) {
      seed = (seed * 16807) % 2147483647;
      const j = seed % (i + 1);
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, [category, shuffleKey]);

  const isEs = locale === "es";

  const scrollBy = (dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = Math.min(280, el.clientWidth * 0.75) * dir;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!sectionRef.current?.contains(document.activeElement) && document.activeElement !== sectionRef.current) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        scrollBy(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        scrollBy(1);
      } else if (e.key === "s" || e.key === "S") {
        setShuffleKey((k) => k + 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="container-page py-6 relative"
      aria-label={isEs ? "Descubre experiencias" : "Discover experiences"}
      tabIndex={0}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold">{isEs ? "Experiencias interactivas" : "Interactive experiences"}</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShuffleKey((k) => k + 1)}
            className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold hover:bg-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
            data-event="discovery-rail-shuffle"
            title={isEs ? "Barajar (S)" : "Shuffle (S)"}
          >
            {isEs ? "Barajar" : "Shuffle"}
          </button>
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            className="hidden rounded-lg border border-border bg-card p-1.5 hover:bg-accent sm:inline-flex focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
            aria-label={isEs ? "Desplazar a la izquierda" : "Scroll left"}
            data-event="discovery-rail-scroll-left"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            className="hidden rounded-lg border border-border bg-card p-1.5 hover:bg-accent sm:inline-flex focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
            aria-label={isEs ? "Desplazar a la derecha" : "Scroll right"}
            data-event="discovery-rail-scroll-right"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCategory(c.id)}
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              category === c.id
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-card hover:bg-accent"
            } focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary`}
            data-event={`discovery-rail-category-${c.id}`}
          >
            {isEs ? c.labelEs : c.labelEn}
          </button>
        ))}
      </div>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-background to-transparent" />
        <div
          ref={scrollerRef}
          className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin snap-x snap-mandatory"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {filtered.map((exp) => {
            const path = isEs ? exp.pathEs : exp.pathEn;
            const title = isEs ? exp.titleEs : exp.titleEn;
            const desc = isEs ? exp.descEs : exp.descEn;
            const color = CATEGORY_COLORS[exp.category] || "from-primary/60 to-primary/30";
            const Icon = CATEGORY_ICONS[exp.category] || Sparkles;
            return (
              <Link
                key={exp.id}
                to={path}
                className="group min-w-[220px] max-w-[240px] flex-shrink-0 snap-start overflow-hidden rounded-xl border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                data-event="discovery-rail-click"
                data-exp={exp.id}
              >
                <div className={`relative h-20 bg-gradient-to-br ${color} opacity-90 transition group-hover:opacity-100`}>
                  <Icon className="absolute bottom-2 right-2 size-5 text-white/80" aria-hidden />
                </div>
                <div className="p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-primary">
                    {CATEGORIES.find((c) => c.id === exp.category)?.[isEs ? "labelEs" : "labelEn"]}
                  </p>
                  <h3 className="mt-1 text-sm font-bold leading-snug">{title}</h3>
                  <p className="mt-2 line-clamp-3 text-xs text-muted-foreground">{desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
