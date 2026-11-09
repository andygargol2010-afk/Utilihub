// Part 2 of 3 — split from RefractionChallengeGame.tsx on 2026-11-04. Edit here; RefractionChallengeGame.tsx re-exports.
import { type Lens } from "./RefractionChallengeGame.part1";

export type Block = { x: number; y: number; w: number; h: number };
export type Level = {
  lenses: Lens[];
  blocks: Block[];
  target: { x: number; y: number; r: number };
  hintEn: string;
  hintEs: string;
};

export type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
};

export const W = 480;
export const H = 280;
export const ORIGIN = { x: 24, y: H / 2 };
export const MAX_PARTICLES = 48;
export const PROGRESS_KEY = "utilihub_game_progress_refraction-challenge";

export const LEVELS: Level[] = [
  {
    lenses: [],
    blocks: [],
    target: { x: 430, y: 140, r: 18 },
    hintEn: "Straight shot — aim carefully.",
    hintEs: "Tiro directo — apuntá con cuidado.",
  },
  {
    lenses: [{ x: 240, y: 140, r: 42, strength: 0.045 }],
    blocks: [],
    target: { x: 430, y: 70, r: 18 },
    hintEn: "One lens bends the beam toward its center.",
    hintEs: "Una lente dobla el rayo hacia su centro.",
  },
  {
    lenses: [
      { x: 170, y: 100, r: 36, strength: 0.05 },
      { x: 300, y: 180, r: 36, strength: 0.05 },
    ],
    blocks: [{ x: 250, y: 40, w: 20, h: 80 }],
    target: { x: 430, y: 210, r: 18 },
    hintEn: "Two lenses + a blocker. Thread the gap.",
    hintEs: "Dos lentes y un obstáculo. Pasá por el hueco.",
  },
  {
    lenses: [
      { x: 150, y: 80, r: 34, strength: 0.055 },
      { x: 250, y: 200, r: 34, strength: 0.055 },
      { x: 340, y: 110, r: 30, strength: 0.05 },
    ],
    blocks: [
      { x: 200, y: 120, w: 18, h: 100 },
      { x: 300, y: 40, w: 18, h: 70 },
    ],
    target: { x: 440, y: 200, r: 16 },
    hintEn: "Three lenses. Small target.",
    hintEs: "Tres lentes. Blanco chico.",
  },
  {
    lenses: [
      { x: 160, y: 140, r: 40, strength: 0.06 },
      { x: 280, y: 70, r: 32, strength: 0.05 },
      { x: 280, y: 210, r: 32, strength: 0.05 },
    ],
    blocks: [
      { x: 220, y: 0, w: 16, h: 100 },
      { x: 220, y: 180, w: 16, h: 100 },
      { x: 350, y: 100, w: 16, h: 80 },
    ],
    target: { x: 440, y: 140, r: 15 },
    hintEn: "Final: navigate the corridor.",
    hintEs: "Final: navegá el corredor.",
  },
  {
    lenses: [
      { x: 140, y: 60, r: 32, strength: 0.065 },
      { x: 220, y: 160, r: 38, strength: 0.055 },
      { x: 310, y: 90, r: 28, strength: 0.07 },
      { x: 380, y: 180, r: 34, strength: 0.05 },
    ],
    blocks: [
      { x: 180, y: 0, w: 14, h: 90 },
      { x: 180, y: 190, w: 14, h: 90 },
      { x: 260, y: 40, w: 14, h: 70 },
      { x: 340, y: 150, w: 14, h: 80 },
    ],
    target: { x: 450, y: 50, r: 14 },
    hintEn: "Advanced: four lenses, tight corridors. Precision required.",
    hintEs: "Avanzado: cuatro lentes, corredores estrechos. Precisión requerida.",
  },
  {
    lenses: [
      { x: 120, y: 200, r: 30, strength: 0.075 },
      { x: 200, y: 80, r: 36, strength: 0.06 },
      { x: 280, y: 160, r: 28, strength: 0.08 },
      { x: 350, y: 60, r: 32, strength: 0.055 },
      { x: 400, y: 200, r: 26, strength: 0.07 },
    ],
    blocks: [
      { x: 160, y: 30, w: 12, h: 100 },
      { x: 160, y: 170, w: 12, h: 110 },
      { x: 240, y: 100, w: 12, h: 60 },
      { x: 320, y: 0, w: 12, h: 80 },
      { x: 320, y: 200, w: 12, h: 80 },
      { x: 370, y: 120, w: 12, h: 50 },
    ],
    target: { x: 455, y: 230, r: 12 },
    hintEn: "Expert: five lenses + dense blockers. Thread the needle.",
    hintEs: "Experto: cinco lentes + obstáculos densos. Pasá por la aguja.",
  },
];

export function readProgress(): { maxCleared: number; shots: number } {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return { maxCleared: -1, shots: 0 };
    const parsed = JSON.parse(raw) as { maxCleared?: number; shots?: number };
    const maxCleared =
      typeof parsed.maxCleared === "number" && Number.isFinite(parsed.maxCleared)
        ? Math.max(-1, Math.min(LEVELS.length - 1, Math.floor(parsed.maxCleared)))
        : -1;
    const shots =
      typeof parsed.shots === "number" && Number.isFinite(parsed.shots) && parsed.shots >= 0
        ? Math.floor(parsed.shots)
        : 0;
    return { maxCleared, shots };
  } catch {
    return { maxCleared: -1, shots: 0 };
  }
}

export function writeProgress(maxCleared: number, shots: number) {
  try {
    localStorage.setItem(
      PROGRESS_KEY,
      JSON.stringify({ maxCleared, shots, updatedAt: Date.now() })
    );
  } catch {
    /* ignore quota / private mode */
  }
}

export function spawnSparks(
  particles: Particle[],
  x: number,
  y: number,
  count: number,
  color: string,
  speed = 1.8
) {
  for (let i = 0; i < count; i++) {
    if (particles.length >= MAX_PARTICLES) break;
    const a = Math.random() * Math.PI * 2;
    const s = speed * (0.4 + Math.random() * 0.9);
    particles.push({
      x,
      y,
      vx: Math.cos(a) * s,
      vy: Math.sin(a) * s,
      life: 1,
      maxLife: 0.55 + Math.random() * 0.45,
      color,
      size: 1.2 + Math.random() * 2.2,
    });
  }
}

export function castRay(
  angleDeg: number,
  level: Level
): {
  points: { x: number; y: number }[];
  hit: boolean;
  refractionPoints: { x: number; y: number }[];
} {
  const rad = (angleDeg * Math.PI) / 180;
  let x = ORIGIN.x;
  let y = ORIGIN.y;
  let vx = Math.cos(rad);
  let vy = Math.sin(rad);
  const points = [{ x, y }];
  const refractionPoints: { x: number; y: number }[] = [];
  const step = 2;
  const inside = new Set<number>();

  for (let i = 0; i < 900; i++) {
    x += vx * step;
    y += vy * step;
    if (i % 2 === 0) points.push({ x, y });

    if (x < 0 || x > W || y < 0 || y > H) break;

    for (const b of level.blocks) {
      if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) {
        return { points, hit: false, refractionPoints };
      }
    }

    const t = level.target;
    if ((x - t.x) ** 2 + (y - t.y) ** 2 <= t.r ** 2) {
      points.push({ x: t.x, y: t.y });
      return { points, hit: true, refractionPoints };
    }

    level.lenses.forEach((lens, idx) => {
      const dx = x - lens.x;
      const dy = y - lens.y;
      const dist = Math.hypot(dx, dy);
      if (dist < lens.r) {
        if (!inside.has(idx)) {
          inside.add(idx);
          refractionPoints.push({ x, y });
          const tx = lens.x - x;
          const ty = lens.y - y;
          const tl = Math.hypot(tx, ty) || 1;
          const nx = tx / tl;
          const ny = ty / tl;
          const factor = lens.strength * (1 - dist / lens.r);
          vx += nx * factor * 12;
          vy += ny * factor * 12;
          const len = Math.hypot(vx, vy) || 1;
          vx /= len;
          vy /= len;
        }
      } else {
        inside.delete(idx);
      }
    });
  }

  return { points, hit: false, refractionPoints };
}
