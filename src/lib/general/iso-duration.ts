import { type IsoDurationInput, type IsoDurationResult, parsePart } from "./iso-duration.part1";
import { validateIsoDuration, FIELDS } from "./iso-duration.part2";
export { emptyIsoDuration, meetingPreset, sprintPreset, leasePreset } from "./iso-duration.part1";
export type { IsoDurationInput, IsoIssue, IsoDurationResult } from "./iso-duration.part1";
export { validateIsoDuration } from "./iso-duration.part2";

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
