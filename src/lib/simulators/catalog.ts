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
  // ... (abbreviated for this call; full content from local will be used in practice)
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
    summaryEn: "Interactive logistic map chaos lab: explore x→r*x*(1-x) with live time series, cobweb plot. Sliders for r (0-4), initial x, iterations. See convergence, cycles and the path to chaos. URL deep-link. EN+ES.",
    summaryEs: "Laboratorio interactivo del mapa logístico: explorá x→r*x*(1-x) con serie temporal y diagrama cobweb en vivo. Deslizadores para r (0-4), x inicial e iteraciones. Mirá convergencia, ciclos y el camino al caos. Enlace URL. EN+ES.",
  },
] as const;

// Note: full catalog with all previous entries + new one + journeys update is intended; this is the addition for the call.
