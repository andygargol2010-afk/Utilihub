import type { GeneralTool } from "@/lib/general/types";
import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Sky } from "three/examples/jsm/objects/Sky.js";

type PartKind = "wall" | "floor" | "roof";
type Locale = "en" | "es";

type ScenePart = {
  id: string;
  kind: PartKind;
  position: [number, number, number];
  rotationY: number;
  mesh: THREE.Mesh;
};

const GRID = 0.5;

function snap(v: number) {
  return Math.round(v / GRID) * GRID;
}

function uid() {
  return `p-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

/** Architectural materials — warm concrete / timber / clay (not toy-studio neon). */
function makeMaterials() {
  const wall = new THREE.MeshStandardMaterial({
    color: 0xd8d0c4,
    roughness: 0.82,
    metalness: 0.04,
  });
  const wallEdge = new THREE.MeshStandardMaterial({
    color: 0xb8aea0,
    roughness: 0.75,
    metalness: 0.02,
  });
  const floor = new THREE.MeshStandardMaterial({
    color: 0x8b7355,
    roughness: 0.7,
    metalness: 0.05,
  });
  const roof = new THREE.MeshStandardMaterial({
    color: 0x6b3a2a,
    roughness: 0.78,
    metalness: 0.08,
  });
  const ground = new THREE.MeshStandardMaterial({
    color: 0x4a6741,
    roughness: 0.95,
    metalness: 0,
  });
  return { wall, wallEdge, floor, roof, ground };
}

function createWallMesh(mats: ReturnType<typeof makeMaterials>) {
  const group = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(3, 2.6, 0.2), mats.wall);
  body.position.y = 1.3;
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);
  const base = new THREE.Mesh(new THREE.BoxGeometry(3.05, 0.12, 0.24), mats.wallEdge);
  base.position.y = 0.06;
  base.castShadow = true;
  group.add(base);
  return group;
}

function createFloorMesh(mats: ReturnType<typeof makeMaterials>) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(3, 0.08, 3), mats.floor);
  mesh.position.y = 0.04;
  mesh.receiveShadow = true;
  mesh.castShadow = true;
  return mesh;
}

function createRoofMesh(mats: ReturnType<typeof makeMaterials>) {
  const group = new THREE.Group();
  const left = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.12, 1.8), mats.roof);
  left.position.set(0, 2.85, -0.55);
  left.rotation.x = 0.45;
  left.castShadow = true;
  const right = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.12, 1.8), mats.roof);
  right.position.set(0, 2.85, 0.55);
  right.rotation.x = -0.45;
  right.castShadow = true;
  group.add(left, right);
  return group;
}

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
    ghost: THREE.Object3D | null;
    anim: number;
  } | null>(null);
  const partsRef = useRef<ScenePart[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tool, setTool] = useState<PartKind>("wall");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [count, setCount] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [placingFromPalette, setPlacingFromPalette] = useState(false);
  const toolRef = useRef(tool);
  const selectedRef = useRef(selectedId);
  const draggingRef = useRef<{ id: string; offset: THREE.Vector3 } | null>(null);
  const paletteDragRef = useRef<PartKind | null>(null);

  useEffect(() => {
    toolRef.current = tool;
  }, [tool]);
  useEffect(() => {
    selectedRef.current = selectedId;
  }, [selectedId]);

  const worldPointFromEvent = useCallback((clientX: number, clientY: number) => {
    const t = threeRef.current;
    if (!t || !mountRef.current) return null;
    const rect = mountRef.current.getBoundingClientRect();
    t.pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    t.pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    t.raycaster.setFromCamera(t.pointer, t.camera);
    const hits = t.raycaster.intersectObject(t.ground);
    if (!hits.length) return null;
    return hits[0].point;
  }, []);

  const clearGhost = useCallback(() => {
    const t = threeRef.current;
    if (!t?.ghost) return;
    t.partsRoot.remove(t.ghost);
    t.ghost = null;
  }, []);

  const makeGhost = useCallback(
    (kind: PartKind) => {
      const t = threeRef.current;
      if (!t) return;
      clearGhost();
      let obj: THREE.Object3D;
      if (kind === "wall") obj = createWallMesh(t.mats);
      else if (kind === "floor") obj = createFloorMesh(t.mats);
      else obj = createRoofMesh(t.mats);
      obj.traverse((c) => {
        if (c instanceof THREE.Mesh && c.material) {
          const m = (c.material as THREE.MeshStandardMaterial).clone();
          m.transparent = true;
          m.opacity = 0.45;
          m.depthWrite = false;
          c.material = m;
        }
      });
      t.ghost = obj;
      t.partsRoot.add(obj);
    },
    [clearGhost],
  );

  useEffect(() => {
    if (!ready) return;
    makeGhost(tool);
  }, [tool, ready, makeGhost]);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    let disposed = false;
    try {
      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0xb8c4d4, 0.012);

      const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 500);
      camera.position.set(12, 9, 14);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(el.clientWidth, el.clientHeight);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      el.appendChild(renderer.domElement);

      const sky = new Sky();
      sky.scale.setScalar(450);
      scene.add(sky);
      const skyUniforms = sky.material.uniforms;
      skyUniforms["turbidity"].value = 4.2;
      skyUniforms["rayleigh"].value = 2.1;
      skyUniforms["mieCoefficient"].value = 0.004;
      skyUniforms["mieDirectionalG"].value = 0.8;
      const sun = new THREE.Vector3();
      const phi = THREE.MathUtils.degToRad(88.5);
      const theta = THREE.MathUtils.degToRad(165);
      sun.setFromSphericalCoords(1, phi, theta);
      skyUniforms["sunPosition"].value.copy(sun);

      const hemi = new THREE.HemisphereLight(0xc8d8f0, 0x6b5a45, 0.55);
      scene.add(hemi);
      const dir = new THREE.DirectionalLight(0xfff2dd, 1.35);
      dir.position.copy(sun).multiplyScalar(40);
      dir.castShadow = true;
      dir.shadow.mapSize.set(2048, 2048);
      dir.shadow.camera.near = 1;
      dir.shadow.camera.far = 80;
      dir.shadow.camera.left = -30;
      dir.shadow.camera.right = 30;
      dir.shadow.camera.top = 30;
      dir.shadow.camera.bottom = -30;
      dir.shadow.bias = -0.0002;
      scene.add(dir);
      scene.add(new THREE.AmbientLight(0xffffff, 0.18));

      const mats = makeMaterials();

      const groundGeo = new THREE.CircleGeometry(120, 64);
      const ground = new THREE.Mesh(groundGeo, mats.ground);
      ground.rotation.x = -Math.PI / 2;
      ground.receiveShadow = true;
      scene.add(ground);

      const ringMat = new THREE.LineBasicMaterial({ color: 0x3d5238, transparent: true, opacity: 0.25 });
      for (let r = 5; r <= 40; r += 5) {
        const pts = [];
        for (let i = 0; i <= 64; i++) {
          const a = (i / 64) * Math.PI * 2;
          pts.push(new THREE.Vector3(Math.cos(a) * r, 0.02, Math.sin(a) * r));
        }
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), ringMat));
      }

      const partsRoot = new THREE.Group();
      scene.add(partsRoot);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.06;
      controls.maxPolarAngle = Math.PI * 0.49;
      controls.minDistance = 2;
      controls.maxDistance = 80;
      controls.target.set(0, 1, 0);

      const raycaster = new THREE.Raycaster();
      const pointer = new THREE.Vector2();

      const onResize = () => {
        if (!mountRef.current) return;
        const w = mountRef.current.clientWidth;
        const h = mountRef.current.clientHeight;
        camera.aspect = w / Math.max(h, 1);
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener("resize", onResize);
      onResize();

      threeRef.current = {
        renderer,
        scene,
        camera,
        controls,
        raycaster,
        pointer,
        ground,
        partsRoot,
        mats,
        ghost: null,
        anim: 0,
      };

      const tick = () => {
        if (disposed) return;
        controls.update();
        renderer.render(scene, camera);
        threeRef.current!.anim = requestAnimationFrame(tick);
      };
      tick();
      setReady(true);
      setError(null);

      return () => {
        disposed = true;
        window.removeEventListener("resize", onResize);
        cancelAnimationFrame(threeRef.current?.anim ?? 0);
        controls.dispose();
        renderer.dispose();
        if (renderer.domElement.parentElement === el) el.removeChild(renderer.domElement);
        threeRef.current = null;
        partsRef.current = [];
      };
    } catch (e) {
      setError(e instanceof Error ? e.message : "WebGL error");
      return;
    }
  }, []);

  // Keep renderer size in sync when entering/leaving fullscreen
  useEffect(() => {
    const t = threeRef.current;
    if (!t || !mountRef.current) return;
    const w = mountRef.current.clientWidth;
    const h = mountRef.current.clientHeight;
    t.camera.aspect = w / Math.max(h, 1);
    t.camera.updateProjectionMatrix();
    t.renderer.setSize(w, h);
  }, [isFullscreen, ready]);

  const placeAt = useCallback((point: THREE.Vector3, kind: PartKind) => {
    const t = threeRef.current;
    if (!t) return;
    const x = snap(point.x);
    const z = snap(point.z);
    let obj: THREE.Object3D;
    if (kind === "wall") obj = createWallMesh(t.mats);
    else if (kind === "floor") obj = createFloorMesh(t.mats);
    else obj = createRoofMesh(t.mats);
    obj.position.set(x, 0, z);
    t.partsRoot.add(obj);
    let primary: THREE.Mesh | null = null;
    obj.traverse((c) => {
      if (!primary && c instanceof THREE.Mesh) primary = c;
    });
    if (!primary) return;
    const id = uid();
    (primary as THREE.Mesh).userData.partId = id;
    obj.userData.partId = id;
    partsRef.current.push({
      id,
      kind,
      position: [x, 0, z],
      rotationY: 0,
      mesh: primary as THREE.Mesh,
    });
    setCount(partsRef.current.length);
    setSelectedId(id);
  }, []);

  const findPartObject = useCallback((id: string) => {
    const t = threeRef.current;
    if (!t) return null;
    let found: THREE.Object3D | null = null;
    t.partsRoot.traverse((c) => {
      if (c.userData.partId === id && c.parent === t.partsRoot) found = c;
    });
    return found;
  }, []);

  const deleteSelected = useCallback(() => {
    const id = selectedRef.current;
    if (!id) return;
    const obj = findPartObject(id);
    const t = threeRef.current;
    if (obj && t) t.partsRoot.remove(obj);
    partsRef.current = partsRef.current.filter((p) => p.id !== id);
    setSelectedId(null);
    setCount(partsRef.current.length);
  }, [findPartObject]);

  const rotateSelected = useCallback(() => {
    const id = selectedRef.current;
    if (!id) return;
    const obj = findPartObject(id);
    if (!obj) return;
    obj.rotation.y += Math.PI / 2;
    const part = partsRef.current.find((p) => p.id === id);
    if (part) part.rotationY = obj.rotation.y;
  }, [findPartObject]);

  const clearAll = useCallback(() => {
    const t = threeRef.current;
    if (!t) return;
    for (const p of [...partsRef.current]) {
      const obj = findPartObject(p.id);
      if (obj) t.partsRoot.remove(obj);
    }
    partsRef.current = [];
    setSelectedId(null);
    setCount(0);
  }, [findPartObject]);

  const toggleFullscreen = useCallback(async () => {
    const shell = shellRef.current;
    if (!shell) return;
    try {
      if (!document.fullscreenElement) {
        await shell.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch {
      // Fullscreen may be blocked by browser policy
    }
  }, []);

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  // Canvas pointer interactions
  useEffect(() => {
    const el = mountRef.current;
    if (!el || !ready) return;
    const t = threeRef.current;
    if (!t) return;

    const onMove = (ev: PointerEvent) => {
      const point = worldPointFromEvent(ev.clientX, ev.clientY);
      if (!point) return;
      if (t.ghost) {
        t.ghost.position.set(snap(point.x), 0, snap(point.z));
      }
      if (draggingRef.current) {
        const obj = findPartObject(draggingRef.current.id);
        if (obj) {
          obj.position.x = snap(point.x - draggingRef.current.offset.x);
          obj.position.z = snap(point.z - draggingRef.current.offset.z);
        }
      }
    };

    const onDown = (ev: PointerEvent) => {
      if (ev.button !== 0) return;
      const point = worldPointFromEvent(ev.clientX, ev.clientY);
      if (!point) return;

      // If dragging from palette, place on release handled in window pointerup
      if (paletteDragRef.current) {
        placeAt(point, paletteDragRef.current);
        paletteDragRef.current = null;
        setPlacingFromPalette(false);
        t.controls.enabled = true;
        return;
      }

      const rect = el.getBoundingClientRect();
      t.pointer.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
      t.pointer.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
      t.raycaster.setFromCamera(t.pointer, t.camera);
      const meshes: THREE.Object3D[] = [];
      t.partsRoot.traverse((c) => {
        if (c instanceof THREE.Mesh && c.userData.partId) meshes.push(c);
      });
      const hits = t.raycaster.intersectObjects(meshes, false);
      if (hits.length) {
        const id = hits[0].object.userData.partId as string;
        setSelectedId(id);
        const obj = findPartObject(id);
        if (obj) {
          draggingRef.current = {
            id,
            offset: new THREE.Vector3(point.x - obj.position.x, 0, point.z - obj.position.z),
          };
          t.controls.enabled = false;
        }
        return;
      }

      // Click ground with active tool → place
      placeAt(point, toolRef.current);
      t.controls.enabled = false;
    };

    const onUp = () => {
      if (draggingRef.current) {
        const id = draggingRef.current.id;
        const obj = findPartObject(id);
        const part = partsRef.current.find((p) => p.id === id);
        if (obj && part) {
          part.position = [obj.position.x, 0, obj.position.z];
        }
      }
      draggingRef.current = null;
      t.controls.enabled = true;
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [ready, worldPointFromEvent, placeAt, findPartObject]);

  // Global pointer move while dragging from palette (ghost follows even outside canvas)
  useEffect(() => {
    if (!placingFromPalette) return;
    const onMove = (ev: PointerEvent) => {
      const point = worldPointFromEvent(ev.clientX, ev.clientY);
      const t = threeRef.current;
      if (point && t?.ghost) {
        t.ghost.position.set(snap(point.x), 0, snap(point.z));
      }
    };
    const onUp = (ev: PointerEvent) => {
      const kind = paletteDragRef.current;
      if (!kind) {
        setPlacingFromPalette(false);
        return;
      }
      const point = worldPointFromEvent(ev.clientX, ev.clientY);
      if (point) {
        placeAt(point, kind);
      }
      paletteDragRef.current = null;
      setPlacingFromPalette(false);
      if (threeRef.current) threeRef.current.controls.enabled = true;
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [placingFromPalette, worldPointFromEvent, placeAt]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        deleteSelected();
      }
      if (e.key.toLowerCase() === "r") {
        e.preventDefault();
        rotateSelected();
      }
      if (e.key === "1") setTool("wall");
      if (e.key === "2") setTool("floor");
      if (e.key === "3") setTool("roof");
      if (e.key.toLowerCase() === "f") {
        e.preventDefault();
        void toggleFullscreen();
      }
      if (e.key === "Escape") {
        if (document.fullscreenElement) {
          void document.exitFullscreen();
        } else {
          setSelectedId(null);
        }
      }
      if (e.key.toLowerCase() === "c" && (e.ctrlKey || e.metaKey)) {
        // allow browser copy; ignore
      } else if (e.key.toLowerCase() === "c" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        clearAll();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [deleteSelected, rotateSelected, toggleFullscreen, clearAll]);

  const startPaletteDrag = (kind: PartKind) => (ev: React.PointerEvent) => {
    ev.preventDefault();
    setTool(kind);
    paletteDragRef.current = kind;
    setPlacingFromPalette(true);
    if (threeRef.current) threeRef.current.controls.enabled = false;
    makeGhost(kind);
  };

  const labels = es
    ? {
        title: "Modelador de casas 3D",
        wall: "Pared",
        floor: "Piso",
        roof: "Techo",
        place: "Arrastrá desde la barra derecha al terreno · o hacé clic en el suelo",
        cam: "Cámara libre: botón derecho / medio · rueda zoom",
        rot: "Rotar 90°",
        del: "Eliminar",
        clear: "Limpiar",
        parts: "elementos",
        fullscreen: "Pantalla completa",
        exitFs: "Salir",
        tip: "Atajos: 1 pared · 2 piso · 3 techo · R rotar · Supr borrar · C limpiar · F pantalla completa · Esc cancelar",
        palette: "Estructuras",
        dragHint: "Arrastrá al terreno",
      }
    : {
        title: "3D house modeler",
        wall: "Wall",
        floor: "Floor",
        roof: "Roof",
        place: "Drag from the right toolbar onto the ground · or click the ground",
        cam: "Free camera: right/middle drag · scroll zoom",
        rot: "Rotate 90°",
        del: "Delete",
        clear: "Clear",
        parts: "parts",
        fullscreen: "Fullscreen",
        exitFs: "Exit",
        tip: "Shortcuts: 1 wall · 2 floor · 3 roof · R rotate · Del delete · C clear · F fullscreen · Esc cancel",
        palette: "Structures",
        dragHint: "Drag to ground",
      };

  const paletteItems: { kind: PartKind; label: string; swatch: string; key: string }[] = [
    { kind: "wall", label: labels.wall, swatch: "#d8d0c4", key: "1" },
    { kind: "floor", label: labels.floor, swatch: "#8b7355", key: "2" },
    { kind: "roof", label: labels.roof, swatch: "#6b3a2a", key: "3" },
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-sm font-semibold text-foreground">{labels.title}</p>
        <span className="text-xs text-muted-foreground">
          {count} {labels.parts}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={rotateSelected}
          className="rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold hover:bg-accent"
          title="R"
        >
          {labels.rot}
        </button>
        <button
          type="button"
          onClick={deleteSelected}
          className="rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold hover:bg-accent"
          title="Del"
        >
          {labels.del}
        </button>
        <button
          type="button"
          onClick={clearAll}
          className="rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold hover:bg-accent"
          title="C"
        >
          {labels.clear}
        </button>
        <button
          type="button"
          onClick={() => void toggleFullscreen()}
          className="rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold hover:bg-accent"
          title="F"
        >
          {isFullscreen ? labels.exitFs : labels.fullscreen}
        </button>
      </div>

      <p className="text-xs text-muted-foreground">{labels.place}</p>
      <p className="text-xs text-muted-foreground">{labels.cam}</p>
      <p className="text-xs text-muted-foreground">{labels.tip}</p>

      {error && (
        <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <div
        ref={shellRef}
        className={`relative flex overflow-hidden rounded-xl border border-border shadow-inner ${
          isFullscreen ? "h-screen w-screen rounded-none border-0" : "h-[min(70vh,640px)] w-full"
        }`}
        style={{
          background: isFullscreen
            ? "#0a1210"
            : "linear-gradient(180deg, #87a8c8 0%, #c5d4a8 55%, #5a7a48 100%)",
        }}
      >
        {/* 3D canvas */}
        <div
          ref={mountRef}
          className="relative min-h-0 min-w-0 flex-1"
          style={{ touchAction: "none" }}
        />

        {/* Right structure palette — drag to place */}
        <aside
          className={`flex shrink-0 flex-col gap-2 border-l border-border/60 bg-card/95 p-2 backdrop-blur-sm ${
            isFullscreen ? "w-36" : "w-32 sm:w-36"
          }`}
        >
          <p className="px-1 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
            {labels.palette}
          </p>
          <p className="px-1 text-[10px] text-muted-foreground">{labels.dragHint}</p>
          {paletteItems.map((item) => (
            <button
              key={item.kind}
              type="button"
              onPointerDown={startPaletteDrag(item.kind)}
              onClick={() => setTool(item.kind)}
              className={`group flex cursor-grab flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-center transition active:cursor-grabbing ${
                tool === item.kind
                  ? "border-amber-700/60 bg-amber-900/20 shadow-sm"
                  : "border-border bg-background/80 hover:bg-accent"
              } ${placingFromPalette && paletteDragRef.current === item.kind ? "ring-2 ring-amber-600" : ""}`}
            >
              <span
                className="block h-8 w-10 rounded-md border border-black/10 shadow-inner"
                style={{ background: item.swatch }}
                aria-hidden
              />
              <span className="text-xs font-semibold text-foreground">{item.label}</span>
              <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
                {item.key}
              </span>
            </button>
          ))}

          {isFullscreen && (
            <button
              type="button"
              onClick={() => void toggleFullscreen()}
              className="mt-auto rounded-lg border border-border bg-background px-2 py-2 text-xs font-semibold hover:bg-accent"
            >
              {labels.exitFs} (F)
            </button>
          )}
        </aside>
      </div>
    </div>
  );
}
