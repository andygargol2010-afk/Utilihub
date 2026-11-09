import { type PlaygroundRef, type PlaygroundLocale } from "./next-step.part1";
import { PLAYGROUNDS } from "./next-step.part2";
export type { PlaygroundLocale, PlaygroundRef } from "./next-step.part1";
export { PLAYGROUNDS } from "./next-step.part2";

/** First id = primary next step. */
export const PLAYGROUND_JOURNEYS: Record<string, string[]> = {
  "echo-wave": ["fluid-type", "firework", "aurora", "postcard"],
  firework: ["postcard", "particle-signature", "aurora", "fluid-type"],
  postcard: ["firework", "fluid-type", "aurora", "constellation-name"],
  aurora: ["fluid-type", "postcard", "firework", "constellation-name"],
  "aurora-particle-playground": ["aurora", "particle-magnet-lab", "gravity-ribbon-canvas", "glow-trail"],
  "aurora-ribbon-weaver": ["aurora-particle-playground", "glow-trail", "gravity-ribbon-canvas", "neon-layer-composer"],
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
  "fluid-ink-flow-playground": ["fluid-type", "glow-trail", "kaleidoscope-mandala", "aurora"],
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
