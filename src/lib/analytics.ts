import { track } from "@vercel/analytics";

/**
 * Track a custom event to Vercel Analytics.
 * Optional debug log in development.
 * Safe no-op if analytics not loaded yet.
 */
export function trackEvent(name: string, properties?: Record<string, string | number | boolean>) {
  try {
    track(name, properties);
    if (typeof window !== "undefined" && import.meta.env.DEV) {
      console.debug("[analytics]", name, properties);
    }
  } catch {
    // Analytics may not be ready; ignore.
  }
}
