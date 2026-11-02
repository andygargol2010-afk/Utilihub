const KEY = "utilihub-house-roof-hidden";

/** Remembers whether the user had roofs hidden, so a reload keeps the interior view they were working in. */
export function loadRoofHidden(): boolean {
  try {
    return window.localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

export function saveRoofHidden(hidden: boolean): void {
  try {
    if (hidden) window.localStorage.setItem(KEY, "1");
    else window.localStorage.removeItem(KEY);
  } catch {
    /* storage unavailable: preference just isn't remembered */
  }
}
