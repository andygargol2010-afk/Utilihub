// Part 2 of 3 — split from MoleculesSim.tsx on 2026-11-04. Edit here; MoleculesSim.tsx re-exports.
import { type Phase } from "./MoleculesSim.part1";

export type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  hx: number;
  hy: number;
  r: number;
};

export const W = 480;
export const H = 320;
export const COUNT = 72;
export const R = 5.4;

export function phaseLabel(phase: Phase, es: boolean) {
  if (es) return phase === "solid" ? "Sólido" : phase === "liquid" ? "Líquido" : "Gas";
  return phase === "solid" ? "Solid" : phase === "liquid" ? "Liquid" : "Gas";
}

export function phaseHint(phase: Phase, es: boolean) {
  if (es) {
    if (phase === "solid") return "Vibran en una red fija — poca energía cinética.";
    if (phase === "liquid") return "Se deslizan y se agrupan — energía media.";
    return "Se mueven libremente y chocan — mucha energía.";
  }
  if (phase === "solid") return "Vibrate in a fixed lattice — low kinetic energy.";
  if (phase === "liquid") return "Slide and cluster — medium energy.";
  return "Move freely and collide — high kinetic energy.";
}

export function makeParticles(phase: Phase): Particle[] {
  const list: Particle[] = [];
  const cols = 9;
  const rows = 8;
  const gapX = (W - 56) / (cols - 1);
  const gapY = (H - 56) / (rows - 1);
  let i = 0;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (i >= COUNT) break;
      const hx = 28 + col * gapX;
      const hy = 28 + row * gapY;
      const speed = phase === "solid" ? 0.12 : phase === "liquid" ? 0.9 : 2.6;
      const angle = Math.random() * Math.PI * 2;
      list.push({
        x: hx + (Math.random() - 0.5) * (phase === "solid" ? 1.5 : 12),
        y: hy + (Math.random() - 0.5) * (phase === "solid" ? 1.5 : 12),
        vx: Math.cos(angle) * speed * (0.55 + Math.random() * 0.9),
        vy: Math.sin(angle) * speed * (0.55 + Math.random() * 0.9),
        hx,
        hy,
        r: R * (0.92 + Math.random() * 0.16),
      });
      i++;
    }
  }
  return list;
}

export function colorForSpeed(speed: number, phase: Phase): [number, number, number] {
  const t = Math.min(1, speed / (phase === "gas" ? 5.5 : phase === "liquid" ? 2.8 : 1.1));
  if (phase === "solid") return [56 + t * 50, 200 + t * 30, 190];
  if (phase === "liquid") return [30 + t * 70, 170 + t * 40, 210 - t * 50];
  return [251, 140 + (1 - t) * 50, 50 + t * 90];
}

export function setupCanvas(canvas: HTMLCanvasElement) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
  canvas.width = Math.round(W * dpr);
  canvas.height = Math.round(H * dpr);
  const ctx = canvas.getContext("2d");
  if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
}
