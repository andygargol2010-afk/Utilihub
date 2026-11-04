// Part 1 of 3 — split from modeler3d-helpers.ts on 2026-11-04. Edit here; modeler3d-helpers.ts re-exports.

export type ShapeKind = "box" | "sphere" | "cylinder" | "cone" | "plane" | "torus" | "prism" | "tube" | "pyramid" | "hemisphere" | "capsule";

export type MatPreset = "default" | "matte" | "metal" | "glass" | "plastic" | "rubber" | "wood" | "concrete" | "ceramic" | "glow" | "brushed" | "velvet";

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
