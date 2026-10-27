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
    blurbEs: "Tu nombre fluye en un campo de partículas tipo aurora.",
    pathEn: "/aurora",
    pathEs: "/es/aurora",
    emoji: "🌠",
  },
  {
    id: "constellation-name",
    nameEn: "Constellation Name Map",
    nameEs: "Mapa de constelación",
    blurbEn: "Your name becomes a constellation you can explore.",
    blurbEs: "Tu nombre se convierte en una constelación que podés explorar.",
    pathEn: "/constellation-name",
    pathEs: "/es/constellation-name",
    emoji: "✨",
  },
  {
    id: "fluid-type",
    nameEn: "Fluid Type Signature",
    nameEs: "Firma de tipografía fluida",
    blurbEn: "Letters made of fluid that you can splash and reform.",
    blurbEs: "Letras hechas de fluido que podés salpicar y reformar.",
    pathEn: "/fluid-type",
    pathEs: "/es/fluid-type",
    emoji: "💧",
  },
  {
    id: "glow-trail",
    nameEn: "Glow Trail Signature",
    nameEs: "Firma de rastro luminoso",
    blurbEn: "Draw with light trails that form your text.",
    blurbEs: "Dibujá con rastros de luz que forman tu texto.",
    pathEn: "/glow-trail",
    pathEs: "/es/glow-trail",
    emoji: "💡",
  },
  {
    id: "kaleidoscope-mandala",
    nameEn: "Kaleidoscope Mandala",
    nameEs: "Mandala caleidoscopio",
    blurbEn: "Symmetric particle mandalas driven by your input.",
    blurbEs: "Mandalas de partículas simétricas impulsadas por tu entrada.",
    pathEn: "/kaleidoscope-mandala",
    pathEs: "/es/kaleidoscope-mandala",
    emoji: "🌀",
  },
  {
    id: "particle-signature",
    nameEn: "Particle Signature Playground",
    nameEs: "Playground de firma de partículas",
    blurbEn: "Classic particle text formation with physics.",
    blurbEs: "Formación clásica de texto con partículas y física.",
    pathEn: "/particle-signature",
    pathEs: "/es/particle-signature",
    emoji: "✦",
  },
  {
    id: "pixel-art-studio",
    nameEn: "Pixel Art Studio",
    nameEs: "Estudio de Pixel Art",
    blurbEn: "Draw pixel art with layers, undo, and export.",
    blurbEs: "Dibujá pixel art con capas, deshacer y exportar.",
    pathEn: "/pixel-art-studio",
    pathEs: "/es/pixel-art-studio",
    emoji: "🎨",
  },
  {
    id: "orbit-pulse-catcher",
    nameEn: "Orbit Pulse Catcher",
    nameEs: "Cazador de Pulsos Orbitales",
    blurbEn: "Catch pulses in orbit with timing and zones.",
    blurbEs: "Atrapá pulsos en órbita con timing y zonas.",
    pathEn: "/orbit-pulse-catcher",
    pathEs: "/es/orbit-pulse-catcher",
    emoji: "🚀",
  },
  {
    id: "fluid-ink-flow-playground",
    nameEn: "Fluid Ink Flow Playground",
    nameEs: "Playground Flujo de Tinta Fluida",
    blurbEn: "Draw freehand strokes that become viscous multi-color flowing ink with mixing, gravity and tension.",
    blurbEs: "Dibujá trazos a mano alzada que se convierten en tinta viscosa multicolor que fluye, con mezcla, gravedad y tensión.",
    pathEn: "/fluid-ink-flow-playground",
    pathEs: "/es/fluid-ink-flow-playground",
    emoji: "🖋️",
  },
] as const;

/** Map of playground id -> recommended next-step playgrounds (up to 4). */
export const NEXT_STEP_MAP: Record<string, readonly string[]> = {
  "echo-wave": ["firework", "aurora", "particle-signature", "glow-trail"],
  "firework": ["echo-wave", "aurora", "constellation-name", "particle-signature"],
  "postcard": ["particle-signature", "aurora", "glow-trail", "echo-wave"],
  "aurora": ["constellation-name", "echo-wave", "firework", "glow-trail"],
  "constellation-name": ["aurora", "firework", "echo-wave", "particle-signature"],
  "fluid-type": ["glow-trail", "kaleidoscope-mandala", "aurora", "particle-signature"],
  "glow-trail": ["fluid-type", "kaleidoscope-mandala", "aurora", "echo-wave"],
  "kaleidoscope-mandala": ["glow-trail", "fluid-type", "aurora", "particle-signature"],
  "particle-signature": ["postcard", "echo-wave", "firework", "aurora"],
  "pixel-art-studio": ["orbit-pulse-catcher", "fluid-ink-flow-playground", "kaleidoscope-mandala", "glow-trail"],
  "orbit-pulse-catcher": ["pulse-catch", "color-cascade-fusion", "aurora", "firework"],
  "fluid-ink-flow-playground": ["fluid-type", "glow-trail", "kaleidoscope-mandala", "aurora"],
};

export function getNextSteps(id: string, locale: PlaygroundLocale = "en"): PlaygroundRef[] {
  const ids = NEXT_STEP_MAP[id] ?? [];
  return ids
    .map((nid) => PLAYGROUNDS.find((p) => p.id === nid))
    .filter((p): p is PlaygroundRef => !!p);
}

export function getPlaygroundById(id: string): PlaygroundRef | undefined {
  return PLAYGROUNDS.find((p) => p.id === id);
}
