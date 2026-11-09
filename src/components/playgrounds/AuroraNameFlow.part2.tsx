"use client";
// Part 2 of 3 — split from AuroraNameFlow.tsx on 2026-11-04. Edit here; AuroraNameFlow.tsx re-exports.

export type MoodId = "arctic" | "tropical" | "cosmic" | "dawn-glow";

export interface Mood {
  id: MoodId;
  label: { en: string; es: string };
  bg: string;
  particle: string;
  ribbon: string;
  glow: string;
}

export const MOODS: Mood[] = [
  { id: "arctic", label: { en: "Arctic", es: "Ártico" }, bg: "#041018", particle: "#7ef9ff", ribbon: "rgba(80,220,255,0.55)", glow: "rgba(100,230,255,0.8)" },
  { id: "tropical", label: { en: "Tropical", es: "Tropical" }, bg: "#0a1814", particle: "#ff6ad5", ribbon: "rgba(255,100,180,0.5)", glow: "rgba(255,120,200,0.75)" },
  { id: "cosmic", label: { en: "Cosmic", es: "Cósmico" }, bg: "#08060e", particle: "#c084fc", ribbon: "rgba(160,100,255,0.5)", glow: "rgba(140,80,255,0.8)" },
  { id: "dawn-glow", label: { en: "Dawn Glow", es: "Resplandor de amanecer" }, bg: "#1a0e0a", particle: "#ffb347", ribbon: "rgba(255,160,80,0.55)", glow: "rgba(255,140,60,0.75)" },
];

export interface Particle {
  x: number; y: number; vx: number; vy: number; tx: number; ty: number; size: number;
  trail: { x: number; y: number }[]; hueShift: number;
}

export const MAX_CHARS = 10;

export const labels = {
  en: {
    message: "Your name or phrase", placeholder: "Aurora…", density: "Particle density", speed: "Flow speed", mood: "Aurora mood",
    shareX: "Share on X", shareWA: "WhatsApp", shareNative: "Share", copy: "Copy link", download: "Download PNG",
    copied: "Copied!", shared: "Shared!",
    help: "Type up to 10 characters. Particles form the letters in a flowing aurora.",
  },
  es: {
    message: "Tu nombre o frase", placeholder: "Aurora…", density: "Densidad de partículas", speed: "Velocidad de flujo", mood: "Ánimo de aurora",
    shareX: "Compartir en X", shareWA: "WhatsApp", shareNative: "Compartir", copy: "Copiar enlace", download: "Descargar PNG",
    copied: "¡Copiado!", shared: "¡Compartido!",
    help: "Hasta 10 caracteres. Las partículas forman las letras en una aurora fluida.",
  },
};

export function sampleTextTargets(text: string, w: number, h: number): { x: number; y: number }[] {
  const off = document.createElement("canvas");
  off.width = Math.floor(w); off.height = Math.floor(h);
  const ctx = off.getContext("2d");
  if (!ctx || !text.trim()) return [];
  ctx.fillStyle = "#000"; ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#fff";
  ctx.font = `bold ${Math.min(h * 0.38, 90)}px system-ui, sans-serif`;
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText(text.trim().slice(0, MAX_CHARS), w / 2, h / 2);
  const data = ctx.getImageData(0, 0, w, h).data;
  const targets: { x: number; y: number }[] = [];
  const step = 5;
  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      const i = (y * w + x) * 4;
      if (data[i] > 120) targets.push({ x, y });
    }
  }
  return targets;
}
