import type { SavedPart } from "./autosave";

export type ViewId = "iso" | "plan" | "front" | "side";

const VIEWS: { id: ViewId; en: string; es: string }[] = [
  { id: "iso", en: "View: 3D", es: "Vista: 3D" },
  { id: "plan", en: "View: Plan (top)", es: "Vista: Planta (arriba)" },
  { id: "front", en: "View: Front", es: "Vista: Frontal" },
  { id: "side", en: "View: Side", es: "Vista: Lateral" },
];

/** Camera position + orbit target that frames the whole design from the chosen direction. */
export function viewPose(parts: SavedPart[], view: ViewId) {
  const xs = parts.map((p) => p.x);
  const zs = parts.map((p) => p.z);
  const cx = parts.length ? (Math.min(...xs) + Math.max(...xs)) / 2 : 0;
  const cz = parts.length ? (Math.min(...zs) + Math.max(...zs)) / 2 : 0;
  const span = parts.length ? Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...zs) - Math.min(...zs)) : 0;
  const d = Math.min(60, Math.max(10, span * 1.5 + 8));
  const target: [number, number, number] = [cx, 1.3, cz];
  const pos: Record<ViewId, [number, number, number]> = {
    iso: [cx + d * 0.62, d * 0.5, cz + d * 0.62],
    plan: [cx, d * 1.1, cz + 0.01],
    front: [cx, 1.8, cz + d],
    side: [cx + d, 1.8, cz],
  };
  return { target, position: pos[view] };
}

/** Toolbar dropdown that jumps the camera to a 3D, plan, front or side view of the design. */
export function ViewPicker({ es, onPick }: { es: boolean; onPick: (id: ViewId) => void }) {
  const title = es ? "Vista de cámara" : "Camera view";
  return (
    <select
      data-testid="view-picker"
      aria-label={title}
      title={title}
      value=""
      onChange={(e) => e.target.value && onPick(e.target.value as ViewId)}
      className="inline-flex min-h-11 shrink-0 snap-start rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold hover:bg-accent"
    >
      <option value="">{es ? "Vista…" : "View…"}</option>
      {VIEWS.map((x) => (
        <option key={x.id} value={x.id}>{es ? x.es : x.en}</option>
      ))}
    </select>
  );
}
