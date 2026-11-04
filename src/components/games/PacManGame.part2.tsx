// Part 2 of 3 — split from PacManGame.tsx on 2026-11-04. Edit here; PacManGame.tsx re-exports.
import { MAZE_RAW } from "./PacManGame.part1";

export const ROWS = MAZE_RAW.length;
export const COLS = MAZE_RAW[0]!.length;
export const CELL = 14;
export const W = COLS * CELL;
export const H = ROWS * CELL;
export const STEP_MS = 140;
export const GHOST_STEP = 150;
export const FRIGHT_MS = 6000;
export const LIVES0 = 3;

export type Dir = "U" | "D" | "L" | "R";
export type Pt = { x: number; y: number };

export const DELTA: Record<Dir, Pt> = {
  U: { x: 0, y: -1 },
  D: { x: 0, y: 1 },
  L: { x: -1, y: 0 },
  R: { x: 1, y: 0 },
};
export const DIRS: Dir[] = ["U", "D", "L", "R"];

export function opposite(a: Dir, b: Dir) {
  return (a === "U" && b === "D") || (a === "D" && b === "U") || (a === "L" && b === "R") || (a === "R" && b === "L");
}

export type CellKind = "wall" | "pellet" | "power" | "empty" | "door";

export function parseMaze(): { grid: CellKind[][]; pellets: number } {
  const grid: CellKind[][] = [];
  let pellets = 0;
  for (let r = 0; r < ROWS; r++) {
    const row: CellKind[] = [];
    const line = MAZE_RAW[r]!;
    for (let c = 0; c < COLS; c++) {
      const ch = line[c] ?? "#";
      if (ch === "#") row.push("wall");
      else if (ch === ".") {
        row.push("pellet");
        pellets++;
      } else if (ch === "o") {
        row.push("power");
        pellets++;
      } else if (ch === "-") row.push("door");
      else row.push("empty");
    }
    grid.push(row);
  }
  return { grid, pellets };
}

/** Horizontal tunnel only on this row (classic side passages). */
export const TUNNEL_ROW = 12;

export function wrap(x: number, y: number): Pt {
  let nx = x;
  if (y === TUNNEL_ROW) {
    if (nx < 0) nx = COLS - 1;
    if (nx >= COLS) nx = 0;
  }
  return { x: nx, y };
}

export function walkable(grid: CellKind[][], x: number, y: number, allowDoor = false): boolean {
  if (y < 0 || y >= ROWS) return false;
  // Off the sides only legal via tunnel wrap
  if ((x < 0 || x >= COLS) && y !== TUNNEL_ROW) return false;
  const p = wrap(x, y);
  if (p.x < 0 || p.x >= COLS) return false;
  const cell = grid[p.y]![p.x]!;
  if (cell === "wall") return false;
  if (cell === "door") return allowDoor;
  return true;
}

export type Ghost = {
  x: number;
  y: number;
  dir: Dir;
  color: string;
  name: string;
  corner: Pt;
};

export function initialGhosts(): Ghost[] {
  return [
    { x: 13, y: 11, dir: "U", color: "#ef4444", name: "blinky", corner: { x: COLS - 2, y: 1 } },
    { x: 12, y: 13, dir: "L", color: "#f472b6", name: "pinky", corner: { x: 1, y: 1 } },
    { x: 13, y: 13, dir: "U", color: "#22d3ee", name: "inky", corner: { x: COLS - 2, y: ROWS - 2 } },
    { x: 14, y: 13, dir: "R", color: "#fb923c", name: "clyde", corner: { x: 1, y: ROWS - 2 } },
  ];
}

export function dist(a: Pt, b: Pt) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

export function pickGhostDir(g: Ghost, grid: CellKind[][], target: Pt, frightened: boolean): Dir {
  const options: Dir[] = [];
  for (const d of DIRS) {
    if (opposite(g.dir, d)) continue;
    const nx = g.x + DELTA[d].x;
    const ny = g.y + DELTA[d].y;
    if (walkable(grid, nx, ny, true)) options.push(d);
  }
  if (options.length === 0) {
    for (const d of DIRS) {
      const nx = g.x + DELTA[d].x;
      const ny = g.y + DELTA[d].y;
      if (walkable(grid, nx, ny, true)) return d;
    }
    return g.dir;
  }
  if (frightened) {
    return options[Math.floor(Math.random() * options.length)]!;
  }
  let best = options[0]!;
  let bestD = Infinity;
  for (const d of options) {
    const p = wrap(g.x + DELTA[d].x, g.y + DELTA[d].y);
    const dd = dist(p, target);
    if (dd < bestD) {
      bestD = dd;
      best = d;
    }
  }
  return best;
}

export function drawMaze(ctx: CanvasRenderingContext2D, grid: CellKind[][]) {
  ctx.fillStyle = "#020617";
  ctx.fillRect(0, 0, W, H);
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (grid[r]![c] !== "wall") continue;
      const x = c * CELL;
      const y = r * CELL;
      ctx.fillStyle = "#0c1a4a";
      ctx.fillRect(x + 1, y + 1, CELL - 2, CELL - 2);
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x + 1.5, y + 1.5, CELL - 3, CELL - 3);
    }
  }
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (grid[r]![c] !== "door") continue;
      ctx.fillStyle = "#f9a8d4";
      ctx.fillRect(c * CELL + 2, r * CELL + CELL / 2 - 1, CELL - 4, 2);
    }
  }
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const k = grid[r]![c]!;
      const cx = c * CELL + CELL / 2;
      const cy = r * CELL + CELL / 2;
      if (k === "pellet") {
        ctx.beginPath();
        ctx.arc(cx, cy, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = "#fde68a";
        ctx.fill();
      } else if (k === "power") {
        ctx.beginPath();
        ctx.arc(cx, cy, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = "#fbbf24";
        ctx.fill();
      }
    }
  }
}

/**
 * Classic chomp: mouth opens/closes smoothly.
 * `mouthPhase` is continuous radians (time-based); we map sin → half-angle.
 * Drawn facing +X then rotated so all directions share the same mouth shape.
 */
export function drawPac(ctx: CanvasRenderingContext2D, x: number, y: number, dir: Dir, mouthPhase: number, moving: boolean) {
  const cx = x * CELL + CELL / 2;
  const cy = y * CELL + CELL / 2;
  const r = CELL * 0.45;
  // 0 = nearly closed, 1 = fully open (~70°)
  const chomp = moving ? (Math.sin(mouthPhase) + 1) / 2 : 0.35;
  const half = 0.12 + chomp * 0.55; // radians each side of forward axis
  const rot: Record<Dir, number> = { R: 0, D: Math.PI / 2, L: Math.PI, U: -Math.PI / 2 };

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rot[dir]);

  // Body + mouth wedge
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.arc(0, 0, r, half, Math.PI * 2 - half, false);
  ctx.closePath();
  ctx.fillStyle = "#facc15";
  ctx.fill();

  // Soft highlight
  ctx.beginPath();
  ctx.arc(-r * 0.15, -r * 0.25, r * 0.28, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.22)";
  ctx.fill();

  // Eye (above the mouth axis so it stays readable while chomping)
  ctx.beginPath();
  ctx.arc(r * 0.12, -r * 0.42, r * 0.16, 0, Math.PI * 2);
  ctx.fillStyle = "#0f172a";
  ctx.fill();

  ctx.restore();
}

export function drawGhost(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string,
  frightened: boolean,
  flash: boolean,
) {
  const cx = x * CELL + CELL / 2;
  const cy = y * CELL + CELL / 2;
  const r = CELL * 0.4;
  const body = frightened ? (flash ? "#fff" : "#1d4ed8") : color;
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.arc(cx, cy - 1, r, Math.PI, 0);
  ctx.lineTo(cx + r, cy + r * 0.7);
  const waves = 3;
  const step = (2 * r) / waves;
  for (let i = 0; i < waves; i++) {
    const wx = cx + r - i * step - step / 2;
    ctx.quadraticCurveTo(wx, cy + r * 0.35, wx - step / 2, cy + r * 0.7);
  }
  ctx.closePath();
  ctx.fill();
  if (!frightened) {
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(cx - 3, cy - 2, 2.4, 0, Math.PI * 2);
    ctx.arc(cx + 3, cy - 2, 2.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#1e3a8a";
    ctx.beginPath();
    ctx.arc(cx - 2.5, cy - 2, 1.2, 0, Math.PI * 2);
    ctx.arc(cx + 3.5, cy - 2, 1.2, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.fillStyle = flash ? "#1e3a8a" : "#fff";
    ctx.beginPath();
    ctx.arc(cx - 3, cy - 2, 1.5, 0, Math.PI * 2);
    ctx.arc(cx + 3, cy - 2, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

export type Phase = "menu" | "ready" | "play" | "dead" | "win";
