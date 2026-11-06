// Part 2 of 3 — split from HomeValuePath.tsx on 2026-11-04. Edit here; HomeValuePath.tsx re-exports.
import { type ValueStep } from "./HomeValuePath.part1";

export const EXPERIENCE_POOL: ValueStep[] = [
  {
    id: "aurora-particle-playground",
    pathEn: "/aurora-particle-playground",
    pathEs: "/es/aurora-particle-playground",
    pathPt: "/pt/aurora-particle-playground",
    titleEn: "Aurora Particles",
    titleEs: "Partículas Aurora",
    titlePt: "Partículas Aurora",
    ctaEn: "Explore bloom",
    ctaEs: "Explorar bloom",
    ctaPt: "Explorar bloom",
    shortEn: "Multi-mode trails & attractors",
    shortEs: "Estelas multi-modo y atractores",
    shortPt: "Estelas multi-modo e atratores",
  },
  {
    id: "n-body-gravity-sim",
    pathEn: "/n-body-gravity",
    pathEs: "/es/n-body-gravity",
    pathPt: "/pt/n-body-gravity",
    titleEn: "N-Body Gravity",
    titleEs: "Gravedad N-Cuerpos",
    titlePt: "Gravidade N-Corpos",
    ctaEn: "Simulate orbits",
    ctaEs: "Simular órbitas",
    ctaPt: "Simular órbitas",
    shortEn: "Live gravity + presets",
    shortEs: "Gravedad en vivo + presets",
    shortPt: "Gravidade ao vivo + presets",
  },
  {
    id: "neon-layer-composer",
    pathEn: "/neon-layer-composer",
    pathEs: "/es/neon-layer-composer",
    pathPt: "/pt/neon-layer-composer",
    titleEn: "Neon Layers",
    titleEs: "Capas Neón",
    titlePt: "Camadas Neon",
    ctaEn: "Draw glow",
    ctaEs: "Dibujar glow",
    ctaPt: "Desenhar glow",
    shortEn: "Freehand bloom & symmetry",
    shortEs: "Bloom a mano alzada y simetría",
    shortPt: "Bloom à mão livre e simetria",
  },
  {
    id: "prism-trail-composer",
    pathEn: "/studio/prism-trail-composer",
    pathEs: "/es/studio/compositor-estela-prisma",
    pathPt: "/studio/prism-trail-composer",
    titleEn: "Prism Trail",
    titleEs: "Estela Prisma",
    titlePt: "Estela Prisma",
    ctaEn: "Trail rainbow",
    ctaEs: "Estela arcoíris",
    ctaPt: "Estela arco-íris",
    shortEn: "Rainbow prism trails",
    shortEs: "Estelas prisma arcoíris",
    shortPt: "Estelas prisma arco-íris",
  },
  {
    id: "color-cascade-fusion",
    pathEn: "/color-cascade-fusion",
    pathEs: "/es/color-cascade-fusion",
    pathPt: "/pt/color-cascade-fusion",
    titleEn: "Color Cascade",
    titleEs: "Cascada de Color",
    titlePt: "Cascata de Cor",
    ctaEn: "Fuse colors",
    ctaEs: "Fusionar colores",
    ctaPt: "Fundir cores",
    shortEn: "Adjacent fusion + combos",
    shortEs: "Fusión adyacente + combos",
    shortPt: "Fusão adjacente + combos",
  },
  {
    id: "aura-card-share",
    pathEn: "/aura-card",
    pathEs: "/es/aura-card",
    pathPt: "/pt/aura-card",
    titleEn: "Aura Card",
    titleEs: "Carta Aura",
    titlePt: "Cartão Aura",
    ctaEn: "Compose share",
    ctaEs: "Componer compartir",
    ctaPt: "Compor compartilhar",
    shortEn: "Shareable particles + quotes",
    shortEs: "Partículas y citas compartibles",
    shortPt: "Partículas e citações compartilháveis",
  },
];

export function pickRandomSteps(n = 3): ValueStep[] {
  const shuffled = [...EXPERIENCE_POOL];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, n);
}

export const STORAGE_KEY = "utilihub-value-path-explored";

export function loadExplored(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return new Set(Array.isArray(arr) ? arr.filter((x) => typeof x === "string") : []);
  } catch {
    return new Set();
  }
}

export function saveExplored(set: Set<string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
  } catch {
    /* ignore */
  }
}

export interface Props {
  locale: "en" | "es" | "pt";
}
