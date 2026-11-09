/** Autosave of the placed parts (kind, position, yaw, own finish) in localStorage. Versioned; every access is guarded. */
const KEY = "utilihub.houseModeler.autosave.v1";

export type SavedPart = { k: string; x: number; z: number; r: number; f?: string; l?: 1; y?: string };
export type SavedLayer = { id: string; name: string; visible: boolean; locked: boolean };

const BASE = "layer-base";
let layerSource: (() => SavedLayer[]) | null = null;
/** The monolith registers how to read its layer list so every snapshot (autosave, undo, share) carries layers too. */
export function setLayerSource(fn: () => SavedLayer[]) {
  layerSource = fn;
}

/** Well-formed layers from a snapshot (always includes the base layer); null when the snapshot has none. */
export function sanitizeLayers(list: unknown): SavedLayer[] | null {
  if (!Array.isArray(list)) return null;
  const out = list
    .filter((l: SavedLayer) => l && typeof l.id === "string" && typeof l.name === "string" && l.id.length < 60)
    .slice(0, 12)
    .map((l: SavedLayer) => ({ id: l.id, name: l.name.slice(0, 40), visible: l.visible !== false, locked: l.locked === true }));
  if (!out.length) return null;
  return out.some((l) => l.id === BASE) ? out : [{ id: BASE, name: "Base", visible: true, locked: false }, ...out];
}

type PartLike = { kind: string; position: number[]; rotationY: number; layerId?: string } & Record<string, unknown>;

/** Part field that holds the finish chosen for this kind (doors use plain `finish`). */
export function finishKey(kind: string): string {
  return kind === "door" ? "finish" : `${kind}Finish`;
}

export function serializeParts(parts: PartLike[]): string {
  const out: SavedPart[] = parts.map((p) => {
    const f = p[finishKey(p.kind)];
    return {
      k: p.kind,
      x: Math.round(p.position[0] * 100) / 100,
      z: Math.round(p.position[2] * 100) / 100,
      r: Math.round(p.rotationY * 1000) / 1000,
      ...(typeof f === "string" ? { f } : {}),
      ...(p.locked === true ? { l: 1 as const } : {}),
      ...(typeof p.layerId === "string" && p.layerId !== BASE ? { y: p.layerId } : {}),
    };
  });
  const ly = layerSource?.() ?? [];
  const plain = ly.length <= 1 && ly.every((l) => l.visible && !l.locked);
  return JSON.stringify(plain ? { v: 1, parts: out } : { v: 1, parts: out, ly });
}

/** Write only when the snapshot changed. Returns the string that is now stored (or the previous one on failure). */
export function writeAutosave(json: string, last: string): string {
  if (json === last) return last;
  try {
    if (JSON.parse(json).parts.length === 0) window.localStorage.removeItem(KEY);
    else window.localStorage.setItem(KEY, json);
    return json;
  } catch {
    return last;
  }
}

const VALID_KINDS = ["wall", "floor", "roof", "column", "door", "window", "stairs", "railing", "chimney", "beam", "foundation", "pergola", "fence", "path", "planter", "bench", "lamp"];

/** Keep only well-formed parts (shared by autosave and share links). */
export function sanitizeParts(list: unknown): SavedPart[] {
  if (!Array.isArray(list)) return [];
  return list
    .filter(
      (p: SavedPart) =>
        p && VALID_KINDS.includes(p.k) && Number.isFinite(p.x) && Number.isFinite(p.z) && Number.isFinite(p.r) && (p.f === undefined || typeof p.f === "string") && (p.y === undefined || typeof p.y === "string"),
    )
    .slice(0, 400);
}

export function readAutosave(): SavedPart[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    return data?.v === 1 ? sanitizeParts(data.parts) : [];
  } catch {
    return [];
  }
}

/** Layers stored next to the autosaved parts, or null. */
export function readAutosaveLayers(): SavedLayer[] | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? sanitizeLayers(JSON.parse(raw)?.ly) : null;
  } catch {
    return null;
  }
}
