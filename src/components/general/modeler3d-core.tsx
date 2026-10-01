import { useCallback, useEffect, useRef, useState } from "react";
import {
  BASE_SIZE, HISTORY_MAX, OBJECT_MAX, NAME_PAIR, STORAGE_KEY,
  clampPos, clampSize, degToRad, makeGeometry, makeMaterial, normDeg, radToDeg, snapVal,
  type ShapeKind, type MatPreset, UNIT_CM,
} from "./modeler3d-helpers";
import { makeAlignApi } from "./modeler3d-align";
import {
  readNamedScenes, saveNamedSceneEntry, removeNamedScene,
  tryDecodeShareFromHash, buildShareUrl, scenePresets,
} from "./modeler3d-scenes";

type SceneObj = { id: string; name: string; kind: ShapeKind; color: string; matPreset?: MatPreset };
type MeshSnapshot = { id: string; name: string; kind: ShapeKind; color: string; matPreset?: MatPreset; position: [number, number, number]; rotation: [number, number, number]; scale: [number, number, number] };
type GroupSnap = { id: string; name: string; childIds: string[]; position: [number, number, number]; rotation: [number, number, number]; scale: [number, number, number] };
type HistoryEntry = { meshes: MeshSnapshot[]; groups: GroupSnap[] };
type ClipItem = { kind: ShapeKind; color: string; matPreset?: MatPreset; position: [number, number, number]; rotation: [number, number, number]; scale: [number, number, number] };

let _id = 0;
const nextId = () => `m${Date.now().toString(36)}${(_id++).toString(36)}`;

export function useModelerCore(locale: "en" | "es" = "en") {
  const es = locale === "es";
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [groupIds, setGroupIds] = useState<string[]>([]);
  const [objects, setObjects] = useState<SceneObj[]>([]);
  const [ctxMenu, setCtxMenu] = useState<{ x: number; y: number } | null>(null);
  const [mode, setModeState] = useState<"translate" | "rotate" | "scale">("translate");
  const [color, setColor] = useState("#a78bfa");
  const [matPreset, setMatPreset] = useState<MatPreset>("default");
  const [fullscreen, setFullscreen] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [size, setSize] = useState<[number, number, number]>([1, 1, 1]);
  const [pos, setPos] = useState<[number, number, number]>([0, 0, 0]);
  const [rotDeg, setRotDeg] = useState<[number, number, number]>([0, 0, 0]);
  const [snap, setSnap] = useState(0.1);
  const [objectLimitMsg, setObjectLimitMsg] = useState<string | null>(null);

  const mountRef = useRef<HTMLDivElement | null>(null);
  const studioRef = useRef<HTMLDivElement | null>(null);
  const threeRef = useRef<any>(null);
  const sizeHistPushedRef = useRef(false);
  const selectedIdRef = useRef<string | null>(null);
  const selectedIdsRef = useRef<string[]>([]);
  const groupsRef = useRef<Map<string, { groupObj: any; childIds: string[]; name: string }>>(new Map());
  const marqueeRef = useRef<{ on: boolean; x0: number; y0: number; el: HTMLDivElement | null }>({ on: false, x0: 0, y0: 0, el: null });
  const modeRef = useRef(mode);
  const gridRef = useRef<any>(null);
  const objectsRef = useRef<SceneObj[]>([]);
  const historyRef = useRef<HistoryEntry[]>([]);
  const histIdxRef = useRef(-1);
  const clipboardRef = useRef<ClipItem[]>([]);
  const snapRef = useRef(snap);

  useEffect(() => { modeRef.current = mode; }, [mode]);
  useEffect(() => { snapRef.current = snap; }, [snap]);
  useEffect(() => { selectedIdRef.current = selectedId; }, [selectedId]);
  useEffect(() => { selectedIdsRef.current = selectedIds; }, [selectedIds]);

  const snapshot = useCallback((): HistoryEntry => {
    const t = threeRef.current;
    const meshes: MeshSnapshot[] = [];
    const groups: GroupSnap[] = [];
    if (!t) return { meshes, groups };
    for (const o of objectsRef.current) {
      if (groupsRef.current.has(o.id)) {
        const g = groupsRef.current.get(o.id)!;
        groups.push({
          id: o.id, name: g.name, childIds: [...g.childIds],
          position: g.groupObj.position.toArray() as [number, number, number],
          rotation: [g.groupObj.rotation.x, g.groupObj.rotation.y, g.groupObj.rotation.z],
          scale: g.groupObj.scale.toArray() as [number, number, number],
        });
        continue;
      }
      const m = t.meshes.get(o.id);
      if (!m) continue;
      meshes.push({
        id: o.id, name: o.name, kind: o.kind, color: o.color, matPreset: o.matPreset ?? "default",
        position: m.position.toArray() as [number, number, number],
        rotation: [m.rotation.x, m.rotation.y, m.rotation.z],
        scale: m.scale.toArray() as [number, number, number],
      });
    }
    return { meshes, groups };
  }, []);

  const pushHistory = useCallback(() => {
    const entry = snapshot();
    const next = historyRef.current.slice(0, histIdxRef.current + 1);
    next.push(entry);
    if (next.length > HISTORY_MAX) next.shift();
    historyRef.current = next;
    histIdxRef.current = next.length - 1;
    setCanUndo(histIdxRef.current > 0);
    setCanRedo(false);
  }, [snapshot]);

  const restoreSnapshot = useCallback((entry: HistoryEntry) => {
    const t = threeRef.current;
    if (!t) return;
    const { THREE } = t;
    t.transform.detach();
    for (const [, m] of t.meshes) {
      m.parent?.remove(m);
      if (m.isMesh) { m.geometry?.dispose?.(); m.material?.dispose?.(); }
    }
    t.meshes.clear();
    for (const [, g] of groupsRef.current) t.scene.remove(g.groupObj);
    groupsRef.current.clear();

    const nextObjs: SceneObj[] = [];
    for (const item of entry.meshes) {
      const mat = makeMaterial(THREE, item.color, item.matPreset ?? "default");
      const geo = makeGeometry(THREE, item.kind);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.castShadow = true; mesh.receiveShadow = true;
      mesh.position.fromArray(item.position);
      mesh.rotation.set(item.rotation[0], item.rotation[1], item.rotation[2]);
      mesh.scale.fromArray(item.scale);
      mesh.userData = { id: item.id, kind: item.kind };
      t.scene.add(mesh); t.meshes.set(item.id, mesh);
      nextObjs.push({ id: item.id, name: item.name, kind: item.kind, color: item.color, matPreset: item.matPreset ?? "default" });
    }
    for (const g of entry.groups) {
      const group = new THREE.Group();
      group.position.fromArray(g.position);
      group.rotation.set(g.rotation[0], g.rotation[1], g.rotation[2]);
      group.scale.fromArray(g.scale);
      for (const cid of g.childIds) {
        const m = t.meshes.get(cid);
        if (m) group.add(m);
      }
      t.scene.add(group);
      t.meshes.set(g.id, group);
      groupsRef.current.set(g.id, { groupObj: group, childIds: [...g.childIds], name: g.name });
      nextObjs.push({ id: g.id, name: g.name, kind: "box" as ShapeKind, color: "#a78bfa" });
    }
    objectsRef.current = nextObjs;
    setObjects(nextObjs);
    setGroupIds(entry.groups.map((g) => g.id));
    setSelectedId(null); setSelectedIds([]); selectedIdRef.current = null; selectedIdsRef.current = [];
  }, []);

  const undo = useCallback(() => {
    if (histIdxRef.current <= 0) return;
    histIdxRef.current -= 1;
    restoreSnapshot(historyRef.current[histIdxRef.current]!);
    setCanUndo(histIdxRef.current > 0);
    setCanRedo(histIdxRef.current < historyRef.current.length - 1);
  }, [restoreSnapshot]);

  const redo = useCallback(() => {
    if (histIdxRef.current >= historyRef.current.length - 1) return;
    histIdxRef.current += 1;
    restoreSnapshot(historyRef.current[histIdxRef.current]!);
    setCanUndo(histIdxRef.current > 0);
    setCanRedo(histIdxRef.current < historyRef.current.length - 1);
  }, [restoreSnapshot]);

  const readTransform = useCallback((id: string | null) => {
    const t = threeRef.current;
    if (!t || !id) { setSize([1, 1, 1]); setPos([0, 0, 0]); setRotDeg([0, 0, 0]); return; }
    const g = groupsRef.current.get(id);
    const m = g?.groupObj || t.meshes.get(id);
    if (!m) return;
    setPos([m.position.x, m.position.y, m.position.z].map((n) => Math.round(n * 100) / 100) as [number, number, number]);
    setRotDeg([normDeg(radToDeg(m.rotation.x)), normDeg(radToDeg(m.rotation.y)), normDeg(radToDeg(m.rotation.z))]);
    if (!g) {
      setSize([m.scale.x, m.scale.y, m.scale.z].map((n) => Math.round(n * 100) / 100) as [number, number, number]);
    }
  }, []);

  const selectMesh = useCallback((id: string | null) => {
    selectedIdRef.current = id;
    setSelectedId(id);
    if (id) {
      selectedIdsRef.current = [id];
      setSelectedIds([id]);
      const meta = objectsRef.current.find((o) => o.id === id);
      if (meta && !groupsRef.current.has(id)) {
        if (meta.color) setColor(meta.color);
        if (meta.matPreset) setMatPreset(meta.matPreset);
      }
    } else {
      selectedIdsRef.current = [];
      setSelectedIds([]);
    }
    const t = threeRef.current;
    if (!t) return;
    if (!id) { t.transform.detach(); readTransform(null); return; }
    const g = groupsRef.current.get(id);
    const target = g?.groupObj || t.meshes.get(id);
    if (target) {
      t.transform.attach(target);
      t.transform.setMode(modeRef.current);
    }
    readTransform(id);
  }, [readTransform]);

  const clearSelection = useCallback(() => {
    selectMesh(null);
  }, [selectMesh]);

  const setMode = useCallback((m: "translate" | "rotate" | "scale") => {
    setModeState(m);
    modeRef.current = m;
    const t = threeRef.current;
    if (t?.transform) t.transform.setMode(m);
  }, []);

  const endTransformEdit = useCallback(() => {
    sizeHistPushedRef.current = false;
  }, []);

  const setPosAxis = useCallback((axis: 0 | 1 | 2, value: number, opts?: { snap?: boolean }) => {
    const t = threeRef.current;
    const id = selectedIdRef.current;
    if (!t || !id) return;
    if (!sizeHistPushedRef.current) { pushHistory(); sizeHistPushedRef.current = true; }
    const g = groupsRef.current.get(id);
    const m = g?.groupObj || t.meshes.get(id);
    if (!m) return;
    let v = clampPos(value);
    if (opts?.snap !== false && snapRef.current > 0) v = snapVal(v, snapRef.current);
    const p = m.position.toArray() as [number, number, number];
    p[axis] = v;
    m.position.fromArray(p);
    setPos((prev) => { const n = [...prev] as [number, number, number]; n[axis] = Math.round(v * 100) / 100; return n; });
  }, [pushHistory]);

  const setRotAxis = useCallback((axis: 0 | 1 | 2, deg: number) => {
    const t = threeRef.current;
    const id = selectedIdRef.current;
    if (!t || !id) return;
    if (!sizeHistPushedRef.current) { pushHistory(); sizeHistPushedRef.current = true; }
    const g = groupsRef.current.get(id);
    const m = g?.groupObj || t.meshes.get(id);
    if (!m) return;
    const r = normDeg(deg);
    if (axis === 0) m.rotation.x = degToRad(r);
    else if (axis === 1) m.rotation.y = degToRad(r);
    else m.rotation.z = degToRad(r);
    setRotDeg((prev) => { const n = [...prev] as [number, number, number]; n[axis] = r; return n; });
  }, [pushHistory]);

  const setSizeAxis = useCallback((axis: 0 | 1 | 2, value: number) => {
    const t = threeRef.current;
    const id = selectedIdRef.current;
    if (!t || !id || groupsRef.current.has(id)) return;
    if (!sizeHistPushedRef.current) { pushHistory(); sizeHistPushedRef.current = true; }
    const m = t.meshes.get(id);
    if (!m) return;
    const v = clampSize(value);
    const s = m.scale.toArray() as [number, number, number];
    s[axis] = v;
    m.scale.fromArray(s);
    setSize((prev) => { const n = [...prev] as [number, number, number]; n[axis] = Math.round(v * 100) / 100; return n; });
  }, [pushHistory]);

  const nudgeSelected = useCallback((dx: number, dy: number, dz: number) => {
    const t = threeRef.current;
    const ids = selectedIdsRef.current;
    if (!t || !ids.length) return;
    pushHistory();
    for (const id of ids) {
      if (groupsRef.current.has(id)) {
        const g = groupsRef.current.get(id)!;
        g.groupObj.position.x += dx; g.groupObj.position.y += dy; g.groupObj.position.z += dz;
      } else {
        const m = t.meshes.get(id);
        if (m) { m.position.x += dx; m.position.y += dy; m.position.z += dz; }
      }
    }
    const primary = selectedIdRef.current;
    if (primary) readTransform(primary);
  }, [pushHistory, readTransform]);

  const createMesh = useCallback((kind: ShapeKind, opts: { color: string; matPreset?: MatPreset; name?: string; position?: [number, number, number]; rotation?: [number, number, number]; scale?: [number, number, number]; recordHistory?: boolean }) => {
    const t = threeRef.current; if (!t) return null;
    let meshCount = 0;
    for (const [mid] of t.meshes) {
      if (!groupsRef.current.has(mid)) meshCount += 1;
    }
    if (meshCount >= OBJECT_MAX) {
      setObjectLimitMsg(es
        ? `Máximo ${OBJECT_MAX} objetos. Eliminá algunos para seguir.`
        : `Maximum ${OBJECT_MAX} objects. Delete some to continue.`);
      window.setTimeout(() => setObjectLimitMsg(null), 4000);
      return null;
    }
    setObjectLimitMsg(null);
    const { THREE } = t;
    if (opts.recordHistory !== false) pushHistory();
    const id = nextId();
    const base = es ? NAME_PAIR[kind][1] : NAME_PAIR[kind][0];
    const count = objectsRef.current.filter((o) => o.kind === kind).length + 1;
    const name = opts.name ?? `${base} ${count}`;
    const preset = opts.matPreset ?? matPreset;
    const mat = makeMaterial(THREE, opts.color, preset);
    const geo = makeGeometry(THREE, kind);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true; mesh.receiveShadow = true;
    if (opts.position) mesh.position.fromArray(opts.position);
    else {
      const halfY = BASE_SIZE[kind][1] / 2;
      const n = objectsRef.current.filter((o) => !groupsRef.current.has(o.id)).length;
      const ox = ((n % 4) - 1.5) * 0.4;
      const oz = (Math.floor(n / 4) - 0.5) * 0.4;
      mesh.position.set(ox, halfY, oz);
    }
    if (opts.rotation) mesh.rotation.set(opts.rotation[0], opts.rotation[1], opts.rotation[2]);
    if (opts.scale) mesh.scale.fromArray(opts.scale);
    mesh.userData = { id, kind };
    t.scene.add(mesh); t.meshes.set(id, mesh);
    const entry: SceneObj = { id, name, kind, color: opts.color, matPreset: preset };
    setObjects((prev) => { const next = [...prev, entry]; objectsRef.current = next; return next; });
    selectMesh(id);
    return id;
  }, [es, matPreset, pushHistory, selectMesh]);

  const addShape = useCallback((kind: ShapeKind) => { createMesh(kind, { color, matPreset }); }, [color, matPreset, createMesh]);

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

  const copySelected = useCallback(() => {
    const t = threeRef.current;
    const ids = selectedIdsRef.current.filter((id) => t?.meshes.has(id) && !groupsRef.current.has(id));
    if (!t || !ids.length) return;
    const items: ClipItem[] = [];
    for (const id of ids) {
      const m = t.meshes.get(id);
      const meta = objectsRef.current.find((o) => o.id === id);
      if (!m || !meta) continue;
      items.push({
        kind: meta.kind, color: meta.color, matPreset: meta.matPreset ?? "default",
        position: m.position.toArray() as [number, number, number],
        rotation: [m.rotation.x, m.rotation.y, m.rotation.z],
        scale: m.scale.toArray() as [number, number, number],
      });
    }
    clipboardRef.current = items;
  }, []);

  const cutSelected = useCallback(() => { copySelected(); deleteSelected(); }, [copySelected, deleteSelected]);

  const pasteClipboard = useCallback(() => {
    const items = clipboardRef.current;
    if (!items.length) return;
    pushHistory();
    const newIds: string[] = [];
    for (const item of items) {
      const id = createMesh(item.kind, {
        color: item.color,
        matPreset: item.matPreset ?? "default",
        position: [item.position[0] + 0.3, item.position[1], item.position[2] + 0.3],
        rotation: item.rotation,
        scale: item.scale,
        recordHistory: false,
      });
      if (id) newIds.push(id);
    }
    if (newIds.length) {
      selectedIdsRef.current = newIds; setSelectedIds(newIds);
      const primary = newIds[newIds.length - 1]!;
      selectedIdRef.current = primary; setSelectedId(primary);
      const t = threeRef.current;
      const m = t?.meshes.get(primary);
      if (m) { t.transform.attach(m); t.transform.setMode(modeRef.current); readTransform(primary); }
    }
  }, [createMesh, pushHistory, readTransform]);

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
      const meta = objectsRef.current.find((o) => o.id === id);
      const preset = (meta?.matPreset ?? matPreset) as MatPreset;
      if (mesh) {
        const prev = mesh.material;
        mesh.material = makeMaterial(THREE, hex, preset);
        if (prev && prev !== mesh.material) {
          try { prev.dispose?.(); } catch { /* */ }
        }
      }
      setObjects((prev) => {
        const next = prev.map((o) => (o.id === id ? { ...o, color: hex } : o));
        objectsRef.current = next;
        return next;
      });
    }
  }, [matPreset, pushHistory]);

  const applyMatPreset = useCallback((preset: MatPreset) => {
    setMatPreset(preset);
    const t = threeRef.current;
    const ids = selectedIdsRef.current.filter((id) => t?.meshes.has(id) && !groupsRef.current.has(id));
    if (!t) return;
    if (!ids.length) return;
    pushHistory();
    const { THREE } = t;
    for (const id of ids) {
      const mesh = t.meshes.get(id);
      const meta = objectsRef.current.find((o) => o.id === id);
      const hex = meta?.color ?? color;
      if (mesh) {
        const prev = mesh.material;
        mesh.material = makeMaterial(THREE, hex, preset);
        if (prev && prev !== mesh.material) {
          try { prev.dispose?.(); } catch { /* */ }
        }
      }
      setObjects((prev) => {
        const next = prev.map((o) => (o.id === id ? { ...o, matPreset: preset } : o));
        objectsRef.current = next;
        return next;
      });
    }
  }, [color, pushHistory]);

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
      if (!m) continue;
      group.attach(m);
    }
    const gid = nextId();
    const name = es ? `Grupo ${groupsRef.current.size + 1}` : `Group ${groupsRef.current.size + 1}`;
    t.meshes.set(gid, group);
    groupsRef.current.set(gid, { groupObj: group, childIds: [...ids], name });
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
    if (released.length) {
      selectedIdsRef.current = released;
      setSelectedIds(released);
      const primary = released[0]!;
      selectedIdRef.current = primary;
      setSelectedId(primary);
      const m = t.meshes.get(primary);
      if (m) { t.transform.attach(m); t.transform.setMode(modeRef.current); readTransform(primary); }
    } else selectMesh(null);
  }, [pushHistory, readTransform, selectMesh]);

  const clearScene = useCallback(() => {
    const t = threeRef.current;
    if (!t) return;
    pushHistory();
    t.transform.detach();
    for (const [, m] of t.meshes) {
      m.parent?.remove(m);
      if (m.isMesh) { m.geometry?.dispose?.(); m.material?.dispose?.(); }
    }
    t.meshes.clear();
    for (const [, g] of groupsRef.current) t.scene.remove(g.groupObj);
    groupsRef.current.clear();
    objectsRef.current = [];
    setObjects([]);
    setGroupIds([]);
    selectMesh(null);
  }, [pushHistory, selectMesh]);

  const saveScene = useCallback(() => {
    try {
      const data = snapshot();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch { /* */ }
  }, [snapshot]);

  const loadScene = useCallback(() => {
    try {
      if (typeof window !== "undefined") {
        const shared = tryDecodeShareFromHash(window.location.hash || "");
        if (shared?.meshes) {
          const data = shared as HistoryEntry;
          restoreSnapshot(data);
          historyRef.current = [data];
          histIdxRef.current = 0;
          setCanUndo(false);
          setCanRedo(false);
          try {
            const url = window.location.pathname + window.location.search;
            window.history.replaceState(null, "", url);
          } catch { /* */ }
          try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch { /* */ }
          return;
        }
      }
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw) as HistoryEntry;
      if (!data?.meshes) return;
      restoreSnapshot(data);
      historyRef.current = [data];
      histIdxRef.current = 0;
      setCanUndo(false);
      setCanRedo(false);
    } catch { /* */ }
  }, [restoreSnapshot]);

  const listNamedScenes = useCallback(() => readNamedScenes(), []);
  const saveNamedScene = useCallback((name: string) => {
    const data = snapshot();
    return saveNamedSceneEntry(name, { meshes: data.meshes as any, groups: data.groups as any });
  }, [snapshot]);
  const loadNamedScene = useCallback((id: string) => {
    const found = readNamedScenes().find((s) => s.id === id);
    if (!found?.data?.meshes) return;
    const data = found.data as HistoryEntry;
    restoreSnapshot(data);
    historyRef.current = [data];
    histIdxRef.current = 0;
    setCanUndo(false);
    setCanRedo(false);
  }, [restoreSnapshot]);
  const deleteNamedScene = useCallback((id: string) => { removeNamedScene(id); }, []);
  const copyShareLink = useCallback(async () => {
    if (typeof window === "undefined") return false;
    const data = snapshot();
    const url = buildShareUrl(window.location.origin, window.location.pathname, window.location.search, data);
    if (url.length > 7000) {
      try {
        const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "utilihub-scene.json";
        a.click();
        URL.revokeObjectURL(a.href);
      } catch { /* */ }
      return false;
    }
    try {
      await navigator.clipboard.writeText(url);
      return true;
    } catch {
      try { window.prompt(es ? "Copiá el enlace:" : "Copy link:", url); return true; } catch { return false; }
    }
  }, [es, snapshot]);
  const applyPreset = useCallback((presetId: string) => {
    const preset = scenePresets(es).find((p) => p.id === presetId);
    if (!preset) return;
    if (objectsRef.current.length > 0) {
      const ok = window.confirm(es ? "¿Reemplazar la escena actual por la plantilla?" : "Replace the current scene with this preset?");
      if (!ok) return;
    }
    const meshes = preset.data.meshes.map((m, i) => ({ ...m, name: m.name || `${m.kind} ${i + 1}` }));
    const entry = { meshes, groups: preset.data.groups || [] } as HistoryEntry;
    pushHistory();
    restoreSnapshot(entry);
    historyRef.current = [...historyRef.current.slice(0, histIdxRef.current + 1), entry];
    histIdxRef.current = historyRef.current.length - 1;
    setCanUndo(histIdxRef.current > 0);
    setCanRedo(false);
  }, [es, pushHistory, restoreSnapshot]);

  const exportJSON = useCallback(() => {
    const data = snapshot();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "scene.json";
    a.click();
    URL.revokeObjectURL(a.href);
  }, [snapshot]);

  const exportSTL = useCallback(async () => {
    const t = threeRef.current;
    if (!t) return;
    try {
      let STLExporter: any;
      try { ({ STLExporter } = await import("three/addons/exporters/STLExporter.js")); }
      catch { ({ STLExporter } = await import("three/examples/jsm/exporters/STLExporter.js")); }
      const exporter = new STLExporter();
      const group = new t.THREE.Group();
      const childOfGroup = new Set<string>();
      for (const [, g] of groupsRef.current) {
        for (const cid of g.childIds) childOfGroup.add(cid);
      }
      for (const [id, m] of t.meshes) {
        if (childOfGroup.has(id)) continue;
        if (m.isMesh || m.isGroup) {
          m.updateWorldMatrix(true, true);
          const clone = m.clone(true);
          clone.matrix.copy(m.matrixWorld);
          clone.matrix.decompose(clone.position, clone.quaternion, clone.scale);
          clone.rotation.setFromQuaternion(clone.quaternion);
          group.add(clone);
        }
      }
      const stl = exporter.parse(group, { binary: true });
      const blob = new Blob([stl], { type: "application/octet-stream" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "scene.stl";
      a.click();
      URL.revokeObjectURL(a.href);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const exportPNG = useCallback(() => {
    const t = threeRef.current;
    if (!t?.renderer || !t?.scene || !t?.camera) return;
    try {
      t.renderer.render(t.scene, t.camera);
      const url = t.renderer.domElement.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = "utilihub-modeler.png";
      a.click();
    } catch (e) {
      console.error(e);
    }
  }, []);

  const exportGLB = useCallback(async () => {
    const t = threeRef.current;
    if (!t) return;
    try {
      let GLTFExporter: any;
      try { ({ GLTFExporter } = await import("three/addons/exporters/GLTFExporter.js")); }
      catch { ({ GLTFExporter } = await import("three/examples/jsm/exporters/GLTFExporter.js")); }
      const exporter = new GLTFExporter();
      const group = new t.THREE.Group();
      const childOfGroup = new Set<string>();
      for (const [, g] of groupsRef.current) {
        for (const cid of g.childIds) childOfGroup.add(cid);
      }
      for (const [id, m] of t.meshes) {
        if (childOfGroup.has(id)) continue;
        if (m.isMesh || m.isGroup) {
          m.updateWorldMatrix(true, true);
          const clone = m.clone(true);
          clone.matrix.copy(m.matrixWorld);
          clone.matrix.decompose(clone.position, clone.quaternion, clone.scale);
          clone.rotation.setFromQuaternion(clone.quaternion);
          group.add(clone);
        }
      }
      const result = await new Promise<ArrayBuffer>((resolve, reject) => {
        exporter.parse(
          group,
          (gltf: ArrayBuffer) => resolve(gltf),
          (err: unknown) => reject(err),
          { binary: true },
        );
      });
      const blob = new Blob([result], { type: "model/gltf-binary" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "utilihub-modeler.glb";
      a.click();
      URL.revokeObjectURL(a.href);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    const el = studioRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.().then(() => setFullscreen(true)).catch(() => setFullscreen(true));
    } else {
      document.exitFullscreen?.().then(() => setFullscreen(false)).catch(() => setFullscreen(false));
    }
  }, []);

  useEffect(() => {
    const onFs = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  const alignApi = makeAlignApi({
    threeRef,
    selectedIdsRef,
    selectedIdRef,
    groupsRef,
    pushHistory,
    readTransform,
  });
  const dropToFloor = alignApi.dropToFloor;
  const alignSelection = alignApi.alignSelection;

  return {
    es, selectedId, selectedIds, groupIds, objects, ctxMenu, setCtxMenu, mode, setMode,
    color, setColor, fullscreen, ready, setReady, error, setError,
    canUndo, canRedo, size, pos, rotDeg, snap, setSnap, mountRef, studioRef, threeRef,
    sizeHistPushedRef, selectedIdRef, selectedIdsRef, groupsRef, marqueeRef,
    modeRef, gridRef, pushHistory, setPosAxis, setRotAxis, endTransformEdit, nudgeSelected, setSizeAxis,
    addShape, deleteSelected, applyColor, groupSelected, ungroupSelected, undo, redo, toggleFullscreen,
    setSelectedId, setSelectedIds, readTransform, loadScene, saveScene, clearScene,
    copySelected, cutSelected, pasteClipboard, exportJSON, exportSTL, exportPNG, exportGLB,
    clearSelection, dropToFloor, alignSelection, objectLimitMsg,
    matPreset, applyMatPreset, UNIT_CM,
    listNamedScenes, saveNamedScene, loadNamedScene, deleteNamedScene, copyShareLink, applyPreset,
  };
}
