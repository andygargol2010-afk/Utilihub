import { sanitizeParts, type SavedPart } from "./autosave";

const PREFIX = "#design=";

const toB64Url = (s: string) => btoa(unescape(encodeURIComponent(s))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const fromB64Url = (s: string) => decodeURIComponent(escape(atob(s.replace(/-/g, "+").replace(/_/g, "/"))));

/** Full URL of this page with the design (serializeParts output) packed into the hash. */
export function buildShareUrl(json: string): string {
  return `${window.location.origin}${window.location.pathname}${window.location.search}${PREFIX}${toB64Url(json)}`;
}

/** Parts encoded in the current URL hash, or [] if absent/invalid. */
export function readShareHash(): SavedPart[] {
  try {
    const h = window.location.hash;
    if (!h.startsWith(PREFIX)) return [];
    const data = JSON.parse(fromB64Url(h.slice(PREFIX.length)));
    return data?.v === 1 ? sanitizeParts(data.parts) : [];
  } catch {
    return [];
  }
}

/** Copy the share URL to the clipboard (fallback: temporary textarea). */
export async function copyShareUrl(json: string): Promise<boolean> {
  try {
    const url = buildShareUrl(json);
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
