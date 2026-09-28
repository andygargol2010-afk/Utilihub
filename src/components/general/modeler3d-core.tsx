import { useCallback, useEffect, useRef, useState } from "react";
import {
 BASE_SIZE, HISTORY_MAX, NAME_PAIR, STORAGE_KEY,
 clampPos, clampSize, degToRad, makeGeometry, makeMaterial, normDeg, radToDeg, snapVal,
 type ShapeKind,
} from "./modeler3d-helpers";
import { makeAlignApi } from "./modeler3d-align";

type Mode = "translate" | "rotate" | "scale";
type SceneObj = { id: string; name: string; kind: ShapeKind; color: string };
type MeshSnapshot = { id: string; name: string; kind: ShapeKind; color: string; position: [number, number, number]; rotation: [number, number, number]; scale: [number, number, number] };
type GroupSnapshot = { id: string; name: string; childIds: string[]; position: [number, number, number]; rotation: [number, number, number]; scale: [number, number, number] };
type FullSnapshot = { objects: MeshSnapshot[]; groups: GroupSnapshot[] };
type ClipItem = { kind: ShapeKind; color: string; position: [number, number, number]; rotation: [number, number, number]; scale: [number, number, number] };

let idSeq = 0;
const nextId = () => `m${++idSeq}`;

export function useModelerCore(locale: "en" | "es" = "en") {
 const es = locale === "es";
 const [objects, setObjects] = useState<SceneObj[]>([]);
 const objectsRef = useRef<SceneObj[]>([]);
 const [selectedId, setSelectedId] = useState<string | null>(null);
 const selectedIdRef = useRef<string | null>(null);
 const [selectedIds, setSelectedIds] = useState<string[]>([]);
 const selectedIdsRef = useRef<string[]>([]);
 const [groupIds, setGroupIds] = useState<string[]>([]);
 const groupsRef = useRef<Map<string, { childIds: string[]; groupObj: any }>>(new Map());
 const [ctxMenu, setCtxMenu] = useState<{ x: number; y: number } | null>(null);
 const [mode, setMode] = useState<Mode>("translate");
 // RESTORE_MARKER_PART1
 return { es, objects, selectedId, selectedIds, groupIds, ctxMenu, setCtxMenu, mode, setMode,
  dropToFloor: () => {}, alignSelection: () => {}, snapTranslateLive: () => {} } as any;
}
