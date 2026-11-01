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
    summaryEn:
      "Interactive states of matter: solid, liquid, and gas. Watch particles vibrate, flow, or fly free.",
    summaryEs:
      "Estados de la materia: sólido, líquido y gas. Mirá cómo las partículas vibran, fluyen o vuelan libres.",
  },
  {
    slug: "gravity-sandbox",
    slugEs: "sandbox-gravedad",
    nameEn: "Gravity sandbox",
    nameEs: "Sandbox de gravedad",
    tag: "physics",
    theme: "cosmos",
    emoji: "🪐",
    badgeEn: "N-body",
    badgeEs: "N-cuerpos",
    summaryEn: "Place masses and watch orbits form under gravity. Tweak G and mass to explore stable and chaotic paths.",
    summaryEs:
      "Colocá masas y mirá cómo se forman órbitas. Ajustá G y la masa para explorar trayectorias estables y caóticas.",
  },
  {
    slug: "pendulum",
    slugEs: "pendulo",
    nameEn: "Simple pendulum",
    nameEs: "Péndulo simple",
    tag: "physics",
    theme: "clockwork",
    emoji: "⏱️",
    badgeEn: "Period & g",
    badgeEs: "Periodo y g",
    summaryEn: "Classic pendulum with live angle, period, and energy. Change length and gravity and see the motion update.",
    summaryEs:
      "Péndulo clásico con ángulo, periodo y energía en vivo. Cambiá longitud y gravedad y mirá el movimiento.",
  },
  {
    slug: "double-pendulum",
    slugEs: "pendulo-doble",
    nameEn: "Double pendulum",
    nameEs: "Péndulo doble",
    tag: "physics",
    theme: "clockwork",
    emoji: "🔗",
    badgeEn: "Chaos",
    badgeEs: "Caos",
    summaryEn: "Two linked pendulums — sensitive to initial conditions. Trace the path and feel deterministic chaos.",
    summaryEs:
      "Dos péndulos enlazados — sensibles a las condiciones iniciales. Trazá la trayectoria y sentí el caos determinista.",
  },
  {
    slug: "projectile-motion",
    slugEs: "movimiento-proyectil",
    nameEn: "Projectile motion",
    nameEs: "Movimiento de proyectil",
    tag: "physics",
    theme: "clockwork",
    emoji: "🎯",
    badgeEn: "Trajectories",
    badgeEs: "Trayectorias",
    summaryEn: "Launch a projectile with angle and speed. See range, height, and the parabolic path in real time.",
    summaryEs:
      "Lanzá un proyectil con ángulo y velocidad. Mirá alcance, altura y la parábola en tiempo real.",
  },
  {
    slug: "optics-bench",
    slugEs: "banco-optico",
    nameEn: "Optics bench",
    nameEs: "Banco óptico",
    tag: "physics",
    theme: "lab",
    emoji: "🔦",
    badgeEn: "Lenses",
    badgeEs: "Lentes",
    summaryEn: "Lenses and rays on a virtual optical bench. Move elements and watch focus and magnification change.",
    summaryEs:
      "Lentes y rayos en un banco óptico virtual. Mové elementos y mirá cómo cambian el foco y el aumento.",
  },
  {
    slug: "dc-circuit",
    slugEs: "circuito-dc",
    nameEn: "DC circuit",
    nameEs: "Circuito DC",
    tag: "physics",
    theme: "lab",
    emoji: "🔋",
    badgeEn: "Ohm's law",
    badgeEs: "Ley de Ohm",
    summaryEn: "Build a simple DC circuit. Adjust resistance and voltage and see current respond live.",
    summaryEs:
      "Armá un circuito DC simple. Ajustá resistencia y voltaje y mirá la corriente en vivo.",
  },
  {
    slug: "standing-wave",
    slugEs: "ondas-estacionarias",
    nameEn: "Standing waves",
    nameEs: "Ondas estacionarias",
    tag: "physics",
    theme: "lab",
    emoji: "〰️",
    badgeEn: "Nodes",
    badgeEs: "Nodos",
    summaryEn: "Standing waves on a string. Change frequency and tension to find harmonics and nodes.",
    summaryEs:
      "Ondas estacionarias en una cuerda. Cambiá frecuencia y tensión para hallar armónicos y nodos.",
  },
  {
    slug: "wave-interference",
    slugEs: "interferencia-ondas",
    nameEn: "Wave interference",
    nameEs: "Interferencia de ondas",
    tag: "physics",
    theme: "lab",
    emoji: "🌊",
    badgeEn: "Superposition",
    badgeEs: "Superposición",
    summaryEn: "Two wave sources interfere. See constructive and destructive patterns form in real time.",
    summaryEs:
      "Dos fuentes de onda interfieren. Mirá patrones constructivos y destructivos formarse en vivo.",
  },
  {
    slug: "ecosystem",
    slugEs: "ecosistema",
    nameEn: "Ecosystem",
    nameEs: "Ecosistema",
    tag: "math",
    theme: "lab",
    emoji: "🌿",
    badgeEn: "Predator–prey",
    badgeEs: "Depredador–presa",
    summaryEn: "Simple predator–prey dynamics. Tune rates and watch populations rise, fall, and stabilize.",
    summaryEs:
      "Dinámica simple depredador–presa. Ajustá tasas y mirá cómo las poblaciones suben, bajan y se estabilizan.",
  },
  {
    slug: "sir-epidemic",
    slugEs: "epidemia-sir",
    nameEn: "SIR epidemic",
    nameEs: "Epidemia SIR",
    tag: "math",
    theme: "lab",
    emoji: "🦠",
    badgeEn: "Compartments",
    badgeEs: "Compartimentos",
    summaryEn: "Classic SIR model: susceptible, infected, recovered. Change R0 and recovery rate and watch the curve.",
    summaryEs:
      "Modelo SIR clásico: susceptibles, infectados, recuperados. Cambiá R0 y la tasa de recuperación y mirá la curva.",
  },
  {
    slug: "market-equilibrium",
    slugEs: "equilibrio-mercado",
    nameEn: "Market equilibrium",
    nameEs: "Equilibrio de mercado",
    tag: "math",
    theme: "clockwork",
    emoji: "📈",
    badgeEn: "Supply & demand",
    badgeEs: "Oferta y demanda",
    summaryEn: "Supply and demand curves meet. Shift curves and see price and quantity find a new equilibrium.",
    summaryEs:
      "Curvas de oferta y demanda. Desplazalas y mirá cómo precio y cantidad encuentran un nuevo equilibrio.",
  },
  {
    slug: "galton-board",
    slugEs: "tablero-galton",
    nameEn: "Galton board",
    nameEs: "Tablero de Galton",
    tag: "math",
    theme: "clockwork",
    emoji: "🎱",
    badgeEn: "Bell curve",
    badgeEs: "Campana de Gauss",
    summaryEn: "Balls bounce through pegs into bins. Watch a binomial distribution build toward a bell curve.",
    summaryEs:
      "Bolas rebotan entre clavos hacia las ranuras. Mirá cómo se arma una distribución binomial hacia la campana.",
  },
  {
    slug: "boids-flocking-lab",
    slugEs: "lab-bandadas-boids",
    nameEn: "Boids flocking lab",
    nameEs: "Lab de bandadas (boids)",
    tag: "math",
    theme: "cosmos",
    emoji: "🐦",
    badgeEn: "Flocking",
    badgeEs: "Bandadas",
    summaryEn: "Separation, alignment, cohesion. Tune the three rules and watch agents form flocks and trails.",
    summaryEs:
      "Separación, alineación y cohesión. Ajustá las tres reglas y mirá cómo los agentes forman bandadas.",
  },
  {
    slug: "reaction-diffusion-lab",
    slugEs: "lab-reaccion-difusion",
    nameEn: "Reaction–diffusion lab",
    nameEs: "Lab de reacción–difusión",
    tag: "chemistry",
    theme: "lab",
    emoji: "🧬",
    badgeEn: "Patterns",
    badgeEs: "Patrones",
    summaryEn: "Gray–Scott style reaction–diffusion. Grow spots, stripes, and labyrinths from simple local rules.",
    summaryEs:
      "Reacción–difusión estilo Gray–Scott. Generá manchas, rayas y laberintos con reglas locales simples.",
  },
  {
    slug: "logistic-chaos-lab",
    slugEs: "laboratorio-caos-logistico",
    nameEn: "Logistic Chaos Lab",
    nameEs: "Laboratorio de caos logístico",
    tag: "math",
    theme: "lab",
    emoji: "🌀",
    badgeEn: "Period-doubling",
    badgeEs: "Duplicación de periodo",
    summaryEn:
      "Logistic map x→r·x·(1−x): time series, cobweb, and bifurcation. Find the Feigenbaum cascade and attractors.",
    summaryEs:
      "Mapa logístico x→r·x·(1−x): serie temporal, cobweb y bifurcación. Encontrá la cascada de Feigenbaum y atractores.",
  },
  {
    slug: "traffic-signal-lab",
    slugEs: "laboratorio-semaforos",
    nameEn: "Traffic Signal Lab",
    nameEs: "Laboratorio de semáforos",
    tag: "physics",
    theme: "lab",
    emoji: "🚦",
    badgeEn: "Phase timing",
    badgeEs: "Tiempos de fase",
    summaryEn:
      "4-way intersection. Set NS/EW green times, watch cars queue or flow, and track throughput live.",
    summaryEs:
      "Intersección de 4 vías. Ajustá verdes N-S/E-O, mirá colas y flujo, y medí el throughput en vivo.",
  },
  {
    slug: "bin-packing",
    slugEs: "empaque-cajas",
    nameEn: "Bin packing",
    nameEs: "Empaque de cajas",
    tag: "math",
    theme: "lab",
    emoji: "📦",
    badgeEn: "Utilization",
    badgeEs: "Utilización",
    summaryEn:
      "Pack rectangles into a fixed bin. Click to place selected sizes, avoid overlaps, maximize utilization %.",
    summaryEs:
      "Empacá rectángulos en un contenedor fijo. Hacé clic para colocar tamaños, evitá solapamientos, maximizá la utilización %.",
  },
] as const;

export const SIM_JOURNEYS: Record<string, string[]> = {
  "logistic-chaos-lab": ["sir-epidemic", "galton-board", "double-pendulum", "ecosystem"],
  "traffic-signal-lab": ["logistic-chaos-lab", "sir-epidemic", "ecosystem", "boids-flocking-lab"],
  "double-pendulum": ["pendulum", "logistic-chaos-lab", "gravity-sandbox", "galton-board"],
  "sir-epidemic": ["ecosystem", "logistic-chaos-lab", "galton-board", "market-equilibrium"],
  "molecular-motion": ["reaction-diffusion-lab", "optics-bench", "dc-circuit", "standing-wave"],
  "gravity-sandbox": ["double-pendulum", "projectile-motion", "boids-flocking-lab", "pendulum"],
  "boids-flocking-lab": ["ecosystem", "traffic-signal-lab", "gravity-sandbox", "reaction-diffusion-lab"],
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
