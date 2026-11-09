import { ADS_OFF, type AdsConfig, type AdsFormats } from "./ads-config";

type CacheEntry = { at: number; value: AdsConfig };

const TTL_MS = 60_000;
let cache: CacheEntry | null = null;

/** Hard kill switch: when true, no Adsterra unit loads anywhere. */
const ADS_FORCE_OFF = true;

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
 * Server-side Adsterra flags from Vercel Global Config (formerly Edge Config).
 * Keys: ads_enabled (bool), ads_formats ({ banner, native, socialBar, popunder }).
 * Connection: process.env.GLOBAL_CONFIG, falling back to process.env.EDGE_CONFIG
 * (handled by @vercel/global-config). Missing connection or read errors → ALL OFF.
 * Cached in-process for ~60s.
 *
 * ADS_FORCE_OFF=true disables every format regardless of Edge Config.
 */
export async function getAdsConfig(): Promise<AdsConfig> {
  if (ADS_FORCE_OFF) {
    cache = { at: Date.now(), value: ADS_OFF };
    return ADS_OFF;
  }

  const now = Date.now();
  if (cache && now - cache.at < TTL_MS) return cache.value;

  const connection = process.env.GLOBAL_CONFIG ?? process.env.EDGE_CONFIG;
  if (!connection) {
    cache = { at: now, value: ADS_OFF };
    return ADS_OFF;
  }

  try {
    const { get } = await import("@vercel/global-config");
    const [enabledRaw, formatsRaw] = await Promise.all([
      get<unknown>("ads_enabled"),
      get<unknown>("ads_formats"),
    ]);
    const enabled = asBool(enabledRaw);
    if (!enabled) {
      cache = { at: now, value: ADS_OFF };
      return ADS_OFF;
    }
    const value: AdsConfig = {
      enabled: true,
      formats: normalizeFormats(formatsRaw),
    };
    cache = { at: now, value };
    return value;
  } catch {
    cache = { at: now, value: ADS_OFF };
    return ADS_OFF;
  }
}
