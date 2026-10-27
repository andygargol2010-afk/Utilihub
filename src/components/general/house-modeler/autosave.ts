/** Autosave of the placed parts (kind, position, yaw, own finish) in localStorage. Versioned; every access is guarded. */
const KEY = "utilihub.houseModeler.autosave.v1";

export type SavedPart = { k: string; x: number; z: number; r: number; f?: string };

type PartLike = { kind: string; position: number[]; rotationY: number } & Record<string, unknown>;

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
    };
  });
  return JSON.stringify({ v: 1, parts: out });
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
        p && VALID_KINDS.includes(p.k) && Number.isFinite(p.x) && Number.isFinite(p.z) && Number.isFinite(p.r) && (p.f === undefined || typeof p.f === "string"),
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
