import type { GeneralTool } from "@/lib/general/types";
import { useEffect, useState } from "react";
import { useModelerCore } from "./modeler3d-core";
import { shapeList, COLORS, matPresetList, scenePresets } from "./modeler3d-helpers";
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
    copySelected, cutSelected, pasteClipboard, exportJSON, exportSTL, exportPNG, exportGLB,
    clearSelection, dropToFloor, alignSelection, objectLimitMsg,
    matPreset, applyMatPreset, UNIT_CM,
    listNamedScenes, saveNamedScene, loadNamedScene, deleteNamedScene, copyShareLink, applyPreset,
  } = core;

  type DraftKey = string;
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [showHelp, setShowHelp] = useState(false);
  const [showOnboard, setShowOnboard] = useState(false);
  const [showScenes, setShowScenes] = useState(false);
  const [namedScenes, setNamedScenes] = useState<{ id: string; name: string; savedAt: number }[]>([]);
  const [shareMsg, setShareMsg] = useState<string | null>(null);

  const refreshScenes = () => {
    try {
      setNamedScenes(listNamedScenes().map((x) => ({ id: x.id, name: x.name, savedAt: x.savedAt })));
    } catch { setNamedScenes([]); }
  };

  useEffect(() => {
    try {
      if (!localStorage.getItem("utilihub-modeler3d-onboarded")) setShowOnboard(true);
    } catch { /* */ }
  }, []);

  const dismissOnboard = () => {
    setShowOnboard(false);
    try { localStorage.setItem("utilihub-modeler3d-onboarded", "1"); } catch { /* */ }
  };

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
      if (e.key === "Escape") { e.preventDefault(); clearSelection(); setCtxMenu(null); setShowHelp(false); setShowScenes(false); return; }
      if (e.key === "?" || (e.shiftKey && e.key === "/")) { e.preventDefault(); setShowHelp((v) => !v); return; }
      if (e.key === "g" || e.key === "G" || e.key === "v" || e.key === "V") { setMode("translate"); return; }
      if (e.key === "r" || e.key === "R") { setMode("rotate"); return; }
      if (e.key === "s" || e.key === "S") { setMode("scale"); return; }
      if (e.key === "Delete" || e.key === "Backspace") { e.preventDefault(); deleteSelected(); return; }
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
  }, [snap, undo, redo, groupSelected, ungroupSelected, copySelected, cutSelected, pasteClipboard, deleteSelected, setMode, nudgeSelected, clearSelection, setCtxMenu]);

  return (
    <div ref={studioRef} className={`relative w-full overflow-hidden bg-[#0a0610] ${fullscreen ? "fixed inset-0 z-50 h-full rounded-none border-0" : "min-h-[520px] h-[min(75vh,720px)] rounded-xl border border-rose-500/25 shadow-[0_0_40px_rgba(244,63,94,0.08)]"}`}>
      <div ref={mountRef} className="absolute inset-0" />
      {objectLimitMsg && (
        <div className="pointer-events-none absolute left-1/2 top-14 z-30 -translate-x-1/2 rounded-lg border border-amber-400/40 bg-amber-950/90 px-3 py-2 text-xs font-semibold text-amber-50 shadow-lg">
          {objectLimitMsg}
        </div>
      )}
      {showHelp && (
        <div className="absolute bottom-24 right-2.5 z-30 max-h-[min(70vh,28rem)] w-[min(100%-1.25rem,20rem)] overflow-y-auto rounded-xl border border-white/15 bg-black/95 p-3 text-[11px] text-rose-50 shadow-2xl backdrop-blur-md sm:bottom-28">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-xs font-bold uppercase tracking-wide text-rose-200">{es ? "Atajos de teclado" : "Keyboard shortcuts"}</p>
            <button type="button" className="rounded px-1.5 py-0.5 text-rose-200/80 hover:bg-white/10" onClick={() => setShowHelp(false)}>✕</button>
          </div>
          <ul className="space-y-1.5 leading-snug text-rose-100/90">
            <li><kbd className="rounded bg-white/10 px-1">G</kbd> / <kbd className="rounded bg-white/10 px-1">V</kbd> — {es ? "Mover" : "Move"}</li>
            <li><kbd className="rounded bg-white/10 px-1">R</kbd> — {es ? "Rotar" : "Rotate"}</li>
            <li><kbd className="rounded bg-white/10 px-1">S</kbd> — {es ? "Escalar" : "Scale"}</li>
            <li><kbd className="rounded bg-white/10 px-1">Del</kbd> — {es ? "Eliminar" : "Delete"}</li>
            <li><kbd className="rounded bg-white/10 px-1">Esc</kbd> — {es ? "Deseleccionar" : "Deselect"}</li>
            <li><kbd className="rounded bg-white/10 px-1">Ctrl+D</kbd> — {es ? "Duplicar" : "Duplicate"}</li>
            <li><kbd className="rounded bg-white/10 px-1">Ctrl+C/X/V</kbd> — {es ? "Copiar / cortar / pegar" : "Copy / cut / paste"}</li>
            <li><kbd className="rounded bg-white/10 px-1">Ctrl+Z</kbd> / <kbd className="rounded bg-white/10 px-1">Ctrl+Y</kbd> — {es ? "Deshacer / rehacer" : "Undo / redo"}</li>
            <li><kbd className="rounded bg-white/10 px-1">Ctrl+G</kbd> — {es ? "Agrupar" : "Group"}</li>
            <li><kbd className="rounded bg-white/10 px-1">Ctrl+Shift+G</kbd> — {es ? "Desagrupar" : "Ungroup"}</li>
            <li><kbd className="rounded bg-white/10 px-1">←↑→↓</kbd> — {es ? "Empujar (Alt = altura)" : "Nudge (Alt = height)"}</li>
            <li><kbd className="rounded bg-white/10 px-1">?</kbd> — {es ? "Esta ayuda" : "This help"}</li>
          </ul>
        </div>
      )}
      {showScenes && ready && !error && (
        <div className="absolute right-2 top-12 z-30 w-[min(100%-1rem,18rem)] rounded-xl border border-white/15 bg-black/95 p-3 text-xs text-rose-50 shadow-2xl backdrop-blur-md sm:top-14">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-wide text-rose-200">{es ? "Escenas" : "Scenes"}</p>
            <button type="button" className="rounded px-1.5 py-0.5 text-rose-200/80 hover:bg-white/10" onClick={() => setShowScenes(false)}>✕</button>
          </div>
          <div className="mb-2 flex flex-col gap-1.5">
            <button
              type="button"
              className="rounded-lg border border-white/10 bg-white/10 px-2 py-1.5 text-left font-semibold hover:bg-white/15"
              onClick={() => {
                const name = window.prompt(es ? "Nombre de la escena" : "Scene name", es ? "Mi escena" : "My scene");
                if (name === null) return;
                saveNamedScene(name.trim() || (es ? "Escena" : "Scene"));
                refreshScenes();
              }}
            >
              {es ? "Guardar escena actual" : "Save current scene"}
            </button>
            <button
              type="button"
              className="rounded-lg border border-white/10 bg-white/10 px-2 py-1.5 text-left font-semibold hover:bg-white/15"
              onClick={async () => {
                const ok = await copyShareLink();
                setShareMsg(ok
                  ? (es ? "Enlace copiado" : "Link copied")
                  : (es ? "Escena grande: se descargó JSON" : "Scene too large: JSON downloaded"));
                window.setTimeout(() => setShareMsg(null), 3500);
              }}
            >
              {es ? "Copiar enlace para compartir" : "Copy share link"}
            </button>
            {shareMsg && <p className="text-[10px] text-emerald-300">{shareMsg}</p>}
          </div>
          <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-rose-200/60">{es ? "Plantillas" : "Presets"}</p>
          <div className="mb-2 flex flex-wrap gap-1">
            {scenePresets(es).map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => { applyPreset(p.id); setShowScenes(false); }}
                className="rounded border border-white/10 bg-white/10 px-2 py-1 text-[10px] font-semibold hover:bg-white/20"
              >
                {p.label}
              </button>
            ))}
          </div>
          <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-rose-200/60">{es ? "Guardadas" : "Saved"}</p>
          {namedScenes.length === 0 ? (
            <p className="text-[10px] text-rose-100/50">{es ? "Ninguna aún" : "None yet"}</p>
          ) : (
            <ul className="max-h-40 space-y-1 overflow-y-auto">
              {namedScenes.map((sc) => (
                <li key={sc.id} className="flex items-center gap-1 rounded border border-white/5 bg-white/5 px-1.5 py-1">
                  <button type="button" className="min-w-0 flex-1 truncate text-left font-semibold hover:text-rose-200" onClick={() => { loadNamedScene(sc.id); setShowScenes(false); }}>{sc.name}</button>
                  <button type="button" className="shrink-0 rounded px-1 text-rose-300/70 hover:bg-rose-900/40 hover:text-rose-100" title={es ? "Eliminar" : "Delete"} onClick={() => { deleteNamedScene(sc.id); refreshScenes(); }}>✕</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      {showOnboard && ready && !error && (
        <div className="absolute inset-0 z-40 flex items-end justify-center bg-black/55 p-3 sm:items-center">
          <div className="w-full max-w-sm rounded-2xl border border-white/15 bg-[#120a14] p-4 text-rose-50 shadow-2xl">
            <p className="text-xs font-bold uppercase tracking-wide text-rose-300">{es ? "Primeros pasos" : "Quick start"}</p>
            <ol className="mt-3 list-decimal space-y-2 pl-4 text-sm leading-snug text-rose-100/90">
              <li>{es ? "Tocá una forma arriba para crear (cubo, esfera…)." : "Tap a shape above to create (cube, sphere…)."}</li>
              <li>{es ? "Arrastrá con un dedo para orbitar; dos dedos para zoom/pan." : "Drag with one finger to orbit; two fingers to zoom/pan."}</li>
              <li>{es ? "Seleccioná un objeto y usá G / R / S o los controles para mover, rotar y escalar." : "Select an object and use G / R / S or the gizmo to move, rotate, and scale."}</li>
            </ol>
            <button type="button" onClick={dismissOnboard} className="mt-4 w-full rounded-lg bg-rose-500 px-3 py-2.5 text-sm font-bold text-white hover:bg-rose-400">
              {es ? "Entendido" : "Got it"}
            </button>
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
      {ready && !error && (
        <>
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 p-1.5 sm:p-2">
          <div className="pointer-events-auto mx-auto flex max-w-full flex-wrap items-center gap-1 rounded-xl border border-white/10 bg-black/80 px-1.5 py-1.5 shadow-lg backdrop-blur-md sm:gap-1.5 sm:px-2">
            <button type="button" onClick={undo} disabled={!canUndo} className="rounded-lg border border-white/10 bg-white/10 px-2 py-1.5 text-[11px] font-semibold text-rose-50 hover:bg-white/15 disabled:opacity-35 sm:text-xs">{es ? "Deshacer" : "Undo"}</button>
            <button type="button" onClick={redo} disabled={!canRedo} className="rounded-lg border border-white/10 bg-white/10 px-2 py-1.5 text-[11px] font-semibold text-rose-50 hover:bg-white/15 disabled:opacity-35 sm:text-xs">{es ? "Rehacer" : "Redo"}</button>
            <button type="button" onClick={groupSelected} disabled={selectedIds.length < 2} className="rounded-lg border border-white/10 bg-white/10 px-2 py-1.5 text-[11px] font-semibold text-rose-50 hover:bg-white/15 disabled:opacity-35 sm:text-xs">{es ? "Agrupar" : "Group"}</button>
            <button type="button" onClick={ungroupSelected} disabled={!selectedIds.some((id) => groupIds.includes(id))} className="rounded-lg border border-white/10 bg-white/10 px-2 py-1.5 text-[11px] font-semibold text-rose-50 hover:bg-white/15 disabled:opacity-35 sm:text-xs">{es ? "Desagrupar" : "Ungroup"}</button>
            <button type="button" onClick={deleteSelected} disabled={selectedIds.length === 0} className="rounded-lg border border-rose-500/40 bg-rose-950/60 px-2 py-1.5 text-[11px] font-semibold text-rose-100 hover:bg-rose-900/70 disabled:opacity-35 sm:text-xs">{es ? "Eliminar" : "Delete"}</button>
            <button type="button" onClick={() => { copySelected(); pasteClipboard(); }} disabled={selectedIds.length === 0} className="rounded-lg border border-white/10 bg-white/10 px-2 py-1.5 text-[11px] font-semibold text-rose-50 hover:bg-white/15 disabled:opacity-35 sm:text-xs" title="Ctrl+D">{es ? "Duplicar" : "Duplicate"}</button>
            <button type="button" onClick={dropToFloor} disabled={selectedIds.length === 0} className="rounded-lg border border-white/10 bg-white/10 px-2 py-1.5 text-[11px] font-semibold text-rose-50 hover:bg-white/15 disabled:opacity-35 sm:text-xs" title={es ? "Apoyar en el piso" : "Drop to floor"}>{es ? "Piso" : "Floor"}</button>
            <button type="button" onClick={() => setShowHelp((v) => !v)} className="rounded-lg border border-white/10 bg-white/10 px-2 py-1.5 text-[11px] font-semibold text-rose-50 hover:bg-white/15 sm:text-xs" title={es ? "Atajos" : "Shortcuts"}>?</button>
            <span className="hidden h-5 w-px bg-white/15 sm:block" />
            <button type="button" onClick={toggleFullscreen} className="rounded-lg border border-white/10 bg-white/10 px-2 py-1.5 text-[11px] font-semibold text-rose-50 hover:bg-white/15 sm:text-xs">{fullscreen ? (es ? "Salir" : "Exit") : (es ? "Pantalla" : "Full")}</button>
            <button type="button" title={es ? "Snap de rejilla" : "Grid snap"} onClick={() => {
              const steps = [0, 0.1, 0.5, 1];
              const i = steps.indexOf(snap);
              setSnap(steps[(i + 1) % steps.length]!);
            }} className="rounded-lg border border-white/10 bg-white/10 px-2 py-1.5 text-[11px] font-semibold text-rose-50 hover:bg-white/15 sm:text-xs">
              {snap === 0 ? "Snap off" : `Snap ${snap}`}
            </button>
            <button type="button" title={es ? "Borrar escena" : "Clear scene"} onClick={() => { if (window.confirm(es ? "¿Borrar toda la escena?" : "Clear entire scene?")) clearScene(); }} className="rounded-lg border border-white/10 bg-white/10 px-2 py-1.5 text-[11px] font-semibold text-rose-50 hover:bg-white/15 sm:text-xs">{es ? "Limpiar" : "Clear"}</button>
            <button type="button" title="Export JSON" onClick={exportJSON} className="rounded-lg border border-white/10 bg-white/10 px-2 py-1.5 text-[11px] font-semibold text-rose-50 hover:bg-white/15 sm:text-xs">JSON</button>
            <button type="button" title="Export STL" onClick={exportSTL} className="rounded-lg border border-white/10 bg-white/10 px-2 py-1.5 text-[11px] font-semibold text-rose-50 hover:bg-white/15 sm:text-xs">STL</button>
            <button type="button" title={es ? "Captura PNG" : "Screenshot PNG"} onClick={exportPNG} className="rounded-lg border border-white/10 bg-white/10 px-2 py-1.5 text-[11px] font-semibold text-rose-50 hover:bg-white/15 sm:text-xs">PNG</button>
            <button type="button" title={es ? "Exportar GLB" : "Export GLB"} onClick={exportGLB} className="rounded-lg border border-white/10 bg-white/10 px-2 py-1.5 text-[11px] font-semibold text-rose-50 hover:bg-white/15 sm:text-xs">GLB</button>
            <button type="button" title={es ? "Escenas y compartir" : "Scenes & share"} onClick={() => { refreshScenes(); setShowScenes((v) => !v); }} className="rounded-lg border border-white/10 bg-white/10 px-2 py-1.5 text-[11px] font-semibold text-rose-50 hover:bg-white/15 sm:text-xs">{es ? "Escenas" : "Scenes"}</button>
          </div>
          {selectedIds.length >= 2 && (
            <div className="pointer-events-auto mx-auto mt-1.5 flex max-w-full flex-wrap items-center justify-center gap-1 rounded-lg border border-white/10 bg-black/80 px-2 py-1 shadow-lg backdrop-blur-md">
              <span className="text-[9px] font-bold uppercase tracking-wide text-rose-200/70">{es ? "Alinear" : "Align"}</span>
              {([
                ["x", "min", "X min"],
                ["x", "center", "X mid"],
                ["x", "max", "X max"],
                ["y", "min", "Y min"],
                ["y", "center", "Y mid"],
                ["y", "max", "Y max"],
                ["z", "min", "Z min"],
                ["z", "center", "Z mid"],
                ["z", "max", "Z max"],
              ] as const).map(([axis, amode, lab]) => (
                <button key={`${axis}-${amode}`} type="button" onClick={() => alignSelection(axis, amode)} className="rounded border border-white/10 bg-white/10 px-1.5 py-0.5 text-[10px] font-semibold text-rose-50 hover:bg-white/20">{lab}</button>
              ))}
            </div>
          )}
        </div>

        <div className="pointer-events-none absolute bottom-16 left-1.5 top-14 z-10 flex max-h-[calc(100%-5.5rem)] w-[4.75rem] flex-col sm:left-2 sm:w-[5.25rem]">
          <div className="pointer-events-auto flex max-h-full flex-col gap-2 overflow-y-auto rounded-xl border border-white/10 bg-black/85 p-1.5 shadow-lg backdrop-blur-md">
            <div className="flex flex-col items-center gap-1">
              <span className="text-[9px] font-bold uppercase tracking-wide text-rose-200/50">{es ? "Formas" : "Shapes"}</span>
              <div className="grid grid-cols-2 gap-1">
                {shapeList(es).map((s) => (
                  <button
                    key={s.kind}
                    type="button"
                    onClick={() => addShape(s.kind)}
                    title={s.label}
                    className="flex size-8 items-center justify-center rounded-lg border border-white/10 bg-white/10 text-sm font-semibold text-rose-50 hover:bg-rose-500/30 sm:size-9"
                  >
                    <span>{s.icon}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="h-px w-full bg-white/10" />
            <div className="flex flex-col items-center gap-1">
              <span className="text-[9px] font-bold uppercase tracking-wide text-rose-200/50">{es ? "Color" : "Color"}</span>
              <div className="grid grid-cols-3 gap-1">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    title={c}
                    onClick={() => applyColor(c)}
                    className={`size-5 rounded-full border-2 transition sm:size-6 ${color.toLowerCase() === c.toLowerCase() ? "scale-110 border-white ring-2 ring-white/30" : "border-black/30 hover:scale-105"}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
                <label title={es ? "Color personalizado" : "Custom color"} className="relative flex size-5 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-white/40 bg-white/10 hover:border-white/70 sm:size-6">
                  <span className="pointer-events-none text-[10px] font-bold text-rose-50">+</span>
                  <input type="color" value={/^#[0-9a-fA-F]{6}$/.test(color) ? color : "#a78bfa"} onChange={(e) => applyColor(e.target.value)} className="absolute inset-0 cursor-pointer opacity-0" />
                </label>
              </div>
            </div>
            <div className="h-px w-full bg-white/10" />
            <div className="flex flex-col items-center gap-1">
              <span className="text-[9px] font-bold uppercase tracking-wide text-rose-200/50">{es ? "Mat." : "Mat."}</span>
              <div className="flex w-full flex-col gap-1">
                {matPresetList(es).map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => applyMatPreset(p.id)}
                    className={`w-full rounded-md border px-1 py-1 text-[10px] font-semibold leading-tight ${matPreset === p.id ? "border-rose-400 bg-rose-500/30 text-rose-50" : "border-white/10 bg-white/10 text-rose-100/80 hover:bg-white/15"}`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        </>
      )}
      {selectedId && ready && (
        <div className="pointer-events-auto absolute bottom-2.5 right-2.5 z-10 max-w-[min(100%-5.5rem,22rem)] overflow-x-auto rounded-xl border border-white/10 bg-black/85 p-2.5 text-xs text-rose-50 shadow-lg backdrop-blur-sm">
          <div className="flex flex-wrap gap-3">
            {!groupIds.includes(selectedId) && (
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] font-bold text-rose-200/70">{es ? "Tamaño (1 u = 10 cm)" : "Size (1 u = 10 cm)"}</span>
                <span className="text-[9px] text-rose-200/50">{`${(size[0] * UNIT_CM).toFixed(1)}×${(size[1] * UNIT_CM).toFixed(1)}×${(size[2] * UNIT_CM).toFixed(1)} cm`}</span>
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
                    pendiv>
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
