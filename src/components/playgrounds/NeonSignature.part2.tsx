"use client";
// Part 2 of 3 — split from NeonSignature.tsx on 2026-11-04. Edit here; NeonSignature.tsx re-exports.

export type SceneId = "void" | "brick" | "cyber";
export type FontId = "block" | "script" | "condensed";

export type Spark = { x: number; y: number; vx: number; vy: number; life: number; maxLife: number };

export const PRESETS = [
  { id: "cyan", hue: 180, labelEn: "Cyan", labelEs: "Cian" },
  { id: "pink", hue: 320, labelEn: "Hot Pink", labelEs: "Rosa intenso" },
  { id: "lime", hue: 120, labelEn: "Lime", labelEs: "Lima" },
  { id: "orange", hue: 25, labelEn: "Orange", labelEs: "Naranja" },
  { id: "purple", hue: 280, labelEn: "Purple", labelEs: "Púrpura" },
  { id: "red", hue: 350, labelEn: "Red", labelEs: "Rojo" },
];

export const SCENES: { id: SceneId; labelEn: string; labelEs: string }[] = [
  { id: "void", labelEn: "Deep void", labelEs: "Vacío profundo" },
  { id: "brick", labelEn: "Brick wall", labelEs: "Pared de ladrillo" },
  { id: "cyber", labelEn: "Cyber grid", labelEs: "Rejilla cyber" },
];

export const FONTS: { id: FontId; labelEn: string; labelEs: string }[] = [
  { id: "block", labelEn: "Block", labelEs: "Bloque" },
  { id: "script", labelEn: "Script", labelEs: "Manuscrita" },
  { id: "condensed", labelEn: "Condensed", labelEs: "Condensada" },
];

export const labels = {
  en: {
    message: "Your neon text",
    placeholder: "Neon Sign",
    hue: "Neon color (hue)",
    intensity: "Glow intensity",
    flicker: "Flicker amount",
    presets: "Classic neon colors",
    scenes: "Scene background",
    fonts: "Tube font",
    help: "Type text. It becomes a glowing neon tube sign. Color from hash, slider or presets. Pick a scene and font for shareable shots. Flicker + ignite + glass specular + sparks. Download PNG or share URL.",
    download: "Download PNG",
    share: "Share",
    copy: "Copy link",
    copied: "Copied!",
  },
  es: {
    message: "Tu texto neón",
    placeholder: "Cartel Neón",
    hue: "Color neón (matiz)",
    intensity: "Intensidad del brillo",
    flicker: "Cantidad de parpadeo",
    presets: "Colores neón clásicos",
    scenes: "Fondo de escena",
    fonts: "Fuente del tubo",
    help: "Escribí texto. Se convierte en un cartel de neón con tubo brillante. Color por hash, deslizador o presets. Elegí escena y fuente. Parpadeo + encendido + specular de vidrio + chispas. Descargá PNG o compartí URL.",
    download: "Descargar PNG",
    share: "Compartir",
    copy: "Copiar enlace",
    copied: "¡Copiado!",
  },
};

export function hashString(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function drawBrickWall(ctx: CanvasRenderingContext2D, w: number, hgt: number) {
  ctx.fillStyle = "#1a1210";
  ctx.fillRect(0, 0, w, hgt);
  const bw = 28;
  const bh = 14;
  const mortar = 2;
  for (let row = 0; row * (bh + mortar) < hgt + bh; row++) {
    const offset = (row % 2) * (bw / 2);
    for (let col = -1; col * (bw + mortar) < w + bw; col++) {
      const x = col * (bw + mortar) + offset;
      const y = row * (bh + mortar);
      const shade = 0.12 + ((row * 7 + col * 3) % 5) * 0.03;
      ctx.fillStyle = `rgb(${Math.floor(55 + shade * 40)}, ${Math.floor(32 + shade * 20)}, ${Math.floor(28 + shade * 15)})`;
      ctx.fillRect(x, y, bw, bh);
    }
  }
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.fillRect(0, 0, w, hgt);
}

export function drawCyberGrid(ctx: CanvasRenderingContext2D, w: number, hgt: number, tme: number) {
  ctx.fillStyle = "#050810";
  ctx.fillRect(0, 0, w, hgt);
  const step = 28;
  const pulse = 0.08 + 0.04 * Math.sin(tme * 0.8);
  ctx.strokeStyle = `rgba(80, 120, 180, ${0.12 + pulse})`;
  ctx.lineWidth = 1;
  for (let x = 0; x <= w; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, hgt);
    ctx.stroke();
  }
  for (let y = 0; y <= hgt; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
  const gy = hgt * 0.72;
  const g = ctx.createLinearGradient(0, gy - 40, 0, gy + 20);
  g.addColorStop(0, "rgba(40, 80, 140, 0)");
  g.addColorStop(0.5, "rgba(60, 120, 200, 0.15)");
  g.addColorStop(1, "rgba(40, 80, 140, 0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, gy - 40, w, 60);
}

export function fontStack(id: FontId, size: number): string {
  if (id === "script") return `italic 700 ${Math.round(size * 1.05)}px "Brush Script MT", "Segoe Script", "Comic Sans MS", cursive`;
  if (id === "condensed") return `900 ${size}px "Arial Narrow", Impact, "Franklin Gothic Condensed", sans-serif`;
  return `900 ${size}px system-ui, "Arial Black", Impact, sans-serif`;
}
