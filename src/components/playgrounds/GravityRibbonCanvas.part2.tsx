"use client";
// Part 2 of 3 — split from GravityRibbonCanvas.tsx on 2026-11-04. Edit here; GravityRibbonCanvas.tsx re-exports.

export type Point = { x: number; y: number };
export type Ribbon = { points: Point[]; thickness: number; hue: number };

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  hueOffset: number;
  trail: Point[];
}

export const THEMES = {
  aurora: { bg: "#050816", hues: [180, 220, 260, 300], ribbon: "rgba(160,210,255,0.55)" },
  solar: { bg: "#1a0a05", hues: [20, 40, 60, 10], ribbon: "rgba(255,180,80,0.5)" },
  neon: { bg: "#0a0514", hues: [300, 320, 180, 140], ribbon: "rgba(255,100,220,0.5)" },
  ocean: { bg: "#051018", hues: [190, 200, 210, 170], ribbon: "rgba(100,200,255,0.5)" },
};

export const labels = {
  en: {
    count: "Particle count",
    strength: "Attraction strength",
    flow: "Flow along ribbons",
    speed: "Flow speed",
    trail: "Trail length",
    glow: "Trail glow",
    thickness: "Ribbon thickness",
    theme: "Color theme",
    clear: "Clear ribbons",
    reset: "Reset particles",
    undo: "Undo last ribbon",
    help: "Draw freeform ribbons. Each ribbon has its own thickness and hue. Particles are pulled toward them, stream along the path, and emit proximity sparkles when close, leaving glowing additive trails that form temporary signatures. Ribbons render with smooth curves. Multiple ribbons interact. Themes color both ribbons and particles.",
    ribbons: "Ribbons",
  },
  es: {
    count: "Cantidad de part\u00edculas",
    strength: "Fuerza de atracci\u00f3n",
    flow: "Flujo a lo largo de cintas",
    speed: "Velocidad de flujo",
    trail: "Longitud de estela",
    glow: "Brillo de estela",
    thickness: "Grosor de cinta",
    theme: "Tema de color",
    clear: "Limpiar cintas",
    reset: "Reiniciar part\u00edculas",
    undo: "Deshacer \u00faltima cinta",
    help: "Dibuj\u00e1 cintas libres. Cada cinta tiene su propio grosor y tono. Las part\u00edculas se atraen hacia ellas, fluyen a lo largo del camino y emiten destellos de proximidad cuando se acercan, dejando estelas brillantes aditivas que forman firmas temporales. Las cintas se renderizan con curvas suaves. Varias cintas interact\u00faan. Los temas colorean cintas y part\u00edculas.",
    ribbons: "Cintas",
  },
};
