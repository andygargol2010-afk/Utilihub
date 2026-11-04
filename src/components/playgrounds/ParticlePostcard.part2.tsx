"use client";
// Part 2 of 3 — split from ParticlePostcard.tsx on 2026-11-04. Edit here; ParticlePostcard.tsx re-exports.

export type MoodId = "aurora" | "neon" | "sunset" | "ocean" | "ember";

export interface Mood {
  id: MoodId;
  label: { en: string; es: string };
  hue: number;
  glow: string;
  bg: string;
  trail: string;
}

export const MOODS: Mood[] = [
  { id: "aurora", label: { en: "Aurora", es: "Aurora" }, hue: 160, glow: "rgba(100,255,200,0.8)", bg: "#041216", trail: "rgba(4,18,22,0.35)" },
  { id: "neon", label: { en: "Neon", es: "Neón" }, hue: 300, glow: "rgba(255,80,220,0.8)", bg: "#0c0418", trail: "rgba(12,4,24,0.35)" },
  { id: "sunset", label: { en: "Sunset", es: "Atardecer" }, hue: 20, glow: "rgba(255,140,80,0.8)", bg: "#16080a", trail: "rgba(22,8,10,0.35)" },
  { id: "ocean", label: { en: "Ocean", es: "Océano" }, hue: 205, glow: "rgba(80,160,255,0.8)", bg: "#040c1c", trail: "rgba(4,12,28,0.35)" },
  { id: "ember", label: { en: "Ember", es: "Brasa" }, hue: 8, glow: "rgba(255,90,40,0.8)", bg: "#140604", trail: "rgba(20,6,4,0.35)" },
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
  settled: boolean;
}

export const MAX_CHARS = 10;

export const labels = {
  en: {
    message: "Your message or name",
    placeholder: "Hello…",
    density: "Particle density",
    gravity: "Swarm strength",
    mood: "Mood color",
    shareX: "Share on X",
    shareWA: "WhatsApp",
    shareNative: "Share",
    copy: "Copy link",
    download: "Download PNG",
    copied: "Copied!",
    shared: "Shared!",
    help: "Type up to 10 characters — particles swarm to form the text. Longer text is drawn narrower so it stays readable.",
  },
  es: {
    message: "Tu mensaje o nombre",
    placeholder: "Hola…",
    density: "Densidad de partículas",
    gravity: "Fuerza del enjambre",
    mood: "Color de ánimo",
    shareX: "Compartir en X",
    shareWA: "WhatsApp",
    shareNative: "Compartir",
    copy: "Copiar enlace",
    download: "Descargar PNG",
    copied: "¡Copiado!",
    shared: "¡Compartido!",
    help: "Hasta 10 caracteres — las partículas forman el texto. Con más de 5 letras se estrechan para que se lean bien.",
  },
};

/**
 * Sample glyph pixels with per-character tracking (extra letter spacing)
 * and mild per-glyph horizontal compression for more compact, thicker letters.
 */
export function sampleTextTargets(
  text: string,
  w: number,
  h: number,
  density: number,
): { x: number; y: number }[] {
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

  const label = text.trim().slice(0, MAX_CHARS);
  const chars = [...label];
  const len = Math.max(1, chars.length);
  const cx = W / 2;
  const cy = H / 2;

  // Base height-driven size
  let fontSize = Math.min(H * 0.52, 128);
  ctx.font = `900 ${fontSize}px system-ui, "Segoe UI", sans-serif`;

  // Per-glyph compactness: letters themselves are a bit narrower
  // so strokes stay thicker relative to width.
  const glyphScaleX = len >= 8 ? 0.78 : len >= 6 ? 0.84 : 0.9;

  // Extra tracking (space between letters) — user request
  const tracking = fontSize * (len >= 7 ? 0.22 : 0.18);

  // Measure total width with tracking + per-glyph scale
  let totalW = 0;
  const charWidths: number[] = [];
  for (const ch of chars) {
    const mw = ctx.measureText(ch).width * glyphScaleX;
    charWidths.push(mw);
    totalW += mw;
  }
  totalW += tracking * Math.max(0, len - 1);

  // Fit into ~92% of canvas width
  const maxW = W * 0.92;
  if (totalW > maxW) {
    const fit = maxW / totalW;
    fontSize *= fit;
    fontSize = Math.max(24, fontSize);
    ctx.font = `900 ${fontSize}px system-ui, "Segoe UI", sans-serif`;
    // re-measure
    totalW = 0;
    for (let i = 0; i < chars.length; i++) {
      const mw = ctx.measureText(chars[i]).width * glyphScaleX;
      charWidths[i] = mw;
      totalW += mw;
    }
    totalW += tracking * Math.max(0, len - 1);
  }

  // Thicker strokes via multi-pass overdraw
  const thick = Math.max(0.85, fontSize * 0.028);

  // Draw each character individually, centered as a group
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  let cursorX = cx - totalW / 2;

  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    const gw = charWidths[i];
    const glyphCx = cursorX + gw / 2;

    ctx.save();
    ctx.translate(glyphCx, cy);
    ctx.scale(glyphScaleX, 1);
    // Overdraw for denser, more compact fill
    for (const ox of [-thick * 1.5, -thick * 0.6, 0, thick * 0.6, thick * 1.5]) {
      for (const oy of [-thick * 1.0, -thick * 0.3, 0, thick * 0.3, thick * 1.0]) {
        ctx.fillText(ch, ox / glyphScaleX, oy);
      }
    }
    ctx.restore();

    cursorX += gw + tracking;
  }

  const data = ctx.getImageData(0, 0, W, H).data;
  // Denser sampling so compact glyphs still get enough particles
  const step = len >= 7 ? 1 : density >= 180 ? 1 : 2;
  const raw: { x: number; y: number }[] = [];
  for (let y = 0; y < H; y += step) {
    for (let x = 0; x < W; x += step) {
      const i = (y * W + x) * 4;
      if (data[i] > 70) raw.push({ x, y }); // slightly lower threshold
    }
  }
  if (raw.length === 0) return raw;

  // More points for longer / narrower words
  const maxPts = Math.min(1100, Math.max(220, Math.floor(density * (len >= 7 ? 3.0 : 2.4))));
  if (raw.length <= maxPts) return raw;
  const out: { x: number; y: number }[] = [];
  const stride = raw.length / maxPts;
  for (let i = 0; i < maxPts; i++) {
    out.push(raw[Math.min(raw.length - 1, Math.floor(i * stride))]);
  }
  return out;
}
