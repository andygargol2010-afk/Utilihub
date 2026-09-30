export type ShapeKind = "box" | "sphere" | "cylinder" | "cone" | "plane" | "torus" | "prism" | "tube";

export type MatPreset = "default" | "matte" | "metal" | "glass";

/** 1 world unit ≈ 10 cm for measurement labels */
export const UNIT_CM = 10;

export type SceneObj = { id: string; name: string; kind: ShapeKind; color: string; matPreset?: MatPreset };

export type HistoryEntry = {
  objects: SceneObj[];
  meshes: { id: string; kind: ShapeKind; color: string; position: [number, number, number]; rotation: [number, number, number]; scale: [number, number, number] }[];
  groups: { id: string; name: string; childIds: string[]; position: [number, number, number]; rotation: [number, number, number] }[];
};

export type ClipItem = {
  kind: ShapeKind;
  color: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
};

export const STORAGE_KEY = "utilihub-modeler3d-v1";
export const SCENES_KEY = "utilihub-modeler3d-scenes-v1";
export const MAX_NAMED_SCENES = 12;

export type NamedScene = {
  id: string;
  name: string;
  savedAt: number;
  data: {
    meshes: {
      id: string; name?: string; kind: ShapeKind; color: string; matPreset?: MatPreset;
      position: [number, number, number]; rotation: [number, number, number]; scale: [number, number, number];
    }[];
    groups: {
      id: string; name: string; childIds: string[];
      position: [number, number, number]; rotation: [number, number, number]; scale: [number, number, number];
    }[];
  };
};

/** Built-in starter layouts (no groups). */
export function scenePresets(es: boolean): { id: string; label: string; data: NamedScene["data"] }[] {
  const box = (id: string, color: string, pos: [number, number, number], scale: [number, number, number] = [1, 1, 1], kind: ShapeKind = "box") => ({
    id, name: id, kind, color, matPreset: "default" as MatPreset,
    position: pos, rotation: [0, 0, 0] as [number, number, number], scale,
  });
  return [
    {
      id: "desk",
      label: es ? "Escritorio" : "Desk",
      data: {
        meshes: [
          box("p1", "#94a3b8", [0, 0.05, 0], [1.6, 0.1, 0.9], "box"),
          box("p2", "#64748b", [-0.7, 0.4, 0], [0.08, 0.7, 0.08], "cylinder"),
          box("p3", "#64748b", [0.7, 0.4, 0], [0.08, 0.7, 0.08], "cylinder"),
          box("p4", "#64748b", [-0.7, 0.4, 0.35], [0.08, 0.7, 0.08], "cylinder"),
          box("p5", "#64748b", [0.7, 0.4, 0.35], [0.08, 0.7, 0.08], "cylinder"),
          box("p6", "#60a5fa", [0, 0.35, -0.2], [0.5, 0.4, 0.05], "box"),
        ],
        groups: [],
      },
    },
    {
      id: "stack",
      label: es ? "Torre de bloques" : "Block tower",
      data: {
        meshes: [
          box("t1", "#f472b6", [0, 0.25, 0], [1, 0.5, 1]),
          box("t2", "#a78bfa", [0, 0.75, 0], [0.8, 0.5, 0.8]),
          box("t3", "#34d399", [0, 1.2, 0], [0.55, 0.4, 0.55]),
          box("t4", "#fbbf24", [0, 1.55, 0], [0.35, 0.3, 0.35]),
        ],
        groups: [],
      },
    },
    {
      id: "axes",
      label: es ? "Ejes de referencia" : "Reference axes",
      data: {
        meshes: [
          box("ax", "#f87171", [0.5, 0.06, 0], [1, 0.12, 0.12]),
          box("ay", "#4ade80", [0, 0.5, 0], [0.12, 1, 0.12]),
          box("az", "#60a5fa", [0, 0.06, 0.5], [0.12, 0.12, 1]),
          box("o", "#e2e8f0", [0, 0.1, 0], [0.2, 0.2, 0.2], "sphere"),
        ],
        groups: [],
      },
    },
  ];
}

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
};
export const BASE_SIZE: Record<ShapeKind, [number, number, number]> = {
  box: [1, 1, 1],
  sphere: [1.1, 1.1, 1.1],
  cylinder: [0.9, 1.1, 0.9],
  cone: [1, 1.1, 1],
  plane: [1.4, 0.06, 1.4],
  torus: [1.5, 0.4, 1.5],
  prism: [1.1, 1.1, 1.1],
  tube: [0.56, 1.2, 0.56],
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
    default: return new THREE.BoxGeometry(1, 1, 1);
  }
}

export function makeMaterial(THREE: any, color: string, preset: MatPreset = "default") {
  if (preset === "matte") {
    return new THREE.MeshStandardMaterial({
      color,
      metalness: 0,
      roughness: 0.92,
      flatShading: false,
    });
  }
  if (preset === "metal") {
    return new THREE.MeshPhysicalMaterial({
      color,
      metalness: 1,
      roughness: 0.18,
      clearcoat: 0.35,
      clearcoatRoughness: 0.12,
      reflectivity: 1,
      envMapIntensity: 1.2,
      flatShading: false,
    });
  }
  if (preset === "glass") {
    return new THREE.MeshPhysicalMaterial({
      color,
      metalness: 0,
      roughness: 0.05,
      transmission: 0.92,
      transparent: true,
      opacity: 0.45,
      thickness: 0.6,
      ior: 1.45,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      envMapIntensity: 1,
      flatShading: false,
    });
  }
  // default — same look as before (color bug fix path)
  return new THREE.MeshPhysicalMaterial({
    color,
    metalness: 0.12,
    roughness: 0.28,
    clearcoat: 0.55,
    clearcoatRoughness: 0.18,
    reflectivity: 0.55,
    sheen: 0.15,
    sheenRoughness: 0.4,
    sheenColor: 0xffffff,
    envMapIntensity: 0.85,
    flatShading: false,
  });
}

export function matPresetList(es: boolean): { id: MatPreset; label: string }[] {
  return [
    { id: "default", label: es ? "Estándar" : "Default" },
    { id: "matte", label: es ? "Mate" : "Matte" },
    { id: "metal", label: es ? "Metal" : "Metal" },
    { id: "glass", label: es ? "Vidrio" : "Glass" },
  ];
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
