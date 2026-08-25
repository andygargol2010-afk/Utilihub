/**
 * AdSense integration stays disabled until a real Google publisher ID is configured.
 * Never commit a placeholder publisher ID to ads.txt or production code.
 */
export const ADSENSE_PUBLISHER_ID = import.meta.env.VITE_ADSENSE_PUBLISHER_ID?.trim() ?? "";

export const ADSENSE_ENABLED = ADSENSE_PUBLISHER_ID.length > 0;

export function adsenseClientId(): string | undefined {
  if (!ADSENSE_ENABLED) return undefined;
  return `ca-${ADSENSE_PUBLISHER_ID}`;
}
