/** Shared next-step catalog for playgrounds / shareable experiences (retention). */

export type PlaygroundLocale = "en" | "es";

export type PlaygroundRef = {
  id: string;
  nameEn: string;
  nameEs: string;
  blurbEn: string;
  blurbEs: string;
  pathEn: string;
  pathEs: string;
  emoji: string;
};

/** All interactive playgrounds / text-to-particle experiences. */
export const PLAYGROUNDS: readonly PlaygroundRef[] = [
  {
    id: "echo-wave",
    nameEn: "Echo Wave Signature",
    nameEs: "Firma de Onda Eco",
    blurbEn: "Unique multi-layer sine waves from your text. Pluck ripples that interfere.",
    blurbEs: "Ondas sinusoidales multicapa únicas a partir de tu texto. Creá ondas que interfieren.",
    pathEn: "/echo-wave",
    pathEs: "/es/echo-wave",
    emoji: "🌊",
  },
  {
    id: "firework",
    nameEn: "Firework Signature",
    nameEs: "Firma de fuegos",
    blurbEn: "Letters form from fireworks, then explode into color.",
    blurbEs: "Letras formadas por fuegos artificiales y explosión de color.",
    pathEn: "/firework",
    pathEs: "/es/firework",
    emoji: "🎆",
  },
  {
    id: "postcard",
    nameEn: "Particle Postcard",
    nameEs: "Postal de partículas",
    blurbEn: "Particles swarm to form your short message.",
    blurbEs: "Partículas que se juntan para formar tu mensaje.",
    pathEn: "/postcard",
    pathEs: "/es/postcard",
    emoji: "✉️",
  },
  {
    id: "aurora",
    nameEn: "Aurora Name Flow",
    nameEs: "Aurora de nombre",
    blurbEn: "Your name flows through an aurora particle field.",
    blurbEs: "Tu nombre fluye en un campo de partículas aurora.",
    pathEn: "/aurora",
    pathEs: "/es/aurora",
    emoji: "🌌",
  },
  {
    id: "aurora-particle-playground",
    nameEn: "Aurora Particle Playground",
    nameEs: "Playground de Partículas Aurora",
    blurbEn: "Place magnetic attractors; particles form glowing aurora ribbons with persistent trails.",
    blurbEs: "Colocá atractores magnéticos; las partículas forman cintas de aurora brillantes con estelas persistentes.",
    pathEn: "/aurora-particle-playground",
    pathEs: "/es/aurora-particle-playground",
    emoji: "🌌",
  },
  {
    id: "fluid-type",
    nameEn: "Fluid Type Signature",
    nameEs: "Firma de tipografía fluida",
    blurbEn: "Liquid type that reacts as you type.",
    blurbEs: "Tipografía líquida que reacciona al escribir.",
    pathEn: "/fluid-type",
    pathEs: "/es/fluid-type",
    emoji: "💧",
  },
  {
    id: "constellation-name",
    nameEn: "Constellation Name Map",
    nameEs: "Mapa de constelación",
    blurbEn: "Turn a name into a personal star map.",
    blurbEs: "Convertí un nombre en un mapa de estrellas personal.",
    pathEn: "/constellation",
    pathEs: "/es/constellation",
    emoji: "✨",
  },
  {
    id: "visual-signature",
    nameEn: "Visual Signature",
    nameEs: "Firma visual",
    blurbEn: "A shareable visual mark from your text.",
    blurbEs: "Una marca visual compartible a partir de tu texto.",
    pathEn: "/visual-signature",
    pathEs: "/es/firma-visual",
    emoji: "🪻",
  },
  {
    id: "particles",
    nameEn: "Particle Playground",
    nameEs: "Playground de partículas",
    blurbEn: "Live particle field with interactive controls.",
    blurbEs: "Campo de partículas en vivo con controles interactivos.",
    pathEn: "/playgrounds/particles",
    pathEs: "/es/playgrounds/particulas",
    emoji: "✨",
  },
  {
    id: "gravity-particles",
    nameEn: "Gravity Particles",
    nameEs: "Partículas con gravedad",
    blurbEn: "Particles that fall and cluster under gravity.",
    blurbEs: "Partículas que caen y se agrupan con gravedad.",
    pathEn: "/playgrounds/gravity-particles",
    pathEs: "/es/playgrounds/particulas-gravedad",
    emoji: "🪐",
  },
  {
    id: "particle-magnet-lab",
    nameEn: "Particle Magnet Lab",
    nameEs: "Laboratorio de Imanes de Partículas",
    blurbEn: "Place attract/repel magnets; particles stream and leave field trails.",
    blurbEs: "Colocá imanes que atraen o repelen; las partículas fluyen y dejan estelas del campo.",
    pathEn: "/playgrounds/particle-magnets",
    pathEs: "/es/playgrounds/imanes-particulas",
    emoji: "🧲",
  },
  {
    id: "gravity-ribbon-canvas",
    nameEn: "Gravity Ribbon Canvas",
    nameEs: "Lienzo de Cintas de Gravedad",
    blurbEn: "Sketch freeform ribbons that attract particles into glowing trail signatures.",
    blurbEs: "Dibujá cintas libres que atraen partículas en firmas de estelas brillantes.",
    pathEn: "/playgrounds/gravity-ribbon-canvas",
    pathEs: "/es/playgrounds/lienzo-cintas-gravedad",
    emoji: "🌊",
  },
  {
    id: "particle-signature",
    nameEn: "Particle Signature",
    nameEs: "Firma de partículas",
    blurbEn: "Draw a signature that particles remember.",
    blurbEs: "Dibujá una firma que las partículas recuerdan.",
    pathEn: "/playgrounds/particle-signature",
    pathEs: "/es/playgrounds/firma-particulas",
    emoji: "💫",
  },
  {
    id: "constellation-studio",
    nameEn: "Constellation Share Studio",
    nameEs: "Estudio de constelaciones",
    blurbEn: "Drag stars, connect lines, share the URL.",
    blurbEs: "Arrastrá estrellas, conectá líneas y compartí la URL.",
    pathEn: "/playgrounds/constellation",
    pathEs: "/es/playgrounds/constelacion",
    emoji: "⭐",
  },
  {
    id: "debt-snowball",
    nameEn: "Debt Snowball Visualizer",
    nameEs: "Visualizador deuda bola de nieve",
    blurbEn: "See debts shrink with the snowball method.",
    blurbEs: "Mirá cómo bajan las deudas con el método bola de nieve.",
    pathEn: "/playgrounds/debt-snowball",
    pathEs: "/es/playgrounds/deuda-bola-nieve",
    emoji: "❄️",
  },
  {
    id: "floor-plan",
    nameEn: "Floor Plan Studio",
    nameEs: "Estudio de planos",
    blurbEn: "Compose rooms and furniture on a live canvas.",
    blurbEs: "Armá ambientes y muebles en un canvas en vivo.",
    pathEn: "/playgrounds/floor-plan",
    pathEs: "/es/playgrounds/plano-planta",
    emoji: "🏠",
  },
  {
    id: "kaleidoscope-mandala",
    nameEn: "Kaleidoscope Mandala Studio",
    nameEs: "Estudio de mandalas caleidoscópico",
    blurbEn: "Draw once — rotational symmetry blooms into a mandala.",
    blurbEs: "Dibujá una vez: la simetría rotacional florece en un mandala.",
    pathEn: "/playgrounds/kaleidoscope-mandala",
    pathEs: "/es/playgrounds/kaleidoscopio-mandala",
    emoji: "🔮",
  },
  {
    id: "seating-chart",
    nameEn: "Event Seating Chart",
    nameEs: "Plano de asientos",
    blurbEn: "Drag guests onto tables with live capacity.",
    blurbEs: "Arrastrá invitados a mesas con capacidad en vivo.",
    pathEn: "/playgrounds/seating-chart",
    pathEs: "/es/playgrounds/plano-asientos",
    emoji: "🪑",
  },
  {
    id: "neon-sign",
    nameEn: "Neon Signature Studio",
    nameEs: "Estudio de Firma Neón",
    blurbEn: "Typed text becomes a glowing animated neon tube sign with flicker.",
    blurbEs: "El texto se convierte en un cartel de neón brillante animado con parpadeo.",
    pathEn: "/neon-sign",
    pathEs: "/es/neon-sign",
    emoji: "💡",
  },
  {
    id: "neon-signature-composer",
    nameEn: "Neon Signature Composer",
    nameEs: "Compositor de Firma Neón",
    blurbEn: "Draw freehand multi-layer neon paths with flowing glow and sparkles.",
    blurbEs: "Dibujá trayectorias de neón multicapa a mano alzada con brillo fluido y chispas.",
    pathEn: "/studio/neon-signature-composer",
    pathEs: "/es/studio/compositor-firma-neon",
    emoji: "🌟",
  },
  {
    id: "pulse-catch",
    nameEn: "Pulse Catch",
    nameEs: "Pulse Catch",
    blurbEn: "Catch glowing sparks before they fade. Build combos and particle bursts.",
    blurbEs: "Atrapá chispas brillantes antes de que se apaguen. Construí combos y explosiones de partículas.",
    pathEn: "/pulse-catch",
    pathEs: "/es/pulse-catch",
    emoji: "⚡",
  },
  {
    id: "glow-trail",
    nameEn: "Glow Trail Composer",
    nameEs: "Compositor de Estelas Brillantes",
    blurbEn: "Draw glowing light trails that leave persistent particle afterglows and blooms.",
    blurbEs: "Dibujá estelas de luz brillante que dejan resplandores de partículas y floraciones persistentes.",
    pathEn: "/glow-trail",
    pathEs: "/es/glow-trail",
    emoji: "✨",
  },
  {
    id: "prism-trail-composer",
    nameEn: "Prism Trail Composer",
    nameEs: "Compositor de Estela Prisma",
    blurbEn: "Freehand paths that split into rainbow refraction beams with live bloom and particle afterglow.",
    blurbEs: "Trayectorias a mano alzada que se dividen en haces de refracción arcoíris con bloom en vivo y resplandor de partículas.",
    pathEn: "/studio/prism-trail-composer",
    pathEs: "/es/studio/compositor-estela-prisma",
    emoji: "🌈",
  },
  {
    id: "neon-layer-composer",
    nameEn: "Neon Layer Composer",
    nameEs: "Compositor de Capas Neón",
    blurbEn: "Multi-layer neon drawing with symmetry modes and stroke-attached particle emitters.",
    blurbEs: "Dibujo neón multicapa con modos de simetría y emisores de partículas en el trazo.",
    pathEn: "/neon-layer-composer",
    pathEs: "/es/neon-layer-composer",
    emoji: "✨",
  },
  {
    id: "modular-pattern-composer",
    nameEn: "Modular Pattern Composer",
    nameEs: "Compositor de Patrones Modulares",
    blurbEn: "Place modular tiles on a grid with live procedural animations, symmetry and playback.",
    blurbEs: "Colocá baldosas modulares en una grilla con animaciones procedurales en vivo, simetría y reproducción.",
    pathEn: "/modular-pattern-composer",
    pathEs: "/es/modular-pattern-composer",
    emoji: "🔲",
  },
  {
    id: "river-light",
    nameEn: "River of Light Journey",
    nameEs: "Río de Luz · Viaje",
    blurbEn: "Place waypoints; a glowing river of particles flows between them with afterglows and blooms.",
    blurbEs: "Colocá puntos; un río brillante de partículas fluye entre ellos con resplandores y floraciones.",
    pathEn: "/river-light",
    pathEs: "/es/rio-luz",
    emoji: "🌊",
  },
  {
    id: "waypoint-river-composer",
    nameEn: "Waypoint River Composer",
    nameEs: "Compositor Río de Waypoints",
    blurbEn: "Place sequential waypoints to compose a flowing light-river journey with stage gradients.",
    blurbEs: "Colocá waypoints secuenciales para componer un viaje de río de luz con degradados por etapa.",
    pathEn: "/journeys/waypoint-river-composer",
    pathEs: "/es/viajes/compositor-rio-waypoints",
    emoji: "🌊",
  },
  {
    id: "solar-system-scale-explorer",
    nameEn: "Solar System Scale Explorer",
    nameEs: "Explorador de Escala del Sistema Solar",
    blurbEn: "Zoom, pan and drag planets to feel true relative sizes and distances of the solar system.",
    blurbEs: "Hacé zoom, pan y arrastrá planetas para sentir los tamaños y distancias relativos reales del sistema solar.",
    pathEn: "/solar-system-scale-explorer",
    pathEs: "/es/solar-system-scale-explorer",
    emoji: "🔭",
  },
  {
    id: "daily-progress-constellation",
    nameEn: "Daily Progress Constellation",
    nameEs: "Constelación de Progreso Diario",
    blurbEn: "Each daily visit lights a new star and builds your personal constellation.",
    blurbEs: "Cada visita diaria enciende una nueva estrella y construye tu constelación personal.",
    pathEn: "/daily-progress-constellation",
    pathEs: "/es/daily-progress-constellation",
    emoji: "✨",
  },
  {
    id: "color-cascade-fusion",
    nameEn: "Color Cascade Fusion",
    nameEs: "Fusión Cascada de Color",
    blurbEn: "Fuse falling colored orbs by clicking adjacent matches. Chain reactions and rising levels.",
    blurbEs: "Fusioná orbes de colores que caen haciendo clic en coincidencias adyacentes. Reacciones en cadena y niveles crecientes.",
    pathEn: "/color-cascade-fusion",
    pathEs: "/es/color-cascade-fusion",
    emoji: "🌊",
  },
  {
    id: "aura-card-share",
    nameEn: "Aura Card Composer",
    nameEs: "Compositor de Tarjeta de Aura",
    blurbEn: "Design a personal aura card with particles, bloom, gradients and custom text baked into a PNG.",
    blurbEs: "Diseñá una tarjeta de aura personal con partículas, bloom, degradados y texto personalizado horneado en PNG.",
    pathEn: "/aura-card",
    pathEs: "/es/aura-card",
    emoji: "✨",
  },
  {
    id: "orbit-pulse-catcher",
    nameEn: "Orbit Pulse Catcher",
    nameEs: "Atrapa Pulsos Órbita",
    blurbEn: "Time taps on colored zones to catch orbiting matching pulses. Combos and levels.",
    blurbEs: "Sincronizá toques en zonas de color para atrapar pulsos orbitantes coincidentes. Combos y niveles.",
    pathEn: "/games/orbit-pulse-catcher",
    pathEs: "/es/juegos/atrapa-pulsos-orbita",
    emoji: "🔴",
  },
] as const;

/** First id = primary next step. */
export const PLAYGROUND_JOURNEYS: Record<string, string[]> = {
  "echo-wave": ["fluid-type", "firework", "aurora", "postcard"],
  firework: ["postcard", "particle-signature", "aurora", "fluid-type"],
  postcard: ["firework", "fluid-type", "aurora", "constellation-name"],
  aurora: ["fluid-type", "postcard", "firework", "constellation-name"],
  "aurora-particle-playground": ["aurora", "particle-magnet-lab", "gravity-ribbon-canvas", "glow-trail"],
  "fluid-type": ["aurora", "postcard", "firework", "particle-signature"],
  "constellation-name": ["constellation-studio", "postcard", "aurora", "firework"],
  "visual-signature": ["particle-signature", "firework", "postcard", "aurora"],
  particles: ["gravity-particles", "particle-magnet-lab", "gravity-ribbon-canvas", "kaleidoscope-mandala"],
  "gravity-particles": ["gravity-ribbon-canvas", "particle-magnet-lab", "particles", "firework"],
  "particle-magnet-lab": ["gravity-ribbon-canvas", "gravity-particles", "particles", "glow-trail"],
  "gravity-ribbon-canvas": ["gravity-particles", "particle-magnet-lab", "glow-trail", "particles"],
  "particle-signature": ["firework", "postcard", "visual-signature", "particles"],
  "constellation-studio": ["constellation-name", "kaleidoscope-mandala", "floor-plan", "particles"],
  "debt-snowball": ["floor-plan", "seating-chart", "particles", "gravity-particles"],
  "floor-plan": ["seating-chart", "constellation-studio", "debt-snowball", "particles"],
  "seating-chart": ["floor-plan", "constellation-studio", "debt-snowball", "particles"],
  "kaleidoscope-mandala": ["constellation-studio", "particles", "particle-signature", "firework"],
  "neon-sign": ["firework", "aurora", "fluid-type", "echo-wave"],
  "neon-signature-composer": ["neon-sign", "glow-trail", "kaleidoscope-mandala", "particle-signature"],
  "pulse-catch": ["firework", "particles", "gravity-particles", "neon-sign"],
  "glow-trail": ["gravity-ribbon-canvas", "kaleidoscope-mandala", "neon-sign", "particle-signature"],
  "prism-trail-composer": ["glow-trail", "neon-signature-composer", "kaleidoscope-mandala", "particle-signature"],
  "neon-layer-composer": ["prism-trail-composer", "neon-signature-composer", "kaleidoscope-mandala", "glow-trail"],
  "modular-pattern-composer": ["neon-layer-composer", "kaleidoscope-mandala", "prism-trail-composer", "glow-trail"],
  "river-light": ["glow-trail", "aurora", "neon-sign", "particles"],
  "waypoint-river-composer": ["river-light", "glow-trail", "aurora", "neon-signature-composer"],
  "solar-system-scale-explorer": ["constellation-studio", "aurora", "gravity-particles", "particle-magnet-lab"],
  "daily-progress-constellation": ["constellation-studio", "constellation-name", "aurora", "solar-system-scale-explorer"],
  "color-cascade-fusion": ["pulse-catch", "firework", "particles", "aurora"],
  "aura-card-share": ["aurora-particle-playground", "prism-trail-composer", "neon-signature-composer", "postcard"],
  "orbit-pulse-catcher": ["pulse-catch", "color-cascade-fusion", "aurora", "firework"],
};

export function playgroundById(id: string): PlaygroundRef | undefined {
  return PLAYGROUNDS.find((p) => p.id === id);
}

export function relatedPlaygrounds(currentId: string): PlaygroundRef[] {
  const curated = (PLAYGROUND_JOURNEYS[currentId] ?? [])
    .map((id) => playgroundById(id))
    .filter((p): p is PlaygroundRef => Boolean(p) && p.id !== currentId);
  if (curated.length >= 4) return curated.slice(0, 4);
  const used = new Set([currentId, ...curated.map((p) => p.id)]);
  const rest = PLAYGROUNDS.filter((p) => !used.has(p.id));
  return [...curated, ...rest].slice(0, 4);
}

export function playgroundPath(p: PlaygroundRef, locale: PlaygroundLocale) {
  return locale === "es" ? p.pathEs : p.pathEn;
}

export function playgroundName(p: PlaygroundRef, locale: PlaygroundLocale) {
  return locale === "es" ? p.nameEs : p.nameEn;
}

export function playgroundBlurb(p: PlaygroundRef, locale: PlaygroundLocale) {
  return locale === "es" ? p.blurbEs : p.blurbEn;
}
