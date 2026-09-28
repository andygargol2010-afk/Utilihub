import { useCallback, useEffect, useRef, useState } from "react";
import type { ShapeKind } from "./modeler3d-helpers";

/** Temporary maintenance stub — full modeler restore pending. */
export function useModelerCore(locale: "en" | "es" = "en") {
  const es = locale === "es";
  const [ready] = useState(false);
  const [error] = useState(es ? "El modelador 3D se está actualizando. Volvé en unos minutos." : "The 3D modeler is being updated. Please check back shortly.");
  const noop = useCallback(() => {}, []);
  const mountRef = useRef<HTMLDivElement | null>(null);
  const studioRef = useRef<HTMLDivElement | null>(null);
  const threeRef = useRef<any>(null);
  const gridRef = useRef<any>(null);
  const selectedIdRef = useRef<string | null>(null);
  const selectedIdsRef = useRef<string[]>([]);
  const groupsRef = useRef<Map<string, { childIds: string[]; groupObj: any }>>(new Map());
  const marqueeRef = useRef({ on: false, x0: 0, y0: 0, el: null as HTMLDivElement | null });
  const modeRef = useRef<"translate" | "rotate" | "scale">("translate");
  const sizeHistPushedRef = useRef(false);

  return {
    es, objects: [] as any[], selectedId: null as string | null, selectedIds: [] as string[],
    groupIds: [] as string[], ctxMenu: null as { x: number; y: number } | null, setCtxMenu: noop as any,
    mode: "translate" as const, setMode: noop as any, color: "#a78bfa", setColor: noop as any,
    fullscreen: false, ready, setReady: noop as any, error, setError: noop as any,
    canUndo: false, canRedo: false, size: [1, 1, 1] as [number, number, number],
    pos: [0, 0, 0] as [number, number, number], rotDeg: [0, 0, 0] as [number, number, number],
    snap: 0.25, setSnap: noop as any, mountRef, studioRef, threeRef,
    sizeHistPushedRef, selectedIdRef, selectedIdsRef, groupsRef, marqueeRef,
    modeRef, gridRef, pushHistory: noop, setPosAxis: noop as any, setRotAxis: noop as any,
    endTransformEdit: noop, nudgeSelected: noop as any, setSizeAxis: noop as any,
    addShape: noop as any, deleteSelected: noop, applyColor: noop as any,
    groupSelected: noop, ungroupSelected: noop, undo: noop, redo: noop, toggleFullscreen: noop,
    setSelectedId: noop as any, setSelectedIds: noop as any, readTransform: noop as any,
    loadScene: noop, saveScene: noop, clearScene: noop,
    copySelected: noop, cutSelected: noop, pasteClipboard: noop, exportJSON: noop, exportSTL: noop,
    dropToFloor: noop, alignSelection: noop as any, snapTranslateLive: noop as any,
  };
}
