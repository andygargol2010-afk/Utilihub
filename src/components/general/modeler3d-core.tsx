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
 const mountRef = useRef<HTMLDivElement | null>(null);
 const studioRef = useRef<HTMLDivElement | null>(null);
 const threeRef = useRef<any>(null);
 const gridRef = useRef<any>(null);
 const sizeHistPushedRef = useRef(false);
 const marqueeRef = useRef({ on: false, x0: 0, y0: 0, el: null as HTMLDivElement | null });
 const historyRef = useRef<FullSnapshot[]>([]);
 const futureRef = useRef<FullSnapshot[]>([]);
 const skipHistoryRef = useRef(false);
 const clipboardRef = useRef<ClipItem[]>([]);

 // NOTE: truncated mid-restore - will complete in next commit
 const pushHistory = useCallback(() => {}, []);
 const readTransform = useCallback((_id: string | null) => {}, []);
 const { dropToFloor, alignSelection, snapTranslateLive } = makeAlignApi({
   threeRef, selectedIdsRef, selectedIdRef, groupsRef, pushHistory, readTransform,
 });

 return {
   es, objects, selectedId, selectedIds, groupIds, ctxMenu, setCtxMenu, mode, setMode,
   color, setColor, fullscreen, ready, setReady, error, setError,
   canUndo, canRedo, size, pos, rotDeg, snap, setSnap, mountRef, studioRef, threeRef,
   sizeHistPushedRef, selectedIdRef, selectedIdsRef, groupsRef, marqueeRef,
   modeRef, gridRef, pushHistory, setPosAxis: () => {}, setRotAxis: () => {}, endTransformEdit: () => {},
   nudgeSelected: () => {}, setSizeAxis: () => {},
   addShape: () => {}, deleteSelected: () => {}, applyColor: () => {},
   groupSelected: () => {}, ungroupSelected: () => {}, undo: () => {}, redo: () => {}, toggleFullscreen: () => {},
   setSelectedId, setSelectedIds, readTransform, loadScene: () => {}, saveScene: () => {}, clearScene: () => {},
   copySelected: () => {}, cutSelected: () => {}, pasteClipboard: () => {}, exportJSON: () => {}, exportSTL: () => {},
   dropToFloor, alignSelection, snapTranslateLive,
 };
}
