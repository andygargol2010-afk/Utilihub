"use client";
// Part 2 of 3 — split from FireworkSignature.tsx on 2026-11-04. Edit here; FireworkSignature.tsx re-exports.

export type MoodId = "aurora" | "neon" | "sunset" | "ocean" | "ember" | "cosmic";

export interface Mood {
  id: MoodId;
  label: { en: string; es: string };
  hue: number;
  glow: string;
  bg: string;
  trail: string;
}

export const MOODS: Mood[] = [
  { id: "aurora", label: { en: "Aurora", es: "Aurora" }, hue: 160, glow: "rgba(100,255,200,0.85)", bg: "#041216", trail: "rgba(4,18,22,0.28)" },
  { id: "neon", label: { en: "Neon", es: "Neón" }, hue: 300, glow: "rgba(255,80,220,0.85)", bg: "#0c0418", trail: "rgba(12,4,24,0.28)" },
  { id: "sunset", label: { en: "Sunset", es: "Atardecer" }, hue: 20, glow: "rgba(255,140,80,0.85)", bg: "#16080a", trail: "rgba(22,8,10,0.28)" },
  { id: "ocean", label: { en: "Ocean", es: "Océano" }, hue: 205, glow: "rgba(80,160,255,0.85)", bg: "#040c1c", trail: "rgba(4,12,28,0.28)" },
  { id: "ember", label: { en: "Ember", es: "Brasa" }, hue: 8, glow: "rgba(255,90,40,0.85)", bg: "#140604", trail: "rgba(20,6,4,0.28)" },
  { id: "cosmic", label: { en: "Cosmic", es: "Cósmico" }, hue: 260, glow: "rgba(180,100,255,0.85)", bg: "#0a0618", trail: "rgba(10,6,24,0.28)" },
];

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  tx: number;
  ty: number;
  size: number;
  hue: number;
  life: number;
  phase: "launch" | "form" | "burst" | "residual";
  hold: number;
  residualX?: number;
  residualY?: number;
}

export const labels = {
  en: {
    message: "Your name or phrase",
    placeholder: "UtiliHub",
    density: "Spark density",
    burst: "Burst size",
    mood: "Color mood",
    shareX: "Share on X",
    shareWA: "WhatsApp",
    shareNative: "Share",
    copy: "Copy link",
    download: "Download PNG",
    copied: "Copied!",
    shared: "Shared!",
    help: "Up to 10 characters. Fireworks launch, form the letters, then explode into a constellation.",
  },
  es: {
    message: "Tu nombre o frase",
    placeholder: "UtiliHub",
    density: "Densidad de chispas",
    burst: "Tamaño de estallido",
    mood: "Ánimo de color",
    shareX: "Compartir en X",
    shareWA: "WhatsApp",
    shareNative: "Compartir",
    copy: "Copiar enlace",
    download: "Descargar PNG",
    copied: "¡Copiado!",
    shared: "¡Compartido!",
    help: "Hasta 10 caracteres. Los fuegos se lanzan, forman las letras y explotan en una constelación.",
  },
};

export function sampleTextTargets(text: string, w: number, h: number, density: number): { x: number; y: number }[] {
  const off = document.createElement("canvas");
  const W = Math.max(1, Math.floor(w));
  const H = Math.max(1, Math.floor(h));
  off.width = W;
  off.height = H;
  const ctx = off.getContext("2d", { willReadFrequently: true });
  if (!ctx || !text.trim()) return [];
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#fff";
  const label = text.trim().slice(0, 10);
  const len = Math.max(1, label.length);
  const fontSize = Math.min(H * 0.44, Math.max(32, (W * 0.92) / (len * 0.62)));
  ctx.font = `900 ${fontSize}px system-ui, "Segoe UI", sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const cx = W / 2, cy = H / 2;
  ctx.fillText(label, cx, cy);
  ctx.fillText(label, cx + 0.6, cy);
  ctx.fillText(label, cx, cy + 0.6);
  const data = ctx.getImageData(0, 0, W, H).data;
  const t = Math.max(0, Math.min(1, (density - 80) / 280));
  const step = Math.max(2, Math.round(4 - t * 2));
  const raw: { x: number; y: number }[] = [];
  for (let y = 0; y < H; y += step) {
    for (let x = 0; x < W; x += step) {
      const i = (y * W + x) * 4;
      if (data[i] > 40) raw.push({ x, y });
    }
  }
  if (raw.length === 0) return raw;
  const maxPts = Math.min(520, Math.max(120, Math.floor(density * 1.6)));
  if (raw.length <= maxPts) return raw;
  const out: { x: number; y: number }[] = [];
  const stride = raw.length / maxPts;
  for (let i = 0; i < maxPts; i++) out.push(raw[Math.min(raw.length - 1, Math.floor(i * stride))]);
  return out;
}

export function hashSeed(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
