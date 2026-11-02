const KEY = "utilihub-house-units";
let imperial = false;

/** Metric (default) or imperial display units; only changes how numbers are shown, never the model. */
export function loadImperial(): boolean {
  try {
    imperial = window.localStorage.getItem(KEY) === "ft";
  } catch {
    imperial = false;
  }
  return imperial;
}

export function setImperial(v: boolean): void {
  imperial = v;
  try {
    if (v) window.localStorage.setItem(KEY, "ft");
    else window.localStorage.removeItem(KEY);
  } catch {
    /* storage unavailable: choice just isn't remembered */
  }
}

export function isImperial(): boolean {
  return imperial;
}

const FT = 3.28084;
export const fmtLen = (m: number, imp = imperial): string => (imp ? `${(m * FT).toFixed(1)} ft` : `${m.toFixed(2)} m`);
export const fmtArea = (m2: number, imp = imperial): string => (imp ? `${(m2 * FT * FT).toFixed(0)} ft²` : `${m2.toFixed(1)} m²`);
