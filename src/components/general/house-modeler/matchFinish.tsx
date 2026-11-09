import { finishKey } from "./autosave";

type PartLike = { id: string; kind: string } & Record<string, unknown>;

/**
 * Copies the selected part's finish onto every other part of the same kind.
 * `currentFinish` reads the live finish of a part (scene userData first), `apply` paints one part and
 * returns false when it was skipped (locked / hidden layer). Returns how many parts changed, or null with no finish.
 */
export function matchFinishToAll<P extends PartLike>(
  parts: P[],
  selectedId: string | null,
  currentFinish: (p: P) => string | undefined,
  apply: (p: P, finish: string) => boolean,
): number | null {
  const src = parts.find((p) => p.id === selectedId);
  const finish = src ? currentFinish(src) : undefined;
  if (!src || !finish) return null;
  let n = 0;
  for (const p of parts) {
    if (p.id === src.id || p.kind !== src.kind || currentFinish(p) === finish) continue;
    if (apply(p, finish)) {
      (p as Record<string, unknown>)[finishKey(p.kind)] = finish;
      n += 1;
    }
  }
  return n;
}

export function matchFinishHint(es: boolean, n: number | null) {
  if (n === null) return es ? "Esta pieza no tiene acabado" : "This part has no finish";
  if (n === 0) return es ? "Todas las piezas de este tipo ya tienen este acabado" : "All parts of this type already have this finish";
  return es ? `Acabado aplicado a ${n} pieza${n === 1 ? "" : "s"} más — Ctrl+Z deshace` : `Finish applied to ${n} more part${n === 1 ? "" : "s"} — Ctrl+Z undoes`;
}

/** Selection-bar button: same finish on every part of the selected kind. */
export function MatchFinishButton({ es, disabled, onClick, overlay = false }: { es: boolean; disabled: boolean; onClick: () => void; overlay?: boolean }) {
  const look = overlay
    ? "gap-1 border-amber-100/25 bg-amber-950/85 px-2.5 text-[11px] text-amber-50 hover:bg-amber-800"
    : "shrink-0 snap-start gap-2 border-border bg-card px-3 py-2 text-sm hover:bg-accent";
  return (
    <button
      type="button"
      data-testid={overlay ? "match-finish-fs" : "match-finish"}
      onClick={onClick}
      aria-disabled={disabled}
      title={es ? "Aplicar este acabado a todas las piezas del mismo tipo" : "Apply this finish to all parts of the same type"}
      className={`inline-flex min-h-11 items-center rounded-lg border font-semibold ${look} ${disabled ? "cursor-not-allowed opacity-40" : ""}`}
    >
      {es ? "Igualar acabado" : "Match finish"}
    </button>
  );
}
