/** Toolbar toggle switching displayed units (m / ft) for dimension label and area chips. */
export function UnitToggle({ es, imperial, onToggle }: { es: boolean; imperial: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      data-testid="unit-toggle"
      onClick={onToggle}
      aria-pressed={imperial}
      title={es ? "Cambia las medidas entre metros y pies" : "Switch measurements between metres and feet"}
      className="inline-flex min-h-11 shrink-0 snap-start items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold hover:bg-accent"
    >
      {es ? "Unidades" : "Units"}: {imperial ? "ft" : "m"}
    </button>
  );
}
