import { TIME_PRESETS, type TimeOfDay } from "./lighting";

/** Toolbar dropdown that switches the scene lighting between morning, noon, sunset and dusk. */
export function TimeOfDayPicker({ es, value, onPick }: { es: boolean; value: TimeOfDay; onPick: (id: TimeOfDay) => void }) {
  const title = es ? "Hora del día" : "Time of day";
  return (
    <select
      data-testid="time-of-day-picker"
      aria-label={title}
      title={title}
      value={value}
      onChange={(e) => onPick(e.target.value as TimeOfDay)}
      className="inline-flex min-h-11 shrink-0 snap-start rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold hover:bg-accent"
    >
      {TIME_PRESETS.map((x) => (
        <option key={x.id} value={x.id}>{es ? x.es : x.en}</option>
      ))}
    </select>
  );
}
