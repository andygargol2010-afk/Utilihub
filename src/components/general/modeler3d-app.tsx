import type { GeneralTool } from "@/lib/general/types";
import { useEffect } from "react";
import { useModelerCore } from "./modeler3d-core";
import { shapeList, COLORS } from "./modeler3d-helpers";

type Mode = "translate" | "rotate" | "scale";

export function Modeler3DApp({ locale = "en" }: { tool: GeneralTool; locale?: "en" | "es" }) {
  const core = useModelerCore(locale);
  const {
    es, objects, selectedId, selectedIds, groupIds, ctxMenu, setCtxMenu, mode, setMode,
    color, setColor, fullscreen, setFullscreen, ready, setReady, error, setError,
    canUndo, canRedo, showGrid, size, setSize, uniformScale, setUniformScale,
    pos, rotDeg, snap, setSnap, mountRef, studioRef, threeRef, sizeHistPushedRef,
    transformHistPushedRef, selectedIdRef, selectedIdsRef, groupsRef, marqueeRef,
    modeRef, objectsRef, gridRef, pushHistory, selectMesh, applySize, setPosAxis,
    setRotAxis, endTransformEdit, setSizeAxis, addShape, deleteSelected, applyColor,
    groupSelected, ungroupSelected, undo, redo, toggleFullscreen,
    setSelectedId, setSelectedIds,
  } = core;

  // NOTE: truncated - will complete in follow-up if this works
  return (
    <div ref={studioRef} className="relative min-h-[480px] h-[min(70vh,640px)] w-full overflow-hidden rounded-xl border border-rose-500/20 bg-[#0c0810]">
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
    </div>
  );
}
