"use client";
// Part 2 of 3 — split from ParticleMagnetLab.tsx on 2026-11-04. Edit here; ParticleMagnetLab.tsx re-exports.

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  hue: number;
}

export interface Magnet {
  x: number;
  y: number;
  id: number;
  polarity: 1 | -1; // 1 attract, -1 repel
  strength: number;
}

export const labels = {
  en: {
    count: "Particle count",
    strength: "Magnet strength",
    polarity: "Default polarity",
    attract: "Attract",
    repel: "Repel",
    colorMode: "Color mode",
    speed: "Speed",
    field: "Field",
    clear: "Clear magnets",
    reset: "Reset particles",
    sharePng: "Download PNG",
    shareUrl: "Copy share link",
    copied: "Copied!",
    help: "Click/tap to place magnets. Drag to move. Double-click/tap removes nearest. Right-click or long-press toggles polarity of nearest magnet. Particles stream and leave fading trails that show the field. Use pause to inspect the field. Toggle field arrows for a grid of force directions.",
    magnets: "Magnets",
    selected: "Selected",
    none: "none",
    pause: "Pause",
    resume: "Resume",
    random: "Random magnets",
    fieldArrows: "Field arrows",
  },
  es: {
    count: "Cantidad de partículas",
    strength: "Fuerza del imán",
    polarity: "Polaridad por defecto",
    attract: "Atraer",
    repel: "Repeler",
    colorMode: "Modo de color",
    speed: "Velocidad",
    field: "Campo",
    clear: "Limpiar imanes",
    reset: "Reiniciar partículas",
    sharePng: "Descargar PNG",
    shareUrl: "Copiar enlace",
    copied: "¡Copiado!",
    help: "Clic/toque para colocar imanes. Arrastrá para mover. Doble clic/toque elimina el más cercano. Clic derecho o pulsación larga alterna la polaridad del imán más cercano. Las partículas fluyen y dejan estelas que visualizan el campo. Usá pausa para inspeccionar el campo. Activá flechas de campo para una grilla de direcciones de fuerza.",
    magnets: "Imanes",
    selected: "Seleccionado",
    none: "ninguno",
    pause: "Pausar",
    resume: "Reanudar",
    random: "Imanes aleatorios",
    fieldArrows: "Flechas de campo",
  },
};
