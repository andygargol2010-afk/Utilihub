/** ISO 8601 duration builder. Weeks are exclusive of Y/M/D (ISO 8601-1). */

export type IsoDurationInput = {
  years: string;
  months: string;
  weeks: string;
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
};

export type IsoIssue = { field: string; message: string };

export type IsoDurationResult = {
  duration: string;
  datePart: string;
  timePart: string;
  approximateSeconds: number;
  note: string;
  noteEs: string;
};

export function emptyIsoDuration(): IsoDurationInput {
  return { years: "", months: "", weeks: "", days: "", hours: "", minutes: "", seconds: "" };
}

export function meetingPreset(): IsoDurationInput {
  return { years: "0", months: "0", weeks: "0", days: "0", hours: "1", minutes: "30", seconds: "0" };
}

export function sprintPreset(): IsoDurationInput {
  return { years: "0", months: "0", weeks: "2", days: "0", hours: "0", minutes: "0", seconds: "0" };
}

export function leasePreset(): IsoDurationInput {
  return { years: "1", months: "2", weeks: "0", days: "3", hours: "4", minutes: "0", seconds: "0" };
}

function parsePart(value: string) {
  const trimmed = value.trim().replace(",", ".");
  if (!trimmed) return { ok: true as const, n: 0, blank: true };
  if (!/^\d+(\.\d+)?$/.test(trimmed)) {
    if (trimmed.startsWith("-")) return { ok: false as const, reason: "neg" as const };
    return { ok: false as const, reason: "nan" as const };
  }
  const n = Number(trimmed);
  if (!Number.isFinite(n)) return { ok: false as const, reason: "nan" as const };
  if (n < 0) return { ok: false as const, reason: "neg" as const };
  if (!Number.isInteger(n)) return { ok: false as const, reason: "frac" as const };
  if (n > 9999) return { ok: false as const, reason: "big" as const };
  return { ok: true as const, n, blank: false };
}

const FIELDS: (keyof IsoDurationInput)[] = ["years", "months", "weeks", "days", "hours", "minutes", "seconds"];

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

function unit(n: number, letter: string) {
  return n > 0 ? `${n}${letter}` : "";
}

export function buildIsoDuration(parts: Record<keyof IsoDurationInput, number>): IsoDurationResult {
  const datePart = parts.weeks > 0
    ? unit(parts.weeks, "W")
    : `${unit(parts.years, "Y")}${unit(parts.months, "M")}${unit(parts.days, "D")}`;
  const timePart = `${unit(parts.hours, "H")}${unit(parts.minutes, "M")}${unit(parts.seconds, "S")}`;
  let duration = "P";
  if (!datePart && !timePart) duration = "P0D";
  else {
    duration += datePart;
    if (timePart) duration += `T${timePart}`;
  }
  const approximateSeconds =
    parts.years * 365.2425 * 86400 +
    parts.months * 30.436875 * 86400 +
    parts.weeks * 7 * 86400 +
    parts.days * 86400 +
    parts.hours * 3600 +
    parts.minutes * 60 +
    parts.seconds;
  return {
    duration,
    datePart: datePart || (timePart ? "" : "0D"),
    timePart,
    approximateSeconds,
    note: "Years use 365.2425 days and months use 30.436875 days only for the approximate second count. The ISO string does not expand months.",
    noteEs: "Los años usan 365.2425 días y los meses 30.436875 días solo para el conteo aproximado de segundos. La cadena ISO no expande los meses.",
  };
}

export function computeIsoDuration(input: IsoDurationInput): IsoDurationResult | null {
  if (validateIsoDuration(input, false).length) return null;
  const parts = Object.fromEntries(FIELDS.map((field) => [field, parsePart(input[field]).ok ? parsePart(input[field]).n : 0])) as Record<keyof IsoDurationInput, number>;
  return buildIsoDuration(parts);
}

export function formatSeconds(value: number) {
  const rounded = Math.round(value);
  return rounded.toLocaleString("en-US");
}
