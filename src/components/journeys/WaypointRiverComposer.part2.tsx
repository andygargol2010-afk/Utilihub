// Part 2 of 3 — split from WaypointRiverComposer.tsx on 2026-11-04. Edit here; WaypointRiverComposer.tsx re-exports.
import { type Point } from "./WaypointRiverComposer.part1";

export type Attractor = { x: number; y: number; strength: number };
export type Particle = { t: number; trail: Point[]; hue: number };

export const LABELS = {
  en: {
    place: "Place waypoint",
    drag: "Drag to move",
    clear: "Clear",
    randomize: "Randomize path",
    pause: "Pause",
    resume: "Resume",
    speed: "Speed",
    width: "Width",
    bloom: "Bloom",
    density: "Density",
    gravity: "Gravity",
    trail: "Trail",
    attractors: "Attractors",
    share: "Share PNG",
    help: "Click canvas to place waypoints. Drag existing ones to move. Particles flow with fading trails. Space = pause · R = randomize · C = clear.",
  },
  es: {
    place: "Colocar waypoint",
    drag: "Arrastrar para mover",
    clear: "Limpiar",
    randomize: "Aleatorizar camino",
    pause: "Pausar",
    resume: "Reanudar",
    speed: "Velocidad",
    width: "Ancho",
    bloom: "Bloom",
    density: "Densidad",
    gravity: "Gravedad",
    trail: "Estela",
    attractors: "Atractores",
    share: "Compartir PNG",
    help: "Clic en el lienzo para colocar waypoints. Arrastrá los existentes para mover. Las partículas fluyen con estelas que se desvanecen. Espacio = pausa · R = aleatorio · C = limpiar.",
  },
} as const;

export function encodeWaypoints(wps: Point[]): string {
  return wps.map((p) => `${p.x.toFixed(3)},${p.y.toFixed(3)}`).join("~");
}

export function decodeWaypoints(s: string | null): Point[] | null {
  if (!s) return null;
  try {
    const parts = s.split("~").filter(Boolean);
    if (parts.length < 2) return null;
    const pts = parts.map((seg) => {
      const [xs, ys] = seg.split(",");
      const x = parseFloat(xs);
      const y = parseFloat(ys);
      if (Number.isNaN(x) || Number.isNaN(y)) return null;
      return { x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) };
    });
    if (pts.some((p) => !p)) return null;
    return pts as Point[];
  } catch {
    return null;
  }
}
