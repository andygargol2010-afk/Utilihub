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
        scene.fog = new THREE.FogExp2(0x0a0610, 0.045);
        const camera = new THREE.PerspectiveCamera(46, w / h, 0.08, 120);
        camera.position.set(3.8, 2.9, 4.8);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setSize(w, h);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        if ("outputColorSpace" in renderer) (renderer as any).outputColorSpace = (THREE as any).SRGBColorSpace ?? (THREE as any).sRGBEncoding;
        else if ("outputEncoding" in renderer) (renderer as any).outputEncoding = (THREE as any).sRGBEncoding;
        renderer.toneMapping = (THREE as any).ACESFilmicToneMapping ?? 4;
        renderer.toneMappingExposure = 1.15;
        mount.appendChild(renderer.domElement);
        Object.assign(renderer.domElement.style, { width: "100%", height: "100%", display: "block", touchAction: "none" });

        scene.add(new THREE.HemisphereLight(0xffe8f0, 0x1a1028, 0.42));
        scene.add(new THREE.AmbientLight(0xb8a0c8, 0.22));

        const key = new THREE.DirectionalLight(0xfff5f8, 1.35);
        key.position.set(5.5, 10, 4.5);
        key.castShadow = true;
        key.shadow.mapSize.set(2048, 2048);
        key.shadow.camera.near = 0.5;
        key.shadow.camera.far = 28;
        key.shadow.camera.left = -8; key.shadow.camera.right = 8;
        key.shadow.camera.top = 8; key.shadow.camera.bottom = -8;
        key.shadow.bias = -0.00025;
        key.shadow.normalBias = 0.02;
        key.shadow.radius = 3.5;
        scene.add(key);

        const fill = new THREE.DirectionalLight(0xa8c4ff, 0.35);
        fill.position.set(-4, 3, -2);
        scene.add(fill);

        const rim = new THREE.DirectionalLight(0xff6b9d, 0.28);
        rim.position.set(-2, 6, -5);
        scene.add(rim);

        const spark = new THREE.PointLight(0xffc0d8, 0.45, 12, 2);
        spark.position.set(1.2, 2.4, 1.8);
        scene.add(spark);

        const floorMat = new THREE.MeshStandardMaterial({
          color: 0x14101c,
          roughness: 0.92,
          metalness: 0.05,
        });
        const floor = new THREE.Mesh(new THREE.CircleGeometry(8, 64), floorMat);
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        floor.position.y = -0.001;
        scene.add(floor);

        const ringMat = new THREE.MeshStandardMaterial({ color: 0x08060c, roughness: 1, metalness: 0 });
        const ring = new THREE.Mesh(new THREE.RingGeometry(7.5, 11, 64), ringMat);
        ring.rotation.x = -Math.PI / 2;
        ring.position.y = -0.002;
        scene.add(ring);

        const grid = new THREE.GridHelper(10, 20, 0xf43f5e, 0x3a2030);
        (grid.material as any).opacity = 0.55;
        (grid.material as any).transparent = true;
        scene.add(grid); gridRef.current = grid;

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.08;
        controls.target.set(0, 0.55, 0);
        controls.maxPolarAngle = Math.PI * 0.49;
        controls.minDistance = 1.2;
        controls.maxDistance = 18;
        const meshes = new Map();
        const transform = new TransformControls(camera, renderer.domElement);
        transform.setSize(0.9);
        const multiStart = { pos: new Map<string, { x: number; y: number; z: number }>(), rot: new Map<string, { x: number; y: number; z: number }>(), scl: new Map<string, { x: number; y: number; z: number }>() };
        transform.addEventListener("dragging-changed", (event: { value: boolean }) => {
          controls.enabled = !event.value;
          if (event.value) {
            pushHistory();
            multiStart.pos.clear(); multiStart.rot.clear(); multiStart.scl.clear();
            for (const id of selectedIdsRef.current) {
              const m = meshes.get(id);
              if (!m || groupsRef.current.has(id)) continue;
              multiStart.pos.set(id, { x: m.position.x, y: m.position.y, z: m.position.z });
              multiStart.rot.set(id, { x: m.rotation.x, y: m.rotation.y, z: m.rotation.z });
              multiStart.scl.set(id, { x: m.scale.x, y: m.scale.y, z: m.scale.z });
            }
          } else {
            const pid = selectedIdRef.current;
            if (pid) readTransform(pid);
          }
        });
        transform.addEventListener("objectChange", () => {
          const primary = selectedIdRef.current;
          if (!primary || !multiStart.pos.has(primary)) return;
          const pm = meshes.get(primary);
          if (!pm || groupsRef.current.has(primary)) return;
          const modeNow = modeRef.current;
          const sp = multiStart.pos.get(primary)!;
          const sr = multiStart.rot.get(primary)!;
          const ss = multiStart.scl.get(primary)!;
          for (const id of selectedIdsRef.current) {
            if (id === primary || groupsRef.current.has(id)) continue;
            const m = meshes.get(id);
            if (!m || !multiStart.pos.has(id)) continue;
            if (modeNow === "translate") {
              const s = multiStart.pos.get(id)!;
              m.position.set(s.x + (pm.position.x - sp.x), s.y + (pm.position.y - sp.y), s.z + (pm.position.z - sp.z));
            } else if (modeNow === "rotate") {
              const s = multiStart.rot.get(id)!;
              m.rotation.set(s.x + (pm.rotation.x - sr.x), s.y + (pm.rotation.y - sr.y), s.z + (pm.rotation.z - sr.z));
            } else if (modeNow === "scale") {
              const s = multiStart.scl.get(id)!;
              const rx = ss.x ? pm.scale.x / ss.x : 1, ry = ss.y ? pm.scale.y / ss.y : 1, rz = ss.z ? pm.scale.z / ss.z : 1;
              m.scale.set(s.x * rx, s.y * ry, s.z * rz);
            }
          }
          if (modeNow === "scale") {
            for (const id of selectedIdsRef.current) {
              if (groupsRef.current.has(id)) continue;
              const m = meshes.get(id);
              const startS = multiStart.scl.get(id);
              if (!m || !startS || !startS.y) continue;
              m.geometry?.computeBoundingBox?.();
              const bb = m.geometry?.boundingBox;
              const half0 = bb ? (bb.max.y - bb.min.y) / 2 : 0.5;
              const startP = multiStart.pos.get(id);
              if (startP) m.position.y = startP.y - half0 * startS.y + half0 * m.scale.y;
            }
          }
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
            readTransform(primary);
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
            readTransform(primary);
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
        try { loadScene(); } catch { /* */ }
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
      if (mod && (e.key === "c" || e.key === "C")) { e.preventDefault(); copySelected(); return; }
      if (mod && (e.key === "x" || e.key === "X")) { e.preventDefault(); cutSelected(); return; }
      if (mod && (e.key === "v" || e.key === "V")) { e.preventDefault(); pasteClipboard(); return; }
      if (mod && (e.key === "d" || e.key === "D")) { e.preventDefault(); copySelected(); pasteClipboard(); return; }
      if (mod) return;
      if (e.key === "v" || e.key === "V") setMode("translate");
      if (e.key === "r" || e.key === "R") setMode("rotate");
      if (e.key === "s" || e.key === "S") setMode("scale");
      if (e.key === "Delete" || e.key === "Backspace") { e.preventDefault(); deleteSelected(); }
      if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "PageUp" || e.key === "PageDown") {
        e.preventDefault();
        const step = (snap > 0 ? snap : 0.1) * (e.shiftKey ? 5 : 1);
        let dx = 0, dy = 0, dz = 0;
        if (e.key === "ArrowLeft") dx = -step;
        else if (e.key === "ArrowRight") dx = step;
        else if (e.key === "ArrowUp") { if (e.altKey) dy = step; else dz = -step; }
        else if (e.key === "ArrowDown") { if (e.altKey) dy = -step; else dz = step; }
        else if (e.key === "PageUp") dy = step;
        else if (e.key === "PageDown") dy = -step;
        nudgeSelected(dx, dy, dz);
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        selectedIdsRef.current = []; setSelectedIds([]);
        selectedIdRef.current = null; setSelectedId(null);
        const t = threeRef.current;
        if (t) t.transform.detach();
        setCtxMenu(null);
        return;
      }
      if (e.key === "f" || e.key === "F") void toggleFullscreen();
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "PageUp" || e.key === "PageDown") {
        endTransformEdit();
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [copySelected, cutSelected, deleteSelected, endTransformEdit, groupSelected, nudgeSelected, pasteClipboard, redo, setMode, setSelectedId, setSelectedIds, snap, threeRef, toggleFullscreen, undo, ungroupSelected]);

  return (
    <div ref={studioRef} className={`relative ${fullscreen ? "fixed inset-0 z-50 bg-black" : ""}`}>
      <div className={`relative w-full overflow-hidden bg-[#0a0610] ${fullscreen ? "h-full rounded-none border-0" : "min-h-[480px] h-[min(70vh,640px)] rounded-xl border border-rose-500/25 shadow-[0_0_40px_rgba(244,63,94,0.08)]"}`}>
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
              <button type="button" onClick={undo} disabled={!canUndo} className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-semibold text-rose-50 disabled:opacity-40">{es ? "Deshacer" : "Undo"}</button>
              <button type="button" onClick={redo} disabled={!canRedo} className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-semibold text-rose-50 disabled:opacity-40">{es ? "Rehacer" : "Redo"}</button>
              <button type="button" onClick={groupSelected} disabled={selectedIds.length < 2} className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-semibold text-rose-50 disabled:opacity-40">{es ? "Agrupar" : "Group"}</button>
              <button type="button" onClick={ungroupSelected} disabled={!selectedIds.some((id) => groupIds.includes(id))} className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-semibold text-rose-50 disabled:opacity-40">{es ? "Desagrupar" : "Ungroup"}</button>
              <button type="button" onClick={deleteSelected} disabled={selectedIds.length === 0} className="rounded-md border border-rose-500/40 bg-rose-950/70 px-2 py-1 text-[11px] font-semibold text-rose-200 disabled:opacity-40">{es ? "Eliminar" : "Delete"}</button>
              <button type="button" onClick={toggleFullscreen} className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-semibold text-rose-50">{fullscreen ? (es ? "Salir" : "Exit") : (es ? "Pantalla" : "Full")}</button>
              <button type="button" title={es ? "Snap de rejilla" : "Grid snap"} onClick={() => {
                const steps = [0, 0.1, 0.25, 0.5, 1];
                const i = steps.indexOf(snap);
                setSnap(steps[(i + 1) % steps.length]!);
              }} className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-semibold text-rose-50">
                {snap === 0 ? "Snap:off" : `Snap:${snap}`}
              </button>
              <button type="button" title={es ? "Borrar escena" : "Clear scene"} onClick={() => { if (window.confirm(es ? "¿Borrar toda la escena?" : "Clear entire scene?")) clearScene(); }} className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-semibold text-rose-50">{es ? "Limpiar" : "Clear"}</button>
              <button type="button" title="Export JSON" onClick={exportJSON} className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-semibold text-rose-50">JSON</button>
              <button type="button" title="Export STL" onClick={exportSTL} className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-semibold text-rose-50">STL</button>
              <span className="mx-0.5 h-4 w-px bg-white/15" />
              {shapeList(es).map((s) => (
                <button key={s.kind} type="button" onClick={() => addShape(s.kind)} title={s.label} className="rounded-md border border-white/10 bg-white/5 px-1.5 py-1 text-[11px] font-semibold text-rose-50 hover:bg-white/15">{s.icon}</button>
              ))}
              <span className="mx-0.5 h-4 w-px bg-white/15" />
              {COLORS.map((c) => (
                <button key={c} type="button" title={c} onClick={() => applyColor(c)} className={`size-4 shrink-0 rounded-full border-2 ${color.toLowerCase() === c.toLowerCase() ? "scale-125 border-white ring-1 ring-white/40" : "border-black/20"}`} style={{ backgroundColor: c }} />
              ))}
              <label title={es ? "Color personalizado" : "Custom color"} className="relative ml-0.5 flex size-5 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-white/40 bg-white/10 hover:border-white/70">
                <span className="pointer-events-none absolute text-[10px] font-bold text-rose-50">+</span>
                <input
                  type="color"
                  value={/^#[0-9a-fA-F]{6}$/.test(color) ? color : "#a78bfa"}
                  onChange={(e) => applyColor(e.target.value)}
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
              </label>
            </div>
          </div>
        )}
        {selectedId && ready && (
          <div className="pointer-events-auto absolute bottom-2 left-2 z-10 max-w-[calc(100%-1rem)] overflow-x-auto rounded-lg border border-white/10 bg-black/80 p-2 text-[11px] text-rose-50 backdrop-blur-sm">
            <div className="flex flex-wrap gap-3">
              {!groupIds.includes(selectedId) && (
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] font-bold text-rose-200/70">{es ? "Tamaño" : "Size"}</span>
                {(["X","Y","Z"] as const).map((lab, axis) => {
                  const key = `sz${axis}`;
                  return (
                  <div key={"sz"+lab} className="flex items-center gap-1">
                    <span className="w-3 font-bold">{lab}</span>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={draft(key, size[axis], 2)}
                      onChange={(e) => {
                        const text = e.target.value;
                        setDraft(key, text);
                        const n = parseFloat(text);
                        if (Number.isFinite(n) && text !== "" && text !== "-" && text !== "." && text !== "-.") {
                          setSizeAxis(axis as 0|1|2, n);
                        }
                      }}
                      onBlur={() => {
                        const n = parseFloat(drafts[key] ?? "");
                        if (Number.isFinite(n)) setSizeAxis(axis as 0|1|2, n);
                        clearDraft(key);
                        sizeHistPushedRef.current = false;
                      }}
                      onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
                      className="w-12 rounded border border-white/10 bg-black/50 px-1 py-0.5 text-center"
                    />
                  </div>
                  );
                })}
              </div>
              )}
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] font-bold text-rose-200/70">{es ? "Posición" : "Position"}</span>
                {(["X","Y","Z"] as const).map((lab, axis) => {
                  const key = `ps${axis}`;
                  return (
                  <div key={"ps"+lab} className="flex items-center gap-1">
                    <span className="w-3 font-bold">{lab}</span>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={draft(key, pos[axis], 3)}
                      onChange={(e) => {
                        const text = e.target.value;
                        setDraft(key, text);
                        const n = parseFloat(text);
                        if (Number.isFinite(n) && text !== "" && text !== "-" && text !== "." && text !== "-.") {
                          setPosAxis(axis as 0|1|2, n, { snap: false });
                        }
                      }}
                      onBlur={() => {
                        const n = parseFloat(drafts[key] ?? "");
                        if (Number.isFinite(n)) setPosAxis(axis as 0|1|2, n, { snap: false });
                        clearDraft(key);
                        endTransformEdit();
                      }}
                      onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
                      className="w-14 rounded border border-white/10 bg-black/50 px-1 py-0.5 text-center"
                    />
                  </div>
                  );
                })}
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] font-bold text-rose-200/70">{es ? "Rotación" : "Rotation"}</span>
                {(["X","Y","Z"] as const).map((lab, axis) => {
                  const key = `rt${axis}`;
                  return (
                  <div key={"rt"+lab} className="flex items-center gap-1">
                    <span className="w-3 font-bold">{lab}</span>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={draft(key, rotDeg[axis], 1)}
                      onChange={(e) => {
                        const text = e.target.value;
                        setDraft(key, text);
                        const n = parseFloat(text);
                        if (Number.isFinite(n) && text !== "" && text !== "-" && text !== "." && text !== "-.") {
                          setRotAxis(axis as 0|1|2, n);
                        }
                      }}
                      onBlur={() => {
                        const n = parseFloat(drafts[key] ?? "");
                        if (Number.isFinite(n)) setRotAxis(axis as 0|1|2, n);
                        clearDraft(key);
                        endTransformEdit();
                      }}
                      onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
                      className="w-14 rounded border border-white/10 bg-black/50 px-1 py-0.5 text-center"
                    />
                  </div>
                  );
                })}
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] font-bold text-rose-200/70">{es ? "Modo" : "Mode"}</span>
                <div className="flex gap-1">
                  {(["translate","rotate","scale"] as const).map((m) => (
                    <button key={m} type="button" onClick={() => setMode(m)} className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${mode === m ? "bg-rose-500/50" : "bg-white/10"}`}>{m[0].toUpperCase()}</button>
                  ))}
                </div>
              </div>
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
