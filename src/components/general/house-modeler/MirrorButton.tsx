import type { SavedPart } from "./autosave";

/** Flip the whole design left↔right around its own centre (positions and yaw; the footprint stays in place). */
export function mirrorParts(parts: SavedPart[]): SavedPart[] {
  if (!parts.length) return parts;
  const xs = parts.map((p) => p.x);
  const c = (Math.min(...xs) + Math.max(...xs)) / 2;
  return parts.map((p) => ({ ...p, x: Math.round((2 * c - p.x) * 100) / 100, r: Math.round(-p.r * 1000) / 1000 }));
}

export function MirrorButton({ es, disabled, onMirror }: { es: boolean; disabled: boolean; onMirror: () => void }) {
  const label = es ? "Espejo ↔" : "Mirror ↔";
  return (
    <button
      type="button"
      data-testid="mirror-design"
      onClick={onMirror}
      disabled={disabled}
      aria-label={es ? "Reflejar el diseño de izquierda a derecha" : "Flip the whole design left to right"}
      title={es ? "Refleja todo el diseño (se puede deshacer)" : "Flip the whole design (undoable)"}
      className="inline-flex min-h-11 shrink-0 snap-start items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold hover:bg-accent disabled:opacity-50"
    >
      {label}
    </button>
  );
}
