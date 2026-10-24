import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";

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

interface Props {
  locale: "en" | "es";
}

export function ExperienceDiscoveryRail({ locale }: Props) {
  const [category, setCategory] = useState("all");
  const [shuffleKey, setShuffleKey] = useState(0);

  const filtered = useMemo(() => {
    const list = category === "all" ? EXPERIENCES : EXPERIENCES.filter((e) => e.category === category);
    const shuffled = [...list].sort(() => Math.random() - 0.5);
    return shuffled;
  }, [category, shuffleKey]);

  const isEs = locale === "es";

  return (
    <section className="container-page py-6" aria-label={isEs ? "Descubre experiencias" : "Discover experiences"}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold">{isEs ? "Experiencias interactivas" : "Interactive experiences"}</h2>
        <button
          type="button"
          onClick={() => setShuffleKey((k) => k + 1)}
          className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold hover:bg-accent"
          data-event="discovery-rail-shuffle"
        >
          {isEs ? "Barajar" : "Shuffle"}
        </button>
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
            }`}
            data-event={`discovery-rail-category-${c.id}`}
          >
            {isEs ? c.labelEs : c.labelEn}
          </button>
        ))}
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
        {filtered.map((exp) => {
          const path = isEs ? exp.pathEs : exp.pathEn;
          const title = isEs ? exp.titleEs : exp.titleEn;
          const desc = isEs ? exp.descEs : exp.descEn;
          const color = CATEGORY_COLORS[exp.category] || "from-primary/60 to-primary/30";
          return (
            <Link
              key={exp.id}
              to={path}
              className="group min-w-[220px] max-w-[240px] flex-shrink-0 overflow-hidden rounded-xl border border-border bg-card shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
              data-event="discovery-rail-click"
              data-exp={exp.id}
            >
              <div className={`h-16 bg-gradient-to-br ${color} opacity-90 transition group-hover:opacity-100`} />
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
    </section>
  );
}
