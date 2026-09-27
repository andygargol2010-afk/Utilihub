import { useCallback, useEffect, useRef, useState } from "react";
import {
  ALL_KINDS, BASE_SIZE, COLORS, HISTORY_MAX, NAME_PAIR, STORAGE_KEY,
  clampPos, clampSize, degToRad, makeGeometry, makeMaterial, normDeg, radToDeg, shapeList, snapVal,
  type ShapeKind,
} from "./modeler3d-helpers";

type Mode = "translate" | "rotate" | "scale";
type SceneObj = { id: string; name: string; kind: ShapeKind; color: string };
type MeshSnapshot = { id: string; name: string; kind: ShapeKind; color: string; position: [number, number, number]; rotation: [number, number, number]; scale: [number, number, number] };
type GroupSnapshot = { id: string; name: string; childIds: string[]; position: [number, number, number]; rotation: [number, number, number]; scale: [number, number, number] };
type FullSnapshot = { objects: MeshSnapshot[]; groups: GroupSnapshot[] };

let idSeq = 1;
function nextId() { return `obj-${idSeq++}`; }

export function useModelerCore(locale: "en" | "es" = "en") {
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
  const [size, setSize] = useState<[number, number, number]>([1, 1, 1]);
  const [uniformScale, setUniformScale] = useState(false);
  const [pos, setPos] = useState<[number, number, number]>([0, 0, 0]);
  const [rotDeg, setRotDeg] = useState<[number, number, number]>([0, 0, 0]);
  const [snap, setSnap] = useState(0.25);
  const sizeHistPushedRef = useRef(false);
  const transformHistPushedRef = useRef(false);
  const snapRef = useRef(0.25);
  const selectedIdRef = useRef<string | null>(null);
  const selectedIdsRef = useRef<string[]>([]);
  const groupsRef = useRef<Map<string, { childIds: string[]; groupObj: any }>>(new Map());
  const marqueeRef = useRef<{ on: boolean; x0: number; y0: number; el: HTMLDivElement | null }>({ on: false, x0: 0, y0: 0, el: null });
  const modeRef = useRef<Mode>("translate");
  const objectsRef = useRef<SceneObj[]>([]);
  const historyRef = useRef<FullSnapshot[]>([]);
  const futureRef = useRef<FullSnapshot[]>([]);
  const skipHistoryRef = useRef(false);
  const gridRef = useRef<any>(null);
  selectedIdRef.current = selectedId;
  selectedIdsRef.current = selectedIds;
  modeRef.current = mode;
  objectsRef.current = objects;
  snapRef.current = snap;

  const captureSnapshot = useCallback((): FullSnapshot => {
    const t = threeRef.current;
    if (!t) return { objects: [], groups: [] };
    const { THREE } = t;
    const posV = new THREE.Vector3();
    const quat = new THREE.Quaternion();
    const scl = new THREE.Vector3();
    const euler = new THREE.Euler();
    const objects: MeshSnapshot[] = [];
    for (const o of objectsRef.current) {
      if (groupsRef.current.has(o.id)) continue;
      const mesh = t.meshes.get(o.id);
      if (!mesh) {
        objects.push({ id: o.id, name: o.name, kind: o.kind, color: o.color, position: [0, 0.5, 0], rotation: [0, 0, 0], scale: [1, 1, 1] });
        continue;
      }
      mesh.updateMatrixWorld(true);
      mesh.matrixWorld.decompose(posV, quat, scl);
      euler.setFromQuaternion(quat);
      const col = mesh.material?.color?.getHexString?.() ? `#${mesh.material.color.getHexString()}` : o.color;
      objects.push({ id: o.id, name: o.name, kind: o.kind, color: col, position: [posV.x, posV.y, posV.z], rotation: [euler.x, euler.y, euler.z], scale: [scl.x, scl.y, scl.z] });
    }
    const groups: GroupSnapshot[] = [];
    for (const [gid, g] of groupsRef.current) {
      const meta = objectsRef.current.find((o) => o.id === gid);
      g.groupObj.updateMatrixWorld(true);
      g.groupObj.matrixWorld.decompose(posV, quat, scl);
      euler.setFromQuaternion(quat);
      groups.push({ id: gid, name: meta?.name || "Group", childIds: [...g.childIds], position: [posV.x, posV.y, posV.z], rotation: [euler.x, euler.y, euler.z], scale: [scl.x, scl.y, scl.z] });
    }
    return { objects, groups };
  }, []);

  const pushHistory = useCallback(() => {
    if (skipHistoryRef.current) return;
    historyRef.current.push(captureSnapshot());
    if (historyRef.current.length > HISTORY_MAX) historyRef.current.shift();
    futureRef.current = [];
    setCanUndo(historyRef.current.length > 0);
    setCanRedo(false);
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
    } else {
      setSelectedId(null); selectedIdRef.current = null;
      setSelectedIds([]); selectedIdsRef.current = [];
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
    // Y is floor height (bottom of object), not mesh center
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
    const t = threeRef.current;
    const ids = selectedIdsRef.current.filter((id) => t?.meshes.has(id) && !groupsRef.current.has(id));
    if (!t || !ids.length) return;
    pushHistory();
    const sx = clampSize(next[0]), sy = clampSize(next[1]), sz = clampSize(next[2]);
    for (const id of ids) {
      const mesh = t.meshes.get(id); const meta = objectsRef.current.find((o) => o.id === id);
      if (!mesh || !meta) continue;
      const b = BASE_SIZE[meta.kind];
      const oldHalf = (b[1] * mesh.scale.y) / 2;
      mesh.scale.set(sx / b[0], sy / b[1], sz / b[2]);
      const newHalf = (b[1] * mesh.scale.y) / 2;
      mesh.position.y = mesh.position.y - oldHalf + newHalf;
    }
    setSize([sx, sy, sz]);
  }, [pushHistory]);

  const setPosAxis = useCallback((axis: 0 | 1 | 2, value: number, opts?: { snap?: boolean }) => {
    const t = threeRef.current;
    if (!t) return;
    const ids = selectedIdsRef.current.filter((id) => t.meshes.has(id) && !groupsRef.current.has(id));
    if (!ids.length) return;
    const primaryId = selectedIdRef.current && ids.includes(selectedIdRef.current) ? selectedIdRef.current : ids[0]!;
    const primaryMesh = t.meshes.get(primaryId);
    const primaryMeta = objectsRef.current.find((o) => o.id === primaryId);
    if (!primaryMesh || !primaryMeta) return;
    if (!transformHistPushedRef.current) { pushHistory(); transformHistPushedRef.current = true; }
    const useSnap = opts?.snap !== false;
    const target = useSnap ? snapVal(clampPos(value), snap) : clampPos(value);

    // Y = floor height (bottom of object). X/Z = mesh center.
    if (axis === 1) {
      for (const id of ids) {
        const mesh = t.meshes.get(id);
        const meta = objectsRef.current.find((o) => o.id === id);
        if (!mesh || !meta) continue;
        const halfH = (BASE_SIZE[meta.kind][1] * mesh.scale.y) / 2;
        const y = useSnap ? snapVal(clampPos(target + halfH), snap) : clampPos(target + halfH);
        mesh.position.y = y;
      }
      const halfPrimary = (BASE_SIZE[primaryMeta.kind][1] * primaryMesh.scale.y) / 2;
      const floorY = primaryMesh.position.y - halfPrimary;
      setPos([
        Math.round(primaryMesh.position.x * 1000) / 1000,
        Math.round(floorY * 1000) / 1000,
        Math.round(primaryMesh.position.z * 1000) / 1000,
      ]);
      return;
    }

    const delta = target - primaryMesh.position.getComponent(axis);
    for (const id of ids) {
      const mesh = t.meshes.get(id);
      if (!mesh) continue;
      const next = mesh.position.toArray() as [number, number, number];
      const v = next[axis] + delta;
      next[axis] = useSnap ? snapVal(clampPos(v), snap) : clampPos(v);
      mesh.position.set(next[0], next[1], next[2]);
    }
    const p = primaryMesh.position;
    const halfPrimary = (BASE_SIZE[primaryMeta.kind][1] * primaryMesh.scale.y) / 2;
    setPos([
      Math.round(p.x * 1000) / 1000,
      Math.round((p.y - halfPrimary) * 1000) / 1000,
      Math.round(p.z * 1000) / 1000,
    ]);
  }, [pushHistory, snap]);

  const setRotAxis = useCallback((axis: 0 | 1 | 2, value: number) => {
    const t = threeRef.current;
    if (!t) return;
    const ids = selectedIdsRef.current.filter((id) => t.meshes.has(id) && !groupsRef.current.has(id));
    if (!ids.length) return;
    const primaryId = selectedIdRef.current && ids.includes(selectedIdRef.current) ? selectedIdRef.current : ids[0]!;
    const primaryMesh = t.meshes.get(primaryId);
    if (!primaryMesh) return;
    if (!transformHistPushedRef.current) { pushHistory(); transformHistPushedRef.current = true; }
    const safe = normDeg(Number.isFinite(value) ? value : 0);
    const oldDeg = [
      normDeg(radToDeg(primaryMesh.rotation.x)),
      normDeg(radToDeg(primaryMesh.rotation.y)),
      normDeg(radToDeg(primaryMesh.rotation.z)),
    ] as [number, number, number];
    const delta = safe - oldDeg[axis];
    for (const id of ids) {
      const mesh = t.meshes.get(id);
      if (!mesh) continue;
      const cur = [
        radToDeg(mesh.rotation.x),
        radToDeg(mesh.rotation.y),
        radToDeg(mesh.rotation.z),
      ] as [number, number, number];
      cur[axis] = cur[axis] + delta;
      mesh.rotation.set(degToRad(cur[0]), degToRad(cur[1]), degToRad(cur[2]));
    }
    const next: [number, number, number] = [oldDeg[0], oldDeg[1], oldDeg[2]];
    next[axis] = safe;
    setRotDeg(next);
  }, [pushHistory]);

  const endTransformEdit = useCallback(() => { transformHistPushedRef.current = false; }, []);

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
      mesh.position.set((Math.random() - 0.5) * 1.2, halfY, (Math.random() - 0.5) * 1.2);
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
      if (mesh?.material) mesh.material.color.set(hex);
    }
    setObjects((prev) => {
      const next = prev.map((o) => (ids.includes(o.id) ? { ...o, color: hex } : o));
      objectsRef.current = next; return next;
    });
  }, [pushHistory]);

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

  const toggleFullscreen = useCallback(() => {
    const el = studioRef.current;
    if (!el) return;
    if (!document.fullscreenElement) { void el.requestFullscreen?.(); setFullscreen(true); }
    else { void document.exitFullscreen?.(); setFullscreen(false); }
  }, []);

  useEffect(() => {
    const onFs = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  useEffect(() => { if (gridRef.current) gridRef.current.visible = showGrid; }, [showGrid]);

  const changeMode = useCallback((m: Mode) => {
    setMode(m);
    modeRef.current = m;
    const t = threeRef.current;
    if (t?.transform) t.transform.setMode(m);
  }, []);

  return {
    es, objects, setObjects, selectedId, setSelectedId, selectedIds, setSelectedIds,
    groupIds, setGroupIds, ctxMenu, setCtxMenu, mode, setMode: changeMode, color, setColor,
    fullscreen, setFullscreen, ready, setReady, error, setError, canUndo, setCanUndo,
    canRedo, setCanRedo, showGrid, setShowGrid, size, setSize, uniformScale, setUniformScale,
    pos, setPos, rotDeg, setRotDeg, snap, setSnap, mountRef, studioRef, threeRef,
    sizeHistPushedRef, transformHistPushedRef, snapRef, selectedIdRef, selectedIdsRef,
    groupsRef, marqueeRef, modeRef, objectsRef, historyRef, futureRef, skipHistoryRef, gridRef,
    captureSnapshot, pushHistory, rebuildFromSnapshot, readTransform, selectMesh, applySize,
    setPosAxis, setRotAxis, endTransformEdit, setSizeAxis, createMesh, addShape, deleteSelected,
    applyColor, groupSelected, ungroupSelected, undo, redo, toggleFullscreen,
  };
}
