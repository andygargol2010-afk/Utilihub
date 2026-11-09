// Part 2 of 3 — split from modeler3d-core.tsx on 2026-11-04. Edit here; modeler3d-core.tsx re-exports.
import { type ShapeKind, type MatPreset } from "./modeler3d-helpers";

export type MeshSnapshot = { id: string; name: string; kind: ShapeKind; color: string; matPreset?: MatPreset; position: [number, number, number]; rotation: [number, number, number]; scale: [number, number, number] };
export type GroupSnap = { id: string; name: string; childIds: string[]; position: [number, number, number]; rotation: [number, number, number]; scale: [number, number, number] };
export type HistoryEntry = { meshes: MeshSnapshot[]; groups: GroupSnap[] };
export type ClipItem = { kind: ShapeKind; color: string; matPreset?: MatPreset; position: [number, number, number]; rotation: [number, number, number]; scale: [number, number, number] };

export let _id = 0;
export const nextId = () => `m${Date.now().toString(36)}${(_id++).toString(36)}`;
