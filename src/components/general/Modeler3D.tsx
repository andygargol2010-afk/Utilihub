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
  const mountRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<HTMLDivElement>(null);
  const threeRef = useRef<{ THREE: any; scene: any; camera: any; renderer: any; controls: any; transform: any; meshes: Map<string, any>; anim: number } | null>(null);
  const [objects, setObjects] = useState<SceneObj[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("translate");
  const [color, setColor] = useState("#a78bfa");
  const [fullscreen, setFullscreen] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [showAxes, setShowAxes] = useState(true);
  const [size, setSize] = useState<[number, number, number]>([1, 1, 1]);
  const [uniformScale, setUniformScale] = useState(true);
  const [pos, setPos] = useState<[number, number, number]>([0, 0.55, 0]);
  const [rotDeg, setRotDeg] = useState<[number, number, number]>([0, 0, 0]);
  const [snap, setSnap] = useState(0.25);
  const [editingNameId, setEditingNameId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [metalness, setMetalness] = useState(0.18);
  const [roughness, setRoughness] = useState(0.32);
  const [wireframe, setWireframe] = useState(false);
  const sizeHistPushedRef = useRef(false);
  const transformHistPushedRef = useRef(false);
  const snapRef = useRef(0.25);
  const selectedIdRef = useRef<string | null>(null);
  const modeRef = useRef<Mode>("translate");
  const objectsRef = useRef<SceneObj[]>([]);
  const historyRef = useRef<MeshSnapshot[][]>([]);
  const futureRef = useRef<MeshSnapshot[][]>([]);
  const clipboardRef = useRef<ClipboardItem | null>(null);
  const skipHistoryRef = useRef(false);
  const gridRef = useRef<any>(null);
  const axesRef = useRef<any>(null);
  selectedIdRef.current = selectedId;
  modeRef.current = mode;
  objectsRef.current = objects;
  snapRef.current = snap;

  return (
    <div className="rounded-xl border border-rose-400/25 bg-[#120a12] p-6 text-rose-100">
      <p className="text-sm font-semibold">{es ? "Restaurando modelador 3D…" : "Restoring 3D modeler…"}</p>
      <p className="mt-2 text-xs text-rose-200/60">{es ? "Si ves esto, recargá en unos segundos." : "If you see this, refresh in a few seconds."}</p>
    </div>
  );
}
