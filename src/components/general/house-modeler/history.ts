import { sanitizeLayers, type SavedLayer, type SavedPart } from "./autosave";

export type HistoryStep = { parts: SavedPart[]; layers: SavedLayer[] | null };
const step = (json: string): HistoryStep => {
  const d = JSON.parse(json);
  return { parts: d.parts, layers: sanitizeLayers(d.ly) };
};

/** Undo/redo over serialized snapshots (autosave format). The monolith feeds it the current snapshot; it never touches the scene. */
export function createHistory(limit = 60) {
  let past: string[] = [];
  let future: string[] = [];
  let cur = "";
  return {
    /** Replace the current snapshot without recording a step (after restore/undo/redo). */
    sync(json: string) {
      cur = json;
    },
    /** Record a user change when the snapshot differs from the current one. Returns true if recorded. */
    observe(json: string) {
      if (json === cur) return false;
      if (cur) past.push(cur);
      if (past.length > limit) past.shift();
      future = [];
      cur = json;
      return true;
    },
    undo(): HistoryStep | null {
      const prev = past.pop();
      if (prev === undefined) return null;
      future.push(cur);
      cur = prev;
      return step(prev);
    },
    redo(): HistoryStep | null {
      const next = future.pop();
      if (next === undefined) return null;
      past.push(cur);
      cur = next;
      return step(next);
    },
    canUndo: () => past.length > 0,
    canRedo: () => future.length > 0,
  };
}

/** Maps Ctrl/Cmd+Z, Ctrl/Cmd+Shift+Z and Ctrl/Cmd+Y to a step; null when the key is unrelated or typing in a field. */
export function undoKeyStep(e: KeyboardEvent): "undo" | "redo" | null {
  if (!(e.ctrlKey || e.metaKey) || e.altKey) return null;
  const el = e.target as HTMLElement | null;
  if (el?.tagName === "INPUT" || el?.tagName === "TEXTAREA" || el?.tagName === "SELECT" || el?.isContentEditable) return null;
  const k = e.key.toLowerCase();
  if (k !== "z" && k !== "y") return null;
  return k === "y" || e.shiftKey ? "redo" : "undo";
}
