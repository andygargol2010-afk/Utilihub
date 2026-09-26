/** Shared constants & builders for 3D modeler */
export type ShapeKind = "box" | "sphere" | "cylinder" | "cone" | "plane" | "torus" | "prism" | "tube";

export const NAME_PAIR: Record<ShapeKind, [string, string]> = {
  box: ["Cube", "Cubo"],
  sphere: ["Sphere", "Esfera"],
  cylinder: ["Cylinder", "Cilindro"],
  cone: ["Cone", "Cono"],
  plane: ["Plane", "Plano"],
  torus: ["Torus", "Toro"],
  prism: ["Prism", "Prisma"],
  tube: ["Tube", "Tubo"],
};

export const BASE_SIZE: Record<ShapeKind, [number, number, number]> = {
  box: [1, 1, 1],
  sphere: [1.1, 1.1, 1.1],
  cylinder: [0.9, 1.1, 0.9],
  cone: [1, 1.1, 1],
  plane: [1.4, 0.06, 1.4],
  torus: [1.2, 0.4, 1.2],
  prism: [1, 1.1, 1],
  tube: [1, 1.1, 1],
};

export const ALL_KINDS: ShapeKind[] = ["box", "sphere", "cylinder", "cone", "plane", "torus", "prism", "tube"];
export const STORAGE_KEY = "utilihub_3d_scene_v1";
export const COLORS = ["#f43f5e", "#a78bfa", "#22d3ee", "#4ade80", "#fbbf24", "#f8fafc"];
export const HISTORY_MAX = 40;

export const clampSize = (n: number) => (!Number.isFinite(n) || n <= 0 ? 0.05 : Math.min(Math.max(n, 0.05), 50));
export const clampPos = (n: number) => (!Number.isFinite(n) ? 0 : Math.min(Math.max(n, -50), 50));
export const radToDeg = (r: number) => (r * 180) / Math.PI;
export const degToRad = (d: number) => (d * Math.PI) / 180;
export function snapVal(n: number, step: number) {
  if (!step || step <= 0) return n;
  return Math.round(n / step) * step;
}

export function makeGeometry(THREE: any, kind: ShapeKind) {
  switch (kind) {
    case "sphere": return new THREE.SphereGeometry(0.55, 48, 32);
    case "cylinder": return new THREE.CylinderGeometry(0.45, 0.45, 1.1, 40);
    case "cone": return new THREE.ConeGeometry(0.5, 1.1, 40);
    case "plane": return new THREE.BoxGeometry(1.4, 0.06, 1.4);
    case "torus": return new THREE.TorusGeometry(0.55, 0.2, 24, 48);
    case "prism": return new THREE.CylinderGeometry(0.55, 0.55, 1.1, 3);
    case "tube": return new THREE.CylinderGeometry(0.28, 0.28, 1.2, 32);
    default: return new THREE.BoxGeometry(1, 1, 1);
  }
}

export function makeMaterial(THREE: any, color: string, metalness = 0.18, roughness = 0.32) {
  return new THREE.MeshPhysicalMaterial({
    color, metalness, roughness, clearcoat: 0.35, clearcoatRoughness: 0.25, reflectivity: 0.4,
  });
}

export function shapeList(es: boolean): { kind: ShapeKind; label: string; icon: string }[] {
  return [
    { kind: "box", label: es ? "Cubo" : "Cube", icon: "■" },
    { kind: "sphere", label: es ? "Esfera" : "Sphere", icon: "●" },
    { kind: "cylinder", label: es ? "Cilindro" : "Cylinder", icon: "▮" },
    { kind: "cone", label: es ? "Cono" : "Cone", icon: "▲" },
    { kind: "plane", label: es ? "Plano" : "Plane", icon: "▬" },
    { kind: "torus", label: es ? "Toro" : "Torus", icon: "◎" },
    { kind: "prism", label: es ? "Prisma" : "Prism", icon: "△" },
    { kind: "tube", label: es ? "Tubo" : "Tube", icon: "◯" },
  ];
}
