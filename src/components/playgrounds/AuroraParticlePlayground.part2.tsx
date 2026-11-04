"use client";
// Part 2 of 3 — split from AuroraParticlePlayground.tsx on 2026-11-04. Edit here; AuroraParticlePlayground.tsx re-exports.

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  hue: number;
  life: number;
  mode: "ribbon" | "orb" | "vortex";
  trail: { x: number; y: number }[];
}

export interface Emitter {
  x: number;
  y: number;
  id: number;
  strength: number;
}

export const labels = {
  en: {
    density: "Density",
    speed: "Speed",
    bloom: "Bloom intensity",
    gravity: "Gravity",
    wind: "Wind",
    mode: "Mode",
    palette: "Palette",
    pause: "Pause",
    resume: "Resume",
    randomize: "Randomize",
    clear: "Clear emitters",
    sharePng: "Download PNG",
    shareLink: "Copy link",
    copied: "Copied!",
    help: "Click/tap to place emitters. Drag to move. Double-click removes nearest. Toggle Attract/Repel. Hover for dynamic pointer force. Particles form flowing ribbons with persistent fading trails, blooming orbs or swirling vortices.",
    emitters: "Emitters",
    polarity: "Polarity",
    attract: "Attract",
    repel: "Repel",
  },
  es: {
    density: "Densidad",
    speed: "Velocidad",
    bloom: "Intensidad bloom",
    gravity: "Gravedad",
    wind: "Viento",
    mode: "Modo",
    palette: "Paleta",
    pause: "Pausa",
    resume: "Reanudar",
    randomize: "Aleatorio",
    clear: "Limpiar emisores",
    sharePng: "Descargar PNG",
    shareLink: "Copiar enlace",
    copied: "\u00a1Copiado!",
    help: "Clic/toque para colocar emisores. Arrastr\u00e1 para mover. Doble clic elimina el m\u00e1s cercano. Altern\u00e1 Atraer/Repeler. Hover para fuerza din\u00e1mica del puntero. Part\u00edculas forman cintas fluidas con estelas persistentes que se desvanecen, orbes blooming o v\u00f3rtices.",
    emitters: "Emisores",
    polarity: "Polaridad",
    attract: "Atraer",
    repel: "Repeler",
  },
  pt: {
    density: "Densidade",
    speed: "Velocidade",
    bloom: "Intensidade bloom",
    gravity: "Gravidade",
    wind: "Vento",
    mode: "Modo",
    palette: "Paleta",
    pause: "Pausa",
    resume: "Retomar",
    randomize: "Aleat\u00f3rio",
    clear: "Limpar emissores",
    sharePng: "Baixar PNG",
    shareLink: "Copiar link",
    copied: "Copiado!",
    help: "Clique/toque para colocar emissores. Arraste para mover. Duplo clique remove o mais pr\u00f3ximo. Alterne Atrair/Repelir. Hover para for\u00e7a din\u00e2mica do ponteiro. Part\u00edculas formam fitas fluidas com rastros persistentes que desvanecem, orbes blooming ou v\u00f3rtices.",
    emitters: "Emissores",
    polarity: "Polaridade",
    attract: "Atrair",
    repel: "Repelir",
  },
};

export const palettes = {
  aurora: { base: 140, range: 80 },
  neon: { base: 280, range: 60 },
  sunset: { base: 20, range: 40 },
  cosmic: { base: 220, range: 100 },
  ocean: { base: 190, range: 50 },
};

export const TRAIL_LEN = 10;
