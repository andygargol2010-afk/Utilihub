// Part 2 of 3 — split from iso-duration.ts on 2026-11-04. Edit here; iso-duration.ts re-exports.
import { type IsoDurationInput, type IsoIssue, parsePart } from "./iso-duration.part1";

export const FIELDS: (keyof IsoDurationInput)[] = ["years", "months", "weeks", "days", "hours", "minutes", "seconds"];

export function validateIsoDuration(input: IsoDurationInput, es: boolean): IsoIssue[] {
  const issues: IsoIssue[] = [];
  const parsed = FIELDS.map((field) => ({ field, part: parsePart(input[field]) }));
  if (parsed.every((row) => row.part.ok && row.part.blank)) {
    issues.push({
      field: "years",
      message: es ? "Todos los campos están vacíos. Usá 0 o un preset." : "Every field is empty. Enter 0 or load a preset.",
    });
    return issues;
  }
  for (const row of parsed) {
    if (row.part.ok) continue;
    const reason = row.part.reason;
    const message = reason === "neg"
      ? es ? "No se aceptan valores negativos (una duración negativa sería -P…)." : "Negative values are rejected (a negative duration would be -P…)."
      : reason === "frac"
        ? es ? "Solo se aceptan enteros. ISO permite un decimal solo en el componente menor." : "Only integers are accepted. ISO allows one decimal on the lowest component only."
        : reason === "big"
          ? es ? "Cada componente debe ser 9999 o menos." : "Each component must be 9999 or less."
          : es ? "El valor no es un número (NaN)." : "The value is not a number (NaN).";
    issues.push({ field: row.field, message });
  }
  if (issues.length) return issues;
  const n = Object.fromEntries(parsed.map((row) => [row.field, row.part.ok ? row.part.n : 0])) as Record<keyof IsoDurationInput, number>;
  if (n.weeks > 0 && (n.years > 0 || n.months > 0 || n.days > 0)) {
    issues.push({
      field: "weeks",
      message: es
        ? "ISO 8601 no mezcla semanas con años, meses o días. Usá P2W o P14D, no ambos."
        : "ISO 8601 does not mix weeks with years, months, or days. Use P2W or P14D, not both.",
    });
  }
  return issues;
}
