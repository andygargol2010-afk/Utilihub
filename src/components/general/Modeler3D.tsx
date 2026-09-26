import { useCallback, useEffect, useRef, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";
import {
  ALL_KINDS, BASE_SIZE, COLORS, HISTORY_MAX, NAME_PAIR, STORAGE_KEY,
  clampPos, clampSize, degToRad, makeGeometry, makeMaterial, radToDeg, shapeList, snapVal,
  type ShapeKind,
} from "./modeler3d-helpers";

type Mode = "translate" | "rotate" | "scale";
type SceneObj = { id: string; name: string; kind: ShapeKind; color: string };
type MeshSnapshot = { id: string; name: string; kind: ShapeKind; color: string; position: [number, number, number]; rotation: [number, number, number]; scale: [number, number, number] };
type ClipboardItem = { kind: ShapeKind; color: string; name: string; position: [number, number, number]; rotation: [number, number, number]; scale: [number, number, number] };

let idSeq = 1;
function nextId() { return `obj-${idSeq++}`; }

export function Modeler3D({ locale = "en" }: { tool: GeneralTool; locale?: "en" | "es" }) {
  const es = locale === "es";
  return (
    <div className="rounded-xl border border-rose-500/20 bg-black/40 p-6 text-rose-100">
      <p className="text-sm font-semibold">{es ? "Modelador 3D — restaurando multi-select y grupos…" : "3D Modeler — restoring multi-select and groups…"}</p>
      <p className="mt-2 text-xs text-rose-200/70">Shift+click · Shift+drag box · Ctrl+G groups · size/color on all selected</p>
    </div>
  );
}
