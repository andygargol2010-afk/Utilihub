// Part 2 of 3 — split from PulseCatch.tsx on 2026-11-04. Edit here; PulseCatch.tsx re-exports.

export type Burst = {
  x: number;
  y: number;
  particles: { x: number; y: number; vx: number; vy: number; life: number; hue: number; size?: number }[];
};

export type Floater = {
  x: number;
  y: number;
  text: string;
  life: number;
  maxLife: number;
  hue: number;
  big?: boolean;
};

export type Ring = {
  x: number;
  y: number;
  r: number;
  maxR: number;
  life: number;
  hue: number;
};
