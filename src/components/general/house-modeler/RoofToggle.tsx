/** Toolbar toggle that hides every roof so the interior of the house can be seen from above or at an angle. */
export function RoofToggle({ es, hidden, onToggle }: { es: boolean; hidden: boolean; onToggle: () => void }) {
  const label = hidden ? (es ? "Mostrar techo" : "Show roof") : es ? "Ocultar techo" : "Hide roof";
  return (
    <button
      type="button"
      data-testid="roof-toggle"
      onClick={onToggle}
      aria-pressed={hidden}
      title={es ? "Oculta los techos para ver el interior (no borra nada)" : "Hide roofs to see inside (nothing is deleted)"}
      className="inline-flex min-h-11 shrink-0 snap-start items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold hover:bg-accent"
    >
      {label}
    </button>
  );
}
