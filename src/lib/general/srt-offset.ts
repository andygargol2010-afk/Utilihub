/** Shift SubRip cues. Empty or broken input does not invent a file. */
export type SrtOffsetResult =
  | { status: "ok"; output: string; cues: number }
  | { status: "empty" | "invalid" | "negative" | "too-big"; cues?: number };

const MAX_CHARS = 200_000;
const MAX_CUES = 400;
const TIME = /(\d{2}):(\d{2}):(\d{2})[,.](\d{3})/;
const ARROW = /(\d{2}:\d{2}:\d{2}[,.]\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2}[,.]\d{3})/;

function toMs(stamp: string): number | null {
  const match = TIME.exec(stamp);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  const seconds = Number(match[3]);
  const millis = Number(match[4]);
  if (minutes > 59 || seconds > 59) return null;
  return ((hours * 60 + minutes) * 60 + seconds) * 1000 + millis;
}

function fromMs(ms: number): string {
  const hours = Math.floor(ms / 3_600_000);
  const minutes = Math.floor((ms % 3_600_000) / 60_000);
  const seconds = Math.floor((ms % 60_000) / 1000);
  const millis = ms % 1000;
  const pad = (value: number, size: number) => String(value).padStart(size, "0");
  return `${pad(hours, 2)}:${pad(minutes, 2)}:${pad(seconds, 2)},${pad(millis, 3)}`;
}

export function shiftSrt(raw: string, offsetMs: number): SrtOffsetResult {
  if (!Number.isFinite(offsetMs) || Math.abs(offsetMs) > 12 * 60 * 60 * 1000) return { status: "invalid" };
  const text = raw.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n").trim();
  if (!text) return { status: "empty" };
  if (text.length > MAX_CHARS) return { status: "too-big" };
  const blocks = text.split(/\n{2,}/);
  const cues: string[] = [];
  for (const block of blocks) {
    const lines = block.split("\n");
    const arrowIndex = lines.findIndex((line) => ARROW.test(line));
    if (arrowIndex < 0) return { status: "invalid" };
    const match = ARROW.exec(lines[arrowIndex]);
    if (!match) return { status: "invalid" };
    const start = toMs(match[1]);
    const end = toMs(match[2]);
    if (start === null || end === null || end < start) return { status: "invalid" };
    const nextStart = start + offsetMs;
    const nextEnd = end + offsetMs;
    if (nextStart < 0 || nextEnd < 0) return { status: "negative", cues: cues.length };
    const index = arrowIndex > 0 && /^\d+$/.test(lines[0].trim()) ? lines[0].trim() : String(cues.length + 1);
    const body = lines.slice(arrowIndex + 1).join("\n").replace(/\s+$/, "");
    if (!body) return { status: "invalid" };
    cues.push(`${index}\n${fromMs(nextStart)} --> ${fromMs(nextEnd)}\n${body}`);
    if (cues.length > MAX_CUES) return { status: "too-big", cues: cues.length };
  }
  if (cues.length === 0) return { status: "empty" };
  return { status: "ok", output: `${cues.join("\n\n")}\n`, cues: cues.length };
}
