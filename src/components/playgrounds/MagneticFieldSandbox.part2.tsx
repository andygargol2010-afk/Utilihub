"use client";
// Part 2 of 3 — split from MagneticFieldSandbox.tsx on 2026-11-04. Edit here; MagneticFieldSandbox.tsx re-exports.

export interface Pole {
  id: number;
  x: number;
  y: number;
  polarity: 1 | -1; // 1 = N, -1 = S
  strength: number;
}

export interface Particle {
  x: number;
  y: number;
  life: number;
  maxLife: number;
}

export const labels = {
  en: {
    placeN: "Place North",
    placeS: "Place South",
    clear: "Clear poles",
    strength: "Strength",
    lines: "Field lines",
    sharePng: "Download branded PNG",
    shareUrl: "Copy share link",
    copied: "Copied!",
    help: "Click the canvas to place a pole (use the buttons to choose North or South). Drag poles to move them. Field lines update live with directional arrows. Double-click a pole to remove it. Toggle particles that flow along the field.",
    poles: "Poles",
    north: "N",
    south: "S",
    presets: "Presets",
    dipole: "Dipole",
    twoN: "Two North",
    quad: "Quadrupole",
    applyStrength: "Apply strength to all",
    particles: "Particles",
    on: "On",
    off: "Off",
  },
  es: {
    placeN: "Colocar Norte",
    placeS: "Colocar Sur",
    clear: "Limpiar polos",
    strength: "Fuerza",
    lines: "Líneas de campo",
    sharePng: "Descargar PNG con marca",
    shareUrl: "Copiar enlace",
    copied: "¡Copiado!",
    help: "Hacé clic en el lienzo para colocar un polo (usá los botones para elegir Norte o Sur). Arrastrá los polos para moverlos. Las líneas de campo se actualizan en vivo con flechas de dirección. Doble clic en un polo para eliminarlo. Activá o desactivá las partículas que fluyen a lo largo del campo.",
    poles: "Polos",
    north: "N",
    south: "S",
    presets: "Presets",
    dipole: "Dipolo",
    twoN: "Dos Norte",
    quad: "Cuadrupolo",
    applyStrength: "Aplicar fuerza a todos",
    particles: "Partículas",
    on: "Activadas",
    off: "Desactivadas",
  },
};
