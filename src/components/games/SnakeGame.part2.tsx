// Part 2 of 3 — split from SnakeGame.tsx on 2026-11-04. Edit here; SnakeGame.tsx re-exports.
import { COLS } from "./SnakeGame.part1";

export const ROWS = 15;
export const CELL = 22;
export const PAD = 8;
export const BAR = 36;
export const W = COLS * CELL + PAD * 2;
export const H = ROWS * CELL + PAD * 2 + BAR;
/** Step duration — a bit longer + eased lerp reads as continuous glide */
export const STEP_MS = 145;
export const BODY_R = CELL * 0.42;

export type Pt = { x: number; y: number };
export type Dir = "U" | "D" | "L" | "R";

export const DELTA: Record<Dir, Pt> = {
  U: { x: 0, y: -1 },
  D: { x: 0, y: 1 },
  L: { x: -1, y: 0 },
  R: { x: 1, y: 0 },
};

export function opposite(a: Dir, b: Dir) {
  return (a === "U" && b === "D") || (a === "D" && b === "U") || (a === "L" && b === "R") || (a === "R" && b === "L");
}

export function randomFood(snake: Pt[]): Pt {
  for (let n = 0; n < 500; n++) {
    const p = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
    if (!snake.some((s) => s.x === p.x && s.y === p.y)) return p;
  }
  return { x: 0, y: 0 };
}

export function initialSnake(): Pt[] {
  const midY = Math.floor(ROWS / 2);
  const midX = Math.floor(COLS / 2) - 1;
  return [
    { x: midX, y: midY },
    { x: midX - 1, y: midY },
    { x: midX - 2, y: midY },
  ];
}

export function cellPx(p: Pt) {
  return {
    x: PAD + p.x * CELL + CELL / 2,
    y: BAR + PAD + p.y * CELL + CELL / 2,
  };
}

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/** Smoothstep — accelerates/decelerates so motion feels less robotic */
export function ease(t: number) {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
}

export function lerpPt(a: Pt, b: Pt, t: number): Pt {
  return { x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) };
}

/**
 * Interpolated pixel path (head → tail).
 * Each segment glides from its previous cell toward the current one.
 * Extra mid-points on turns keep the body continuous around corners.
 */
export function visualPath(snake: Pt[], prev: Pt[] | null, t: number): { x: number; y: number }[] {
  const u = ease(t);
  const centers: { x: number; y: number }[] = [];
  for (let i = 0; i < snake.length; i++) {
    const cur = snake[i]!;
    let from = cur;
    if (prev) {
      if (i === 0 && prev[0]) from = prev[0];
      else if (i < prev.length) from = prev[i]!;
      else from = prev[prev.length - 1]!;
    }
    centers.push(cellPx(lerpPt(from, cur, u)));
  }
  if (centers.length < 2) return centers;

  // Insert corner fillets so sharp 90° turns don't look angular
  const out: { x: number; y: number }[] = [centers[0]!];
  for (let i = 1; i < centers.length - 1; i++) {
    const a = centers[i - 1]!;
    const b = centers[i]!;
    const c = centers[i + 1]!;
    const dx1 = b.x - a.x;
    const dy1 = b.y - a.y;
    const dx2 = c.x - b.x;
    const dy2 = c.y - b.y;
    const turn = Math.abs(dx1 * dy2 - dy1 * dx2) > 0.01;
    if (turn) {
      const pull = 0.35;
      out.push({ x: lerp(a.x, b.x, 1 - pull), y: lerp(a.y, b.y, 1 - pull) });
      out.push(b);
      out.push({ x: lerp(b.x, c.x, pull), y: lerp(b.y, c.y, pull) });
    } else {
      out.push(b);
    }
  }
  out.push(centers[centers.length - 1]!);
  return out;
}

export function drawChecker(ctx: CanvasRenderingContext2D) {
  const light = "#a2d149";
  const dark = "#aad751";
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      ctx.fillStyle = (r + c) % 2 === 0 ? light : dark;
      ctx.fillRect(PAD + c * CELL, BAR + PAD + r * CELL, CELL, CELL);
    }
  }
}

export function drawApple(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.beginPath();
  ctx.arc(x, y + r * 0.05, r, 0, Math.PI * 2);
  ctx.fillStyle = "#e74c3c";
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x - r * 0.3, y - r * 0.15, r * 0.22, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.45)";
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(x + r * 0.25, y - r * 0.85, r * 0.32, r * 0.16, -0.5, 0, Math.PI * 2);
  ctx.fillStyle = "#57a639";
  ctx.fill();
  ctx.strokeStyle = "#5d4037";
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x, y - r * 0.55);
  ctx.lineTo(x + r * 0.05, y - r * 0.95);
  ctx.stroke();
}

export function strokeSnakePath(ctx: CanvasRenderingContext2D, pts: { x: number; y: number }[]) {
  if (pts.length === 0) return;
  ctx.beginPath();
  ctx.moveTo(pts[0]!.x, pts[0]!.y);
  if (pts.length === 1) return;
  if (pts.length === 2) {
    ctx.lineTo(pts[1]!.x, pts[1]!.y);
    return;
  }
  // Midpoint chain: each corner becomes a smooth quadratic control point
  for (let i = 1; i < pts.length - 1; i++) {
    const midX = (pts[i]!.x + pts[i + 1]!.x) / 2;
    const midY = (pts[i]!.y + pts[i + 1]!.y) / 2;
    ctx.quadraticCurveTo(pts[i]!.x, pts[i]!.y, midX, midY);
  }
  const last = pts[pts.length - 1]!;
  ctx.lineTo(last.x, last.y);
}

export function drawSnake(ctx: CanvasRenderingContext2D, pts: { x: number; y: number }[], dir: Dir) {
  if (pts.length === 0) return;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  // Soft shadow under body
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.18)";
  ctx.shadowBlur = 4;
  ctx.shadowOffsetY = 1;
  ctx.lineWidth = BODY_R * 2;
  ctx.strokeStyle = "#4a86f0";
  strokeSnakePath(ctx, pts);
  ctx.stroke();
  ctx.restore();
  // Lighter highlight stroke
  ctx.lineWidth = BODY_R * 1.15;
  ctx.strokeStyle = "#5b9af5";
  strokeSnakePath(ctx, pts);
  ctx.stroke();
  const h = pts[0]!;
  ctx.beginPath();
  ctx.arc(h.x, h.y, BODY_R * 1.05, 0, Math.PI * 2);
  ctx.fillStyle = "#4a86f0";
  ctx.fill();
  // subtle head highlight
  ctx.beginPath();
  ctx.arc(h.x - BODY_R * 0.15, h.y - BODY_R * 0.2, BODY_R * 0.45, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.18)";
  ctx.fill();
  const eyeDist = BODY_R * 0.4;
  const eyeR = BODY_R * 0.32;
  let e1: Pt;
  let e2: Pt;
  if (dir === "R") {
    e1 = { x: h.x + eyeDist * 0.6, y: h.y - eyeDist };
    e2 = { x: h.x + eyeDist * 0.6, y: h.y + eyeDist };
  } else if (dir === "L") {
    e1 = { x: h.x - eyeDist * 0.6, y: h.y - eyeDist };
    e2 = { x: h.x - eyeDist * 0.6, y: h.y + eyeDist };
  } else if (dir === "U") {
    e1 = { x: h.x - eyeDist, y: h.y - eyeDist * 0.6 };
    e2 = { x: h.x + eyeDist, y: h.y - eyeDist * 0.6 };
  } else {
    e1 = { x: h.x - eyeDist, y: h.y + eyeDist * 0.6 };
    e2 = { x: h.x + eyeDist, y: h.y + eyeDist * 0.6 };
  }
  for (const e of [e1, e2]) {
    ctx.beginPath();
    ctx.arc(e.x, e.y, eyeR, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    let px = e.x;
    let py = e.y;
    if (dir === "R") px += eyeR * 0.25;
    if (dir === "L") px -= eyeR * 0.25;
    if (dir === "U") py -= eyeR * 0.25;
    if (dir === "D") py += eyeR * 0.25;
    ctx.beginPath();
    ctx.arc(px, py, eyeR * 0.48, 0, Math.PI * 2);
    ctx.fillStyle = "#1a237e";
    ctx.fill();
  }
}

export function drawDpadHint(ctx: CanvasRenderingContext2D, loc: "en" | "es" | "pt" | "fr" | "de", mobile: boolean) {
  const cx = W / 2;
  const cy = BAR + (H - BAR) / 2 - 10;
  roundRect(ctx, cx - 52, cy - 52, 104, 108, 16);
  ctx.fillStyle = "rgba(30, 50, 40, 0.88)";
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.font = "bold 16px system-ui";
  ctx.textAlign = "center";
  ctx.fillText("\u25b2", cx, cy - 24);
  ctx.fillText("\u25c0", cx - 26, cy + 4);
  ctx.fillText("\u25bc", cx, cy + 30);
  ctx.fillText("\u25b6", cx + 26, cy + 4);
  ctx.font = "11px system-ui";
  ctx.fillText(mobile ? (loc === "pt" ? "Deslize" : loc === "es" ? "Desliz\u00e1" : loc === "fr" ? "Glisser" : loc === "de" ? "Wischen" : "Swipe") : (loc === "pt" ? "Setas" : loc === "es" ? "Flechas" : loc === "fr" ? "Fl\u00e8ches" : loc === "de" ? "Pfeile" : "Arrows"), cx, cy + 48);
}

export function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function paint(
  ctx: CanvasRenderingContext2D,
  snake: Pt[],
  prev: Pt[] | null,
  food: Pt,
  dir: Dir,
  score: number,
  t: number,
  phase: "menu" | "hint" | "play" | "dead",
  best: number,
  loc: "en" | "es" | "pt" | "fr" | "de",
  mobile: boolean,
) {
  ctx.fillStyle = "#4a752c";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#578a34";
  ctx.fillRect(0, 0, W, BAR);
  drawApple(ctx, 20, BAR / 2, 11);
  ctx.fillStyle = "#fff";
  ctx.font = "bold 16px system-ui,Segoe UI,sans-serif";
  ctx.textBaseline = "middle";
  ctx.fillText(String(score), 36, BAR / 2 + 1);
  drawChecker(ctx);
  const fp = cellPx(food);
  drawApple(ctx, fp.x, fp.y, CELL * 0.38);
  const path = visualPath(snake, prev, phase === "play" || phase === "hint" ? t : 1);
  drawSnake(ctx, path, dir);
  if (phase === "menu" || phase === "dead") {
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.fillRect(PAD, BAR + PAD, COLS * CELL, ROWS * CELL);
    const cw = 200;
    const ch = phase === "dead" ? 200 : 180;
    const cx = (W - cw) / 2;
    const cy = BAR + (H - BAR - ch) / 2;
    roundRect(ctx, cx, cy, cw, ch, 16);
    ctx.fillStyle = "#5dade2";
    ctx.fill();
    drawApple(ctx, cx + 55, cy + 40, 16);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 20px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(String(score), cx + 55, cy + 70);
    ctx.font = "28px system-ui";
    ctx.fillText("\ud83c\udfc6", cx + 145, cy + 48);
    ctx.font = "bold 20px system-ui";
    ctx.fillText(String(Math.max(best, score)), cx + 145, cy + 70);
    ctx.fillStyle = "#4a86f0";
    roundRect(ctx, cx + 50, cy + 95, 100, 28, 14);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx + 140, cy + 109, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(cx + 134, cy + 104, 5, 0, Math.PI * 2);
    ctx.arc(cx + 146, cy + 104, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#1a237e";
    ctx.beginPath();
    ctx.arc(cx + 135, cy + 104, 2.5, 0, Math.PI * 2);
    ctx.arc(cx + 147, cy + 104, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "bold 14px system-ui";
    ctx.fillText(phase === "dead" ? (loc === "pt" ? "Jogar de novo" : loc === "es" ? "\u00a1Otra vez!" : loc === "fr" ? "Rejouer" : loc === "de" ? "Nochmal" : "Play again") : (loc === "pt" ? "Pronto" : loc === "es" ? "Listo" : loc === "fr" ? "Pr\u00eat" : loc === "de" ? "Bereit" : "Ready"), cx + cw / 2, cy + ch - 18);
    ctx.textAlign = "left";
  }
  if (phase === "hint") {
    drawDpadHint(ctx, loc, mobile);
  }
}
