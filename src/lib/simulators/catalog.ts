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
      "Watch particles vibrate, flow, or fly free as you switch solid, liquid, and gas. Interactive states of matter in your browser.",
    summaryEs:
      "Mirá cómo las partículas vibran, fluyen o vuelan al pasar de sólido a líquido y gas. Estados de la materia interactivos en el navegador.",
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
      "N-body gravity playground. Try orbit, binary, or cluster presets, tweak G, and tap to add masses with trails.",
    summaryEs:
      "Patio de gravedad de N cuerpos. Probá órbita, binario o cúmulo, ajustá G y tocá para añadir masas con estelas.",
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

export function simBadge(sim: SimDef, locale: SimLocale = "en") {
  return locale === "es" ? sim.badgeEs : sim.badgeEn;
}
