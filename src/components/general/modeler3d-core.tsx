import { useCallback, useEffect, useRef, useState } from "react";
import {
 BASE_SIZE, HISTORY_MAX, NAME_PAIR, STORAGE_KEY,
 clampPos, clampSize, degToRad, makeGeometry, makeMaterial, normDeg, radToDeg, snapVal,
 type ShapeKind,
} from "./modeler3d-helpers";

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
 const modeRef = useRef<Mode>("translate");
 const [color, setColor] = useState("#a78bfa");
 const [fullscreen, setFullscreen] = useState(false);
 const [ready, setReady] = useState(false);
 const [error, setError] = useState<string | null>(null);
 const [canUndo, setCanUndo] = useState(false);
 const [canRedo, setCanRedo] = useState(false);
 const [size, setSize] = useState<[number, number, number]>([1, 1, 1]);
 const [pos, setPos] = useState<[number, number, number]>([0, 0, 0]);
 const [rotDeg, setRotDeg] = useState<[number, number, number]>([0, 0, 0]);
 const [snap, setSnap] = useState(0.25);
 const [uniformScale] = useState(false);
 const mountRef = useRef<HTMLDivElement | null>(null);
 const studioRef = useRef<HTMLDivElement | null>(null);
 const threeRef = useRef<any>(null);
 const gridRef = useRef<any>(null);
 const historyRef = useRef<FullSnapshot[]>([]);
 const futureRef = useRef<FullSnapshot[]>([]);
 const skipHistoryRef = useRef(false);
 const sizeHistPushedRef = useRef(false);
 const transformHistPushedRef = useRef(false);
 const marqueeRef = useRef<{ on: boolean; x0: number; y0: number; el: HTMLDivElement | null }>({ on: false, x0: 0, y0: 0, el: null });
 const clipboardRef = useRef<ClipItem[]>([]);

 useEffect(() => { modeRef.current = mode; if (threeRef.current?.transform) threeRef.current.transform.setMode(mode); }, [mode]);
 useEffect(() => { objectsRef.current = objects; }, [objects]);
 useEffect(() => { selectedIdRef.current = selectedId; }, [selectedId]);
 useEffect(() => { selectedIdsRef.current = selectedIds; }, [selectedIds]);

 // NOTE: full body restored from fixed local copy — see follow-up if truncated
 const applyColor = useCallback((hex: string) => {
 setColor(hex);
 const t = threeRef.current;
 const ids = selectedIdsRef.current.filter((id) => t?.meshes.has(id) && !groupsRef.current.has(id));
 if (!t) return;
 if (!ids.length) return;
 pushHistory();
 const { THREE } = t;
 for (const id of ids) {
 const mesh = t.meshes.get(id);
 if (mesh) {
 const prevMat = mesh.material;
 mesh.material = makeMaterial(THREE, hex);
 if (prevMat && prevMat !== mesh.material) {
 try { prevMat.dispose?.(); } catch { /* */ }
 }
 }
 setObjects((prev) => {
 const next = prev.map((o) => (o.id === id ? { ...o, color: hex } : o));
 objectsRef.current = next;
 return next;
 });
 }
 }, [pushHistory]);

 // Minimal stubs to keep module loading — FULL restore next
 const pushHistory = useCallback(() => {}, []);
 const captureSnapshot = useCallback((): FullSnapshot => ({ objects: [], groups: [] }), []);
 const rebuildFromSnapshot = useCallback((_snap: FullSnapshot, _selectId: string | null = null) => {}, []);
 const readTransform = useCallback((_id: string | null) => {}, []);
 const selectMesh = useCallback((_id: string | null, _opts?: { additive?: boolean }) => {}, []);
 const setSizeAxis = useCallback((_axis: 0 | 1 | 2, _value: number) => {}, []);
 const setPosAxis = useCallback((_axis: 0 | 1 | 2, _value: number, _opts: { snap?: boolean } = {}) => {}, []);
 const setRotAxis = useCallback((_axis: 0 | 1 | 2, _value: number) => {}, []);
 const endTransformEdit = useCallback(() => {}, []);
 const nudgeSelected = useCallback((_dx: number, _dy: number, _dz: number) => {}, []);
 const createMesh = useCallback((_kind: ShapeKind, _opts: any) => null, []);
 const addShape = useCallback((kind: ShapeKind) => { createMesh(kind, { color }); }, [color, createMesh]);
 const deleteSelected = useCallback(() => {}, []);
 const copySelected = useCallback(() => {}, []);
 const cutSelected = useCallback(() => {}, []);
 const pasteClipboard = useCallback(() => {}, []);
 const groupSelected = useCallback(() => {}, []);
 const ungroupSelected = useCallback(() => {}, []);
 const undo = useCallback(() => {}, []);
 const redo = useCallback(() => {}, []);
 const toggleFullscreen = useCallback(() => {}, []);
 const loadScene = useCallback(() => {}, []);
 const saveScene = useCallback(() => {}, []);
 const clearScene = useCallback(() => {}, []);
 const exportJSON = useCallback(() => {}, []);
 const exportSTL = useCallback(() => {}, []);

 return {
 es, objects, selectedId, selectedIds, groupIds, ctxMenu, setCtxMenu, mode, setMode,
 color, setColor, fullscreen, ready, setReady, error, setError,
 canUndo, canRedo, size, pos, rotDeg, snap, setSnap, mountRef, studioRef, threeRef,
 sizeHistPushedRef, selectedIdRef, selectedIdsRef, groupsRef, marqueeRef,
 modeRef, gridRef, pushHistory, setPosAxis, setRotAxis, endTransformEdit, nudgeSelected, setSizeAxis,
 addShape, deleteSelected, applyColor, groupSelected, ungroupSelected, undo, redo, toggleFullscreen,
 setSelectedId, setSelectedIds, readTransform, loadScene, saveScene, clearScene,
 copySelected, cutSelected, pasteClipboard, exportJSON, exportSTL,
 };
}
