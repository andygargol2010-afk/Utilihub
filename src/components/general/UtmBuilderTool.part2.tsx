// Part 2 of 3 — split from UtmBuilderTool.tsx on 2026-11-04. Edit here; UtmBuilderTool.tsx re-exports.

export const inputClass = "h-11 w-full rounded-xl border bg-background px-3 text-base";

export const MEDIUMS = ["cpc", "email", "social", "referral", "organic", "display"];

export function cleanToken(value: string, lower: boolean) {
  const trimmed = value.trim().replace(/\s+/g, "-");
  return lower ? trimmed.toLowerCase() : trimmed;
}

export function normalizeUrl(raw: string) {
  const trimmed = raw.trim();
  if (!trimmed) return { error: "empty" as const };
  const withProtocol = /^[a-z][a-z0-9+.-]*:/i.test(trimmed) ? trimmed : `https://${trimmed}`;
  let url: URL;
  try {
    url = new URL(withProtocol);
  } catch {
    return { error: "invalid" as const };
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return { error: "protocol" as const };
  if (!url.hostname || !url.hostname.includes(".")) return { error: "host" as const };
  return { url };
}
