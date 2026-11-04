import { type SchengenStay, type SchengenResult, parseIso, addDays, inclusiveDays, formatIso } from "./schengen.part1";
import { usedDays } from "./schengen.part2";
export { newStayId, todayIso, parseIso, formatIso, addDays, inclusiveDays } from "./schengen.part1";
export type { SchengenStay, SchengenIssue, SchengenStayResult, SchengenResult } from "./schengen.part1";
export { usedDays, validateSchengen } from "./schengen.part2";

export function calculateSchengen(reference: string, stays: SchengenStay[]): SchengenResult | null {
  const ref = parseIso(reference);
  if (!ref) return null;
  const parsed = stays
    .map((stay) => {
      const entry = parseIso(stay.entry);
      const exit = parseIso(stay.exit);
      if (!entry || !exit || exit.getTime() < entry.getTime()) return null;
      return { id: stay.id, entry, exit };
    })
    .filter((stay): stay is { id: string; entry: Date; exit: Date } => stay !== null);
  if (!parsed.length) return null;
  const windowStart = addDays(ref, -179);
  const used = usedDays(ref, parsed);
  const stayResults = parsed.map((stay) => {
    let inWindow = 0;
    for (let day = stay.entry; day.getTime() <= stay.exit.getTime(); day = addDays(day, 1)) {
      if (day.getTime() >= windowStart.getTime() && day.getTime() <= ref.getTime()) inWindow += 1;
    }
    return { id: stay.id, days: inclusiveDays(stay.entry, stay.exit), inWindow };
  });
  let nextFreeDate: string | null = null;
  let daysUntilOneFree: number | null = null;
  if (used > 0) {
    for (let offset = 1; offset <= 180; offset++) {
      const future = addDays(ref, offset);
      if (usedDays(future, parsed) < used) {
        nextFreeDate = formatIso(future);
        daysUntilOneFree = offset;
        break;
      }
    }
  }
  return {
    used,
    remaining: Math.max(0, 90 - used),
    overstay: Math.max(0, used - 90),
    windowStart: formatIso(windowStart),
    windowEnd: formatIso(ref),
    stays: stayResults,
    nextFreeDate,
    daysUntilOneFree,
  };
}

export function shiftIso(value: string, days: number) {
  const parsed = parseIso(value);
  if (!parsed) return value;
  return formatIso(addDays(parsed, days));
}
