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
    emoji: "🖋️",
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
] as const;

/** First id = primary next step. */
export const PLAYGROUND_JOURNEYS: Record<string, string[]> = {
  "echo-wave": ["fluid-type", "firework", "aurora", "postcard"],
  firework: ["postcard", "particle-signature", "aurora", "fluid-type"],
  postcard: ["firework", "fluid-type", "aurora", "constellation-name"],
  aurora: ["fluid-type", "postcard", "firework", "constellation-name"],
  "fluid-type": ["aurora", "postcard", "firework", "particle-signature"],
  "constellation-name": ["constellation-studio", "postcard", "aurora", "firework"],
  "visual-signature": ["particle-signature", "firework", "postcard", "aurora"],
  particles: ["gravity-particles", "kaleidoscope-mandala", "particle-signature", "firework"],
  "gravity-particles": ["particles", "firework", "particle-signature", "postcard"],
  "particle-signature": ["firework", "postcard", "visual-signature", "particles"],
  "constellation-studio": ["constellation-name", "kaleidoscope-mandala", "floor-plan", "particles"],
  "debt-snowball": ["floor-plan", "seating-chart", "particles", "gravity-particles"],
  "floor-plan": ["seating-chart", "constellation-studio", "debt-snowball", "particles"],
  "seating-chart": ["floor-plan", "constellation-studio", "debt-snowball", "particles"],
  "kaleidoscope-mandala": ["constellation-studio", "particles", "particle-signature", "firework"],
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
