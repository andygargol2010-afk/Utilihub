import { useCallback, useEffect, useRef, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";
import {
  ALL_KINDS, BASE_SIZE, COLORS, HISTORY_MAX, NAME_PAIR, STORAGE_KEY,
  clampPos, clampSize, degToRad, makeGeometry, makeMaterial, radToDeg, shapeList, snapVal,
  type ShapeKind,
} from "./modeler3d-helpers";

type Mode = "translate" | "rotate" | "scale";
type SceneObj = { id: string; name: string; kind: ShapeKind; color: string };
type MeshSnapshot = { id: string; name: string; kind: ShapeKind; color: string; position: [number, number, number]; rotation: [number, number, number]; scale: [number, number, number] };
type ClipboardItem = { kind: ShapeKind; color: string; name: string; position: [number, number, number]; rotation: [number, number, number]; scale: [number, number, number] };

let idSeq = 1;
function nextId() { return `obj-${idSeq++}`; }

export function Modeler3D({ locale = "en" }: { tool: GeneralTool; locale?: "en" | "es" }) {
  const es = locale === "es";
  const mountRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<HTMLDivElement>(null);
  const threeRef = useRef<{ THREE: any; scene: any; camera: any; renderer: any; controls: any; transform: any; meshes: Map<string, any>; anim: number } | null>(null);
  const [objects, setObjects] = useState<SceneObj[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [groupIds, setGroupIds] = useState<string[]>([]);
  const [ctxMenu, setCtxMenu] = useState<{ x: number; y: number } | null>(null);
  const [mode, setMode] = useState<Mode>("translate");
  const [color, setColor] = useState("#a78bfa");
  const [fullscreen, setFullscreen] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [showAxes, setShowAxes] = useState(true);
  const [size, setSize] = useState<[number, number, number]>([1, 1, 1]);
  const [uniformScale, setUniformScale] = useState(true);
  const [pos, setPos] = useState<[number, number, number]>([0, 0.55, 0]);
  const [rotDeg, setRotDeg] = useState<[number, number, number]>([0, 0, 0]);
  const [snap, setSnap] = useState(0.25);
  const [editingNameId, setEditingNameId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [metalness, setMetalness] = useState(0.18);
  const [roughness, setRoughness] = useState(0.32);
  const [wireframe, setWireframe] = useState(false);
  const sizeHistPushedRef = useRef(false);
  const transformHistPushedRef = useRef(false);
  const snapRef = useRef(0.25);
  const selectedIdRef = useRef<string | null>(null);
  const selectedIdsRef = useRef<string[]>([]);
  const groupsRef = useRef<Map<string, { childIds: string[]; groupObj: any }>>(new Map());
  const marqueeRef = useRef<{ on: boolean; x0: number; y0: number; el: HTMLDivElement | null }>({ on: false, x0: 0, y0: 0, el: null });
  const modeRef = useRef<Mode>("translate");
  const objectsRef = useRef<SceneObj[]>([]);
  const historyRef = useRef<MeshSnapshot[][]>([]);
  const futureRef = useRef<MeshSnapshot[][]>([]);
  const clipboardRef = useRef<ClipboardItem | null>(null);
  const skipHistoryRef = useRef(false);
  const gridRef = useRef<any>(null);
  const axesRef = useRef<any>(null);
  selectedIdRef.current = selectedId;
  selectedIdsRef.current = selectedIds;
  modeRef.current = mode;
  objectsRef.current = objects;
  snapRef.current = snap;

  const captureSnapshot = useCallback((): MeshSnapshot[] => {
    const t = threeRef.current;
    if (!t) return [];
    return objectsRef.current.filter((o) => !groupsRef.current.has(o.id)).map((o) => {
      const mesh = t.meshes.get(o.id);
      if (!mesh) return { id: o.id, name: o.name, kind: o.kind, color: o.color, position: [0, 0.5, 0] as [number, number, number], rotation: [0, 0, 0] as [number, number, number], scale: [1, 1, 1] as [number, number, number] };
      return { id: o.id, name: o.name, kind: o.kind, color: `#${mesh.material?.color?.getHexString?.() || "a78bfa"}`, position: mesh.position.toArray() as [number, number, number], rotation: [mesh.rotation.x, mesh.rotation.y, mesh.rotation.z] as [number, number, number], scale: mesh.scale.toArray() as [number, number, number] };
    });
  }, []);

  const pushHistory = useCallback(() => {
    if (skipHistoryRef.current) return;
    historyRef.current.push(captureSnapshot());
    if (historyRef.current.length > HISTORY_MAX) historyRef.current.shift();
    futureRef.current = [];
    setCanUndo(historyRef.current.length > 0);
    setCanRedo(false);
  }, [captureSnapshot]);

  const rebuildFromSnapshot = useCallback((snap: MeshSnapshot[], selectId: string | null = null) => {
    const t = threeRef.current;
    if (!t) return;
    const { THREE } = t;
    t.transform.detach();
    for (const [, mesh] of t.meshes) { t.scene.remove(mesh); mesh.geometry?.dispose?.(); mesh.material?.dispose?.(); }
    t.meshes.clear(); groupsRef.current.clear(); setGroupIds([]);
    const nextObjs: SceneObj[] = [];
    for (const item of snap) {
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
    setObjects(nextObjs); objectsRef.current = nextObjs;
    if (selectId && t.meshes.has(selectId)) {
      setSelectedId(selectId); selectedIdRef.current = selectId;
      setSelectedIds([selectId]); selectedIdsRef.current = [selectId];
      t.transform.attach(t.meshes.get(selectId)); t.transform.setMode(modeRef.current);
    } else { setSelectedId(null); selectedIdRef.current = null; setSelectedIds([]); selectedIdsRef.current = []; }
  }, []);

  const readTransform = useCallback((id: string | null) => {
    const t = threeRef.current;
    if (!t || !id) { setSize([1, 1, 1]); setPos([0, 0.55, 0]); setRotDeg([0, 0, 0]); return; }
    const mesh = t.meshes.get(id);
    const meta = objectsRef.current.find((o) => o.id === id);
    if (!mesh || !meta || groupsRef.current.has(id)) return;
    const b = BASE_SIZE[meta.kind];
    setSize([clampSize(b[0] * mesh.scale.x), clampSize(b[1] * mesh.scale.y), clampSize(b[2] * mesh.scale.z)]);
    setPos([Math.round(mesh.position.x * 1000) / 1000, Math.round(mesh.position.y * 1000) / 1000, Math.round(mesh.position.z * 1000) / 1000]);
    setRotDeg([Math.round(radToDeg(mesh.rotation.x) * 10) / 10, Math.round(radToDeg(mesh.rotation.y) * 10) / 10, Math.round(radToDeg(mesh.rotation.z) * 10) / 10]);
    if (mesh.material) {
      setMetalness(typeof mesh.material.metalness === "number" ? mesh.material.metalness : 0.18);
      setRoughness(typeof mesh.material.roughness === "number" ? mesh.material.roughness : 0.32);
    }
  }, []);

  const selectMesh = useCallback((id: string | null, opts?: { additive?: boolean }) => {
    const t = threeRef.current;
    setCtxMenu(null);
    if (!id) {
      setSelectedId(null); selectedIdRef.current = null;
      setSelectedIds([]); selectedIdsRef.current = [];
      if (t) t.transform.detach();
      setSize([1, 1, 1]); setPos([0, 0.55, 0]); setRotDeg([0, 0, 0]);
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
    const t = threeRef.current; const id = selectedIdRef.current;
    if (!t || !id || groupsRef.current.has(id)) return;
    const mesh = t.meshes.get(id); const meta = objectsRef.current.find((o) => o.id === id);
    if (!mesh || !meta) return;
    pushHistory();
    const b = BASE_SIZE[meta.kind];
    mesh.scale.set(clampSize(next[0]) / b[0], clampSize(next[1]) / b[1], clampSize(next[2]) / b[2]);
    setSize([clampSize(next[0]), clampSize(next[1]), clampSize(next[2])]);
  }, [pushHistory]);

  const setPosAxis = useCallback((axis: 0 | 1 | 2, value: number) => {
    const t = threeRef.current; const id = selectedIdRef.current;
    if (!t || !id) return;
    const mesh = t.meshes.get(id); if (!mesh) return;
    if (!transformHistPushedRef.current) { pushHistory(); transformHistPushedRef.current = true; }
    const next: [number, number, number] = [mesh.position.x, mesh.position.y, mesh.position.z];
    next[axis] = snapVal(clampPos(value), snap);
    mesh.position.set(next[0], next[1], next[2]);
    setPos([Math.round(next[0] * 1000) / 1000, Math.round(next[1] * 1000) / 1000, Math.round(next[2] * 1000) / 1000]);
  }, [pushHistory, snap]);

  const setRotAxis = useCallback((axis: 0 | 1 | 2, value: number) => {
    const t = threeRef.current; const id = selectedIdRef.current;
    if (!t || !id) return;
    const mesh = t.meshes.get(id); if (!mesh) return;
    if (!transformHistPushedRef.current) { pushHistory(); transformHistPushedRef.current = true; }
    const next: [number, number, number] = [radToDeg(mesh.rotation.x), radToDeg(mesh.rotation.y), radToDeg(mesh.rotation.z)];
    next[axis] = value;
    mesh.rotation.set(degToRad(next[0]), degToRad(next[1]), degToRad(next[2]));
    setRotDeg([Math.round(next[0] * 10) / 10, Math.round(next[1] * 10) / 10, Math.round(next[2] * 10) / 10]);
  }, [pushHistory]);

  const endTransformEdit = useCallback(() => { transformHistPushedRef.current = false; }, []);

  const setSizeAxis = useCallback((axis: 0 | 1 | 2, value: number) => {
    const v = clampSize(value);
    setSize((prev) => {
      const next: [number, number, number] = uniformScale ? [v, v, v] : ([...prev] as [number, number, number]);
      if (!uniformScale) next[axis] = v;
      const t = threeRef.current; const id = selectedIdRef.current;
      if (t && id && !groupsRef.current.has(id)) {
        const mesh = t.meshes.get(id); const meta = objectsRef.current.find((o) => o.id === id);
        if (mesh && meta) {
          if (!sizeHistPushedRef.current) { pushHistory(); sizeHistPushedRef.current = true; }
          const b = BASE_SIZE[meta.kind];
          mesh.scale.set(clampSize(next[0]) / b[0], clampSize(next[1]) / b[1], clampSize(next[2]) / b[2]);
        }
      }
      return next;
    });
  }, [pushHistory, uniformScale]);

  const createMesh = useCallback((kind: ShapeKind, opts: { color: string; name?: string; position?: [number, number, number]; rotation?: [number, number, number]; scale?: [number, number, number]; recordHistory?: boolean }) => {
    const t = threeRef.current; if (!t) return null;
    const { THREE } = t;
    if (opts.recordHistory !== false) pushHistory();
    const id = nextId();
    const base = es ? NAME_PAIR[kind][1] : NAME_PAIR[kind][0];
    const count = objectsRef.current.filter((o) => o.kind === kind).length + 1;
    const name = opts.name ?? `${base} ${count}`;
    const mat = makeMaterial(THREE, opts.color, metalness, roughness);
    const geo = makeGeometry(THREE, kind);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true; mesh.receiveShadow = true;
    if (mesh.material) mesh.material.wireframe = wireframe;
    if (opts.position) mesh.position.fromArray(opts.position);
    else mesh.position.set((Math.random() - 0.5) * 1.2, kind === "plane" ? 0.03 : 0.55, (Math.random() - 0.5) * 1.2);
    if (opts.rotation) mesh.rotation.set(opts.rotation[0], opts.rotation[1], opts.rotation[2]);
    if (opts.scale) mesh.scale.fromArray(opts.scale);
    mesh.userData = { id, kind };
    t.scene.add(mesh); t.meshes.set(id, mesh);
    const entry: SceneObj = { id, name, kind, color: opts.color };
    setObjects((prev) => { const next = [...prev, entry]; objectsRef.current = next; return next; });
    selectMesh(id);
    return id;
  }, [es, metalness, pushHistory, roughness, selectMesh, wireframe]);

  const addShape = useCallback((kind: ShapeKind) => { createMesh(kind, { color }); }, [color, createMesh]);

  const deleteSelected = useCallback(() => {
    const t = threeRef.current;
    const ids = [...selectedIdsRef.current];
    if (!t || !ids.length) return;
    pushHistory();
    t.transform.detach();
    for (const id of ids) {
      const g = groupsRef.current.get(id);
      if (g) {
        for (const cid of g.childIds) {
          const m = t.meshes.get(cid);
          if (m) { m.parent?.remove(m); m.geometry?.dispose?.(); m.material?.dispose?.(); t.meshes.delete(cid); }
        }
        t.scene.remove(g.groupObj); t.meshes.delete(id); groupsRef.current.delete(id);
        setGroupIds((p) => p.filter((x) => x !== id));
        setObjects((prev) => { const next = prev.filter((o) => o.id !== id && !g.childIds.includes(o.id)); objectsRef.current = next; return next; });
      } else {
        const m = t.meshes.get(id);
        if (m) { (m.parent && m.parent !== t.scene ? m.parent.remove(m) : t.scene.remove(m)); m.geometry?.dispose?.(); m.material?.dispose?.(); t.meshes.delete(id); }
        setObjects((prev) => { const next = prev.filter((o) => o.id !== id); objectsRef.current = next; return next; });
      }
    }
    selectMesh(null);
  }, [pushHistory, selectMesh]);

  const clearScene = useCallback(() => {
    const t = threeRef.current;
    if (!t || objectsRef.current.length === 0) return;
    pushHistory();
    t.transform.detach();
    for (const [, mesh] of t.meshes) { t.scene.remove(mesh); mesh.geometry?.dispose?.(); mesh.material?.dispose?.(); }
    t.meshes.clear(); groupsRef.current.clear(); setGroupIds([]);
    setObjects([]); objectsRef.current = []; selectMesh(null);
  }, [pushHistory, selectMesh]);

  const applyColor = useCallback((hex: string) => {
    setColor(hex);
    const t = threeRef.current; const id = selectedIdRef.current;
    if (!t || !id) return;
    const mesh = t.meshes.get(id); if (!mesh?.material) return;
    pushHistory(); mesh.material.color.set(hex);
    setObjects((prev) => { const next = prev.map((o) => (o.id === id ? { ...o, color: hex } : o)); objectsRef.current = next; return next; });
  }, [pushHistory]);

  const copySelected = useCallback(() => {
    const t = threeRef.current; const id = selectedIdRef.current;
    if (!t || !id || groupsRef.current.has(id)) return;
    const mesh = t.meshes.get(id); const meta = objectsRef.current.find((o) => o.id === id);
    if (!mesh || !meta) return;
    clipboardRef.current = { kind: meta.kind, color: `#${mesh.material.color.getHexString()}`, name: meta.name, position: mesh.position.toArray() as [number, number, number], rotation: [mesh.rotation.x, mesh.rotation.y, mesh.rotation.z], scale: mesh.scale.toArray() as [number, number, number] };
  }, []);

  const pasteClipboard = useCallback(() => {
    const clip = clipboardRef.current; if (!clip) return;
    createMesh(clip.kind, { color: clip.color, name: `${clip.name} ${es ? "copia" : "copy"}`, position: [clip.position[0] + 0.45, clip.position[1], clip.position[2] + 0.45], rotation: clip.rotation, scale: clip.scale });
  }, [createMesh, es]);

  const duplicateSelected = useCallback(() => {
    const t = threeRef.current; const id = selectedIdRef.current;
    if (!t || !id || groupsRef.current.has(id)) return;
    const mesh = t.meshes.get(id); const meta = objectsRef.current.find((o) => o.id === id);
    if (!mesh || !meta) return;
    const offset = snap > 0 ? Math.max(snap, 0.25) : 0.45;
    createMesh(meta.kind, { color: `#${mesh.material.color.getHexString()}`, name: `${meta.name} ${es ? "copia" : "copy"}`, position: [mesh.position.x + offset, mesh.position.y, mesh.position.z + offset], rotation: [mesh.rotation.x, mesh.rotation.y, mesh.rotation.z], scale: mesh.scale.toArray() as [number, number, number] });
  }, [createMesh, es, snap]);

  const renameObject = useCallback((id: string, name: string) => {
    const trimmed = name.trim() || (es ? "Sin nombre" : "Untitled");
    setObjects((prev) => { const next = prev.map((o) => (o.id === id ? { ...o, name: trimmed } : o)); objectsRef.current = next; return next; });
    setEditingNameId(null);
  }, [es]);

  const groupSelected = useCallback(() => {
    const t = threeRef.current;
    const ids = selectedIdsRef.current.filter((id) => t?.meshes.has(id) && !groupsRef.current.has(id));
    if (!t || ids.length < 2) return;
    pushHistory();
    const { THREE } = t;
    const group = new THREE.Group();
    const box = new THREE.Box3();
    for (const id of ids) { const m = t.meshes.get(id); if (m) box.expandByObject(m); }
    group.position.copy(box.getCenter(new THREE.Vector3()));
    t.scene.add(group);
    for (const id of ids) { const m = t.meshes.get(id); if (m) group.attach(m); }
    const gid = nextId();
    group.userData = { id: gid, kind: "group" };
    const gname = `${es ? "Grupo" : "Group"} ${groupsRef.current.size + 1}`;
    groupsRef.current.set(gid, { childIds: ids, groupObj: group });
    setGroupIds((p) => [...p, gid]);
    t.meshes.set(gid, group as any);
    setObjects((prev) => { const next = [...prev, { id: gid, name: gname, kind: "box" as ShapeKind, color: "#a78bfa" }]; objectsRef.current = next; return next; });
    setSelectedIds([gid]); selectedIdsRef.current = [gid];
    setSelectedId(gid); selectedIdRef.current = gid;
    t.transform.attach(group); t.transform.setMode(modeRef.current);
    setCtxMenu(null);
  }, [es, pushHistory]);

  const ungroupSelected = useCallback(() => {
    const t = threeRef.current;
    if (!t) return;
    const targets = selectedIdsRef.current.filter((id) => groupsRef.current.has(id));
    if (!targets.length) return;
    pushHistory();
    const released: string[] = [];
    for (const gid of targets) {
      const g = groupsRef.current.get(gid)!;
      for (const cid of g.childIds) {
        const m = t.meshes.get(cid);
        if (m) { t.scene.attach(m); released.push(cid); }
      }
      t.scene.remove(g.groupObj); t.meshes.delete(gid); groupsRef.current.delete(gid);
      setGroupIds((p) => p.filter((x) => x !== gid));
      setObjects((prev) => { const next = prev.filter((o) => o.id !== gid); objectsRef.current = next; return next; });
    }
    setSelectedIds(released); selectedIdsRef.current = released;
    const primary = released[0] || null;
    setSelectedId(primary); selectedIdRef.current = primary;
    if (primary && t.meshes.has(primary)) t.transform.attach(t.meshes.get(primary));
    else t.transform.detach();
    setCtxMenu(null);
  }, [pushHistory]);

  const applyMetalness = useCallback((v: number) => {
    const val = Math.min(1, Math.max(0, v)); setMetalness(val);
    const t = threeRef.current; const id = selectedIdRef.current;
    if (!t || !id) return;
    const mesh = t.meshes.get(id); if (!mesh?.material) return;
    pushHistory(); mesh.material.metalness = val;
  }, [pushHistory]);

  const applyRoughness = useCallback((v: number) => {
    const val = Math.min(1, Math.max(0, v)); setRoughness(val);
    const t = threeRef.current; const id = selectedIdRef.current;
    if (!t || !id) return;
    const mesh = t.meshes.get(id); if (!mesh?.material) return;
    pushHistory(); mesh.material.roughness = val;
  }, [pushHistory]);

  const setCameraPreset = useCallback((preset: "iso" | "front" | "top" | "side") => {
    const t = threeRef.current; if (!t) return;
    if (preset === "iso") t.camera.position.set(3.6, 2.8, 4.6);
    else if (preset === "front") t.camera.position.set(0, 1.2, 6);
    else if (preset === "top") t.camera.position.set(0, 8, 0.01);
    else t.camera.position.set(6, 1.2, 0);
    t.controls.target.set(0, 0.55, 0); t.controls.update();
  }, []);

  const frameSelected = useCallback(() => {
    const t = threeRef.current;
    if (!t) return;
    const id = selectedIdRef.current;
    const mesh = id ? t.meshes.get(id) : null;
    if (mesh) {
      const box = new t.THREE.Box3().setFromObject(mesh);
      const center = box.getCenter(new t.THREE.Vector3());
      const size = box.getSize(new t.THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z, 0.5);
      const dist = maxDim * 2.8;
      t.controls.target.copy(center);
      t.camera.position.set(center.x + dist * 0.7, center.y + dist * 0.55, center.z + dist * 0.7);
      t.controls.update();
    } else {
      t.controls.target.set(0, 0.55, 0);
      t.camera.position.set(3.6, 2.8, 4.6);
      t.controls.update();
    }
  }, []);

  const toggleWireframe = useCallback(() => {
    setWireframe((prev) => {
      const next = !prev;
      const t = threeRef.current;
      if (t) for (const [, mesh] of t.meshes) if (mesh.material) mesh.material.wireframe = next;
      return next;
    });
  }, []);

  const saveLocal = useCallback(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, objects: captureSnapshot() })); } catch { /* */ }
  }, [captureSnapshot]);

  const loadLocal = useCallback(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY); if (!raw) return false;
      const data = JSON.parse(raw);
      const list = Array.isArray(data) ? data : data.objects;
      if (!Array.isArray(list) || list.length === 0) return false;
      pushHistory();
      const snap: MeshSnapshot[] = list.map((item: any, i: number) => ({
        id: typeof item.id === "string" ? item.id : `local-${i}`,
        name: item.name || `Object ${i + 1}`,
        kind: (ALL_KINDS.includes(item.kind) ? item.kind : "box") as ShapeKind,
        color: item.color || "#a78bfa",
        position: (item.position || [0, 0.5, 0]) as [number, number, number],
        rotation: (item.rotation || [0, 0, 0]) as [number, number, number],
        scale: (item.scale || [1, 1, 1]) as [number, number, number],
      }));
      skipHistoryRef.current = true; rebuildFromSnapshot(snap); skipHistoryRef.current = false;
      return true;
    } catch { return false; }
  }, [pushHistory, rebuildFromSnapshot]);

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
    setCanUndo(historyRef.current.length > 0); setCanRedo(futureRef.current.length > 0);
    skipHistoryRef.current = true; rebuildFromSnapshot(next, selectedIdRef.current); skipHistoryRef.current = false;
  }, [captureSnapshot, rebuildFromSnapshot]);

  const exportJson = useCallback(() => {
    const blob = new Blob([JSON.stringify({ version: 1, objects: captureSnapshot() }, null, 2)], { type: "application/json" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "utilihub-3d-scene.json"; a.click(); URL.revokeObjectURL(a.href);
  }, [captureSnapshot]);

  const importJson = useCallback(() => {
    const input = document.createElement("input"); input.type = "file"; input.accept = "application/json,.json";
    input.onchange = async () => {
      const file = input.files?.[0]; if (!file) return;
      try {
        const data = JSON.parse(await file.text());
        const list = Array.isArray(data) ? data : data.objects;
        if (!Array.isArray(list) || list.length === 0) return;
        pushHistory();
        const snap: MeshSnapshot[] = list.map((item: any, i: number) => ({
          id: typeof item.id === "string" ? item.id : `import-${i}-${Date.now()}`,
          name: item.name || `Object ${i + 1}`,
          kind: (ALL_KINDS.includes(item.kind) ? item.kind : "box") as ShapeKind,
          color: item.color || "#a78bfa",
          position: (item.position || [0, 0.5, 0]) as [number, number, number],
          rotation: (item.rotation || [0, 0, 0]) as [number, number, number],
          scale: (item.scale || [1, 1, 1]) as [number, number, number],
        }));
        skipHistoryRef.current = true; rebuildFromSnapshot(snap); skipHistoryRef.current = false;
      } catch (err) { console.error(err); }
    };
    input.click();
  }, [pushHistory, rebuildFromSnapshot]);

  const exportStl = useCallback(() => {
    const t = threeRef.current;
    if (!t || objectsRef.current.length === 0) return;
    let body = "";
    for (const o of objectsRef.current) {
      if (groupsRef.current.has(o.id)) continue;
      const mesh = t.meshes.get(o.id); if (!mesh?.geometry) continue;
      mesh.updateMatrixWorld(true);
      const geom = mesh.geometry.clone(); geom.applyMatrix4(mesh.matrixWorld);
      const pos = geom.attributes.position; const idx = geom.index;
      const writeTri = (ax: number, ay: number, az: number, bx: number, by: number, bz: number, cx: number, cy: number, cz: number) => {
        const nx = (by - ay) * (cz - az) - (bz - az) * (cy - ay);
        const ny = (bz - az) * (cx - ax) - (bx - ax) * (cz - az);
        const nz = (bx - ax) * (cy - ay) - (by - ay) * (cx - ax);
        const len = Math.hypot(nx, ny, nz) || 1;
        body += `  facet normal ${nx / len} ${ny / len} ${nz / len}\n    outer loop\n      vertex ${ax} ${ay} ${az}\n      vertex ${bx} ${by} ${bz}\n      vertex ${cx} ${cy} ${cz}\n    endloop\n  endfacet\n`;
      };
      if (idx) {
        for (let i = 0; i < idx.count; i += 3) {
          const ia = idx.getX(i), ib = idx.getX(i + 1), ic = idx.getX(i + 2);
          writeTri(pos.getX(ia), pos.getY(ia), pos.getZ(ia), pos.getX(ib), pos.getY(ib), pos.getZ(ib), pos.getX(ic), pos.getY(ic), pos.getZ(ic));
        }
      } else {
        for (let i = 0; i < pos.count; i += 3) {
          writeTri(pos.getX(i), pos.getY(i), pos.getZ(i), pos.getX(i + 1), pos.getY(i + 1), pos.getZ(i + 1), pos.getX(i + 2), pos.getY(i + 2), pos.getZ(i + 2));
        }
      }
      geom.dispose();
    }
    const blob = new Blob([`solid utilihub\n${body}endsolid utilihub\n`], { type: "model/stl" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "utilihub-model.stl"; a.click(); URL.revokeObjectURL(a.href);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const el = studioRef.current; if (!el) return;
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

  useEffect(() => { if (gridRef.current) gridRef.current.visible = showGrid; }, [showGrid]);
  useEffect(() => { if (axesRef.current) axesRef.current.visible = showAxes; }, [showAxes]);

  useEffect(() => {
    let cancelled = false;
    const mount = mountRef.current;
    if (!mount) return;
    (async () => {
      try {
        const THREE = await import("three");
        let OrbitControls: any, TransformControls: any;
        try {
          ({ OrbitControls } = await import("three/addons/controls/OrbitControls.js"));
          ({ TransformControls } = await import("three/addons/controls/TransformControls.js"));
        } catch {
          ({ OrbitControls } = await import("three/examples/jsm/controls/OrbitControls.js"));
          ({ TransformControls } = await import("three/examples/jsm/controls/TransformControls.js"));
        }
        if (cancelled || !mountRef.current) return;
        const width = mount.clientWidth || 640, height = mount.clientHeight || 400;
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0c0810);
        scene.fog = new THREE.FogExp2(0x0c0810, 0.035);
        const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 100);
        camera.position.set(3.6, 2.8, 4.6);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2.5));
        renderer.setSize(width, height);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        if ("outputColorSpace" in renderer) renderer.outputColorSpace = THREE.SRGBColorSpace;
        if ("toneMapping" in renderer) { renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.15; }
        mount.appendChild(renderer.domElement);
        Object.assign(renderer.domElement.style, { width: "100%", height: "100%", display: "block", borderRadius: "0.75rem", touchAction: "none" });
        scene.add(new THREE.HemisphereLight(0xffe4ec, 0x1a1020, 0.55));
        scene.add(new THREE.AmbientLight(0xffffff, 0.28));
        const key = new THREE.DirectionalLight(0xfff0f5, 1.35);
        key.position.set(5, 9, 4); key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
        key.shadow.camera.near = 0.5; key.shadow.camera.far = 30;
        key.shadow.camera.left = -8; key.shadow.camera.right = 8; key.shadow.camera.top = 8; key.shadow.camera.bottom = -8;
        key.shadow.bias = -0.0002; key.shadow.normalBias = 0.04; scene.add(key);
        const rim = new THREE.DirectionalLight(0xc4b5fd, 0.55); rim.position.set(-5, 3, -4); scene.add(rim);
        const floor = new THREE.Mesh(new THREE.CircleGeometry(6, 64), new THREE.MeshStandardMaterial({ color: 0x1a1220, metalness: 0.4, roughness: 0.65 }));
        floor.rotation.x = -Math.PI / 2; floor.position.y = -0.001; floor.receiveShadow = true; scene.add(floor);
        const grid = new THREE.GridHelper(10, 20, 0xf43f5e, 0x3f1d2e);
        if (Array.isArray(grid.material)) grid.material.forEach((m: any) => { m.transparent = true; m.opacity = 0.55; });
        else { grid.material.transparent = true; grid.material.opacity = 0.55; }
        scene.add(grid); gridRef.current = grid;
        const axes = new THREE.AxesHelper(1.35); axes.position.y = 0.01; scene.add(axes); axesRef.current = axes;
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true; controls.dampingFactor = 0.07; controls.maxPolarAngle = Math.PI * 0.49;
        controls.minDistance = 1.4; controls.maxDistance = 20; controls.target.set(0, 0.55, 0);
        const meshes = new Map();
        const transform = new TransformControls(camera, renderer.domElement);
        transform.setSize(0.9);
        transform.addEventListener("dragging-changed", (event: { value: boolean }) => {
          controls.enabled = !event.value;
          if (event.value) pushHistory();
        });
        if (typeof transform.getHelper === "function") scene.add(transform.getHelper()); else scene.add(transform);
        const raycaster = new THREE.Raycaster(); const pointer = new THREE.Vector2();
        const onPointer = (event: PointerEvent) => {
          if (transform.dragging || event.button === 2) return;
          const rect = renderer.domElement.getBoundingClientRect();
          pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
          pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
          raycaster.setFromCamera(pointer, camera);
          const hits = raycaster.intersectObjects([...meshes.values()].filter((m: any) => m.isMesh), true);
          if (hits.length > 0) {
            let obj: any = hits[0]!.object;
            while (obj && !obj.userData?.id && obj.parent) obj = obj.parent;
            const id = obj?.userData?.id as string; if (!id) return;
            const next = event.shiftKey
              ? (selectedIdsRef.current.includes(id) ? selectedIdsRef.current.filter((x) => x !== id) : [...selectedIdsRef.current, id])
              : [id];
            selectedIdsRef.current = next; setSelectedIds(next);
            const primary = next[next.length - 1]!;
            selectedIdRef.current = primary; setSelectedId(primary);
            const g = groupsRef.current.get(primary);
            const target = g?.groupObj || meshes.get(primary);
            if (target) transform.attach(target);
            transform.setMode(modeRef.current);
            setCtxMenu(null);
          } else {
            marqueeRef.current.on = true;
            marqueeRef.current.x0 = event.clientX - rect.left;
            marqueeRef.current.y0 = event.clientY - rect.top;
            if (!marqueeRef.current.el && mountRef.current) {
              const el = document.createElement("div");
              el.style.cssText = "position:absolute;border:1px solid rgba(244,63,94,.9);background:rgba(244,63,94,.15);pointer-events:none;z-index:30;display:none;";
              mountRef.current.appendChild(el);
              marqueeRef.current.el = el;
            }
            if (!event.shiftKey) {
              selectedIdsRef.current = []; setSelectedIds([]);
              selectedIdRef.current = null; setSelectedId(null); transform.detach();
            }
            setCtxMenu(null);
          }
        };
        const onPointerMove = (event: PointerEvent) => {
          if (!marqueeRef.current.on || !marqueeRef.current.el) return;
          const rect = renderer.domElement.getBoundingClientRect();
          const cx = event.clientX - rect.left, cy = event.clientY - rect.top;
          const x0 = Math.min(marqueeRef.current.x0, cx), y0 = Math.min(marqueeRef.current.y0, cy);
          const el = marqueeRef.current.el;
          el.style.display = "block"; el.style.left = x0 + "px"; el.style.top = y0 + "px";
          el.style.width = Math.abs(cx - marqueeRef.current.x0) + "px"; el.style.height = Math.abs(cy - marqueeRef.current.y0) + "px";
        };
        const onPointerUp = (event: PointerEvent) => {
          if (!marqueeRef.current.on) return;
          const rect = renderer.domElement.getBoundingClientRect();
          const cx = event.clientX - rect.left, cy = event.clientY - rect.top;
          const x0 = Math.min(marqueeRef.current.x0, cx), y0 = Math.min(marqueeRef.current.y0, cy);
          const x1 = Math.max(marqueeRef.current.x0, cx), y1 = Math.max(marqueeRef.current.y0, cy);
          marqueeRef.current.on = false;
          if (marqueeRef.current.el) marqueeRef.current.el.style.display = "none";
          if (x1 - x0 < 4 && y1 - y0 < 4) return;
          const found: string[] = [];
          for (const [id, mesh] of meshes) {
            if (!mesh.isMesh) continue;
            mesh.updateMatrixWorld(true);
            const c = new THREE.Box3().setFromObject(mesh).getCenter(new THREE.Vector3());
            c.project(camera);
            const sx = (c.x * 0.5 + 0.5) * rect.width, sy = (-c.y * 0.5 + 0.5) * rect.height;
            if (sx >= x0 && sx <= x1 && sy >= y0 && sy <= y1) found.push(id);
          }
          if (found.length) {
            const next = event.shiftKey ? Array.from(new Set([...selectedIdsRef.current, ...found])) : found;
            selectedIdsRef.current = next; setSelectedIds(next);
            const primary = next[next.length - 1]!;
            selectedIdRef.current = primary; setSelectedId(primary);
            if (meshes.has(primary)) { transform.attach(meshes.get(primary)); transform.setMode(modeRef.current); }
          }
        };
        const onContextMenu = (event: PointerEvent) => {
          event.preventDefault();
          const rect = renderer.domElement.getBoundingClientRect();
          setCtxMenu({ x: event.clientX - rect.left, y: event.clientY - rect.top });
        };
        renderer.domElement.addEventListener("pointerdown", onPointer);
        renderer.domElement.addEventListener("pointermove", onPointerMove);
        renderer.domElement.addEventListener("pointerup", onPointerUp);
        renderer.domElement.addEventListener("contextmenu", onContextMenu);
        const resize = () => {
          if (!mountRef.current) return;
          const w = mountRef.current.clientWidth, h = mountRef.current.clientHeight;
          if (w < 2 || h < 2) return;
          camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.setSize(w, h, false);
        };
        new ResizeObserver(resize).observe(mount);
        let anim = 0;
        const tick = () => { anim = requestAnimationFrame(tick); controls.update(); renderer.render(scene, camera); };
        tick();
        threeRef.current = { THREE, scene, camera, renderer, controls, transform, meshes, anim };
        setReady(true);
      } catch (e) {
        console.error(e);
        if (!cancelled) setError(es ? "No se pudo cargar el motor 3D." : "Could not load the 3D engine.");
      }
    })();
    return () => {
      cancelled = true;
      const t = threeRef.current;
      if (t) {
        cancelAnimationFrame(t.anim);
        try { t.transform.dispose(); t.controls.dispose(); t.renderer.dispose(); if (t.renderer.domElement.parentElement) t.renderer.domElement.parentElement.removeChild(t.renderer.domElement); } catch { /* */ }
        threeRef.current = null;
      }
    };
  }, [es]);

  useEffect(() => { const t = threeRef.current; if (t?.transform) t.transform.setMode(mode); }, [mode]);
  useEffect(() => {
    if (!ready || objectsRef.current.length > 0) return;
    try { if (localStorage.getItem(STORAGE_KEY)) loadLocal(); } catch { /* */ }
  }, [ready]);
  useEffect(() => {
    if (!ready) return;
    const id = window.setTimeout(() => saveLocal(), 600);
    return () => window.clearTimeout(id);
  }, [objects, ready, saveLocal]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const mod = e.ctrlKey || e.metaKey;
      if (mod && (e.key === "z" || e.key === "Z") && e.shiftKey) { e.preventDefault(); redo(); return; }
      if (mod && (e.key === "z" || e.key === "Z")) { e.preventDefault(); undo(); return; }
      if (mod && (e.key === "y" || e.key === "Y")) { e.preventDefault(); redo(); return; }
      if (mod && (e.key === "c" || e.key === "C")) { e.preventDefault(); copySelected(); return; }
      if (mod && (e.key === "v" || e.key === "V")) { e.preventDefault(); pasteClipboard(); return; }
      if (mod && (e.key === "d" || e.key === "D")) { e.preventDefault(); duplicateSelected(); return; }
      if (mod && (e.key === "g" || e.key === "G") && e.shiftKey) { e.preventDefault(); ungroupSelected(); return; }
      if (mod && (e.key === "g" || e.key === "G")) { e.preventDefault(); groupSelected(); return; }
      if (mod) return;
      if (e.key === "v" || e.key === "V") setMode("translate");
      if (e.key === "r" || e.key === "R") setMode("rotate");
      if (e.key === "s" || e.key === "S") setMode("scale");
      if (e.key === "Delete" || e.key === "Backspace") { e.preventDefault(); deleteSelected(); }
      if (e.key === "f" || e.key === "F") void toggleFullscreen();
      if (e.key === "h" || e.key === "H") { e.preventDefault(); frameSelected(); }
      if (e.key === "w" || e.key === "W") { e.preventDefault(); toggleWireframe(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [copySelected, deleteSelected, duplicateSelected, frameSelected, groupSelected, pasteClipboard, redo, toggleFullscreen, toggleWireframe, undo, ungroupSelected]);

  const shapes = shapeList(es);
  const modes: { id: Mode; label: string }[] = [
    { id: "translate", label: es ? "Mover" : "Move" },
    { id: "rotate", label: es ? "Rotar" : "Rotate" },
    { id: "scale", label: es ? "Escalar" : "Scale" },
  ];

  return (
    <div ref={studioRef} className={`relative -mx-1 flex flex-col overflow-hidden rounded-[1.5rem] border border-rose-400/25 bg-gradient-to-b from-[#1a0f18] via-[#120a12] to-[#0a060c] text-rose-50 shadow-[0_28px_70px_-24px_rgba(244,63,94,0.45)] ${fullscreen ? "fixed inset-0 z-50 m-0 h-full max-h-[100dvh] rounded-none border-0" : ""}`}>
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-rose-500/20 bg-black/30 px-3 py-2.5 sm:px-4">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-rose-400 to-fuchsia-600 text-sm font-black text-white shadow-md">3D</span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-rose-300/80">{es ? "Estudio de diseño" : "Design studio"}</p>
            <p className="text-sm font-bold text-rose-50">{es ? "Modelador 3D" : "3D modeler"}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <button type="button" onClick={undo} disabled={!canUndo} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-rose-100/90 hover:bg-white/10 disabled:opacity-40">Undo</button>
          <button type="button" onClick={redo} disabled={!canRedo} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-rose-100/90 hover:bg-white/10 disabled:opacity-40">Redo</button>
          <button type="button" onClick={importJson} disabled={!ready} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-rose-100/90 hover:bg-white/10 disabled:opacity-40">{es ? "Importar" : "Import"}</button>
          <button type="button" onClick={exportJson} disabled={!ready || objects.length === 0} className="rounded-full border border-rose-400/30 bg-rose-500/15 px-3 py-1.5 text-xs font-semibold text-rose-100 disabled:opacity-40">JSON</button>
          <button type="button" onClick={exportStl} disabled={!ready || objects.length === 0} className="rounded-full border border-rose-400/30 bg-rose-500/15 px-3 py-1.5 text-xs font-semibold text-rose-100 disabled:opacity-40">STL</button>
          <button type="button" onClick={() => setShowGrid((v) => !v)} className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${showGrid ? "border-rose-400/40 bg-rose-500/20 text-rose-100" : "border-white/10 bg-white/5 text-rose-100/50"}`}>{es ? "Grilla" : "Grid"}</button>
          <button type="button" onClick={() => setShowAxes((v) => !v)} className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${showAxes ? "border-rose-400/40 bg-rose-500/20 text-rose-100" : "border-white/10 bg-white/5 text-rose-100/50"}`}>{es ? "Ejes" : "Axes"}</button>
          <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-1.5 py-0.5">
            {(["iso", "front", "top", "side"] as const).map((p) => (
              <button key={p} type="button" onClick={() => setCameraPreset(p)} className="rounded-full px-2 py-1 text-[10px] font-bold uppercase text-rose-100/80 hover:bg-white/10">{p === "iso" ? "Iso" : p === "front" ? (es ? "Frente" : "Front") : p === "top" ? (es ? "Arriba" : "Top") : (es ? "Lado" : "Side")}</button>
            ))}
          </div>
          <button type="button" onClick={toggleWireframe} disabled={!ready} className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${wireframe ? "border-rose-400/40 bg-rose-500/20 text-rose-100" : "border-white/10 bg-white/5 text-rose-100/90"}`}>Wire</button>
          <button type="button" onClick={frameSelected} disabled={!ready} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-rose-100/90 hover:bg-white/10 disabled:opacity-40">{es ? "Enfocar" : "Frame"}</button>
          <button type="button" onClick={saveLocal} disabled={!ready} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-rose-100/90 hover:bg-white/10 disabled:opacity-40">{es ? "Guardar" : "Save"}</button>
          <button type="button" onClick={clearScene} disabled={!ready || objects.length === 0} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-rose-100/90 hover:bg-white/10 disabled:opacity-40">{es ? "Limpiar" : "Clear"}</button>
          <button type="button" onClick={() => void toggleFullscreen()} className="rounded-full bg-gradient-to-b from-rose-300 to-rose-600 px-3 py-1.5 text-xs font-bold text-rose-950 shadow-md">{fullscreen ? (es ? "Salir" : "Exit") : es ? "Pantalla completa" : "Fullscreen"}</button>
        </div>
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-0 lg:flex-row">
        <aside className="flex shrink-0 flex-row gap-2 overflow-x-auto border-b border-rose-500/15 bg-black/20 p-2.5 lg:w-36 lg:flex-col lg:overflow-y-auto lg:border-b-0 lg:border-r">
          <p className="hidden text-[10px] font-bold uppercase tracking-wider text-rose-300/70 lg:block">{es ? "Formas" : "Shapes"}</p>
          {shapes.map((s) => (
            <button key={s.kind} type="button" disabled={!ready} onClick={() => addShape(s.kind)} className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-xl border border-rose-400/20 bg-rose-950/40 px-3 text-xs font-semibold text-rose-50 hover:border-rose-400/50 disabled:opacity-40 lg:w-full">
              <span className="text-base text-rose-300" aria-hidden>{s.icon}</span>{s.label}
            </button>
          ))}
          <div className="my-1 hidden h-px bg-rose-500/20 lg:block" />
          <div className="flex items-center gap-1.5 px-1">
            {COLORS.map((c) => (<button key={c} type="button" title={c} onClick={() => applyColor(c)} className={`size-6 rounded-full border-2 transition ${color === c ? "scale-110 border-white" : "border-transparent"}`} style={{ backgroundColor: c }} />))}
            <input type="color" value={color} onChange={(e) => applyColor(e.target.value)} className="size-6 cursor-pointer rounded border-0 bg-transparent" />
          </div>
        </aside>
        <div className="relative flex min-h-0 min-w-0 flex-1 flex-col p-2.5 sm:p-3">
          <div ref={mountRef} className={`relative min-h-0 w-full flex-1 overflow-hidden rounded-xl border border-rose-500/20 bg-[#0c0810] ${fullscreen ? "min-h-[200px]" : "aspect-[5/3.4] min-h-[280px] max-h-[520px] sm:min-h-[340px]"}`}>
            {!ready && !error && (<p className="absolute inset-0 flex items-center justify-center text-sm text-rose-200/60">{es ? "Cargando estudio 3D…" : "Loading 3D studio…"}</p>)}
            {error && (<p className="absolute inset-0 flex items-center justify-center px-4 text-center text-sm text-rose-300">{error}</p>)}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-wrap items-end justify-between gap-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2.5 pt-8">
              <div className="pointer-events-auto flex flex-wrap items-center gap-1.5">
                {modes.map((m) => (<button key={m.id} type="button" onClick={() => setMode(m.id)} className={mode === m.id ? "rounded-full bg-gradient-to-b from-rose-300 to-rose-600 px-3 py-1.5 text-xs font-bold text-rose-950 shadow" : "rounded-full border border-white/15 bg-black/50 px-3 py-1.5 text-xs font-semibold text-rose-100/90 backdrop-blur-sm hover:bg-white/15"}>{m.label}</button>))}
                <button type="button" onClick={duplicateSelected} disabled={!selectedId} className="rounded-full border border-white/15 bg-black/50 px-3 py-1.5 text-xs font-semibold text-rose-100/90 backdrop-blur-sm hover:bg-white/15 disabled:opacity-40">{es ? "Duplicar" : "Duplicate"}</button>
                <button type="button" onClick={groupSelected} disabled={selectedIds.length < 2} className="rounded-full border border-white/15 bg-black/50 px-3 py-1.5 text-xs font-semibold text-rose-100/90 backdrop-blur-sm hover:bg-white/15 disabled:opacity-40" title="Ctrl+G">{es ? "Agrupar" : "Group"}</button>
                <button type="button" onClick={ungroupSelected} disabled={!selectedIds.some((id) => groupIds.includes(id))} className="rounded-full border border-white/15 bg-black/50 px-3 py-1.5 text-xs font-semibold text-rose-100/90 backdrop-blur-sm hover:bg-white/15 disabled:opacity-40" title="Ctrl+Shift+G">{es ? "Desagrupar" : "Ungroup"}</button>
                <button type="button" onClick={deleteSelected} disabled={selectedIds.length === 0} className="rounded-full border border-rose-500/40 bg-rose-950/70 px-3 py-1.5 text-xs font-semibold text-rose-200 backdrop-blur-sm hover:bg-rose-900/80 disabled:opacity-40">{es ? "Eliminar" : "Delete"}</button>
                <label className="flex items-center gap-1 rounded-full border border-white/15 bg-black/50 px-2.5 py-1 text-[10px] font-semibold text-rose-100/90 backdrop-blur-sm">
                  <span>Snap</span>
                  <select value={snap} onChange={(e) => setSnap(parseFloat(e.target.value))} className="rounded bg-black/40 px-1 py-0.5 text-[10px] text-rose-50 outline-none">
                    <option value={0}>Off</option><option value={0.1}>0.1</option><option value={0.25}>0.25</option><option value={0.5}>0.5</option><option value={1}>1</option>
                  </select>
                </label>
              </div>
              <p className="pointer-events-none hidden text-[10px] text-rose-200/60 sm:block">{es ? "Shift+click · Caja · Ctrl+G · clic derecho" : "Shift+click · Box · Ctrl+G · right-click"}</p>
            </div>
          </div>
        </div>
        <aside className="max-h-[42vh] shrink-0 overflow-y-auto border-t border-rose-500/15 bg-black/25 p-2.5 lg:max-h-none lg:w-52 lg:border-l lg:border-t-0">
          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-rose-300/70">{es ? "Objetos" : "Objects"} ({objects.length})</p>
          {objects.length === 0 ? (<p className="text-[11px] text-rose-200/45">{es ? "Agregá una forma." : "Add a shape."}</p>) : (
            <ul className="space-y-1">
              {objects.map((o) => (
                <li key={o.id}>
                  {editingNameId === o.id ? (
                    <input autoFocus value={editingName} onChange={(e) => setEditingName(e.target.value)} onBlur={() => renameObject(o.id, editingName)} onKeyDown={(e) => { if (e.key === "Enter") renameObject(o.id, editingName); if (e.key === "Escape") setEditingNameId(null); }} className="w-full rounded-lg border border-rose-400/40 bg-black/50 px-2 py-1.5 text-xs font-medium text-rose-50 outline-none" />
                  ) : (
                    <button type="button" onClick={(e) => selectMesh(o.id, { additive: e.shiftKey })} onDoubleClick={() => { setEditingNameId(o.id); setEditingName(o.name); }} className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs font-medium transition ${selectedIds.includes(o.id) ? "bg-rose-500/25 text-rose-50 ring-1 ring-rose-400/40" : "text-rose-100/80 hover:bg-white/5"}`}>
                      <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: o.color }} /><span className="truncate">{o.name}</span>
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
          {selectedId && !groupIds.includes(selectedId) && (
            <div className="mt-3 space-y-3 border-t border-rose-500/15 pt-3">
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-rose-300/70">{es ? "Posición" : "Position"}</p>
                {([0, 1, 2] as const).map((axis) => {
                  const labels = ["X", "Y", "Z"]; const cols = ["#f87171", "#4ade80", "#60a5fa"];
                  return (<div key={`pos-${axis}`} className="flex items-center justify-between gap-1"><span className="w-4 text-[10px] font-bold" style={{ color: cols[axis] }}>{labels[axis]}</span><input type="number" step={snap > 0 ? snap : 0.05} value={Number(pos[axis].toFixed(3))} onChange={(e) => setPosAxis(axis, parseFloat(e.target.value) || 0)} onBlur={endTransformEdit} className="w-20 rounded border border-white/10 bg-black/40 px-1.5 py-1 text-center text-xs font-semibold text-rose-50 outline-none" /></div>);
                })}
              </div>
              <div className="space-y-1.5 border-t border-rose-500/10 pt-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-rose-300/70">{es ? "Material" : "Material"}</p>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] text-rose-200/70">{es ? "Metal" : "Metal"}</span>
                  <input type="range" min={0} max={1} step={0.05} value={metalness} onChange={(e) => applyMetalness(parseFloat(e.target.value))} className="h-1.5 w-24 cursor-pointer appearance-none rounded-full bg-rose-950 accent-rose-400" />
                  <span className="w-8 text-right text-[10px] font-semibold tabular-nums">{metalness.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] text-rose-200/70">{es ? "Rugosidad" : "Rough"}</span>
                  <input type="range" min={0} max={1} step={0.05} value={roughness} onChange={(e) => applyRoughness(parseFloat(e.target.value))} className="h-1.5 w-24 cursor-pointer appearance-none rounded-full bg-rose-950 accent-rose-400" />
                  <span className="w-8 text-right text-[10px] font-semibold tabular-nums">{roughness.toFixed(2)}</span>
                </div>
              </div>
              <div className="space-y-2 border-t border-rose-500/10 pt-2">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-rose-300/70">{es ? "Medidas" : "Size"}</p>
                  <label className="flex items-center gap-1 text-[10px] font-semibold text-rose-200/80"><input type="checkbox" checked={uniformScale} onChange={(e) => setUniformScale(e.target.checked)} className="size-3.5" />{es ? "Uniforme" : "Uniform"}</label>
                </div>
                {([0, 1, 2] as const).map((axis) => {
                  const labels = es ? ["Ancho X", "Alto Y", "Prof. Z"] : ["Width X", "Height Y", "Depth Z"];
                  const cols = ["#f87171", "#4ade80", "#60a5fa"];
                  return (
                    <div key={axis} className="space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-semibold" style={{ color: cols[axis] }}>{labels[axis]}</span>
                        <div className="flex items-center gap-0.5">
                          <button type="button" className="grid size-6 place-items-center rounded border border-white/10 bg-white/5 text-xs font-bold" onClick={() => { sizeHistPushedRef.current = false; setSizeAxis(axis, size[axis] - 0.1); sizeHistPushedRef.current = false; }}>−</button>
                          <input type="number" min={0.05} max={50} step={0.05} value={Number(size[axis].toFixed(2))} onChange={(e) => { setSizeAxis(axis, parseFloat(e.target.value) || 0.05); sizeHistPushedRef.current = false; }} className="w-14 rounded border border-white/10 bg-black/40 px-1 py-1 text-center text-xs font-semibold text-rose-50" />
                          <button type="button" className="grid size-6 place-items-center rounded border border-white/10 bg-white/5 text-xs font-bold" onClick={() => { sizeHistPushedRef.current = false; setSizeAxis(axis, size[axis] + 0.1); sizeHistPushedRef.current = false; }}>+</button>
                        </div>
                      </div>
                      <input type="range" min={0.05} max={5} step={0.05} value={Math.min(size[axis], 5)} onChange={(e) => setSizeAxis(axis, parseFloat(e.target.value))} onPointerUp={() => { sizeHistPushedRef.current = false; }} className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-rose-950 accent-rose-400" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </aside>
      </div>
      {ctxMenu && (
        <div className="absolute z-50 min-w-[150px] rounded-xl border border-rose-400/30 bg-[#1a0f18]/95 py-1 shadow-xl backdrop-blur-md" style={{ left: ctxMenu.x, top: ctxMenu.y }} onPointerDown={(e) => e.stopPropagation()}>
          <button type="button" disabled={selectedIds.length < 2} onClick={groupSelected} className="flex w-full px-3 py-1.5 text-left text-xs font-semibold text-rose-50 hover:bg-rose-500/20 disabled:opacity-40">{es ? "Agrupar" : "Group"} <span className="ml-auto text-[10px] opacity-50">Ctrl+G</span></button>
          <button type="button" disabled={!selectedIds.some((id) => groupIds.includes(id))} onClick={ungroupSelected} className="flex w-full px-3 py-1.5 text-left text-xs font-semibold text-rose-50 hover:bg-rose-500/20 disabled:opacity-40">{es ? "Desagrupar" : "Ungroup"}</button>
          <button type="button" disabled={!selectedId} onClick={duplicateSelected} className="flex w-full px-3 py-1.5 text-left text-xs font-semibold text-rose-50 hover:bg-rose-500/20 disabled:opacity-40">{es ? "Duplicar" : "Duplicate"}</button>
          <button type="button" disabled={selectedIds.length === 0} onClick={deleteSelected} className="flex w-full px-3 py-1.5 text-left text-xs font-semibold text-rose-200 hover:bg-rose-500/20 disabled:opacity-40">{es ? "Eliminar" : "Delete"}</button>
          <button type="button" onClick={() => setCtxMenu(null)} className="flex w-full px-3 py-1.5 text-left text-xs font-semibold text-rose-100/60 hover:bg-white/10">{es ? "Cerrar" : "Close"}</button>
        </div>
      )}
    </div>
  );
}
