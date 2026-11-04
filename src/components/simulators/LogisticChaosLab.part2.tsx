// Part 2 of 3 — split from LogisticChaosLab.tsx on 2026-11-04. Edit here; LogisticChaosLab.tsx re-exports.

export const H = 560;
export const BIF_R_MIN = 0;
export const BIF_R_MAX = 4;
export const BIF_STEPS = 400;
export const BIF_TRANSIENT = 80;
export const BIF_PLOT = 20;

export const BIFURCATION_POINTS = [
  { r: 3.0, label: "P2" },
  { r: 3.449, label: "P4" },
  { r: 3.544, label: "P8" },
  { r: 3.57, label: "Feigenbaum" },
];

export const STABILITY_WINDOWS = [
  { rMin: 3.738, rMax: 3.745, label: "P5", labelEs: "P5" },
  { rMin: 3.8284, rMax: 3.8415, label: "P3", labelEs: "P3" },
];

export function classifyAttractor(pts: number[]): { type: string; typeEs: string; period: number } {
  if (pts.length < 10) return { type: "computing…", typeEs: "calculando…", period: 0 };
  const last = pts.slice(-40);
  const rounded = last.map((v) => Math.round(v * 1000) / 1000);
  const unique = [...new Set(rounded)].sort((a, b) => a - b);
  const n = unique.length;
  if (n <= 1) return { type: "Fixed point", typeEs: "Punto fijo", period: 1 };
  if (n === 2) return { type: "Period-2 cycle", typeEs: "Ciclo periodo-2", period: 2 };
  if (n === 4) return { type: "Period-4 cycle", typeEs: "Ciclo periodo-4", period: 4 };
  if (n === 8) return { type: "Period-8 cycle", typeEs: "Ciclo periodo-8", period: 8 };
  if (n <= 16) return { type: `Period-${n} cycle`, typeEs: `Ciclo periodo-${n}`, period: n };
  return { type: "Chaos / dense attractor", typeEs: "Caos / atractor denso", period: n };
}

export function isInStabilityWindow(r: number) {
  return STABILITY_WINDOWS.find((w) => r >= w.rMin && r <= w.rMax);
}
