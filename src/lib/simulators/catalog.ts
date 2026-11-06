import { type SimDef, type SimLocale, type SimTag } from "./catalog.part1";
import { SIMULATORS } from "./catalog.part2";
import { PT_SIMULATORS, PT_SIM_TAGS } from "@/lib/i18n/pt-simulators";
export type { SimLocale, SimTag, SimTheme, SimDef } from "./catalog.part1";
export { SIMULATORS } from "./catalog.part2";

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
  if (locale === "pt") return PT_SIMULATORS[sim.slug]?.name ?? sim.nameEn;
  return locale === "es" ? sim.nameEs : sim.nameEn;
}

export function simSummary(sim: SimDef, locale: SimLocale = "en") {
  if (locale === "pt") return PT_SIMULATORS[sim.slug]?.summary ?? sim.summaryEn;
  return locale === "es" ? sim.summaryEs : sim.summaryEn;
}

export function simBadge(sim: SimDef, locale: SimLocale = "en") {
  if (locale === "pt") return PT_SIMULATORS[sim.slug]?.badge ?? sim.badgeEn;
  return locale === "es" ? sim.badgeEs : sim.badgeEn;
}

export function simTagLabel(tag: SimTag, locale: SimLocale = "en") {
  if (locale === "pt") return PT_SIM_TAGS[tag];
  if (locale === "es") {
    return tag === "physics" ? "Física" : tag === "chemistry" ? "Química" : "Matemática";
  }
  return tag === "physics" ? "Physics" : tag === "chemistry" ? "Chemistry" : "Math";
}
