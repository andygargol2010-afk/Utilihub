import { useCallback, useEffect, useRef, useState } from "react";
import {
 BASE_SIZE, HISTORY_MAX, NAME_PAIR,
 clampPos, clampSize, degToRad, makeGeometry, makeMaterial, normDeg, radToDeg, snapVal,
 type ShapeKind,
} from "./modeler3d-helpers";

type Mode = "translate" | "rotate" | "scale";
type SceneObj = { id: string; name: string; kind: ShapeKind; color: string };
type MeshSnapshot = { id: string; name: string; kind: ShapeKind; color: string; position: [number, number, number]; rotation: [number, number, number]; scale: [number, number, number] };
type GroupSnapshot = { id: string; name: string; childIds: string[]; position: [number, number, number]; rotation: [number, number, number]; scale: [number, number, number] };
type FullSnapshot = { objects: MeshSnapshot[]; groups: GroupSnapshot[] };

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

 useEffect(() => { modeRef.current = mode; if (threeRef.current?.transform) threeRef.current.transform.setMode(mode); }, [mode]);
 useEffect(() => { objectsRef.current = objects; }, [objects]);
 useEffect(() => { selectedIdRef.current = selectedId; }, [selectedId]);
 useEffect(() => { selectedIdsRef.current = selectedIds; }, [selectedIds]);

 const captureSnapshot = useCallback((): FullSnapshot => {
 const t = threeRef.current;
 const objectsSnap: MeshSnapshot[] = [];
 const groupsSnap: GroupSnapshot[] = [];
 if (!t) return { objects: objectsSnap, groups: groupsSnap };
 for (const o of objectsRef.current) {
 if (groupsRef.current.has(o.id)) continue;
 const mesh = t.meshes.get(o.id);
 if (!mesh || !mesh.isMesh) continue;
 mesh.updateMatrixWorld(true);
 const pos = mesh.getWorldPosition(new t.THREE.Vector3());
 const quat = mesh.getWorldQuaternion(new t.THREE.Quaternion());
 const scl = mesh.getWorldScale(new t.THREE.Vector3());
 const eul = new t.THREE.Euler().setFromQuaternion(quat);
 objectsSnap.push({
 id: o.id, name: o.name, kind: o.kind, color: o.color,
 position: [pos.x, pos.y, pos.z],
 rotation: [eul.x, eul.y, eul.z],
 scale: [scl.x, scl.y, scl.z],
 });
 }
 for (const [gid, g] of groupsRef.current) {
 const go = g.groupObj;
 groupsSnap.push({
 id: gid, name: objectsRef.current.find((x) => x.id === gid)?.name ?? "Group",
 childIds: [...g.childIds],
 position: [go.position.x, go.position.y, go.position.z],
 rotation: [go.rotation.x, go.rotation.y, go.rotation.z],
 scale: [go.scale.x, go.scale.y, go.scale.z],
 });
 }
 return { objects: objectsSnap, groups: groupsSnap };
 }, []);

 const pushHistory = useCallback(() => {
 if (skipHistoryRef.current) return;
 const snap = captureSnapshot();
 historyRef.current.push(snap);
 if (historyRef.current.length > HISTORY_MAX) historyRef.current.shift();
 futureRef.current = [];
 setCanUndo(true); setCanRedo(false);
 }, [captureSnapshot]);

 const rebuildFromSnapshot = useCallback((snap: FullSnapshot, selectId: string | null = null) => {
 const t = threeRef.current;
 if (!t) return;
 const { THREE } = t;
 t.transform.detach();
 for (const [, obj] of t.meshes) {
 if (obj.isMesh) { t.scene.remove(obj); obj.geometry?.dispose?.(); obj.material?.dispose?.(); }
 else t.scene.remove(obj);
 }
 t.meshes.clear(); groupsRef.current.clear(); setGroupIds([]);
 const nextObjs: SceneObj[] = [];
 for (const item of snap.objects) {
 const mat = makeMaterial(THREE, item.color);
 const geo = makeGeometry(THREE, item.kind);
 const mesh = new THREE.Mesh(geo, mat);
 mesh.castShadow = true; mesh.receiveShadow = true;
 mesh.position.fromArray(item.position);
 mesh.rotation.set(item.rotation[0], item.rotation[1], item.rotation[2]);
 mesh.scale.fromArray(item.scale);
 mesh.userData = { id: item.id, kind: item.kind };
 t.scene.add(mesh); t.meshes.set(item.id, mesh);
 nextObjs.push({ id: item.id, name: item.name, kind: item.kind, color: item.color });
 }
 const restoredGroupIds: string[] = [];
 for (const g of snap.groups || []) {
 const group = new THREE.Group();
 group.position.fromArray(g.position);
 group.rotation.set(g.rotation[0], g.rotation[1], g.rotation[2]);
 group.scale.fromArray(g.scale);
 group.userData = { id: g.id, kind: "group" };
 t.scene.add(group);
 for (const cid of g.childIds) { const m = t.meshes.get(cid); if (m) group.attach(m); }
 groupsRef.current.set(g.id, { childIds: [...g.childIds], groupObj: group });
 t.meshes.set(g.id, group as any);
 nextObjs.push({ id: g.id, name: g.name, kind: "box" as ShapeKind, color: "#a78bfa" });
 restoredGroupIds.push(g.id);
 }
 setGroupIds(restoredGroupIds);
 setObjects(nextObjs); objectsRef.current = nextObjs;
 if (selectId && t.meshes.has(selectId)) {
 setSelectedId(selectId); selectedIdRef.current = selectId;
 setSelectedIds([selectId]); selectedIdsRef.current = [selectId];
 const g = groupsRef.current.get(selectId);
 t.transform.attach(g?.groupObj || t.meshes.get(selectId));
 t.transform.setMode(modeRef.current);
 if (!g) {
 const mesh = t.meshes.get(selectId);
 const meta = nextObjs.find((o) => o.id === selectId);
 if (mesh && meta) {
 const b = BASE_SIZE[meta.kind];
 const clean = (n: number, d: number) => {
 const r = Math.round(n * 10 ** d) / 10 ** d;
 return Math.abs(r) < 1 / 10 ** d / 2 ? 0 : r;
 };
 const sx = clampSize(clean(b[0] * mesh.scale.x, 2));
 const sy = clampSize(clean(b[1] * mesh.scale.y, 2));
 const sz = clampSize(clean(b[2] * mesh.scale.z, 2));
 setSize([sx, sy, sz]);
 setPos([clean(mesh.position.x, 3), clean(mesh.position.y - sy / 2, 3), clean(mesh.position.z, 3)]);
 setRotDeg([normDeg(radToDeg(mesh.rotation.x)), normDeg(radToDeg(mesh.rotation.y)), normDeg(radToDeg(mesh.rotation.z))]);
 }
 } else {
 setSize([1, 1, 1]); setPos([0, 0, 0]); setRotDeg([0, 0, 0]);
 }
 } else {
 setSelectedId(null); selectedIdRef.current = null;
 setSelectedIds([]); selectedIdsRef.current = [];
 setSize([1, 1, 1]); setPos([0, 0, 0]); setRotDeg([0, 0, 0]);
 }
 }, []);

 const readTransform = useCallback((id: string | null) => {
 const t = threeRef.current;
 if (!t || !id) { setSize([1, 1, 1]); setPos([0, 0, 0]); setRotDeg([0, 0, 0]); return; }
 const mesh = t.meshes.get(id);
 const meta = objectsRef.current.find((o) => o.id === id);
 if (!mesh || !meta || groupsRef.current.has(id)) return;
 const b = BASE_SIZE[meta.kind];
 const clean = (n: number, digits: number) => {
 const r = Math.round(n * 10 ** digits) / 10 ** digits;
 return Math.abs(r) < 1 / 10 ** digits / 2 ? 0 : r;
 };
 const sx = clampSize(clean(b[0] * mesh.scale.x, 2));
 const sy = clampSize(clean(b[1] * mesh.scale.y, 2));
 const sz = clampSize(clean(b[2] * mesh.scale.z, 2));
 setSize([sx, sy, sz]);
 const floorY = mesh.position.y - sy / 2;
 setPos([clean(mesh.position.x, 3), clean(floorY, 3), clean(mesh.position.z, 3)]);
 setRotDeg([
 normDeg(radToDeg(mesh.rotation.x)),
 normDeg(radToDeg(mesh.rotation.y)),
 normDeg(radToDeg(mesh.rotation.z)),
 ]);
 }, []);

 const selectMesh = useCallback((id: string | null, opts?: { additive?: boolean }) => {
 const t = threeRef.current;
 setCtxMenu(null);
 if (!id) {
 setSelectedId(null); selectedIdRef.current = null;
 setSelectedIds([]); selectedIdsRef.current = [];
 if (t) t.transform.detach();
 setSize([1, 1, 1]); setPos([0, 0, 0]); setRotDeg([0, 0, 0]);
 return;
 }
 const next = opts?.additive
 ? (selectedIdsRef.current.includes(id) ? selectedIdsRef.current.filter((x) => x !== id) : [...selectedIdsRef.current, id])
 : [id];
 setSelectedIds(next); selectedIdsRef.current = next;
 const primary = next[next.length - 1] || null;
 setSelectedId(primary); selectedIdRef.current = primary;
 if (!t || !primary) return;
 const g = groupsRef.current.get(primary);
 const target = g?.groupObj || t.meshes.get(primary);
 if (target) { t.transform.attach(target); t.transform.setMode(modeRef.current); if (!g) readTransform(primary); }
 }, [readTransform]);

 const applySize = useCallback((next: [number, number, number]) => {
 setSize(next);
 }, []);

 const setSizeAxis = useCallback((axis: 0 | 1 | 2, value: number) => {
 const v = clampSize(value);
 setSize((prev) => {
 const next: [number, number, number] = uniformScale ? [v, v, v] : ([...prev] as [number, number, number]);
 if (!uniformScale) next[axis] = v;
 const t = threeRef.current;
 const ids = selectedIdsRef.current.filter((id) => t?.meshes.has(id) && !groupsRef.current.has(id));
 if (t && ids.length) {
 if (!sizeHistPushedRef.current) { pushHistory(); sizeHistPushedRef.current = true; }
 for (const id of ids) {
 const mesh = t.meshes.get(id); const meta = objectsRef.current.find((o) => o.id === id);
 if (!mesh || !meta) continue;
 const b = BASE_SIZE[meta.kind];
 const oldHalf = (b[1] * mesh.scale.y) / 2;
 mesh.scale.set(clampSize(next[0]) / b[0], clampSize(next[1]) / b[1], clampSize(next[2]) / b[2]);
 const newHalf = (b[1] * mesh.scale.y) / 2;
 mesh.position.y = mesh.position.y - oldHalf + newHalf;
 }
 }
 return next;
 });
 }, [pushHistory, uniformScale]);

 const setPosAxis = useCallback((axis: 0 | 1 | 2, value: number, opts: { snap?: boolean } = {}) => {
 const useSnap = opts.snap !== false;
 const final = useSnap ? snapVal(clampPos(value), snap) : value;
 const t = threeRef.current;
 const ids = selectedIdsRef.current.filter((id) => t?.meshes.has(id) && !groupsRef.current.has(id));
 if (t && ids.length) {
 if (!transformHistPushedRef.current) { pushHistory(); transformHistPushedRef.current = true; }
 for (const id of ids) {
 const mesh = t.meshes.get(id); const meta = objectsRef.current.find((o) => o.id === id);
 if (!mesh || !meta) continue;
 if (axis === 1) {
 const halfH = (BASE_SIZE[meta.kind][1] * mesh.scale.y) / 2;
 mesh.position.y = final + halfH;
 } else if (axis === 0) mesh.position.x = final;
 else mesh.position.z = final;
 }
 }
 setPos((prev) => {
 const n: [number, number, number] = [...prev] as any;
 n[axis] = final;
 return n;
 });
 }, [pushHistory, snap]);

 const setRotAxis = useCallback((axis: 0 | 1 | 2, value: number) => {
 const deg = normDeg(value);
 const t = threeRef.current;
 const ids = selectedIdsRef.current.filter((id) => t?.meshes.has(id) && !groupsRef.current.has(id));
 if (t && ids.length) {
 if (!transformHistPushedRef.current) { pushHistory(); transformHistPushedRef.current = true; }
 for (const id of ids) {
 const mesh = t.meshes.get(id);
 if (!mesh) continue;
 if (axis === 0) mesh.rotation.x = degToRad(deg);
 else if (axis === 1) mesh.rotation.y = degToRad(deg);
 else mesh.rotation.z = degToRad(deg);
 }
 }
 setRotDeg((prev) => {
 const n: [number, number, number] = [...prev] as any;
 n[axis] = deg;
 return n;
 });
 }, [pushHistory]);

 const endTransformEdit = useCallback(() => {
 transformHistPushedRef.current = false;
 }, []);

 const createMesh = useCallback((kind: ShapeKind, opts: { color: string; name?: string; position?: [number, number, number]; rotation?: [number, number, number]; scale?: [number, number, number]; recordHistory?: boolean }) => {
 const t = threeRef.current; if (!t) return null;
 const { THREE } = t;
 if (opts.recordHistory !== false) pushHistory();
 const id = nextId();
 const base = es ? NAME_PAIR[kind][1] : NAME_PAIR[kind][0];
 const count = objectsRef.current.filter((o) => o.kind === kind).length + 1;
 const name = opts.name ?? `${base} ${count}`;
 const mat = makeMaterial(THREE, opts.color);
 const geo = makeGeometry(THREE, kind);
 const mesh = new THREE.Mesh(geo, mat);
 mesh.castShadow = true; mesh.receiveShadow = true;
 if (opts.position) mesh.position.fromArray(opts.position);
 else {
 const halfY = BASE_SIZE[kind][1] / 2;
 mesh.position.set(0, halfY, 0);
 }
 if (opts.rotation) mesh.rotation.set(opts.rotation[0], opts.rotation[1], opts.rotation[2]);
 if (opts.scale) mesh.scale.fromArray(opts.scale);
 mesh.userData = { id, kind };
 t.scene.add(mesh); t.meshes.set(id, mesh);
 const entry: SceneObj = { id, name, kind, color: opts.color };
 setObjects((prev) => { const next = [...prev, entry]; objectsRef.current = next; return next; });
 selectMesh(id);
 return id;
 }, [es, pushHistory, selectMesh]);

 const addShape = useCallback((kind: ShapeKind) => { createMesh(kind, { color }); }, [color, createMesh]);

 const deleteSelected = useCallback(() => {
 const t = threeRef.current;
 const ids = [...selectedIdsRef.current];
 if (!t || !ids.length) return;
 pushHistory();
 t.transform.detach();
 const removeIds = new Set<string>();
 for (const id of ids) {
 const g = groupsRef.current.get(id);
 if (g) {
 for (const cid of g.childIds) {
 const m = t.meshes.get(cid);
 if (m) { m.parent?.remove(m); m.geometry?.dispose?.(); m.material?.dispose?.(); t.meshes.delete(cid); }
 removeIds.add(cid);
 }
 t.scene.remove(g.groupObj); t.meshes.delete(id); groupsRef.current.delete(id);
 removeIds.add(id);
 } else {
 const m = t.meshes.get(id);
 if (m) {
 (m.parent && m.parent !== t.scene ? m.parent.remove(m) : t.scene.remove(m));
 if (m.isMesh) { m.geometry?.dispose?.(); m.material?.dispose?.(); }
 t.meshes.delete(id);
 }
 removeIds.add(id);
 }
 }
 setGroupIds((p) => p.filter((x) => !removeIds.has(x)));
 setObjects((prev) => { const next = prev.filter((o) => !removeIds.has(o.id)); objectsRef.current = next; return next; });
 selectMesh(null);
 }, [pushHistory, selectMesh]);

 const applyColor = useCallback((hex: string) => {
 setColor(hex);
 const t = threeRef.current;
 const ids = selectedIdsRef.current.filter((id) => t?.meshes.has(id) && !groupsRef.current.has(id));
 if (!t || !ids.length) return;
 pushHistory();
 for (const id of ids) {
 const mesh = t.meshes.get(id);
 if (mesh?.material) {
 mesh.material.color?.set?.(hex);
 if (mesh.material.emissive) mesh.material.emissive.set(hex);
 }
 setObjects((prev) => {
 const next = prev.map((o) => (o.id === id ? { ...o, color: hex } : o));
 objectsRef.current = next;
 return next;
 });
 }
 }, [pushHistory]);

 const groupSelected = useCallback(() => {
 const t = threeRef.current;
 const ids = selectedIdsRef.current.filter((id) => t?.meshes.has(id) && !groupsRef.current.has(id));
 if (!t || ids.length < 2) return;
 pushHistory();
 const { THREE } = t;
 const group = new THREE.Group();
 const box = new THREE.Box3();
 for (const id of ids) {
 const m = t.meshes.get(id);
 if (m) box.expandByObject(m);
 }
 const center = box.getCenter(new THREE.Vector3());
 group.position.copy(center);
 t.scene.add(group);
 for (const id of ids) {
 const m = t.meshes.get(id);
 if (m) group.attach(m);
 }
 const gid = nextId();
 const name = es ? `Grupo ${groupsRef.current.size + 1}` : `Group ${groupsRef.current.size + 1}`;
 groupsRef.current.set(gid, { childIds: ids, groupObj: group });
 t.meshes.set(gid, group as any);
 group.userData = { id: gid, kind: "group" };
 setGroupIds((p) => [...p, gid]);
 setObjects((prev) => {
 const next = [...prev, { id: gid, name, kind: "box" as ShapeKind, color: "#a78bfa" }];
 objectsRef.current = next;
 return next;
 });
 selectMesh(gid);
 }, [es, pushHistory, selectMesh]);

 const ungroupSelected = useCallback(() => {
 const t = threeRef.current;
 const ids = selectedIdsRef.current.filter((id) => groupsRef.current.has(id));
 if (!t || !ids.length) return;
 pushHistory();
 const released: string[] = [];
 for (const gid of ids) {
 const g = groupsRef.current.get(gid);
 if (!g) continue;
 for (const cid of g.childIds) {
 const m = t.meshes.get(cid);
 if (m) t.scene.attach(m);
 released.push(cid);
 }
 t.scene.remove(g.groupObj);
 t.meshes.delete(gid);
 groupsRef.current.delete(gid);
 }
 setGroupIds((p) => p.filter((x) => !ids.includes(x)));
 setObjects((prev) => {
 const next = prev.filter((o) => !ids.includes(o.id));
 objectsRef.current = next;
 return next;
 });
 selectMesh(released[0] || null);
 }, [pushHistory, selectMesh]);

 const undo = useCallback(() => {
 if (historyRef.current.length === 0) return;
 const current = captureSnapshot(); const prev = historyRef.current.pop()!;
 futureRef.current.push(current);
 setCanUndo(historyRef.current.length > 0); setCanRedo(futureRef.current.length > 0);
 skipHistoryRef.current = true; rebuildFromSnapshot(prev, selectedIdRef.current); skipHistoryRef.current = false;
 }, [captureSnapshot, rebuildFromSnapshot]);

 const redo = useCallback(() => {
 if (futureRef.current.length === 0) return;
 const current = captureSnapshot(); const next = futureRef.current.pop()!;
 historyRef.current.push(current);
 setCanUndo(true); setCanRedo(futureRef.current.length > 0);
 skipHistoryRef.current = true; rebuildFromSnapshot(next, selectedIdRef.current); skipHistoryRef.current = false;
 }, [captureSnapshot, rebuildFromSnapshot]);

 const toggleFullscreen = useCallback(async () => {
 const el = studioRef.current;
 if (!el) return;
 try {
 if (!document.fullscreenElement) { await el.requestFullscreen(); setFullscreen(true); }
 else { await document.exitFullscreen(); setFullscreen(false); }
 } catch { /* */ }
 }, []);

 useEffect(() => {
 const onFs = () => setFullscreen(!!document.fullscreenElement);
 document.addEventListener("fullscreenchange", onFs);
 return () => document.removeEventListener("fullscreenchange", onFs);
 }, []);

 return {
 es, objects, selectedId, selectedIds, groupIds, ctxMenu, setCtxMenu, mode, setMode,
 color, setColor, fullscreen, ready, setReady, error, setError,
 canUndo, canRedo, size, pos, rotDeg, snap, setSnap, mountRef, studioRef, threeRef,
 sizeHistPushedRef, selectedIdRef, selectedIdsRef, groupsRef, marqueeRef,
 modeRef, gridRef, pushHistory, setPosAxis, setRotAxis, endTransformEdit, setSizeAxis,
 addShape, deleteSelected, applyColor, groupSelected, ungroupSelected, undo, redo, toggleFullscreen,
 setSelectedId, setSelectedIds, readTransform,
 };
}
