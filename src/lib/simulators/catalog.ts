export type SimLocale = "en" | "es";

export type SimTag = "physics" | "chemistry" | "math";

/** Visual theme drives shell + hub card — not a generic dark box. */
export type SimTheme = "lab" | "cosmos" | "clockwork";

export type SimDef = {
  /** Canonical EN slug used in /simulators/$slug */
  slug: string;
  /** ES path slug under /es/simuladores/$slug */
  slugEs: string;
  nameEn: string;
  nameEs: string;
  tag: SimTag;
  theme: SimTheme;
  emoji: string;
  summaryEn: string;
  summaryEs: string;
  /** Short badge on hub cards */
  badgeEn: string;
  badgeEs: string;
};

export const SIMULATORS: readonly SimDef[] = [
  {
    slug: "molecular-motion",
    slugEs: "movimiento-molecular",
    nameEn: "Molecular motion",
    nameEs: "Movimiento molecular",
    tag: "chemistry",
    theme: "lab",
    emoji: "⚛️",
    badgeEn: "States of matter",
    badgeEs: "Estados de la materia",
    summaryEn: "Interactive states of matter simulator: solid, liquid, and gas. Watch particles vibrate, flow, or fly free. Free educational chemistry/physics demo in the browser.",
    summaryEs: "Simulador interactivo de estados de la materia: sólido, líquido y gas. Mirá cómo las partículas vibran, fluyen o vuelan. Demostración educativa gratis de química/física en el navegador.",
  },
  {
    slug: "logistic-chaos-lab",
    slugEs: "laboratorio-caos-logistico",
    nameEn: "Logistic Chaos Lab",
    nameEs: "Laboratorio de Caos Logístico",
    tag: "math",
    theme: "lab",
    emoji: "🌀",
    badgeEn: "Period-doubling",
    badgeEs: "Duplicación de periodo",
    summaryEn: "Interactive logistic map chaos lab: explore x→r*x*(1-x) with live time series, cobweb plot, and bifurcation diagram. Sliders for r (0-4), initial x, iterations. See period-doubling cascade, Feigenbaum point, attractor type. URL deep-link. EN+ES.",
    summaryEs: "Laboratorio interactivo del mapa logístico: explorá x→r*x*(1-x) con serie temporal, diagrama cobweb y bifurcación en vivo. Deslizadores para r (0-4), x inicial e iteraciones. Mirá la cascada de duplicación de periodo, punto de Feigenbaum y tipo de atractor. Enlace URL. EN+ES.",
  },
  {
    slug: "traffic-signal-lab",
    slugEs: "laboratorio-semaforos",
    nameEn: "Traffic Signal Lab",
    nameEs: "Laboratorio de Semáforos",
    tag: "physics",
    theme: "lab",
    emoji: "🚦",
    badgeEn: "Phase timing",
    badgeEs: "Tiempos de fase",
    summaryEn: "Interactive 4-way traffic signal intersection lab. Set NS/EW green times, watch discrete cars spawn, move or queue on the grid, track congestion and throughput. URL deep-link. EN+ES.",
    summaryEs: "Laboratorio interactivo de intersección de 4 vías. Ajustá verdes N-S/E-O, mirá cómo los coches (agentes) avanzan o se encolan en la grilla, medí congestión y flujo. Enlace URL. EN+ES.",
  },
] as const;

export const SIM_JOURNEYS: Record<string, string[]> = {
  "logistic-chaos-lab": ["sir-epidemic", "galton-board", "double-pendulum", "ecosystem"],
  "traffic-signal-lab": ["logistic-chaos-lab", "sir-epidemic", "ecosystem", "boids-flocking-lab"],
};

export function relatedSims(current: Pick<SimDef, "slug">): SimDef[] {
  const curated = (SIM_JOURNEYS[current.slug] ?? [])
    .map((slug) => SIMULATORS.find((s) => s.slug === slug))
    .filter((s): s is SimDef => Boolean(s));
  if (curated.length >= 4) return curated.slice(0, 4);
  const used = new Set([current.slug, ...curated.map((s) => s.slug)]);
  const rest = SIMULATORS.filter((s) => !used.has(s.slug));
  return [...curated, ...rest].slice(0, 4);
}

export function simBySlug(slug: string, locale: SimLocale = "en"): SimDef | undefined {
  const key = slug.toLowerCase();
  return SIMULATORS.find(
    (s) => (locale === "es" ? s.slugEs === key : s.slug === key) || s.slug === key || s.slugEs === key,
  );
}

export function simPath(sim: SimDef, locale: SimLocale = "en") {
  return locale === "es" ? `/es/simuladores/${sim.slugEs}` : `/simulators/${sim.slug}`;
}

export function simName(sim: SimDef, locale: SimLocale = "en") {
  return locale === "es" ? sim.nameEs : sim.nameEn;
}

export function simSummary(sim: SimDef, locale: SimLocale = "en") {
  return locale === "es" ? sim.summaryEs : sim.summaryEn;
}

export function simBadge(sim: SimDef, locale: SimLocale = "en") {
  return locale === "es" ? sim.badgeEs : sim.badgeEn;
}

export function simTagLabel(tag: SimTag, locale: SimLocale = "en") {
  if (locale === "es") {
    return tag === "physics" ? "Física" : tag === "chemistry" ? "Química" : "Matemática";
  }
  return tag === "physics" ? "Physics" : tag === "chemistry" ? "Chemistry" : "Math";
}
