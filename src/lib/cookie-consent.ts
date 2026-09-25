/** Marketing/ads cookie consent (localStorage + mirror cookie). */

export type ConsentValue = "accepted" | "rejected";

export const CONSENT_KEY = "utilihub_cookie_consent";
export const CONSENT_EVENT = "utilihub-consent-change";
const CONSENT_MAX_AGE_SEC = 60 * 60 * 24 * 365; // 1 year

export function getConsent(): ConsentValue | null {
  if (typeof window === "undefined") return null;
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    if (v === "accepted" || v === "rejected") return v;
  } catch {
    /* private mode */
  }
  try {
    const match = document.cookie.match(new RegExp(`(?:^|; )${CONSENT_KEY}=([^;]*)`));
    const v = match?.[1];
    if (v === "accepted" || v === "rejected") return v;
  } catch {
    /* */
  }
  return null;
}

export function hasMarketingConsent(): boolean {
  return getConsent() === "accepted";
}

export function setConsent(value: ConsentValue) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch {
    /* */
  }
  try {
    document.cookie = `${CONSENT_KEY}=${value};path=/;max-age=${CONSENT_MAX_AGE_SEC};SameSite=Lax`;
  } catch {
    /* */
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
}
