// Part 2 of 3 — split from PongGame.tsx on 2026-11-04. Edit here; PongGame.tsx re-exports.

export type Diff = "easy" | "medium" | "hard";

export const DIFF = {
  easy: { ball: 2.3, cpuSpeed: 1.55, error: 28, reactFrom: 0.28, maxBall: 3.4 },
  medium: { ball: 2.85, cpuSpeed: 2.15, error: 14, reactFrom: 0.42, maxBall: 4.2 },
  hard: { ball: 3.5, cpuSpeed: 3.1, error: 5, reactFrom: 0.52, maxBall: 5.2 },
} as const;

export type Ctx2D = CanvasRenderingContext2D & {
  roundRect?(x: number, y: number, w: number, h: number, radii?: number | number[]): void;
};

export function fillRoundRect(ctx: Ctx2D, x: number, y: number, w: number, h: number, r: number) {
  if (typeof ctx.roundRect === "function") {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.fill();
  } else {
    ctx.fillRect(x, y, w, h);
  }
}
