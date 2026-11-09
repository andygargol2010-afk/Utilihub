// Part 1 of 3 — split from modeler3d-core.tsx on 2026-11-04. Edit here; modeler3d-core.tsx re-exports.
import { type ShapeKind, type MatPreset } from "./modeler3d-helpers";

export type SceneObj = { id: string; name: string; kind: ShapeKind; color: string; matPreset?: MatPreset };
