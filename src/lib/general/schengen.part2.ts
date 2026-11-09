// Part 2 of 3 — split from schengen.ts on 2026-11-04. Edit here; schengen.ts re-exports.
import { addDays, type SchengenStay, type SchengenIssue, parseIso } from "./schengen.part1";

export function covered(day: Date, stays: Array<{ entry: Date; exit: Date }>) {
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
