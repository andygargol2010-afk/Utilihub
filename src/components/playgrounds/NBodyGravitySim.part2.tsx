"use client";
// Part 2 of 3 — split from NBodyGravitySim.tsx on 2026-11-04. Edit here; NBodyGravitySim.tsx re-exports.

export interface Body {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  mass: number;
  radius: number;
  color: string;
  trail: { x: number; y: number }[];
}

export const MAX_BODIES = 20;
export const TRAIL_LEN = 48;
export const G = 0.15;

export const labels = {
  en: {
    help: "Tap + drag to place body + velocity arrow. Uncheck Add for pan. Pinch or wheel to zoom. Right-click or long-press (hold ~0.6s) remove. Cap 20 CWV.",
    add: "Add body mode",
    mass: "Mass",
    speed: "Initial speed",
    color: "Color",
    time: "Time scale",
    trails: "Trails",
    pause: "Pause",
    resume: "Resume",
    resetCam: "Reset camera",
    clear: "Clear all",
    share: "Copy share link",
    copied: "Copied!",
    png: "Download PNG",
    shareNative: "Share",
    zoomIn: "Zoom +",
    zoomOut: "Zoom \u2212",
    presets: "Presets",
    binary: "Binary stars",
    solar: "Mini solar",
    chaotic: "Chaotic cluster",
    figure8: "Figure-8",
    bodies: "Bodies",
  },
  es: {
    help: "Toque + arrastr\u00e1 para colocar cuerpo + flecha velocidad. Desmarc\u00e1 Agregar para pan. Pellizco o rueda para zoom. Clic derecho o presi\u00f3n larga (~0.6s) elimina. L\u00edmite 20 CWV.",
    add: "Modo agregar",
    mass: "Masa",
    speed: "Velocidad inicial",
    color: "Color",
    time: "Escala de tiempo",
    trails: "Estelas",
    pause: "Pausar",
    resume: "Reanudar",
    resetCam: "Reset c\u00e1mara",
    clear: "Limpiar todo",
    share: "Copiar enlace",
    copied: "\u00a1Copiado!",
    png: "Descargar PNG",
    shareNative: "Compartir",
    zoomIn: "Zoom +",
    zoomOut: "Zoom \u2212",
    presets: "Preajustes",
    binary: "Estrellas binarias",
    solar: "Mini solar",
    chaotic: "C\u00famulo ca\u00f3tico",
    figure8: "Figura-8",
    bodies: "Cuerpos",
  },
};

export const PRESET_COLORS = ["#60a5fa", "#f472b6", "#34d399", "#fbbf24", "#a78bfa", "#fb7185", "#22d3ee", "#f97316"];
