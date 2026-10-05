import type { GeneralTool } from "@/lib/general/types";
import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Sky } from "three/examples/jsm/objects/Sky.js";
import {
  type PartKind,
  type Locale,
  type ScenePart,
  LAYER_COUNT,
  GRID,
  snap,
  disposeObjectResources,
  uid,
  makeMaterials,
  createPartMesh,
  disposeCatalogMaterials,
} from "./house-modeler-lib";
import { StructureGlyph } from "./house-modeler-glyph";

export function HouseModeler3D({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const mountRef = useRef<HTMLDivElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const threeRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    controls: OrbitControls;
    raycaster: THREE.Raycaster;
    pointer: THREE.Vector2;
    ground: THREE.Mesh;
    partsRoot: THREE.Group;
    mats: ReturnType<typeof makeMaterials>;
    selectionHelper: THREE.BoxHelper;
    anim: number;
  } | null>(null);
  const partsRef = useRef<ScenePart[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tool, setTool] = useState<PartKind>("wall");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [count, setCount] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedLocked, setSelectedLocked] = useState(false);
  const [showLayers, setShowLayers] = useState(false);
  const [activeLayer, setActiveLayer] = useState(0);
  const [layerHidden, setLayerHidden] = useState<boolean[]>(() => Array(LAYER_COUNT).fill(false));
  const toolRef = useRef(tool);
  const selectedRef = useRef(selectedId);
  const activeLayerRef = useRef(0);
  const layerHiddenRef = useRef<boolean[]>(Array(LAYER_COUNT).fill(false));
  const draggingRef = useRef<{ id: string; offset: THREE.Vector3 } | null>(null);
  const dragArmRef = useRef<{ id: string; offset: THREE.Vector3; x: number; y: number } | null>(null);
  const DRAG_ARM_PX = 6;

  useEffect(() => { toolRef.current = tool; }, [tool]);
  useEffect(() => {
    selectedRef.current = selectedId;
    const p = partsRef.current.find((x) => x.id === selectedId);
    setSelectedLocked(Boolean(p?.locked));
  }, [selectedId]);
  useEffect(() => { activeLayerRef.current = activeLayer; }, [activeLayer]);
  useEffect(() => { layerHiddenRef.current = layerHidden; }, [layerHidden]);

  const findPartObject = useCallback((id: string) => {
    const t = threeRef.current;
    if (!t) return null;
    let found: THREE.Object3D | null = null;
    t.partsRoot.traverse((c) => {
      if (c.userData.partId === id && c.parent === t.partsRoot) found = c;
    });
    return found;
  }, []);

  const placeAt = useCallback((point: THREE.Vector3, kind: PartKind) => {
    const t = threeRef.current;
    if (!t) return;
    const x = snap(point.x);
    const z = snap(point.z);
    const obj = createPartMesh(kind, t.mats);
    obj.position.set(x, 0, z);
    t.partsRoot.add(obj);
    let primary: THREE.Mesh | null = null;
    obj.traverse((c) => { if (!primary && c instanceof THREE.Mesh) primary = c; });
    if (!primary) {
      t.partsRoot.remove(obj);
      disposeObjectResources(obj, false);
      return;
    }
    const id = uid();
    obj.userData.partId = id;
    obj.traverse((c) => { if (c instanceof THREE.Mesh) c.userData.partId = id; });
    partsRef.current.push({
      id, kind, position: [x, 0, z], rotationY: 0, mesh: primary as THREE.Mesh,
      locked: false, layer: activeLayerRef.current,
    });
    setCount(partsRef.current.length);
    selectedRef.current = id;
    setSelectedId(id);
    setSelectedLocked(false);
  }, []);

  const deleteSelected = useCallback(() => {
    const id = selectedRef.current;
    if (!id) return;
    if (partsRef.current.find((p) => p.id === id)?.locked) return;
    const obj = findPartObject(id);
    const t = threeRef.current;
    if (obj && t) {
      t.partsRoot.remove(obj);
      disposeObjectResources(obj, false);
    }
    partsRef.current = partsRef.current.filter((p) => p.id !== id);
    selectedRef.current = null;
    setSelectedId(null);
    setSelectedLocked(false);
    setCount(partsRef.current.length);
    if (t) t.selectionHelper.visible = false;
  }, [findPartObject]);

  const rotateSelected = useCallback(() => {
    const id = selectedRef.current;
    if (!id) return;
    if (partsRef.current.find((p) => p.id === id)?.locked) return;
    const obj = findPartObject(id);
    if (!obj) return;
    const next = ((Math.round(obj.rotation.y / (Math.PI / 2)) % 4) + 4) % 4 + 1;
    obj.rotation.y = (next % 4) * (Math.PI / 2);
    const part = partsRef.current.find((p) => p.id === id);
    if (part) part.rotationY = obj.rotation.y;
  }, [findPartObject]);

  const toggleLockSelected = useCallback(() => {
    const id = selectedRef.current;
    if (!id) return;
    const part = partsRef.current.find((p) => p.id === id);
    if (!part) return;
    part.locked = !part.locked;
    setSelectedLocked(part.locked);
    setCount(partsRef.current.length);
  }, []);

  const setSelectedLayer = useCallback((layer: number) => {
    const id = selectedRef.current;
    if (!id) return;
    const part = partsRef.current.find((p) => p.id === id);
    if (!part) return;
    part.layer = Math.max(0, Math.min(LAYER_COUNT - 1, layer | 0));
    setCount(partsRef.current.length);
  }, []);

  const toggleLayerHidden = useCallback((layer: number) => {
    setLayerHidden((prev) => {
      const next = [...prev];
      next[layer] = !next[layer];
      layerHiddenRef.current = next;
      const t = threeRef.current;
      if (t) {
        for (const p of partsRef.current) {
          const obj = t.partsRoot.children.find((c) => c.userData.partId === p.id);
          if (obj) obj.visible = !next[p.layer ?? 0];
        }
      }
      const sel = selectedRef.current;
      if (sel) {
        const sp = partsRef.current.find((p) => p.id === sel);
        if (sp && next[sp.layer ?? 0]) {
          selectedRef.current = null;
          setSelectedId(null);
          setSelectedLocked(false);
          if (t) t.selectionHelper.visible = false;
        }
      }
      return next;
    });
  }, []);

  const selectPartById = useCallback((id: string) => {
    const part = partsRef.current.find((p) => p.id === id);
    if (!part || layerHiddenRef.current[part.layer ?? 0]) return;
    const obj = findPartObject(id);
    selectedRef.current = id;
    setSelectedId(id);
    setSelectedLocked(Boolean(part.locked));
    if (obj && threeRef.current) {
      threeRef.current.selectionHelper.setFromObject(obj);
      threeRef.current.selectionHelper.visible = true;
    }
  }, [findPartObject]);

  const clearAll = useCallback(() => {
    const t = threeRef.current;
    if (!t) return;
    for (const p of [...partsRef.current]) {
      const obj = findPartObject(p.id);
      if (obj) {
        t.partsRoot.remove(obj);
        disposeObjectResources(obj, false);
      }
    }
    partsRef.current = [];
    selectedRef.current = null;
    setSelectedId(null);
    setSelectedLocked(false);
    setCount(0);
    t.selectionHelper.visible = false;
  }, [findPartObject]);

  const toggleFullscreen = useCallback(async () => {
    const el = shellRef.current;
    if (!el) return;
    try {
      if (!document.fullscreenElement) await el.requestFullscreen();
      else await document.exitFullscreen();
    } catch { /* policy */ }
  }, []);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    try {
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      renderer.shadowMap.enabled = true;
      mount.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x87a8c8);
      scene.fog = new THREE.Fog(0x87a8c8, 40, 120);

      const camera = new THREE.PerspectiveCamera(55, mount.clientWidth / Math.max(mount.clientHeight, 1), 0.1, 200);
      camera.position.set(10, 8, 12);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.maxPolarAngle = Math.PI * 0.49;
      controls.target.set(0, 1, 0);

      scene.add(new THREE.HemisphereLight(0xb1e1ff, 0x4a5a3a, 0.85));
      const sun = new THREE.DirectionalLight(0xfff2d6, 1.15);
      sun.position.set(12, 20, 8);
      sun.castShadow = true;
      scene.add(sun);

      try {
        const sky = new Sky();
        sky.scale.setScalar(450);
        const u = (sky.material as THREE.ShaderMaterial).uniforms;
        u["turbidity"].value = 4;
        u["rayleigh"].value = 2.2;
        u["mieCoefficient"].value = 0.004;
        u["mieDirectionalG"].value = 0.8;
        u["sunPosition"].value.setFromSphericalCoords(1, Math.PI * 0.35, Math.PI * 0.2);
        scene.add(sky);
      } catch { /* optional */ }

      const mats = makeMaterials();
      const ground = new THREE.Mesh(new THREE.CircleGeometry(40, 64), mats.gravel);
      ground.rotation.x = -Math.PI / 2;
      ground.receiveShadow = true;
      scene.add(ground);

      const grass = new THREE.Mesh(new THREE.RingGeometry(18, 48, 64), mats.grass);
      grass.rotation.x = -Math.PI / 2;
      grass.position.y = -0.01;
      scene.add(grass);

      const partsRoot = new THREE.Group();
      scene.add(partsRoot);
      const selectionHelper = new THREE.BoxHelper(new THREE.Object3D(), 0xf59e0b);
      selectionHelper.visible = false;
      scene.add(selectionHelper);

      const raycaster = new THREE.Raycaster();
      const pointer = new THREE.Vector2();

      const onResize = () => {
        const w = mount.clientWidth;
        const h = Math.max(mount.clientHeight, 1);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener("resize", onResize);

      let anim = 0;
      const tick = () => {
        anim = requestAnimationFrame(tick);
        controls.update();
        const selId = selectedRef.current;
        if (selId) {
          let target: THREE.Object3D | null = null;
          partsRoot.traverse((c) => { if (c.userData.partId === selId) target = c; });
          if (target) {
            selectionHelper.setFromObject(target);
            selectionHelper.visible = true;
          }
        } else selectionHelper.visible = false;
        renderer.render(scene, camera);
      };
      tick();

      threeRef.current = {
        renderer, scene, camera, controls, raycaster, pointer, ground, partsRoot, mats, selectionHelper, anim,
      };
      setReady(true);

      return () => {
        cancelAnimationFrame(anim);
        window.removeEventListener("resize", onResize);
        controls.dispose();
        renderer.dispose();
        disposeCatalogMaterials(mats);
        if (renderer.domElement.parentElement === mount) mount.removeChild(renderer.domElement);
        threeRef.current = null;
      };
    } catch (e) {
      setError(e instanceof Error ? e.message : "WebGL error");
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    const t = threeRef.current;
    const canvas = t?.renderer.domElement;
    if (!t || !canvas) return;

    const setPointer = (ev: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      t.pointer.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
      t.pointer.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
    };
    const groundHit = () => {
      t.raycaster.setFromCamera(t.pointer, t.camera);
      const hits = t.raycaster.intersectObject(t.ground);
      return hits[0]?.point ?? null;
    };

    const onDown = (ev: PointerEvent) => {
      if (ev.button !== 0) return;
      setPointer(ev);
      t.raycaster.setFromCamera(t.pointer, t.camera);
      const meshes: THREE.Mesh[] = [];
      t.partsRoot.traverse((c) => {
        if (c instanceof THREE.Mesh && c.userData.partId && c.visible) meshes.push(c);
      });
      const hits = t.raycaster.intersectObjects(meshes, false);
      if (hits.length) {
        const id = hits[0].object.userData.partId as string;
        setSelectedId(id);
        selectedRef.current = id;
        const picked = partsRef.current.find((p) => p.id === id);
        setSelectedLocked(Boolean(picked?.locked));
        const obj = findPartObject(id);
        const point = groundHit();
        if (obj && point && !picked?.locked) {
          dragArmRef.current = {
            id,
            offset: new THREE.Vector3(point.x - obj.position.x, 0, point.z - obj.position.z),
            x: ev.clientX,
            y: ev.clientY,
          };
          t.controls.enabled = false;
          ev.preventDefault();
        }
        return;
      }
      const point = groundHit();
      if (point) placeAt(point, toolRef.current);
    };

    const onMove = (ev: PointerEvent) => {
      setPointer(ev);
      const arm = dragArmRef.current;
      if (arm && !draggingRef.current) {
        const dx = ev.clientX - arm.x;
        const dy = ev.clientY - arm.y;
        if (dx * dx + dy * dy > DRAG_ARM_PX * DRAG_ARM_PX) {
          draggingRef.current = { id: arm.id, offset: arm.offset };
        }
      }
      if (draggingRef.current) {
        const point = groundHit();
        const obj = findPartObject(draggingRef.current.id);
        if (point && obj) {
          obj.position.x = snap(point.x - draggingRef.current.offset.x);
          obj.position.z = snap(point.z - draggingRef.current.offset.z);
          const part = partsRef.current.find((p) => p.id === draggingRef.current!.id);
          if (part) part.position = [obj.position.x, obj.position.y, obj.position.z];
        }
      }
    };

    const onUp = () => {
      draggingRef.current = null;
      dragArmRef.current = null;
      if (t) t.controls.enabled = true;
    };

    canvas.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      canvas.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [ready, findPartObject, placeAt]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "Delete" || e.key === "Backspace") { e.preventDefault(); deleteSelected(); }
      if (e.key.toLowerCase() === "r") { e.preventDefault(); rotateSelected(); }
      if (e.key.toLowerCase() === "l") { e.preventDefault(); toggleLockSelected(); }
      if (e.key === "1") setTool("wall");
      if (e.key === "2") setTool("floor");
      if (e.key === "3") setTool("roof");
      if (e.key === "4") setTool("column");
      if (e.key === "5") setTool("door");
      if (e.key === "6") setTool("window");
      if (e.key === "7") setTool("stairs");
      if (e.key === "8") setTool("railing");
      if (e.key === "9") setTool("chimney");
      if (e.key === "0") setTool("beam");
      if (e.key.toLowerCase() === "c" && !e.ctrlKey) { e.preventDefault(); clearAll(); }
      if (e.key.toLowerCase() === "f") { e.preventDefault(); void toggleFullscreen(); }
      if (e.key === "Escape") {
        selectedRef.current = null;
        setSelectedId(null);
        setSelectedLocked(false);
        if (threeRef.current) threeRef.current.selectionHelper.visible = false;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [deleteSelected, rotateSelected, toggleLockSelected, clearAll, toggleFullscreen]);

  useEffect(() => {
    const onFs = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  const labels = es
    ? { wall: "Pared", floor: "Piso", roof: "Techo", column: "Columna", door: "Puerta", window: "Ventana", stairs: "Escalera", railing: "Baranda", chimney: "Chimenea", beam: "Viga", lock: "Bloquear", unlock: "Desbloquear", layers: "Capas", layer: "Capa", activeLayer: "Capa activa", locked: "Bloqueado", clear: "Limpiar", rot: "Girar", del: "Borrar", fullscreen: "Pantalla completa", exitFs: "Salir", none: "Nada seleccionado", parts: "piezas" }
    : { wall: "Wall", floor: "Floor", roof: "Roof", column: "Column", door: "Door", window: "Window", stairs: "Stairs", railing: "Railing", chimney: "Chimney", beam: "Beam", lock: "Lock", unlock: "Unlock", layers: "Layers", layer: "Layer", activeLayer: "Active layer", locked: "Locked", clear: "Clear", rot: "Rotate", del: "Delete", fullscreen: "Fullscreen", exitFs: "Exit", none: "Nothing selected", parts: "parts" };

  const kinds: PartKind[] = ["wall", "floor", "roof", "column", "door", "window", "stairs", "railing", "chimney", "beam"];
  const kindLabel = (k: PartKind) => labels[k];

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={rotateSelected} disabled={!selectedId || selectedLocked} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold hover:bg-accent disabled:opacity-40">
          {labels.rot} <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]">R</kbd>
        </button>
        <button type="button" onClick={toggleLockSelected} disabled={!selectedId} aria-pressed={selectedLocked}
          className={`inline-flex min-h-11 items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold hover:bg-accent disabled:opacity-40 ${selectedLocked ? "border-amber-700/70 bg-amber-900/15" : "border-border bg-card"}`}>
          {selectedLocked ? labels.unlock : labels.lock} <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]">L</kbd>
        </button>
        <button type="button" onClick={() => setShowLayers((v) => !v)} aria-pressed={showLayers}
          className={`inline-flex min-h-11 items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold hover:bg-accent ${showLayers ? "border-primary/50 bg-primary/10" : "border-border bg-card"}`}>
          {labels.layers}
        </button>
        <button type="button" onClick={deleteSelected} disabled={!selectedId || selectedLocked} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold hover:bg-accent disabled:opacity-40">
          {labels.del}
        </button>
        <button type="button" onClick={clearAll} disabled={count === 0} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold hover:bg-accent disabled:opacity-40">
          {labels.clear}
        </button>
        <button type="button" onClick={() => void toggleFullscreen()} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold hover:bg-accent">
          {isFullscreen ? labels.exitFs : labels.fullscreen}
        </button>
        <span className="self-center text-xs text-muted-foreground">{count} {labels.parts}</span>
      </div>

      {showLayers && (
        <div className="rounded-xl border border-border/70 bg-card p-3 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-bold">{labels.layers}</p>
            <p className="text-xs text-muted-foreground">{labels.activeLayer}: <span className="font-semibold text-foreground">{activeLayer + 1}</span></p>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {Array.from({ length: LAYER_COUNT }, (_, i) => (
              <button key={i} type="button" onClick={() => setActiveLayer(i)}
                className={`min-h-9 min-w-9 rounded-lg border px-2 text-xs font-bold ${activeLayer === i ? "border-primary bg-primary/15 text-primary" : "border-border bg-background hover:bg-accent"}`}>
                {i + 1}
              </button>
            ))}
          </div>
          {selectedId && (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground">{labels.layer}:</span>
              {Array.from({ length: LAYER_COUNT }, (_, i) => (
                <button key={`a-${i}`} type="button" onClick={() => setSelectedLayer(i)} className="min-h-8 rounded-md border border-border bg-background px-2 text-[11px] font-semibold hover:bg-accent">
                  → {i + 1}
                </button>
              ))}
            </div>
          )}
          <ul className="mt-3 max-h-48 space-y-2 overflow-y-auto text-sm">
            {Array.from({ length: LAYER_COUNT }, (_, layer) => {
              const items = partsRef.current.filter((p) => (p.layer ?? 0) === layer);
              return (
                <li key={layer} className="rounded-lg border border-border/60 bg-background/80 p-2">
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => toggleLayerHidden(layer)} className="min-h-8 rounded-md border border-border px-2 text-[11px] font-semibold hover:bg-accent">
                      {layerHidden[layer] ? "○" : "●"}
                    </button>
                    <span className="text-xs font-bold">{labels.layer} {layer + 1} <span className="font-normal text-muted-foreground">({items.length})</span></span>
                  </div>
                  {items.length > 0 && (
                    <ul className="mt-1.5 space-y-0.5">
                      {items.map((p) => (
                        <li key={p.id}>
                          <button type="button" onClick={() => selectPartById(p.id)} disabled={layerHidden[layer]}
                            className={`flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-xs hover:bg-accent disabled:opacity-40 ${selectedId === p.id ? "bg-primary/10 font-semibold text-primary" : ""}`}>
                            <span className="truncate">{kindLabel(p.kind)}</span>
                            {p.locked ? <span className="ml-auto text-[10px] uppercase text-amber-800 dark:text-amber-200">{labels.locked}</span> : null}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {error && <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}

      <div ref={shellRef} className={`relative flex overflow-hidden rounded-xl border border-border shadow-inner ${isFullscreen ? "h-screen w-screen rounded-none border-0" : "h-[min(72vh,680px)] w-full"}`}
        style={{ background: isFullscreen ? "#0a1210" : "linear-gradient(180deg, #87a8c8 0%, #c5d4a8 55%, #5a7a48 100%)" }}>
        <div className="relative min-h-0 min-w-0 flex-1">
          <div ref={mountRef} className="h-full w-full" style={{ touchAction: "none" }} />
          <div className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-white">
            {selectedId ? (selectedLocked ? labels.locked : kindLabel(partsRef.current.find((p) => p.id === selectedId)?.kind ?? "wall")) : labels.none}
          </div>
        </div>
        <aside className="flex w-36 shrink-0 flex-col gap-2 overflow-y-auto border-l border-border/70 bg-card/90 p-2 backdrop-blur">
          {kinds.map((kind, i) => (
            <button key={kind} type="button" onClick={() => setTool(kind)}
              className={`flex min-h-11 flex-col items-center gap-1 rounded-xl border px-2 py-2 text-center transition ${tool === kind ? "border-amber-700/70 bg-amber-900/20 ring-1 ring-amber-700/40" : "border-border bg-background/80 hover:bg-accent"}`}>
              <StructureGlyph kind={kind} />
              <span className="text-xs font-semibold">{kindLabel(kind)}</span>
              <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">{i === 9 ? "0" : String(i + 1)}</span>
            </button>
          ))}
        </aside>
      </div>
    </div>
  );
}
