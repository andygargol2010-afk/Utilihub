"use client";
// Part 2 of 3 — split from GravityParticlesPlayground.tsx on 2026-11-04. Edit here; GravityParticlesPlayground.tsx re-exports.

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  hue: number;
}

export interface Attractor {
  x: number;
  y: number;
  id: number;
}

export interface Star {
  x: number;
  y: number;
  r: number;
  a: number;
}

export const labels = {
  en: {
    count: "Particle count",
    gravity: "Gravity strength",
    friction: "Friction",
    trails: "Trails",
    clear: "Clear attractors",
    reset: "Reset particles",
    share: "Copy share link",
    copied: "Copied!",
    help: "Click/tap to place attractors. Drag to move them. Double-click/tap removes nearest. Particles orbit in real time.",
    attractors: "Attractors",
  },
  es: {
    count: "Cantidad de partículas",
    gravity: "Fuerza de gravedad",
    friction: "Fricción",
    trails: "Estelas",
    clear: "Limpiar atrayentes",
    reset: "Reiniciar partículas",
    share: "Copiar enlace",
    copied: "¡Copiado!",
    help: "Clic/toque para colocar atrayentes. Arrastrá para moverlos. Doble clic/toque elimina el más cercano. Las partículas orbitan en tiempo real.",
    attractors: "Atrayentes",
  },
};
