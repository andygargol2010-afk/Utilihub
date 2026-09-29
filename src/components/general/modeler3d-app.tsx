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

  // TEMPORARY STUB - will be replaced
  return <div>loading</div>;
}
