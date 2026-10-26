import { ADS_OFF, type AdsConfig, type AdsFormats } from "./ads-config";

type CacheEntry = { at: number; value: AdsConfig };

const TTL_MS = 60_000;
let cache: CacheEntry | null = null;

function asBool(v: unknown): boolean {
  return v === true;
}

function normalizeFormats(raw: unknown): AdsFormats {
  const o = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  return {
    banner: asBool(o.banner),
    native: asBool(o.native),
    socialBar: asBool(o.socialBar),
    popunder: asBool(o.popunder),
  };
}

/**
 * Server-side Adsterra flags from Vercel Edge Config.
 * Keys: ads_enabled (bool), ads_formats ({ banner, native, socialBar, popunder }).
 * Missing EDGE_CONFIG, read errors, or invalid values → ALL OFF (fail closed).
 * Cached in-process for ~60s.
 */
export async function getAdsConfig(): Promise<AdsConfig> {
  const now = Date.now();
  if (cache && now - cache.at < TTL_MS) return cache.value;

  if (!process.env.EDGE_CONFIG) {
    cache = { at: now, value: ADS_OFF };
    return ADS_OFF;
  }

  try {
    const { get } = await import("@vercel/edge-config");
    const [enabledRaw, formatsRaw] = await Promise.all([
      get<unknown>("ads_enabled"),
      get<unknown>("ads_formats"),
    ]);
    const enabled = asBool(enabledRaw);
    const formats = normalizeFormats(formatsRaw);
    // Master off forces every format off
    if (!enabled) {
      cache = { at: now, value: ADS_OFF };
      return ADS_OFF;
    }
    const value: AdsConfig = { enabled: true, formats };
    cache = { at: now, value };
    return value;
  } catch {
    cache = { at: now, value: ADS_OFF };
    return ADS_OFF;
  }
}
