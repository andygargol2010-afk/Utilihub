import type { GeneralTool } from "@/lib/general/types";
import { useEffect } from "react";
import { useModelerCore } from "./modeler3d-core";
import { shapeList, COLORS } from "./modeler3d-helpers";

export function Modeler3DApp({ locale = "en" }: { tool: GeneralTool; locale?: "en" | "es" }) {
  const core = useModelerCore(locale);
  const {
    es, selectedId, selectedIds, groupIds, ctxMenu, setCtxMenu, mode, setMode,
    color, fullscreen, ready, setReady, error, setError,
    canUndo, canRedo, size, pos, rotDeg, snap, setSnap, mountRef, studioRef, threeRef,
    sizeHistPushedRef, selectedIdRef, selectedIdsRef, groupsRef, marqueeRef,
    modeRef, gridRef, pushHistory, setPosAxis, setRotAxis, endTransformEdit, setSizeAxis,
    addShape, deleteSelected, applyColor, groupSelected, ungroupSelected, undo, redo, toggleFullscreen,
    setSelectedId, setSelectedIds,
  } = core;

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
        scene.background = new THREE.Color(0x0c0810);
        const camera = new THREE.PerspectiveCamera(48, w / h, 0.1, 100);
        camera.position.set(3.6, 2.8, 4.6);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setSize(w, h);
        renderer.shadowMap.enabled = true;
        mount.appendChild(renderer.domElement);
        Object.assign(renderer.domElement.style, { width: "100%", height: "100%", display: "block", touchAction: "none" });
        scene.add(new THREE.HemisphereLight(0xffe4ec, 0x1a1020, 0.55));
        scene.add(new THREE.AmbientLight(0xffffff, 0.28));
        const key = new THREE.DirectionalLight(0xfff0f5, 1.2);
        key.position.set(5, 9, 4); key.castShadow = true; scene.add(key);
        const floor = new THREE.Mesh(new THREE.CircleGeometry(6, 48), new THREE.MeshStandardMaterial({ color: 0x1a1220 }));
        floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
        const grid = new THREE.GridHelper(10, 20, 0xf43f5e, 0x3f1d2e);
        scene.add(grid); gridRef.current = grid;
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true; controls.target.set(0, 0.55, 0);
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
            let id = obj?.userData?.id as string; if (!id) return;
            for (const [gid, g] of groupsRef.current) { if (g.childIds.includes(id)) { id = gid; break; } }
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
            if (!event.shiftKey) {
              selectedIdsRef.current = []; setSelectedIds([]);
              selectedIdRef.current = null; setSelectedId(null); transform.detach();
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
              controls.enabled = false;
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
        const endMarquee = (event: PointerEvent | null, commit: boolean) => {
          if (!marqueeRef.current.on) return;
          controls.enabled = true;
          marqueeRef.current.on = false;
          if (marqueeRef.current.el) marqueeRef.current.el.style.display = "none";
          if (!commit || !event) return;
          const rect = renderer.domElement.getBoundingClientRect();
          const cx = event.clientX - rect.left, cy = event.clientY - rect.top;
          const x0 = Math.min(marqueeRef.current.x0, cx), y0 = Math.min(marqueeRef.current.y0, cy);
          const x1 = Math.max(marqueeRef.current.x0, cx), y1 = Math.max(marqueeRef.current.y0, cy);
          if (x1 - x0 < 4 && y1 - y0 < 4) return;
          const found: string[] = [];
          for (const [id, mesh] of meshes) {
            if (!mesh.isMesh) continue;
            mesh.updateMatrixWorld(true);
            const center = new THREE.Box3().setFromObject(mesh).getCenter(new THREE.Vector3());
            center.project(camera);
            const sx = (center.x * 0.5 + 0.5) * rect.width, sy = (-center.y * 0.5 + 0.5) * rect.height;
            if (sx >= x0 && sx <= x1 && sy >= y0 && sy <= y1) {
              let rid = id;
              for (const [gid, g] of groupsRef.current) { if (g.childIds.includes(id)) { rid = gid; break; } }
              found.push(rid);
            }
          }
          if (found.length) {
            const next = Array.from(new Set([...selectedIdsRef.current, ...found]));
            selectedIdsRef.current = next; setSelectedIds(next);
            const primary = next[next.length - 1]!;
            selectedIdRef.current = primary; setSelectedId(primary);
            const g = groupsRef.current.get(primary);
            const target = g?.groupObj || meshes.get(primary);
            if (target) { transform.attach(target); transform.setMode(modeRef.current); }
          }
        };
        const onPointerUp = (event: PointerEvent) => endMarquee(event, true);
        const onPointerCancel = () => endMarquee(null, false);
        const onContextMenu = (event: PointerEvent) => {
          event.preventDefault();
          const rect = renderer.domElement.getBoundingClientRect();
          setCtxMenu({ x: event.clientX - rect.left, y: event.clientY - rect.top });
        };
        renderer.domElement.addEventListener("pointerdown", onPointer);
        renderer.domElement.addEventListener("pointermove", onPointerMove);
        renderer.domElement.addEventListener("pointerup", onPointerUp);
        renderer.domElement.addEventListener("pointercancel", onPointerCancel);
        renderer.domElement.addEventListener("pointerleave", onPointerCancel);
        renderer.domElement.addEventListener("contextmenu", onContextMenu);
        const resize = () => {
          if (!mountRef.current) return;
          const rw = mountRef.current.clientWidth, rh = mountRef.current.clientHeight;
          if (rw < 2 || rh < 2) return;
          camera.aspect = rw / rh; camera.updateProjectionMatrix(); renderer.setSize(rw, rh, false);
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

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const mod = e.ctrlKey || e.metaKey;
      if (mod && (e.key === "z" || e.key === "Z") && e.shiftKey) { e.preventDefault(); redo(); return; }
      if (mod && (e.key === "z" || e.key === "Z")) { e.preventDefault(); undo(); return; }
      if (mod && (e.key === "y" || e.key === "Y")) { e.preventDefault(); redo(); return; }
      if (mod && (e.key === "g" || e.key === "G") && e.shiftKey) { e.preventDefault(); ungroupSelected(); return; }
      if (mod && (e.key === "g" || e.key === "G")) { e.preventDefault(); groupSelected(); return; }
      if (mod) return;
      if (e.key === "v" || e.key === "V") setMode("translate");
      if (e.key === "r" || e.key === "R") setMode("rotate");
      if (e.key === "s" || e.key === "S") setMode("scale");
      if (e.key === "Delete" || e.key === "Backspace") { e.preventDefault(); deleteSelected(); }
      if (e.key === "f" || e.key === "F") void toggleFullscreen();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [deleteSelected, groupSelected, redo, toggleFullscreen, undo, ungroupSelected]);

  return (
    <div ref={studioRef} className={`relative ${fullscreen ? "fixed inset-0 z-50 bg-black" : ""}`}>
      <div className={`relative w-full overflow-hidden bg-[#0c0810] ${fullscreen ? "h-full rounded-none border-0" : "min-h-[480px] h-[min(70vh,640px)] rounded-xl border border-rose-500/20"}`}>
        <div ref={mountRef} className="absolute inset-0" />
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
        {ready && !error && (
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 p-2">
            <div className="pointer-events-auto flex flex-wrap items-center gap-1.5 rounded-lg border border-white/10 bg-black/75 px-2 py-1.5 backdrop-blur-sm">
              <button type="button" onClick={undo} disabled={!canUndo} className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-semibold text-rose-50 disabled:opacity-40">Undo</button>
              <button type="button" onClick={redo} disabled={!canRedo} className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-semibold text-rose-50 disabled:opacity-40">Redo</button>
              <button type="button" onClick={groupSelected} disabled={selectedIds.length < 2} className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-semibold text-rose-50 disabled:opacity-40">{es ? "Agrupar" : "Group"}</button>
              <button type="button" onClick={ungroupSelected} disabled={!selectedIds.some((id) => groupIds.includes(id))} className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-semibold text-rose-50 disabled:opacity-40">{es ? "Desagrupar" : "Ungroup"}</button>
              <button type="button" onClick={deleteSelected} disabled={selectedIds.length === 0} className="rounded-md border border-rose-500/40 bg-rose-950/70 px-2 py-1 text-[11px] font-semibold text-rose-200 disabled:opacity-40">{es ? "Eliminar" : "Delete"}</button>
              <button type="button" onClick={toggleFullscreen} className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-semibold text-rose-50">{fullscreen ? "Exit" : "Full"}</button>
              <span className="mx-0.5 h-4 w-px bg-white/15" />
              {shapeList(es).map((s) => (
                <button key={s.kind} type="button" onClick={() => addShape(s.kind)} title={s.label} className="rounded-md border border-white/10 bg-white/5 px-1.5 py-1 text-[11px] font-semibold text-rose-50 hover:bg-white/15">{s.icon}</button>
              ))}
              <span className="mx-0.5 h-4 w-px bg-white/15" />
              {COLORS.map((c) => (
                <button key={c} type="button" title={c} onClick={() => applyColor(c)} className={`size-5 shrink-0 rounded-full border-2 ${color === c ? "scale-110 border-white" : "border-transparent"}`} style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>
        )}
        {selectedId && ready && !groupIds.includes(selectedId) && (
          <div className="pointer-events-auto absolute bottom-2 left-2 z-10 flex flex-wrap gap-2 rounded-lg border border-white/10 bg-black/80 p-2 text-[11px] text-rose-50">
            {(["X","Y","Z"] as const).map((lab, axis) => (
              <div key={lab} className="flex items-center gap-1">
                <span className="font-bold">{lab}</span>
                <input type="number" min={0.05} max={50} step={0.05} value={Number(size[axis].toFixed(2))} onChange={(e) => { setSizeAxis(axis as 0|1|2, parseFloat(e.target.value) || 0.05); sizeHistPushedRef.current = false; }} className="w-12 rounded border border-white/10 bg-black/50 px-1 py-0.5 text-center" />
              </div>
            ))}
            <div className="flex gap-1">
              {(["translate","rotate","scale"] as const).map((m) => (
                <button key={m} type="button" onClick={() => setMode(m)} className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${mode === m ? "bg-rose-500/50" : "bg-white/10"}`}>{m[0].toUpperCase()}</button>
              ))}
            </div>
          </div>
        )}
        {ctxMenu && ready && (
          <div className="absolute z-40 min-w-[130px] rounded-lg border border-white/10 bg-black/95 py-1 shadow-xl" style={{ left: ctxMenu.x, top: ctxMenu.y }}>
            <button type="button" onClick={groupSelected} disabled={selectedIds.length < 2} className="flex w-full px-3 py-1.5 text-left text-xs font-semibold text-rose-50 hover:bg-white/10 disabled:opacity-40">{es ? "Agrupar" : "Group"}</button>
            <button type="button" onClick={ungroupSelected} disabled={!selectedIds.some((id) => groupIds.includes(id))} className="flex w-full px-3 py-1.5 text-left text-xs font-semibold text-rose-50 hover:bg-white/10 disabled:opacity-40">{es ? "Desagrupar" : "Ungroup"}</button>
            <button type="button" onClick={deleteSelected} disabled={selectedIds.length === 0} className="flex w-full px-3 py-1.5 text-left text-xs font-semibold text-rose-200 hover:bg-rose-500/20 disabled:opacity-40">{es ? "Eliminar" : "Delete"}</button>
            <button type="button" onClick={() => setCtxMenu(null)} className="flex w-full px-3 py-1.5 text-left text-xs font-semibold text-rose-100/60 hover:bg-white/10">{es ? "Cerrar" : "Close"}</button>
          </div>
        )}
      </div>
    </div>
  );
}
