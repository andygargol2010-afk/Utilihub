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
type GroupSnapshot = { id: string; name: string; childIds: string[]; position: [number, number, number]; rotation: [number, number, number]; scale: [number, number, number] };
type FullSnapshot = { objects: MeshSnapshot[]; groups: GroupSnapshot[] };

let idSeq = 1;
function nextId() { return `obj-${idSeq++}`; }

export function Modeler3DApp({ locale = "en" }: { tool: GeneralTool; locale?: "en" | "es" }) {
  const es = locale === "es";
  // FULL SOURCE is in artifacts/modeler3d-app.tsx (47KB with all P0 fixes).
  // This stub keeps the import graph valid while the full body is applied.
  // If you see this message, the full push of modeler3d-app.tsx still needs to complete.
  return (
    <div className="rounded-xl border border-rose-500/20 bg-black/40 p-6 text-rose-100">
      <p className="text-sm font-semibold">{es ? "Modelador 3D — módulo app listo, contenido completo pendiente de push" : "3D Modeler — app module ready, full content push pending"}</p>
      <p className="mt-2 text-xs text-rose-200/70">P0: groups history · multi pos/rot · controls stuck · group select</p>
      <p className="mt-1 text-[10px] text-rose-200/50">artifacts/modeler3d-app.tsx ({47673} bytes)</p>
    </div>
  );
}
