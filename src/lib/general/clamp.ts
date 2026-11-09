export type ClampStatus = "empty" | "invalid" | "ok";

export type ClampIssue = "number" | "range" | "viewport" | "root";

export type ClampResult =
  | { status: "empty" }
  | { status: "invalid"; issue: ClampIssue }
  | {
      status: "ok";
      minRem: number;
      maxRem: number;
      interceptRem: number;
      vwRem: number;
      css: string;
      atMinPx: number;
      atMaxPx: number;
    };

function round(n: number): number {
  return Math.round(n * 10000) / 10000;
}

function fmt(n: number): string {
  const rounded = round(n);
  return String(rounded);
}

/** Fluid type: clamp(min, intercept + slope*vw, max) in rem. */
export function buildClamp(
  minPx: number,
  maxPx: number,
  minVw: number,
  maxVw: number,
  rootPx: number,
): ClampResult {
  if (![minPx, maxPx, minVw, maxVw, rootPx].every((n) => Number.isFinite(n))) {
    return { status: "invalid", issue: "number" };
  }
  if (minPx <= 0 || maxPx <= 0) return { status: "invalid", issue: "range" };
  if (minPx > maxPx) return { status: "invalid", issue: "range" };
  if (minVw <= 0 || maxVw <= minVw) return { status: "invalid", issue: "viewport" };
  if (rootPx <= 0) return { status: "invalid", issue: "root" };

  const minRem = minPx / rootPx;
  const maxRem = maxPx / rootPx;
  const slope = (maxRem - minRem) / (maxVw - minVw);
  const interceptRem = minRem - minVw * slope;
  const vwRem = slope * 100;
  const preferred = `${fmt(interceptRem)}rem + ${fmt(vwRem)}vw`;
  const css = `font-size: clamp(${fmt(minRem)}rem, ${preferred}, ${fmt(maxRem)}rem);`;
  return {
    status: "ok",
    minRem: round(minRem),
    maxRem: round(maxRem),
    interceptRem: round(interceptRem),
    vwRem: round(vwRem),
    css,
    atMinPx: round(minPx),
    atMaxPx: round(maxPx),
  };
}
