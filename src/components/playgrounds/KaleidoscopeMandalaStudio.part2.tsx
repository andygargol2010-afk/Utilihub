// Part 2 of 3 — split from KaleidoscopeMandalaStudio.tsx on 2026-11-04. Edit here; KaleidoscopeMandalaStudio.tsx re-exports.
import { type Point } from "./KaleidoscopeMandalaStudio.part1";

export type Brush = "neon" | "sparkle" | "glow" | "ink" | "ribbon";
export type Size = "s" | "m" | "l";
export type Stroke = {
  points: Point[];
  color: string;
  brush: Brush;
  symmetry: number;
  size: Size;
};

export const PALETTE = [
  "#ff2d95",
  "#00f5ff",
  "#ffd700",
  "#7cff6b",
  "#b388ff",
  "#ff6b35",
  "#ffffff",
  "#ff3b30",
];

export const SIZE_MULT: Record<Size, number> = { s: 0.6, m: 1, l: 1.7 };

export function seeded(n: number) {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

export function drawStrokeOnCtx(
  ctx: CanvasRenderingContext2D,
  stroke: Stroke,
  w: number,
  h: number,
  scale = 1
) {
  if (stroke.points.length < 2) return;
  const cx = w / 2;
  const cy = h / 2;
  const sm = SIZE_MULT[stroke.size] || 1;
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  const n = stroke.symmetry;
  for (let k = 0; k < n; k++) {
    const angle = (Math.PI * 2 * k) / n;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.translate(-cx, -cy);

    ctx.beginPath();
    ctx.moveTo(stroke.points[0].x * w, stroke.points[0].y * h);
    for (let i = 1; i < stroke.points.length; i++) {
      ctx.lineTo(stroke.points[i].x * w, stroke.points[i].y * h);
    }

    const base = scale * sm;
    if (stroke.brush === "neon") {
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = 3.5 * base;
      ctx.shadowColor = stroke.color;
      ctx.shadowBlur = 16 * base;
      ctx.stroke();
      ctx.shadowBlur = 6 * base;
      ctx.lineWidth = 1.5 * base;
      ctx.stroke();
    } else if (stroke.brush === "glow") {
      ctx.strokeStyle = stroke.color;
      ctx.globalAlpha = 0.45;
      ctx.lineWidth = 18 * base;
      ctx.shadowColor = stroke.color;
      ctx.shadowBlur = 24 * base;
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.lineWidth = 4 * base;
      ctx.shadowBlur = 8 * base;
      ctx.stroke();
    } else if (stroke.brush === "ink") {
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = 2.8 * base;
      ctx.shadowBlur = 0;
      ctx.stroke();
    } else if (stroke.brush === "ribbon") {
      ctx.strokeStyle = stroke.color;
      ctx.globalAlpha = 0.35;
      ctx.lineWidth = 14 * base;
      ctx.shadowColor = stroke.color;
      ctx.shadowBlur = 12 * base;
      ctx.stroke();
      ctx.globalAlpha = 0.9;
      ctx.lineWidth = 3.5 * base;
      ctx.shadowBlur = 4 * base;
      ctx.stroke();
      ctx.globalAlpha = 1;
    } else if (stroke.brush === "sparkle") {
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = 1.2 * base;
      ctx.globalAlpha = 0.75;
      ctx.stroke();
      ctx.fillStyle = stroke.color;
      for (let i = 0; i < stroke.points.length; i += 2) {
        const p = stroke.points[i];
        const px = p.x * w;
        const py = p.y * h;
        const seed = i * 17 + k * 3;
        const ox = (seeded(seed) - 0.5) * 10 * base;
        const oy = (seeded(seed + 1) - 0.5) * 10 * base;
        const r = (1.2 + seeded(seed + 2) * 2.2) * base;
        ctx.globalAlpha = 0.55 + seeded(seed + 3) * 0.4;
        ctx.beginPath();
        ctx.arc(px + ox, py + oy, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
    ctx.restore();
  }
  ctx.restore();
}

export function paintCanvas(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  strokes: Stroke[],
  live: Stroke | null,
  scale = 1
) {
  const cx = w / 2;
  const cy = h / 2;
  ctx.clearRect(0, 0, w, h);
  const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.7);
  bg.addColorStop(0, "#1a0a2e");
  bg.addColorStop(1, "#0d0518");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.06)";
  ctx.lineWidth = 1 * scale;
  ctx.beginPath();
  ctx.arc(cx, cy, Math.min(w, h) * 0.42, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  strokes.forEach((s) => drawStrokeOnCtx(ctx, s, w, h, scale));
  if (live && live.points.length > 1) {
    drawStrokeOnCtx(ctx, live, w, h, scale);
  }
}
