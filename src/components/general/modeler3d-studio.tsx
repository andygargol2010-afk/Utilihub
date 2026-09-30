import type { GeneralTool } from "@/lib/general/types";
import { useEffect, useState } from "react";
import { useModelerCore } from "./modeler3d-core";
import { shapeList, COLORS } from "./modeler3d-helpers";
import { useModelerThreeInit } from "./modeler3d-three-init";

export function Modeler3DStudio({ locale = "en" }: { tool: GeneralTool; locale?: "en" | "es" }) {
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

  useModelerThreeInit({
    mountRef, es, setReady, setError, threeRef, gridRef, pushHistory,
    selectedIdsRef, groupsRef, selectedIdRef, setSelectedIds, setSelectedId,
    readTransform, setCtxMenu, modeRef, marqueeRef, loadScene,
  });

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
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [snap, undo, redo, groupSelected, ungroupSelected, copySelected, cutSelected, pasteClipboard, deleteSelected, setMode, nudgeSelected]);

  return (
    <div ref={studioRef} className={`relative w-full overflow-hidden bg-[#0a0610] ${fullscreen ? "fixed inset-0 z-50 h-full rounded-none border-0" : "min-h-[520px] h-[min(75vh,720px)] rounded-xl border border-rose-500/25 shadow-[0_0_40px_rgba(244,63,94,0.08)]"}`}>
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
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 p-1.5 sm:p-2.5">
          <div className="pointer-events-auto flex w-full max-w-full flex-col gap-2 rounded-xl border border-white/10 bg-black/80 p-2 shadow-lg backdrop-blur-md sm:p-2.5">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
                <span className="hidden text-[10px] font-bold uppercase tracking-wide text-rose-200/50 sm:inline">Edit</span>
                <button type="button" onClick={undo} disabled={!canUndo} className="rounded-lg border border-white/10 bg-white/10 px-2 py-1.5 text-[11px] font-semibold text-rose-50 hover:bg-white/15 disabled:opacity-35 sm:px-3 sm:text-xs">{es ? "Deshacer" : "Undo"}</button>
                <button type="button" onClick={redo} disabled={!canRedo} className="rounded-lg border border-white/10 bg-white/10 px-2 py-1.5 text-[11px] font-semibold text-rose-50 hover:bg-white/15 disabled:opacity-35 sm:px-3 sm:text-xs">{es ? "Rehacer" : "Redo"}</button>
                <button type="button" onClick={groupSelected} disabled={selectedIds.length < 2} className="rounded-lg border border-white/10 bg-white/10 px-2 py-1.5 text-[11px] font-semibold text-rose-50 hover:bg-white/15 disabled:opacity-35 sm:px-3 sm:text-xs">{es ? "Agrupar" : "Group"}</button>
                <button type="button" onClick={ungroupSelected} disabled={!selectedIds.some((id) => groupIds.includes(id))} className="rounded-lg border border-white/10 bg-white/10 px-2 py-1.5 text-[11px] font-semibold text-rose-50 hover:bg-white/15 disabled:opacity-35 sm:px-3 sm:text-xs">{es ? "Desagrupar" : "Ungroup"}</button>
                <button type="button" onClick={deleteSelected} disabled={selectedIds.length === 0} className="rounded-lg border border-rose-500/40 bg-rose-950/60 px-2 py-1.5 text-[11px] font-semibold text-rose-100 hover:bg-rose-900/70 disabled:opacity-35 sm:px-3 sm:text-xs">{es ? "Eliminar" : "Delete"}</button>
              </div>
              <span className="hidden h-6 w-px bg-white/15 sm:block" />
              <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
                <span className="hidden text-[10px] font-bold uppercase tracking-wide text-rose-200/50 sm:inline">View</span>
                <button type="button" onClick={toggleFullscreen} className="rounded-lg border border-white/10 bg-white/10 px-2 py-1.5 text-[11px] font-semibold text-rose-50 hover:bg-white/15 sm:px-3 sm:text-xs">{fullscreen ? (es ? "Salir" : "Exit") : (es ? "Pantalla" : "Full")}</button>
                <button type="button" title={es ? "Snap de rejilla" : "Grid snap"} onClick={() => {
                  const steps = [0, 0.1, 0.25, 0.5, 1];
                  const i = steps.indexOf(snap);
                  setSnap(steps[(i + 1) % steps.length]!);
                }} className="rounded-lg border border-white/10 bg-white/10 px-2 py-1.5 text-[11px] font-semibold text-rose-50 hover:bg-white/15 sm:px-3 sm:text-xs">
                  {snap === 0 ? "Snap off" : `Snap ${snap}`}
                </button>
                <button type="button" title={es ? "Borrar escena" : "Clear scene"} onClick={() => { if (window.confirm(es ? "¿Borrar toda la escena?" : "Clear entire scene?")) clearScene(); }} className="rounded-lg border border-white/10 bg-white/10 px-2 py-1.5 text-[11px] font-semibold text-rose-50 hover:bg-white/15 sm:px-3 sm:text-xs">{es ? "Limpiar" : "Clear"}</button>
                <button type="button" title="Export JSON" onClick={exportJSON} className="rounded-lg border border-white/10 bg-white/10 px-2 py-1.5 text-[11px] font-semibold text-rose-50 hover:bg-white/15 sm:px-3 sm:text-xs">JSON</button>
                <button type="button" title="Export STL" onClick={exportSTL} className="rounded-lg border border-white/10 bg-white/10 px-2 py-1.5 text-[11px] font-semibold text-rose-50 hover:bg-white/15 sm:px-3 sm:text-xs">STL</button>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 border-t border-white/10 pt-2">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wide text-rose-200/50">{es ? "Formas" : "Shapes"}</span>
                {shapeList(es).map((s) => (
                  <button key={s.kind} type="button" onClick={() => addShape(s.kind)} title={s.label} className="flex min-w-[2.25rem] items-center justify-center gap-1 rounded-lg border border-white/10 bg-white/10 px-2.5 py-1.5 text-sm font-semibold text-rose-50 hover:bg-rose-500/30">
                    <span>{s.icon}</span>
                    <span className="hidden text-[11px] sm:inline">{s.label}</span>
                  </button>
                ))}
              </div>
              <span className="hidden h-6 w-px bg-white/15 sm:block" />
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wide text-rose-200/50">{es ? "Color" : "Color"}</span>
                {COLORS.map((c) => (
                  <button key={c} type="button" title={c} onClick={() => applyColor(c)} className={`size-6 shrink-0 rounded-full border-2 transition ${color.toLowerCase() === c.toLowerCase() ? "scale-110 border-white ring-2 ring-white/30" : "border-black/30 hover:scale-105"}`} style={{ backgroundColor: c }} />
                ))}
                <label title={es ? "Color personalizado" : "Custom color"} className="relative flex size-7 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-white/40 bg-white/10 hover:border-white/70">
                  <span className="pointer-events-none text-xs font-bold text-rose-50">+</span>
                  <input type="color" value={/^#[0-9a-fA-F]{6}$/.test(color) ? color : "#a78bfa"} onChange={(e) => applyColor(e.target.value)} className="absolute inset-0 cursor-pointer opacity-0" />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
      {selectedId && ready && (
        <div className="pointer-events-auto absolute bottom-2.5 left-2.5 z-10 max-w-[calc(100%-1.25rem)] overflow-x-auto rounded-xl border border-white/10 bg-black/85 p-2.5 text-xs text-rose-50 shadow-lg backdrop-blur-sm">
          <div className="flex flex-wrap gap-3">
            {!groupIds.includes(selectedId) && (
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] font-bold text-rose-200/70">{es ? "Tamaño" : "Size"}</span>
                {(["X","Y","Z"] as const).map((lab, axis) => {
                  const key = `sz${axis}`;
                  return (
                    <div key={"sz"+lab} className="flex items-center gap-1">
                      <span className="w-3 font-bold">{lab}</span>
                      <input type="text" inputMode="decimal" value={draft(key, size[axis], 2)} onChange={(e) => {
                        const text = e.target.value; setDraft(key, text);
                        const n = parseFloat(text);
                        if (Number.isFinite(n) && text !== "" && text !== "-" && text !== "." && text !== "-.") setSizeAxis(axis as 0|1|2, n);
                      }} onBlur={() => {
                        const n = parseFloat(drafts[key] ?? "");
                        if (Number.isFinite(n)) setSizeAxis(axis as 0|1|2, n);
                        clearDraft(key); sizeHistPushedRef.current = false;
                      }} onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }} className="w-14 rounded border border-white/10 bg-black/50 px-1 py-0.5 text-center" />
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
                    <input type="text" inputMode="decimal" value={draft(key, pos[axis], 2)} onChange={(e) => {
                      const text = e.target.value; setDraft(key, text);
                      const n = parseFloat(text);
                      if (Number.isFinite(n) && text !== "" && text !== "-" && text !== "." && text !== "-.") setPosAxis(axis as 0|1|2, n, { snap: false });
                    }} onBlur={() => {
                      const n = parseFloat(drafts[key] ?? "");
                      if (Number.isFinite(n)) setPosAxis(axis as 0|1|2, n, { snap: false });
                      clearDraft(key); endTransformEdit();
                    }} onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }} className="w-14 rounded border border-white/10 bg-black/50 px-1 py-0.5 text-center" />
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
                    <input type="text" inputMode="decimal" value={draft(key, rotDeg[axis], 1)} onChange={(e) => {
                      const text = e.target.value; setDraft(key, text);
                      const n = parseFloat(text);
                      if (Number.isFinite(n) && text !== "" && text !== "-" && text !== "." && text !== "-.") setRotAxis(axis as 0|1|2, n);
                    }} onBlur={() => {
                      const n = parseFloat(drafts[key] ?? "");
                      if (Number.isFinite(n)) setRotAxis(axis as 0|1|2, n);
                      clearDraft(key); endTransformEdit();
                    }} onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }} className="w-14 rounded border border-white/10 bg-black/50 px-1 py-0.5 text-center" />
                  </div>
                );
              })}
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-bold text-rose-200/70">{es ? "Modo" : "Mode"}</span>
              <div className="flex flex-wrap gap-1">
                {(["translate", "rotate", "scale"] as const).map((m) => (
                  <button key={m} type="button" onClick={() => setMode(m)} className={`rounded border px-2 py-0.5 text-[10px] font-semibold ${mode === m ? "border-rose-400 bg-rose-500/30 text-rose-50" : "border-white/10 bg-white/10 text-rose-100/80"}`}>
                    {m === "translate" ? (es ? "Mover" : "Move") : m === "rotate" ? (es ? "Rotar" : "Rotate") : (es ? "Escala" : "Scale")}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {ctxMenu && (
        <div className="pointer-events-auto absolute z-30 min-w-[10rem] rounded-lg border border-white/15 bg-black/95 py-1 text-xs text-rose-50 shadow-xl" style={{ left: ctxMenu.x, top: ctxMenu.y }}>
          <button type="button" className="block w-full px-3 py-1.5 text-left hover:bg-white/10" onClick={() => { copySelected(); setCtxMenu(null); }}>{es ? "Copiar" : "Copy"}</button>
          <button type="button" className="block w-full px-3 py-1.5 text-left hover:bg-white/10" onClick={() => { cutSelected(); setCtxMenu(null); }}>{es ? "Cortar" : "Cut"}</button>
          <button type="button" className="block w-full px-3 py-1.5 text-left hover:bg-white/10" onClick={() => { pasteClipboard(); setCtxMenu(null); }}>{es ? "Pegar" : "Paste"}</button>
          <button type="button" className="block w-full px-3 py-1.5 text-left hover:bg-white/10" onClick={() => { deleteSelected(); setCtxMenu(null); }}>{es ? "Eliminar" : "Delete"}</button>
          <button type="button" className="block w-full px-3 py-1.5 text-left hover:bg-white/10" onClick={() => setCtxMenu(null)}>{es ? "Cerrar" : "Close"}</button>
        </div>
      )}
    </div>
  );
}
