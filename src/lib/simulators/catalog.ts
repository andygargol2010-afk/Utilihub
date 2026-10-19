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
      "Interactive states of matter simulator: solid, liquid, and gas. Watch particles vibrate, flow, or fly free. Free educational chemistry/physics demo in the browser.",
    summaryEs:
      "Simulador interactivo de estados de la materia: sólido, líquido y gas. Mirá cómo las partículas vibran, fluyen o vuelan. Demostración educativa gratis de química/física en el navegador.",
  },
  {
    slug: "gravity-sandbox",
    slugEs: "sandbox-gravedad",
    nameEn: "Gravity sandbox",
    nameEs: "Sandbox de gravedad",
    tag: "physics",
    theme: "cosmos",
    emoji: "🌌",
    badgeEn: "N-body gravity",
    badgeEs: "Gravedad N-cuerpos",
    summaryEn:
      "Free N-body gravity simulator in the browser. Orbit, binary, or cluster presets; tweak G; tap to add masses with trails. Educational physics playground.",
    summaryEs:
      "Simulador de gravedad de N cuerpos gratis en el navegador. Presets de órbita, binario o cúmulo; ajustá G; tocá para añadir masas con estelas. Física educativa interactiva.",
  },
  {
    slug: "pendulum",
    slugEs: "pendulo",
    nameEn: "Pendulum",
    nameEs: "Péndulo",
    tag: "physics",
    theme: "clockwork",
    emoji: "🕰️",
    badgeEn: "Simple harmonic",
    badgeEs: "Movimiento armónico",
    summaryEn:
      "Swing a pendulum, change length and damping, drag to set the angle. See period and energy in a brass clockwork lab.",
    summaryEs:
      "Hacé oscilar un péndulo, cambiá longitud y amortiguación, arrastrá para fijar el ángulo. Periodo y energía en un laboratorio de relojería.",
  },
  {
    slug: "double-pendulum",
    slugEs: "pendulo-doble",
    nameEn: "Double pendulum chaos",
    nameEs: "Péndulo doble caótico",
    tag: "physics",
    theme: "lab",
    emoji: "⚖️",
    badgeEn: "Sensitive dependence",
    badgeEs: "Dependencia sensible",
    summaryEn:
      "Classic double pendulum chaos lab. Adjust initial angles, rod lengths and masses; watch the second bob draw a fading trail. Optional damping, gravity, pause, reset and slight-perturbation to show sensitive dependence. Lightweight canvas, EN+ES.",
    summaryEs:
      "Laboratorio clásico de péndulo doble caótico. Ajustá ángulos iniciales, longitudes y masas; mirá cómo el segundo bob traza una estela que se desvanece. Amortiguación, gravedad, pausa, reinicio y perturbación leve para mostrar dependencia sensible. Canvas ligero, EN+ES.",
  },
  {
    slug: "projectile-motion",
    slugEs: "movimiento-proyectil",
    nameEn: "Projectile motion",
    nameEs: "Movimiento de proyectil",
    tag: "physics",
    theme: "clockwork",
    emoji: "🚀",
    badgeEn: "Ballistics lab",
    badgeEs: "Lab de balística",
    summaryEn:
      "Launch a projectile: set angle and speed, toggle air drag, and compare the ideal parabola with the real path. Range, height, and flight time live.",
    summaryEs:
      "Lanzá un proyectil: ángulo y velocidad, arrastre del aire opcional, y compará la parábola ideal con la trayectoria real. Alcance, altura y tiempo de vuelo en vivo.",
  },
  {
    slug: "optics-bench",
    slugEs: "banco-optico",
    nameEn: "Optics bench",
    nameEs: "Banco óptico",
    tag: "physics",
    theme: "lab",
    emoji: "🔬",
    badgeEn: "Lenses & mirrors",
    badgeEs: "Lentes y espejos",
    summaryEn:
      "Ray diagram lab: converging and diverging lenses, concave and convex mirrors. Move the object, change focal length, see image distance and magnification.",
    summaryEs:
      "Laboratorio de rayos: lentes convergentes y divergentes, espejos cóncavos y convexos. Mové el objeto, cambiá la focal y mirá distancia e imagen.",
  },
  {
    slug: "dc-circuit",
    slugEs: "circuito-dc",
    nameEn: "DC circuit lab",
    nameEs: "Lab de circuitos DC",
    tag: "physics",
    theme: "lab",
    emoji: "⚡",
    badgeEn: "Series & parallel",
    badgeEs: "Serie y paralelo",
    summaryEn:
      "Build series or parallel resistor circuits, tweak battery voltage, optional LED drop. Live current, voltage drops, and power with animated flow.",
    summaryEs:
      "Armá circuitos en serie o paralelo, ajustá la batería y un LED opcional. Corriente, caídas de tensión y potencia en vivo con flujo animado.",
  },
  {
    slug: "ecosystem",
    slugEs: "ecosistema",
    nameEn: "Ecosystem",
    nameEs: "Ecosistema",
    tag: "math",
    theme: "lab",
    emoji: "🌿",
    badgeEn: "Food chain",
    badgeEs: "Cadena trófica",
    summaryEn:
      "Three-level food chain: plants, herbivores, predators. Tune growth, grazing, and hunting — watch populations balance or collapse.",
    summaryEs:
      "Cadena trófica de tres niveles: plantas, herbívoros y depredadores. Ajustá crecimiento, pastoreo y caza; mirá equilibrio o colapso.",
  },
  {
    slug: "sir-epidemic",
    slugEs: "epidemia-sir",
    nameEn: "SIR epidemic",
    nameEs: "Epidemia SIR",
    tag: "math",
    theme: "lab",
    emoji: "🦠",
    badgeEn: "Outbreak model",
    badgeEs: "Modelo de brote",
    summaryEn:
      "Classic SIR compartments: susceptible, infected, recovered. Tune β, γ, and vaccination. Watch R₀ and the epidemic curve.",
    summaryEs:
      "Compartimentos SIR: susceptibles, infectados, recuperados. Ajustá β, γ y vacunación. Mirá R₀ y la curva de la epidemia.",
  },
  {
    slug: "market-equilibrium",
    slugEs: "equilibrio-mercado",
    nameEn: "Market equilibrium",
    nameEs: "Equilibrio de mercado",
    tag: "math",
    theme: "lab",
    emoji: "📈",
    badgeEn: "Supply & demand",
    badgeEs: "Oferta y demanda",
    summaryEn:
      "Shift supply and demand curves, add a per-unit tax, and see equilibrium price, quantity, revenue, and surplus.",
    summaryEs:
      "Mové las curvas de oferta y demanda, agregá un impuesto unitario y mirá precio, cantidad, ingresos y excedentes de equilibrio.",
  },
  {
    slug: "standing-wave",
    slugEs: "ondas-estacionarias",
    nameEn: "Standing wave",
    nameEs: "Onda estacionaria",
    tag: "physics",
    theme: "lab",
    emoji: "🌊",
    badgeEn: "String harmonics",
    badgeEs: "Armónicos de cuerda",
    summaryEn:
      "A string fixed at both ends. Pick the harmonic, amplitude, and tension. Nodes stay still; wavelength is L/n (L = 1.2 m).",
    summaryEs:
      "Cuerda fija en ambos extremos. Elegí el armónico, la amplitud y la tensión. Los nodos no se mueven; la longitud de onda es L/n (L = 1,2 m).",
  },
  {
    slug: "wave-interference",
    slugEs: "interferencia-ondas",
    nameEn: "Wave interference",
    nameEs: "Interferencia de ondas",
    tag: "physics",
    theme: "lab",
    emoji: "🔪",
    badgeEn: "Two sources",
    badgeEs: "Dos fuentes",
    summaryEn:
      "Two coherent sources. Adjust frequency, separation and phase difference. Watch constructive and destructive interference form live on canvas.",
    summaryEs:
      "Dos fuentes coherentes. Ajustá frecuencia, separación y diferencia de fase. Mirá interferencia constructiva y destructiva en vivo.",
  },
  {
    slug: "galton-board",
    slugEs: "tablero-galton",
    nameEn: "Galton board",
    nameEs: "Tablero de Galton",
    tag: "math",
    theme: "lab",
    emoji: "🔔",
    badgeEn: "Normal distribution",
    badgeEs: "Distribución normal",
    summaryEn:
      "Balls fall through pegs, randomly left or right, and pile up into a Gaussian bell curve. Adjust rows, speed, drop batches, and watch the distribution form live.",
    summaryEs:
      "Las bolas caen por clavos, se bifurcan al azar a izquierda o derecha y forman una campana de Gauss. Ajustá filas, velocidad, soltá lotes y mirá la distribución en vivo.",
  },
  {
    slug: "boids-flocking-lab",
    slugEs: "boids-flocking-lab",
    nameEn: "Boids Flocking Lab",
    nameEs: "Lab de bandada Boids",
    tag: "physics",
    theme: "lab",
    emoji: "🐦",
    badgeEn: "Emergent flocking",
    badgeEs: "Bandada emergente",
    summaryEn:
      "Live flock of colored particles following separation, alignment and cohesion. Adjust rule strengths, speed and perception radius. Trails, color by velocity or neighbors, mild mouse attraction. Pure evolving system visualization.",
    summaryEs:
      "Bandada en vivo de partículas coloreadas que siguen separación, alineación y cohesión. Ajustá fuerza de cada regla, velocidad y radio de percepción. Estelas, color por velocidad o vecinos, atracción suave al ratón. Visualización de sistema evolutivo.",
  },
  {
    slug: "reaction-diffusion-lab",
    slugEs: "lab-reaccion-difusion",
    nameEn: "Reaction-Diffusion Lab",
    nameEs: "Lab de reacción-difusión",
    tag: "chemistry",
    theme: "lab",
    emoji: "🧬",
    badgeEn: "Turing patterns",
    badgeEs: "Patrones de Turing",
    summaryEn:
      "Interactive Gray-Scott reaction-diffusion lab. Adjust feed and kill rates, diffusion coefficients, and color maps. Presets for spots, stripes, mazes, and labyrinths. Live evolving canvas with seed brush to paint activator, pause/reset, and visual organic patterns that emerge over time. Lightweight 2D grid simulation for browser, EN+ES parity.",
    summaryEs:
      "Laboratorio interactivo de reacción-difusión Gray-Scott. Ajustá tasas de alimentación y muerte, coeficientes de difusión y mapas de color. Presets de manchas, rayas, laberintos. Canvas en vivo con pincel para sembrar activador, pausa/reinicio, y patrones orgánicos que emergen con el tiempo. Simulación de grilla 2D ligera, paridad EN+ES.",
  },
] as const;

/** Next-step sims for bounce reduction (first = primary). Keys = EN slug. */
export const SIM_JOURNEYS: Record<string, string[]> = {
  pendulum: ["double-pendulum", "projectile-motion", "gravity-sandbox", "standing-wave"],
  "double-pendulum": ["pendulum", "gravity-sandbox", "projectile-motion", "standing-wave"],
  "projectile-motion": ["pendulum", "double-pendulum", "gravity-sandbox", "optics-bench"],
  "gravity-sandbox": ["pendulum", "double-pendulum", "projectile-motion", "molecular-motion"],
  "molecular-motion": ["gravity-sandbox", "pendulum", "optics-bench", "dc-circuit"],
  "optics-bench": ["wave-interference", "standing-wave", "pendulum", "gravity-sandbox"],
  "standing-wave": ["wave-interference", "optics-bench", "pendulum", "projectile-motion"],
  "wave-interference": ["standing-wave", "optics-bench", "pendulum", "gravity-sandbox"],
  "dc-circuit": ["molecular-motion", "optics-bench", "pendulum", "gravity-sandbox"],
  ecosystem: ["sir-epidemic", "galton-board", "market-equilibrium", "molecular-motion"],
  "sir-epidemic": ["ecosystem", "galton-board", "market-equilibrium", "molecular-motion"],
  "market-equilibrium": ["galton-board", "sir-epidemic", "ecosystem", "gravity-sandbox"],
  "galton-board": ["market-equilibrium", "sir-epidemic", "ecosystem", "pendulum"],
  "boids-flocking-lab": ["gravity-sandbox", "molecular-motion", "double-pendulum", "wave-interference"],
  "reaction-diffusion-lab": ["boids-flocking-lab", "molecular-motion", "ecosystem", "wave-interference"],
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
