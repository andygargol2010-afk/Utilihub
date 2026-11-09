const KEY = "utilihub.houseModeler.snap.v1";
export const SNAP_STEPS = [0.1, 0.25, 0.5, 1] as const;
export type SnapStep = (typeof SNAP_STEPS)[number];

function load(): SnapStep {
  try {
    const v = Number(window.localStorage.getItem(KEY));
    return (SNAP_STEPS as readonly number[]).includes(v) ? (v as SnapStep) : 0.5;
  } catch {
    return 0.5;
  }
}

let step: SnapStep = typeof window === "undefined" ? 0.5 : load();

/** Current placement/nudge grid in metres (shared by snap() and the arrow-key/pad nudges). */
export function gridStep(): SnapStep {
  return step;
}

export function setGridStep(v: SnapStep) {
  step = v;
  try {
    window.localStorage.setItem(KEY, String(v));
  } catch {
    /* storage blocked: step applies for this session only */
  }
}

const fmt = (v: number, es: boolean) => (es ? String(v).replace(".", ",") : String(v));

export function snapLabel(v: number, es: boolean) {
  return es ? `Grilla ${fmt(v, true)} m` : `${fmt(v, false)} m snap`;
}

/** Toolbar dropdown that changes the placement snap grid (0.1 / 0.25 / 0.5 / 1 m). */
export function SnapPicker({ es, value, onPick }: { es: boolean; value: SnapStep; onPick: (v: SnapStep) => void }) {
  const title = es ? "Tamaño de grilla" : "Snap grid size";
  return (
    <select
      data-testid="snap-picker"
      aria-label={title}
      title={title}
      value={value}
      onChange={(e) => onPick(Number(e.target.value) as SnapStep)}
      className="inline-flex min-h-11 shrink-0 snap-start rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold hover:bg-accent"
    >
      {SNAP_STEPS.map((v) => (
        <option key={v} value={v}>{snapLabel(v, es)}</option>
      ))}
    </select>
  );
}

/** Labels that mention the nudge distance must follow the chosen grid, not a hard-coded 0.5 m. */
export function withGridLabels<T extends { nudge: string; tip: string }>(l: T, es: boolean, v: number): T {
  const m = es ? `${fmt(v, true)} m` : `${fmt(v, false)} m`;
  return { ...l, nudge: es ? `Mover ${m}` : `Nudge ${m}`, tip: l.tip.replace(/0[.,]5 m/, m) };
}
