import type { GeneralTool } from "@/lib/general/types";
import { useEffect, useState } from "react";
import { useModelerCore } from "./modeler3d-core";
import { shapeList, COLORS } from "./modeler3d-helpers";

export function Modeler3DApp({ locale = "en" }: { tool: GeneralTool; locale?: "en" | "es" }) {
  const core = useModelerCore(locale);
  const {
    es, selectedId, selectedIds, groupIds, ctxMenu, setCtxMenu, mode, setMode,
    color, fullscreen, ready, setReady, error, setError,
    canUndo, canRedo, size, pos, rotDeg, snap, setSnap, mountRef, studioRef, threeRef,
    sizeHistPushedRef, selectedIdRef, selectedIdsRef, groupsRef, marqueeRef,
    modeRef, gridRef, pushHistory, setPosAxis, setRotAxis, endTransformEdit, nudgeSelected, setSizeAxis,
    addShape, deleteSelected, applyColor, groupSelected, ungroupSelected, undo, redo, toggleFullscreen,
    setSelectedId, setSelectedIds, readTransform, loadScene, saveScene, clearScene,
    copySelected, cutSelected, pasteClipboard, exportJSON, exportSTL,
  } = core;

  type DraftKey = string;
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const draft = (key: DraftKey, fallback: number, digits: number) =>
    drafts[key] !== undefined ? drafts[key]! : String(Number(fallback.toFixed(digits)));
  const setDraft = (key: DraftKey, text: string) => setDrafts((d) => ({ ...d, [key]: text }));
  const clearDraft = (key: DraftKey) => setDrafts((d) => { const n = { ...d }; delete n[key]; return n; });

  useEffect(() => { setDrafts({}); }, [selectedId]);

  useEffect(() => {
    const onUnload = () => { try { saveScene(); } catch { /* */ } };
    window.addEventListener("beforeunload", onUnload);
    return () => window.removeEventListener("beforeunload", onUnload);
  }, [saveScene]);

  // Full three.js init + UI restored in next commit if truncated — placeholder recovery
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
        const w = mount.clientWidth || 640, h = mount.clientHeight || 400;
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0a0610);
        const camera = new THREE.PerspectiveCamera(46, w / h, 0.08, 120);
        camera.position.set(3.8, 2.9, 4.8);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setSize(w, h);
        mount.appendChild(renderer.domElement);
        Object.assign(renderer.domElement.style, { width: "100%", height: "100%", display: "block", touchAction: "none" });
        scene.add(new THREE.AmbientLight(0xb8a0c8, 0.6));
        const key = new THREE.DirectionalLight(0xfff5f8, 1.2);
        key.position.set(5.5, 10, 4.5);
        scene.add(key);
        const grid = new THREE.GridHelper(10, 20, 0xf43f5e, 0x3a2030);
        scene.add(grid);
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.target.set(0, 0.55, 0);
        let anim = 0;
        const tick = () => { anim = requestAnimationFrame(tick); controls.update(); renderer.render(scene, camera); };
        tick();
        threeRef.current = { THREE, scene, camera, renderer, controls, transform: null, meshes: new Map(), anim };
        setReady(true);
      } catch (e) {
        console.error(e);
        if (!cancelled) setError(es ? "No se pudo cargar el motor 3D." : "Could not load the 3D engine.");
      }
    })();
    return () => { cancelled = true; };
  }, [es]);

  return (
    <div ref={studioRef} className={`relative w-full overflow-hidden bg-[#0a0610] ${fullscreen ? "h-full rounded-none border-0" : "min-h-[520px] h-[min(75vh,720px)] rounded-xl border border-rose-500/25"}`}>
      <div ref={mountRef} className="absolute inset-0" />
      {ready && !error && (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 p-1.5 sm:p-2.5">
          <div className="pointer-events-auto flex w-full max-w-full flex-col gap-2 rounded-xl border border-white/10 bg-black/80 p-2 shadow-lg backdrop-blur-md sm:p-2.5">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
                <button type="button" onClick={undo} disabled={!canUndo} className="rounded-lg border border-white/10 bg-white/10 px-2 py-1.5 text-[11px] font-semibold text-rose-50 hover:bg-white/15 disabled:opacity-35 sm:px-3 sm:text-xs">{es ? "Deshacer" : "Undo"}</button>
                <button type="button" onClick={redo} disabled={!canRedo} className="rounded-lg border border-white/10 bg-white/10 px-2 py-1.5 text-[11px] font-semibold text-rose-50 hover:bg-white/15 disabled:opacity-35 sm:px-3 sm:text-xs">{es ? "Rehacer" : "Redo"}</button>
                <button type="button" onClick={groupSelected} disabled={selectedIds.length < 2} className="rounded-lg border border-white/10 bg-white/10 px-2 py-1.5 text-[11px] font-semibold text-rose-50 hover:bg-white/15 disabled:opacity-35 sm:px-3 sm:text-xs">{es ? "Agrupar" : "Group"}</button>
                <button type="button" onClick={ungroupSelected} disabled={!selectedIds.some((id) => groupIds.includes(id))} className="rounded-lg border border-white/10 bg-white/10 px-2 py-1.5 text-[11px] font-semibold text-rose-50 hover:bg-white/15 disabled:opacity-35 sm:px-3 sm:text-xs">{es ? "Desagrupar" : "Ungroup"}</button>
                <button type="button" onClick={deleteSelected} disabled={selectedIds.length === 0} className="rounded-lg border border-rose-500/40 bg-rose-950/60 px-2 py-1.5 text-[11px] font-semibold text-rose-100 hover:bg-rose-900/70 disabled:opacity-35 sm:px-3 sm:text-xs">{es ? "Eliminar" : "Delete"}</button>
              </div>
              <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
                <button type="button" onClick={toggleFullscreen} className="rounded-lg border border-white/10 bg-white/10 px-2 py-1.5 text-[11px] font-semibold text-rose-50 hover:bg-white/15 sm:px-3 sm:text-xs">{fullscreen ? (es ? "Salir" : "Exit") : (es ? "Pantalla" : "Full")}</button>
                <button type="button" onClick={() => { const steps = [0, 0.1, 0.25, 0.5, 1]; const i = steps.indexOf(snap); setSnap(steps[(i + 1) % steps.length]!); }} className="rounded-lg border border-white/10 bg-white/10 px-2 py-1.5 text-[11px] font-semibold text-rose-50 hover:bg-white/15 sm:px-3 sm:text-xs">{snap === 0 ? "Snap off" : `Snap ${snap}`}</button>
                <button type="button" onClick={() => { if (window.confirm(es ? "¿Borrar toda la escena?" : "Clear entire scene?")) clearScene(); }} className="rounded-lg border border-white/10 bg-white/10 px-2 py-1.5 text-[11px] font-semibold text-rose-50 hover:bg-white/15 sm:px-3 sm:text-xs">{es ? "Limpiar" : "Clear"}</button>
                <button type="button" onClick={exportJSON} className="rounded-lg border border-white/10 bg-white/10 px-2 py-1.5 text-[11px] font-semibold text-rose-50 hover:bg-white/15 sm:px-3 sm:text-xs">JSON</button>
                <button type="button" onClick={exportSTL} className="rounded-lg border border-white/10 bg-white/10 px-2 py-1.5 text-[11px] font-semibold text-rose-50 hover:bg-white/15 sm:px-3 sm:text-xs">STL</button>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 border-t border-white/10 pt-2">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wide text-rose-200/50">{es ? "Formas" : "Shapes"}</span>
                {shapeList(es).map((s) => (
                  <button key={s.kind} type="button" onClick={() => addShape(s.kind)} title={s.label} className="flex min-w-[2.25rem] items-center justify-center gap-1 rounded-lg border border-white/10 bg-white/10 px-2.5 py-1.5 text-sm font-semibold text-rose-50 hover:bg-rose-500/30">
                    <span>{s.icon}</span>
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wide text-rose-200/50">{es ? "Color" : "Color"}</span>
                {COLORS.map((c) => (
                  <button key={c} type="button" title={c} onClick={() => applyColor(c)} className={`size-6 shrink-0 rounded-full border-2 transition ${color.toLowerCase() === c.toLowerCase() ? "scale-110 border-white ring-2 ring-white/30" : "border-black/30 hover:scale-105"}`} style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {!ready && !error && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/70">
          <p className="text-sm text-rose-100">{es ? "Cargando modelador 3D…" : "Loading 3D modeler…"}</p>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-rose-950/80 p-6">
          <p className="text-sm font-semibold text-rose-100">{error}</p>
        </div>
      )}
    </div>
  );
}
