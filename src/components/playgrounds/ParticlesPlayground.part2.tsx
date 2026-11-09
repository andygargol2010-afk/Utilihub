"use client";
// Part 2 of 3 — split from ParticlesPlayground.tsx on 2026-11-04. Edit here; ParticlesPlayground.tsx re-exports.

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

export const labels = {
  en: {
    count: "Particles",
    gravity: "Gravity",
    friction: "Friction",
    trails: "Trails",
    mode: "Mouse",
    attract: "Attract",
    repel: "Repel",
    reset: "Reset",
    colorVel: "Color by speed",
  },
  es: {
    count: "Partículas",
    gravity: "Gravedad",
    friction: "Fricción",
    trails: "Estelas",
    mode: "Mouse",
    attract: "Atraer",
    repel: "Repeler",
    reset: "Reiniciar",
    colorVel: "Color por velocidad",
  },
};
