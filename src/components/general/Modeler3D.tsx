import { useCallback, useEffect, useRef, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Mode = "translate" | "rotate" | "scale";
type ShapeKind = "box" | "sphere" | "cylinder" | "cone" | "plane";

type SceneObj = {
  id: string;
  name: string;
  kind: ShapeKind;
  color: string;
};

const COLORS = ["#f43f5e", "#8b5cf6", "#06b6d4", "#22c55e", "#f59e0b", "#e2e8f0"];

let idSeq = 1;
function nextId() {
  return `obj-${idSeq++}`;
}

export function Modeler3D({ locale = "en" }: { tool: GeneralTool; locale?: "en" | "es" }) {
  const es = locale === "es";
  const mountRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<HTMLDivElement>(null);
  const threeRef = useRef<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    THREE: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    scene: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    camera: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    renderer: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    controls: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    transform: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    raycaster: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pointer: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    meshes: Map<string, any>;
    anim: number;
  } | null>(null);

  const [objects, setObjects] = useState<SceneObj[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("translate");
  const [color, setColor] = useState("#8b5cf6");
  const [fullscreen, setFullscreen] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedIdRef = useRef<string | null>(null);
  const modeRef = useRef<Mode>("translate");
  selectedIdRef.current = selectedId;
  modeRef.current = mode;

  const syncTransformMode = useCallback(() => {
    const t = threeRef.current;
    if (!t?.transform) return;
    t.transform.setMode(modeRef.current);
  }, []);

  const selectMesh = useCallback(
    (id: string | null) => {
      const t = threeRef.current;
      setSelectedId(id);
      selectedIdRef.current = id;
      if (!t) return;
      if (id && t.meshes.has(id)) {
        t.transform.attach(t.meshes.get(id));
        t.transform.setMode(modeRef.current);
      } else {
        t.transform.detach();
      }
    },
    [],
  );

  const addShape = useCallback(
    (kind: ShapeKind) => {
      const t = threeRef.current;
      if (!t) return;
      const { THREE } = t;
      const id = nextId();
      const names: Record<ShapeKind, [string, string]> = {
        box: ["Cube", "Cubo"],
        sphere: ["Sphere", "Esfera"],
        cylinder: ["Cylinder", "Cilindro"],
        cone: ["Cone", "Cono"],
        plane: ["Plane", "Plano"],
      };
      const count = objects.filter((o) => o.kind === kind).length + 1;
      const name = `${es ? names[kind][1] : names[kind][0]} ${count}`;
      const mat = new THREE.MeshStandardMaterial({
        color: color,
        metalness: 0.12,
        roughness: 0.45,
      });
      let geo;
      switch (kind) {
        case "sphere":
          geo = new THREE.SphereGeometry(0.55, 32, 24);
          break;
        case "cylinder":
          geo = new THREE.CylinderGeometry(0.45, 0.45, 1.1, 28);
          break;
        case "cone":
          geo = new THREE.ConeGeometry(0.5, 1.1, 28);
          break;
        case "plane":
          geo = new THREE.BoxGeometry(1.4, 0.06, 1.4);
          break;
        default:
          geo = new THREE.BoxGeometry(1, 1, 1);
      }
      const mesh = new THREE.Mesh(geo, mat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.position.set((Math.random() - 0.5) * 1.2, kind === "plane" ? 0.03 : 0.55, (Math.random() - 0.5) * 1.2);
      mesh.userData = { id, kind };
      t.scene.add(mesh);
      t.meshes.set(id, mesh);
      setObjects((prev) => [...prev, { id, name, kind, color }]);
      selectMesh(id);
    },
    [color, es, objects, selectMesh],
  );

  const deleteSelected = useCallback(() => {
    const t = threeRef.current;
    const id = selectedIdRef.current;
    if (!t || !id) return;
    const mesh = t.meshes.get(id);
    if (mesh) {
      t.transform.detach();
      t.scene.remove(mesh);
      mesh.geometry?.dispose();
      mesh.material?.dispose();
      t.meshes.delete(id);
    }
    setObjects((prev) => prev.filter((o) => o.id !== id));
    selectMesh(null);
  }, [selectMesh]);

  const clearScene = useCallback(() => {
    const t = threeRef.current;
    if (!t) return;
    t.transform.detach();
    for (const [, mesh] of t.meshes) {
      t.scene.remove(mesh);
      mesh.geometry?.dispose();
      mesh.material?.dispose();
    }
    t.meshes.clear();
    setObjects([]);
    selectMesh(null);
  }, [selectMesh]);

  const applyColor = useCallback(
    (hex: string) => {
      setColor(hex);
      const t = threeRef.current;
      const id = selectedIdRef.current;
      if (!t || !id) return;
      const mesh = t.meshes.get(id);
      if (mesh?.material) {
        mesh.material.color.set(hex);
        setObjects((prev) => prev.map((o) => (o.id === id ? { ...o, color: hex } : o)));
      }
    },
    [],
  );

  const exportJson = useCallback(() => {
    const t = threeRef.current;
    if (!t) return;
    const payload = {
      version: 1,
      objects: [...t.meshes.entries()].map(([id, mesh]) => ({
        id,
        kind: mesh.userData.kind,
        color: `#${mesh.material.color.getHexString()}`,
        position: mesh.position.toArray(),
        rotation: [mesh.rotation.x, mesh.rotation.y, mesh.rotation.z],
        scale: mesh.scale.toArray(),
      })),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "utilihub-3d-scene.json";
    a.click();
    URL.revokeObjectURL(a.href);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const el = studioRef.current;
    if (!el) return;
    try {
      if (!document.fullscreenElement) {
        await el.requestFullscreen();
        setFullscreen(true);
      } else {
        await document.exitFullscreen();
        setFullscreen(false);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const onFs = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const mount = mountRef.current;
    if (!mount) return;

    (async () => {
      try {
        const THREE = await import("three");
        const { OrbitControls } = await import("three/examples/jsm/controls/OrbitControls.js");
        const { TransformControls } = await import("three/examples/jsm/controls/TransformControls.js");
        if (cancelled || !mountRef.current) return;

        const width = mount.clientWidth || 640;
        const height = mount.clientHeight || 400;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0f0a14);
        scene.fog = new THREE.Fog(0x0f0a14, 12, 28);

        const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 80);
        camera.position.set(3.2, 2.6, 4.2);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setSize(width, height);
        renderer.shadowMap.enabled = true;
        mount.appendChild(renderer.domElement);
        renderer.domElement.style.width = "100%";
        renderer.domElement.style.height = "100%";
        renderer.domElement.style.display = "block";
        renderer.domElement.style.borderRadius = "0.75rem";
        renderer.domElement.style.touchAction = "none";

        const amb = new THREE.AmbientLight(0xffffff, 0.55);
        scene.add(amb);
        const key = new THREE.DirectionalLight(0xffe4f0, 1.15);
        key.position.set(4, 8, 3);
        key.castShadow = true;
        key.shadow.mapSize.set(1024, 1024);
        scene.add(key);
        const fill = new THREE.DirectionalLight(0xa78bfa, 0.35);
        fill.position.set(-3, 2, -2);
        scene.add(fill);

        const grid = new THREE.GridHelper(10, 20, 0xf43f5e, 0x3b1d2e);
        grid.position.y = 0;
        scene.add(grid);

        const ground = new THREE.Mesh(
          new THREE.PlaneGeometry(10, 10),
          new THREE.ShadowMaterial({ opacity: 0.35 }),
        );
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        scene.add(ground);

        const axes = new THREE.AxesHelper(1.2);
        axes.position.y = 0.01;
        scene.add(axes);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.08;
        controls.maxPolarAngle = Math.PI * 0.49;
        controls.minDistance = 1.5;
        controls.maxDistance = 18;
        controls.target.set(0, 0.5, 0);

        const transform = new TransformControls(camera, renderer.domElement);
        transform.setSize(0.85);
        transform.addEventListener("dragging-changed", (event: { value: boolean }) => {
          controls.enabled = !event.value;
        });
        scene.add(transform.getHelper());

        const raycaster = new THREE.Raycaster();
        const pointer = new THREE.Vector2();
        const meshes = new Map();

        const onPointer = (event: PointerEvent) => {
          if (transform.dragging) return;
          const rect = renderer.domElement.getBoundingClientRect();
          pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
          pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
          raycaster.setFromCamera(pointer, camera);
          const hits = raycaster.intersectObjects([...meshes.values()]);
          if (hits.length > 0) {
            const id = hits[0]!.object.userData.id as string;
            selectedIdRef.current = id;
            setSelectedId(id);
            transform.attach(hits[0]!.object);
            transform.setMode(modeRef.current);
          }
        };
        renderer.domElement.addEventListener("pointerdown", onPointer);

        const resize = () => {
          if (!mountRef.current) return;
          const w = mountRef.current.clientWidth;
          const h = mountRef.current.clientHeight;
          if (w < 2 || h < 2) return;
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h, false);
        };
        const ro = new ResizeObserver(resize);
        ro.observe(mount);

        let anim = 0;
        const tick = () => {
          anim = requestAnimationFrame(tick);
          controls.update();
          renderer.render(scene, camera);
        };
        tick();

        threeRef.current = {
          THREE,
          scene,
          camera,
          renderer,
          controls,
          transform,
          raycaster,
          pointer,
          meshes,
          anim,
        };
        setReady(true);

        return () => {
          cancelAnimationFrame(anim);
          ro.disconnect();
          renderer.domElement.removeEventListener("pointerdown", onPointer);
          transform.dispose();
          controls.dispose();
          renderer.dispose();
          if (renderer.domElement.parentElement) {
            renderer.domElement.parentElement.removeChild(renderer.domElement);
          }
        };
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
        try {
          t.transform.dispose();
          t.controls.dispose();
          t.renderer.dispose();
          if (t.renderer.domElement.parentElement) {
            t.renderer.domElement.parentElement.removeChild(t.renderer.domElement);
          }
        } catch {
          /* */
        }
        threeRef.current = null;
      }
    };
  }, [es]);

  useEffect(() => {
    syncTransformMode();
  }, [mode, syncTransformMode]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "v" || e.key === "V") setMode("translate");
      if (e.key === "r" || e.key === "R") setMode("rotate");
      if (e.key === "s" || e.key === "S") setMode("scale");
      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        deleteSelected();
      }
      if (e.key === "f" || e.key === "F") void toggleFullscreen();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [deleteSelected, toggleFullscreen]);

  const shapes: { kind: ShapeKind; label: string; icon: string }[] = [
    { kind: "box", label: es ? "Cubo" : "Cube", icon: "■" },
    { kind: "sphere", label: es ? "Esfera" : "Sphere", icon: "●" },
    { kind: "cylinder", label: es ? "Cilindro" : "Cylinder", icon: "▮" },
    { kind: "cone", label: es ? "Cono" : "Cone", icon: "▲" },
    { kind: "plane", label: es ? "Plano" : "Plane", icon: "▬" },
  ];

  const modes: { id: Mode; label: string }[] = [
    { id: "translate", label: es ? "Mover" : "Move" },
    { id: "rotate", label: es ? "Rotar" : "Rotate" },
    { id: "scale", label: es ? "Escalar" : "Scale" },
  ];

  return (
    <div
      ref={studioRef}
      className={`-mx-1 overflow-hidden rounded-[1.5rem] border border-rose-400/25 bg-gradient-to-b from-[#1a0f18] via-[#120a12] to-[#0a060c] text-rose-50 shadow-[0_28px_70px_-24px_rgba(244,63,94,0.45),0_0_0_1px_rgba(244,63,94,0.12)] ${fullscreen ? "fixed inset-0 z-50 m-0 rounded-none border-0" : ""}`}
    >
      {/* Studio header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rose-500/20 bg-black/30 px-3 py-2.5 sm:px-4">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-rose-400 to-fuchsia-600 text-sm font-black text-white shadow-md">
            3D
          </span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-rose-300/80">
              {es ? "Estudio de diseño" : "Design studio"}
            </p>
            <p className="text-sm font-bold text-rose-50">{es ? "Modelador 3D" : "3D modeler"}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={exportJson}
            disabled={!ready || objects.length === 0}
            className="rounded-full border border-rose-400/30 bg-rose-500/15 px-3 py-1.5 text-xs font-semibold text-rose-100 hover:bg-rose-500/25 disabled:opacity-40"
          >
            {es ? "Exportar JSON" : "Export JSON"}
          </button>
          <button
            type="button"
            onClick={clearScene}
            disabled={!ready || objects.length === 0}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-rose-100/90 hover:bg-white/10 disabled:opacity-40"
          >
            {es ? "Limpiar" : "Clear"}
          </button>
          <button
            type="button"
            onClick={() => void toggleFullscreen()}
            className="rounded-full bg-gradient-to-b from-rose-300 to-rose-600 px-3 py-1.5 text-xs font-bold text-rose-950 shadow-md hover:from-rose-200 hover:to-rose-500"
          >
            {fullscreen ? (es ? "Salir" : "Exit") : es ? "Pantalla completa" : "Fullscreen"}
          </button>
        </div>
      </div>

      <div className={`flex flex-col gap-0 lg:flex-row ${fullscreen ? "h-[calc(100vh-48px)]" : ""}`}>
        {/* Left rail */}
        <aside className="flex shrink-0 flex-row gap-2 overflow-x-auto border-b border-rose-500/15 bg-black/20 p-2.5 lg:w-36 lg:flex-col lg:overflow-y-auto lg:border-b-0 lg:border-r">
          <p className="hidden text-[10px] font-bold uppercase tracking-wider text-rose-300/70 lg:block">
            {es ? "Formas" : "Shapes"}
          </p>
          {shapes.map((s) => (
            <button
              key={s.kind}
              type="button"
              disabled={!ready}
              onClick={() => addShape(s.kind)}
              className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-xl border border-rose-400/20 bg-rose-950/40 px-3 text-xs font-semibold text-rose-50 transition hover:border-rose-400/50 hover:bg-rose-900/50 disabled:opacity-40 lg:w-full"
            >
              <span className="text-base text-rose-300" aria-hidden>
                {s.icon}
              </span>
              {s.label}
            </button>
          ))}
          <div className="my-1 hidden h-px bg-rose-500/20 lg:block" />
          <p className="hidden text-[10px] font-bold uppercase tracking-wider text-rose-300/70 lg:block">
            {es ? "Color" : "Color"}
          </p>
          <div className="flex items-center gap-1.5 px-1">
            {COLORS.map((c) => (
              <button
                key={c}
                type="button"
                title={c}
                onClick={() => applyColor(c)}
                className={`size-6 rounded-full border-2 transition ${color === c ? "border-white scale-110" : "border-transparent"}`}
                style={{ backgroundColor: c }}
              />
            ))}
            <input
              type="color"
              value={color}
              onChange={(e) => applyColor(e.target.value)}
              className="size-6 cursor-pointer rounded border-0 bg-transparent"
              title={es ? "Color personalizado" : "Custom color"}
            />
          </div>
        </aside>

        {/* Viewport — same scale family as simulators */}
        <div className="relative min-w-0 flex-1 p-2.5 sm:p-3">
          <div
            ref={mountRef}
            className={`relative w-full overflow-hidden rounded-xl border border-rose-500/20 bg-[#0f0a14] ${fullscreen ? "h-full min-h-[280px]" : "aspect-[5/3.4] min-h-[280px] max-h-[520px] sm:min-h-[340px]"}`}
          >
            {!ready && !error && (
              <p className="absolute inset-0 flex items-center justify-center text-sm text-rose-200/60">
                {es ? "Cargando estudio 3D…" : "Loading 3D studio…"}
              </p>
            )}
            {error && (
              <p className="absolute inset-0 flex items-center justify-center px-4 text-center text-sm text-rose-300">
                {error}
              </p>
            )}
          </div>

          {/* Transform toolbar */}
          <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1.5">
              {modes.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMode(m.id)}
                  className={
                    mode === m.id
                      ? "rounded-full bg-gradient-to-b from-rose-300 to-rose-600 px-3 py-1.5 text-xs font-bold text-rose-950 shadow"
                      : "rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-rose-100/90 hover:bg-white/10"
                  }
                >
                  {m.label}
                </button>
              ))}
              <button
                type="button"
                onClick={deleteSelected}
                disabled={!selectedId}
                className="rounded-full border border-rose-500/30 bg-rose-950/50 px-3 py-1.5 text-xs font-semibold text-rose-200 hover:bg-rose-900/60 disabled:opacity-40"
              >
                {es ? "Eliminar" : "Delete"}
              </button>
            </div>
            <p className="text-[10px] text-rose-300/50">
              {es ? "V mover · R rotar · S escalar · F pantalla completa · Supr borrar" : "V move · R rotate · S scale · F fullscreen · Del delete"}
            </p>
          </div>
        </div>

        {/* Object list */}
        <aside className="max-h-40 shrink-0 overflow-y-auto border-t border-rose-500/15 bg-black/25 p-2.5 lg:max-h-none lg:w-40 lg:border-l lg:border-t-0">
          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-rose-300/70">
            {es ? "Objetos" : "Objects"} ({objects.length})
          </p>
          {objects.length === 0 ? (
            <p className="text-[11px] leading-relaxed text-rose-200/45">
              {es ? "Agregá una forma desde la barra." : "Add a shape from the bar."}
            </p>
          ) : (
            <ul className="space-y-1">
              {objects.map((o) => (
                <li key={o.id}>
                  <button
                    type="button"
                    onClick={() => selectMesh(o.id)}
                    className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs font-medium transition ${
                      selectedId === o.id
                        ? "bg-rose-500/25 text-rose-50 ring-1 ring-rose-400/40"
                        : "text-rose-100/80 hover:bg-white/5"
                    }`}
                  >
                    <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: o.color }} />
                    <span className="truncate">{o.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>
    </div>
  );
}
