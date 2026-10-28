import { sanitizeParts, type SavedPart } from "./autosave";
import { TIME_PRESETS, type TimeOfDay } from "./lighting";

const PREFIX = "#design=";

const toB64Url = (s: string) => btoa(unescape(encodeURIComponent(s))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const fromB64Url = (s: string) => decodeURIComponent(escape(atob(s.replace(/-/g, "+").replace(/_/g, "/"))));

/** Full URL of this page with the design (serializeParts output) packed into the hash. */
export function buildShareUrl(json: string, tod?: TimeOfDay): string {
  const t = tod && tod !== "sunset" ? `&tod=${tod}` : "";
  return `${window.location.origin}${window.location.pathname}${window.location.search}${PREFIX}${toB64Url(json)}${t}`;
}

/** Time of day packed next to the design in the hash, or null when the link carries none. */
export function readShareTod(): TimeOfDay | null {
  const m = /[&]tod=([a-z]+)/.exec(window.location.hash);
  return m && TIME_PRESETS.some((x) => x.id === m[1]) ? (m[1] as TimeOfDay) : null;
}

/** Parts encoded in the current URL hash, or [] if absent/invalid. */
export function readShareHash(): SavedPart[] {
  try {
    const h = window.location.hash;
    if (!h.startsWith(PREFIX)) return [];
    const data = JSON.parse(fromB64Url(h.slice(PREFIX.length).split("&")[0]));
    return data?.v === 1 ? sanitizeParts(data.parts) : [];
  } catch {
    return [];
  }
}

/** Copy the share URL to the clipboard (fallback: temporary textarea). */
export async function copyShareUrl(json: string, tod?: TimeOfDay): Promise<boolean> {
  try {
    const url = buildShareUrl(json, tod);
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url);
      return true;
    }
    const ta = document.createElement("textarea");
    ta.value = url;
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  } catch {
    return false;
  }
}
