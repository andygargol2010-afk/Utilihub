// Part 2 of 3 — split from modeler3d-helpers.ts on 2026-11-04. Edit here; modeler3d-helpers.ts re-exports.
import { type ShapeKind } from "./modeler3d-helpers.part1";

export function encodeSceneShare(data: unknown): string {
  try {
    const json = JSON.stringify(data);
    const b64 = btoa(unescape(encodeURIComponent(json)));
    return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  } catch {
    return "";
  }
}

export function decodeSceneShare(raw: string): unknown | null {
  try {
    let s = raw.replace(/-/g, "+").replace(/_/g, "/");
    while (s.length % 4) s += "=";
    const json = decodeURIComponent(escape(atob(s)));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export const NAME_PAIR: Record<ShapeKind, [string, string]> = {
  box: ["Cube", "Cubo"],
  sphere: ["Sphere", "Esfera"],
  cylinder: ["Cylinder", "Cilindro"],
  cone: ["Cone", "Cono"],
  plane: ["Plane", "Plano"],
  torus: ["Torus", "Toro"],
  prism: ["Prism", "Prisma"],
  tube: ["Tube", "Tubo"],
  pyramid: ["Pyramid", "Pirámide"],
  hemisphere: ["Hemisphere", "Hemisferio"],
  capsule: ["Capsule", "Cápsula"],
};
export const BASE_SIZE: Record<ShapeKind, [number, number, number]> = {
  box: [1, 1, 1],
  sphere: [1.1, 1.1, 1.1],
  cylinder: [0.9, 1.1, 0.9],
  cone: [1, 1.1, 1],
  plane: [1.4, 0.06, 1.4],
  prism: [1.1, 1.1, 1.1],
  torus: [1.5, 0.4, 1.5],
  tube: [0.56, 1.2, 0.56],
  pyramid: [1.1, 1.1, 1.1],
  hemisphere: [1.1, 0.55, 1.1],
  capsule: [0.7, 1.4, 0.7],
};
export const COLORS = [
  // Brand / vivid
  "#a78bfa", "#f472b6", "#fb7185", "#fb923c", "#fbbf24", "#a3e635",
  "#34d399", "#2dd4bf", "#22d3ee", "#38bdf8", "#60a5fa", "#818cf8",
  // Neutrals
  "#f8fafc", "#e2e8f0", "#94a3b8", "#64748b", "#1e293b", "#0f172a",
  // Extra
  "#f87171", "#2dd4bf", "#a3e635", "#facc15", "#c026d3", "#2563eb",
];
export const HISTORY_MAX = 40;
export const OBJECT_MAX = 80;

export const clampSize = (n: number) => (!Number.isFinite(n) || n <= 0 ? 0.05 : Math.min(Math.max(n, 0.05), 50));
export const clampPos = (n: number) => (!Number.isFinite(n) ? 0 : Math.min(Math.max(n, -50), 50));
export const radToDeg = (r: number) => (r * 180) / Math.PI;
export const degToRad = (d: number) => (d * Math.PI) / 180;
/** Normalize degrees to (-180, 180] so UI never shows 899 / 999 etc. */
export function normDeg(d: number) {
  if (!Number.isFinite(d)) return 0;
  let x = ((d % 360) + 360) % 360;
  if (x > 180) x -= 360;
  return Math.round(x * 10) / 10;
}
export function snapVal(n: number, step: number) {
  if (!step || step <= 0) return n;
  return Math.round(n / step) * step;
}

export function makeGeometry(THREE: any, kind: ShapeKind) {
  switch (kind) {
    case "sphere": return new THREE.SphereGeometry(0.55, 64, 48);
    case "cylinder": return new THREE.CylinderGeometry(0.45, 0.45, 1.1, 48);
    case "cone": return new THREE.ConeGeometry(0.5, 1.1, 48);
    case "plane": return new THREE.BoxGeometry(1.4, 0.06, 1.4);
    case "torus": return new THREE.TorusGeometry(0.55, 0.2, 32, 64);
    case "prism": return new THREE.CylinderGeometry(0.55, 0.55, 1.1, 3);
    case "tube": return new THREE.CylinderGeometry(0.28, 0.28, 1.2, 40);
    case "pyramid": {
      // Base edges aligned to the axes (square 1.1 x 1.1) so it snaps flush next to cubes.
      const g = new THREE.ConeGeometry(0.55 * Math.SQRT2, 1.1, 4);
      g.rotateY(Math.PI / 4);
      return g;
    }
    case "hemisphere": {
      // Closed dome (flat base + curved top) built by lathe, centered vertically like the other shapes.
      const R = 0.55;
      const pts: any[] = [new THREE.Vector2(0, 0)];
      for (let i = 0; i <= 32; i++) {
        const a = (i / 32) * (Math.PI / 2);
        pts.push(new THREE.Vector2(Math.cos(a) * R, Math.sin(a) * R));
      }
      const g = new THREE.LatheGeometry(pts, 64);
      g.translate(0, -R / 2, 0);
      return g;
    }
    case "capsule": return new THREE.CapsuleGeometry(0.35, 0.7, 16, 40);
    default: return new THREE.BoxGeometry(1, 1, 1);
  }
}
