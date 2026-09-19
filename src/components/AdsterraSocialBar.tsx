import { useEffect } from "react";

const SOCIAL_BAR_SRC =
  "https://pl31267070.profitableratecpmnetwork.com/f1/17/ce/f117cedd42d7966755f026d95f77eb99.js";

/** After the user closes the bar, keep it hidden for a full day. */
const COOLDOWN_MS = 24 * 60 * 60 * 1000;
const STORAGE_KEY = "utilihub_social_bar_closed_at";
const HIDE_STYLE_ID = "utilihub-social-bar-cooldown";

/**
 * Do not load ad JS until the user has had time to see the tool UI.
 * Previous value (4.5s) felt aggressive on short tool visits.
 */
const MIN_DELAY_MS = 15_000;

/** Max wait after delay before injecting even without interaction. */
const IDLE_TIMEOUT_MS = 20_000;

/** Require meaningful scroll so a tiny accidental scroll does not trigger. */
const MIN_SCROLL_PX = 120;

const HIDE_CSS = `
  [id*="social"],
  [class*="social-bar"],
  [class*="SocialBar"],
  [id*="push"],
  iframe[src*="profitableratecpmnetwork"],
  iframe[src*="highrevenueformat"],
  body > div[style*="position: fixed"][style*="z-index"],
  body > div[style*="position:fixed"][style*="z-index"] {
    display: none !important;
    visibility: hidden !important;
    pointer-events: none !important;
  }
`;

function isInCooldown(): boolean {
  try {
    const closedAt = Number(localStorage.getItem(STORAGE_KEY) || "0");
    return Date.now() - closedAt < COOLDOWN_MS;
  } catch {
    return false;
  }
}

function markClosed() {
  try {
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
  } catch {
    /* ignore */
  }
}

function injectHideStyle() {
  if (document.getElementById(HIDE_STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = HIDE_STYLE_ID;
  style.textContent = HIDE_CSS;
  document.head.appendChild(style);
}

function removeHideStyle() {
  document.getElementById(HIDE_STYLE_ID)?.remove();
}

function shouldSkipAdsPath(pathname: string) {
  return (
    pathname.includes("/privacidad") ||
    pathname.includes("/privacy") ||
    pathname.includes("/aviso-legal") ||
    pathname.includes("/legal") ||
    pathname.includes("/contacto") ||
    pathname.includes("/contact") ||
    pathname.includes("/admin")
  );
}

function injectScript() {
  if (document.querySelector(`script[data-utilihub-social-bar="1"]`)) return;
  const script = document.createElement("script");
  script.src = SOCIAL_BAR_SRC;
  script.async = true;
  script.dataset.utilihubSocialBar = "1";
  document.body.appendChild(script);
}

/**
 * Social bar loads only after:
 * - min delay (15s), and
 * - browser idle OR meaningful user interaction (scroll ≥120px / pointer / key),
 * never on legal/contact/admin paths,
 * and stays hidden 24h after the user closes it.
 */
export function AdsterraSocialBar() {
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (shouldSkipAdsPath(window.location.pathname)) return;

    if (isInCooldown()) {
      injectHideStyle();
      const closedAt = Number(localStorage.getItem(STORAGE_KEY) || "0");
      const remaining = COOLDOWN_MS - (Date.now() - closedAt);
      const unlock = window.setTimeout(() => removeHideStyle(), Math.max(remaining, 1_000));
      return () => window.clearTimeout(unlock);
    }

    let cancelled = false;
    let injected = false;
    let idleId = 0;
    let fallbackTimer = 0;
    let scrolledPx = 0;

    const tryInject = () => {
      if (cancelled || injected) return;
      injected = true;
      injectScript();
    };

    const onInteract = () => {
      window.clearTimeout(fallbackTimer);
      tryInject();
      cleanupInteract();
    };

    const onScroll = () => {
      scrolledPx = Math.max(scrolledPx, window.scrollY || document.documentElement.scrollTop || 0);
      if (scrolledPx >= MIN_SCROLL_PX) onInteract();
    };

    const cleanupInteract = () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("pointerdown", onInteract, true);
      window.removeEventListener("keydown", onInteract, true);
    };

    const start = window.setTimeout(() => {
      window.addEventListener("scroll", onScroll, { passive: true, capture: true });
      window.addEventListener("pointerdown", onInteract, { once: true, capture: true });
      window.addEventListener("keydown", onInteract, { once: true, capture: true });

      const ric = window.requestIdleCallback?.bind(window);
      if (ric) {
        idleId = ric(() => tryInject(), { timeout: IDLE_TIMEOUT_MS }) as unknown as number;
      } else {
        fallbackTimer = window.setTimeout(tryInject, IDLE_TIMEOUT_MS);
      }
    }, MIN_DELAY_MS);

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const isClose =
        target.closest(
          "[class*='close'], [class*='Close'], [id*='close'], [aria-label*='close' i], [aria-label*='cerrar' i], [title*='close' i]",
        ) ||
        (target.tagName === "SPAN" && /[×x✕✖]/.test(target.textContent || "")) ||
        (target.tagName === "BUTTON" &&
          /close|cerrar|×|x/i.test(target.textContent || target.getAttribute("aria-label") || ""));
      if (isClose) {
        markClosed();
        injectHideStyle();
        window.setTimeout(() => removeHideStyle(), COOLDOWN_MS);
      }
    };

    document.addEventListener("click", onClick, true);

    return () => {
      cancelled = true;
      window.clearTimeout(start);
      window.clearTimeout(fallbackTimer);
      if (idleId && window.cancelIdleCallback) window.cancelIdleCallback(idleId);
      cleanupInteract();
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  return null;
}
