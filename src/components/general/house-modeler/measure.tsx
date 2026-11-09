export type { Measure } from "./measure.part1";
export { createMeasure } from "./measure.part2";

export function MeasureButton({ es, active, onToggle }: { es: boolean; active: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      data-testid="measure-tool"
      aria-pressed={active}
      onClick={onToggle}
      aria-label={es ? "Medir distancia entre dos puntos del suelo" : "Measure the distance between two ground points"}
      title={es ? "Toca dos puntos del suelo para medir" : "Click two ground points to measure"}
      className={`inline-flex min-h-11 shrink-0 snap-start items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold hover:bg-accent ${active ? "border-cyan-500 bg-cyan-100 text-cyan-900 dark:bg-cyan-900/40 dark:text-cyan-100" : "border-border bg-card"}`}
    >
      {es ? "Medir 📏" : "Measure 📏"}
    </button>
  );
}
