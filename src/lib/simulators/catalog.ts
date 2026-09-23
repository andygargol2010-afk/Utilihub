export type SimLocale = "en" | "es";

export type SimTag = "physics" | "chemistry" | "math";

export type SimDef = {
  /** Canonical EN slug used in /simulators/$slug */
  slug: string;
  /** ES path slug under /es/simuladores/$slug */
  slugEs: string;
  nameEn: string;
  nameEs: string;
  tag: SimTag;
  emoji: string;
  summaryEn: string;
  summaryEs: string;
};

export const SIMULATORS: readonly SimDef[] = [
  {
    slug: "molecular-motion",
    slugEs: "movimiento-molecular",
    nameEn: "Molecular motion",
    nameEs: "Movimiento molecular",
    tag: "chemistry",
    emoji: "⚛️",
    summaryEn:
      "Watch particles vibrate, flow, or fly free as you switch solid, liquid, and gas. Interactive states of matter in your browser.",
    summaryEs:
      "Mirá cómo las partículas vibran, fluyen o vuelan al pasar de sólido a líquido y gas. Estados de la materia interactivos en el navegador.",
  },
] as const;

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

export function simTagLabel(tag: SimTag, locale: SimLocale = "en") {
  if (locale === "es") {
    return tag === "physics" ? "Física" : tag === "chemistry" ? "Química" : "Matemática";
  }
  return tag === "physics" ? "Physics" : tag === "chemistry" ? "Chemistry" : "Math";
}
