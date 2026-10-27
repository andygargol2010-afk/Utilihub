import { PRESETS } from "./presets";
import type { SavedPart } from "./autosave";

/** Toolbar dropdown that loads a ready-made layout (the parent replaces the scene and records undo history). */
export function PresetPicker({ es, hasParts, onPick }: { es: boolean; hasParts: boolean; onPick: (parts: SavedPart[]) => void }) {
  const title = es ? "Plantillas de casa" : "House presets";
  return (
    <select
      data-testid="preset-picker"
      aria-label={title}
      title={title}
      value=""
      onChange={(e) => {
        const preset = PRESETS.find((x) => x.id === e.target.value);
        if (!preset) return;
        if (hasParts && !window.confirm(es ? "Esto reemplaza tu diseño actual (puedes deshacer). ¿Continuar?" : "This replaces your current design (you can undo). Continue?")) return;
        onPick(preset.parts);
      }}
      className="inline-flex min-h-11 shrink-0 snap-start rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold hover:bg-accent"
    >
      <option value="">{title}…</option>
      {PRESETS.map((x) => (
        <option key={x.id} value={x.id}>{es ? x.es : x.en}</option>
      ))}
    </select>
  );
}
