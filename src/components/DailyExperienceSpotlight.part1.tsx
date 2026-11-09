// Part 1 of 3 — split from DailyExperienceSpotlight.tsx on 2026-11-04. Edit here; DailyExperienceSpotlight.tsx re-exports.

export interface SpotlightExp {
  id: string;
  pathEn: string;
  pathEs: string;
  pathPt: string;
  titleEn: string;
  titleEs: string;
  titlePt: string;
  teaserEn: string;
  teaserEs: string;
  teaserPt: string;
  ctaEn: string;
  ctaEs: string;
  ctaPt: string;
  accent: string;
}

export const POOL: SpotlightExp[] = [
  {
    id: "aurora-particle-playground",
    pathEn: "/aurora-particle-playground",
    pathEs: "/es/aurora-particle-playground",
    pathPt: "/pt/aurora-particle-playground",
    titleEn: "Aurora Particles",
    titleEs: "Partículas Aurora",
    titlePt: "Partículas Aurora",
    teaserEn: "Multi-mode bloom trails with attractors and emitters.",
    teaserEs: "Estelas bloom multi-modo con atractores y emisores.",
    teaserPt: "Estelas bloom multi-modo com atratores e emissores.",
    ctaEn: "Launch Aurora",
    ctaEs: "Lanzar Aurora",
    ctaPt: "Lançar Aurora",
    accent: "amber",
  },
  {
    id: "n-body-gravity-sim",
    pathEn: "/n-body-gravity",
    pathEs: "/es/n-body-gravity",
    pathPt: "/pt/n-body-gravity",
    titleEn: "N-Body Gravity",
    titleEs: "Gravedad N-Cuerpos",
    titlePt: "Gravidade N-Corpos",
    teaserEn: "Live gravitational dynamics with presets and trails.",
    teaserEs: "Dinámica gravitatoria en vivo con presets y estelas.",
    teaserPt: "Dinâmica gravitacional ao vivo com presets e estelas.",
    ctaEn: "Simulate Gravity",
    ctaEs: "Simular Gravedad",
    ctaPt: "Simular Gravidade",
    accent: "sky",
  },
  {
    id: "neon-layer-composer",
    pathEn: "/neon-layer-composer",
    pathEs: "/es/neon-layer-composer",
    pathPt: "/pt/neon-layer-composer",
    titleEn: "Neon Layers",
    titleEs: "Capas Neón",
    titlePt: "Camadas Neon",
    teaserEn: "Freehand neon canvas with bloom, symmetry and particles.",
    teaserEs: "Lienzo neón a mano alzada con bloom, simetría y partículas.",
    teaserPt: "Tela neon à mão livre com bloom, simetria e partículas.",
    ctaEn: "Compose Neon",
    ctaEs: "Componer Neón",
    ctaPt: "Compor Neon",
    accent: "fuchsia",
  },
  {
    id: "prism-trail-composer",
    pathEn: "/studio/prism-trail-composer",
    pathEs: "/es/studio/compositor-estela-prisma",
    pathPt: "/studio/prism-trail-composer",
    titleEn: "Prism Trail",
    titleEs: "Estela Prisma",
    titlePt: "Estela Prisma",
    teaserEn: "Rainbow prism trails with continuous glow.",
    teaserEs: "Estelas prisma arcoíris con glow continuo.",
    teaserPt: "Estelas prisma arco-íris com glow contínuo.",
    ctaEn: "Trail Prism",
    ctaEs: "Estela Prisma",
    ctaPt: "Estela Prisma",
    accent: "violet",
  },
  {
    id: "color-cascade-fusion",
    pathEn: "/color-cascade-fusion",
    pathEs: "/es/color-cascade-fusion",
    pathPt: "/pt/color-cascade-fusion",
    titleEn: "Color Cascade",
    titleEs: "Cascada de Color",
    titlePt: "Cascata de Cor",
    teaserEn: "Adjacent color fusion and combo cascades.",
    teaserEs: "Fusión de colores adyacentes y cascadas combo.",
    teaserPt: "Fusão de cores adjacentes e cascatas combo.",
    ctaEn: "Fuse Colors",
    ctaEs: "Fusionar Colores",
    ctaPt: "Fundir Cores",
    accent: "emerald",
  },
  {
    id: "aura-card-share",
    pathEn: "/aura-card",
    pathEs: "/es/aura-card",
    pathPt: "/pt/aura-card",
    titleEn: "Aura Card",
    titleEs: "Carta Aura",
    titlePt: "Cartão Aura",
    teaserEn: "Shareable particle cards with quotes and schemes.",
    teaserEs: "Cartas de partículas compartibles con citas y esquemas.",
    teaserPt: "Cartões de partículas compartilháveis com citações e esquemas.",
    ctaEn: "Compose Aura",
    ctaEs: "Componer Aura",
    ctaPt: "Compor Aura",
    accent: "rose",
  },
];
