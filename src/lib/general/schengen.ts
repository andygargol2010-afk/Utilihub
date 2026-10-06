/** Schengen short-stay day count: 90 days in any rolling 180-day window. Dates are inclusive calendar days. */

export type SchengenStay = { id: string; entry: string; exit: string };

export type SchengenIssue = { field: string; message: string };

export type SchengenStayResult = {
  id: string;
  days: number;
  inWindow: number;
};

export type SchengenResult = {
  used: number;
  remaining: number;
  overstay: number;
  windowStart: string;
  windowEnd: string;
  stays: SchengenStayResult[];
  nextFreeDate: string | null;
  daysUntilOneFree: number | null;
};

export function newStayId() {
  return Math.random().toString(36).slice(2, 8);
}

export function todayIso() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseIso(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
  return date;
}

export function formatIso(date: Date) {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * 86400000);
}

export function inclusiveDays(start: Date, end: Date) {
  return Math.round((end.getTime() - start.getTime()) / 86400000) + 1;
}

function covered(day: Date, stays: Array<{ entry: Date; exit: Date }>) {
  return stays.some((stay) => day.getTime() >= stay.entry.getTime() && day.getTime() <= stay.exit.getTime());
}

export function usedDays(reference: Date, stays: Array<{ entry: Date; exit: Date }>) {
  const start = addDays(reference, -179);
  let count = 0;
  for (let i = 0; i < 180; i++) {
    if (covered(addDays(start, i), stays)) count += 1;
  }
  return count;
}

export function validateSchengen(reference: string, stays: SchengenStay[], es: boolean): SchengenIssue[] {
  const issues: SchengenIssue[] = [];
  if (!reference.trim()) {
    issues.push({ field: "reference", message: es ? "Elegí una fecha de referencia." : "Choose a reference date." });
  } else if (!parseIso(reference)) {
    issues.push({ field: "reference", message: es ? "La fecha de referencia no es válida." : "Reference date is not valid." });
  }
  if (!stays.length) {
    issues.push({ field: "stays", message: es ? "Agregá al menos una estancia, o usá un preset." : "Add at least one stay, or use a preset." });
  }
  stays.forEach((stay, index) => {
    const entry = parseIso(stay.entry);
    const exit = parseIso(stay.exit);
    if (!stay.entry.trim() || !stay.exit.trim()) {
      issues.push({
        field: `stay-${stay.id}`,
        message: es ? `La estancia ${index + 1} tiene una fecha vacía.` : `Stay ${index + 1} has an empty date.`,
      });
      return;
    }
    if (!entry || !exit) {
      issues.push({
        field: `stay-${stay.id}`,
        message: es ? `La estancia ${index + 1} tiene una fecha inválida.` : `Stay ${index + 1} has an invalid date.`,
      });
      return;
    }
    if (exit.getTime() < entry.getTime()) {
      issues.push({
        field: `stay-${stay.id}`,
        message: es
          ? `La estancia ${index + 1}: la salida es anterior a la entrada.`
          : `Stay ${index + 1}: exit is before entry.`,
      });
    }
  });
  return issues;
}

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
