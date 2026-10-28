import type { SavedPart } from "./autosave";

/** Turn the whole design 90° clockwise (seen from above) around the centre of its footprint. */
export function rotateParts(parts: SavedPart[]): SavedPart[] {
  if (!parts.length) return parts;
  const xs = parts.map((p) => p.x);
  const zs = parts.map((p) => p.z);
  const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
  const cz = (Math.min(...zs) + Math.max(...zs)) / 2;
  const q = (n: number) => Math.round(n * 100) / 100;
  return parts.map((p) => ({ ...p, x: q(cx + (p.z - cz)), z: q(cz - (p.x - cx)), r: Math.round((p.r + Math.PI / 2) * 1000) / 1000 }));
}

export function RotateDesignButton({ es, disabled, onRotate }: { es: boolean; disabled: boolean; onRotate: () => void }) {
  return (
    <button
      type="button"
      data-testid="rotate-design"
      onClick={onRotate}
      disabled={disabled}
      aria-label={es ? "Girar todo el diseño 90 grados" : "Turn the whole design 90 degrees"}
      title={es ? "Gira todo el diseño 90° (se puede deshacer)" : "Turn the whole design 90° (undoable)"}
      className="inline-flex min-h-11 shrink-0 snap-start items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold hover:bg-accent disabled:opacity-50"
    >
      {es ? "Girar 90° ⟳" : "Turn 90° ⟳"}
    </button>
  );
}
