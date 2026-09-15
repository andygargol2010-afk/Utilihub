import { useEffect } from "react";

const SOCIAL_BAR_SRC =
  "https://pl31267070.profitableratecpmnetwork.com/f1/17/ce/f117cedd42d7966755f026d95f77eb99.js";

const COOLDOWN_MS = 60_000; // 1 minute
const STORAGE_KEY = "utilihub_social_bar_closed_at";
const HIDE_STYLE_ID = "utilihub-social-bar-cooldown";

const HIDE_CSS = `
  /* Hide Adsterra / profitableratecpm Social Bar while in cooldown */
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

/**
 * Adsterra / Profitableratecpm Social Bar (floating overlay).
 * - Desktop: bottom-right (network default).
 * - Mobile: CSS in styles.css keeps it below the sticky navbar.
 * - After the user closes it, it stays hidden for 1 full minute
 *   (localStorage cooldown) so it does not reappear immediately.
 */
export function AdsterraSocialBar() {
  useEffect(() => {
    if (typeof document === "undefined") return;

    // Still in cooldown from a previous close → keep hidden
    if (isInCooldown()) {
      injectHideStyle();
      const remaining = COOLDOWN_MS - (Date.now() - Number(localStorage.getItem(STORAGE_KEY) || "0"));
      const unlock = window.setTimeout(() => {
        removeHideStyle();
      }, Math.max(remaining, 500));
      return () => window.clearTimeout(unlock);
    }

    // Already injected this session
    if (document.querySelector(`script[data-utilihub-social-bar="1"]`)) return;

    const timer = window.setTimeout(() => {
      const script = document.createElement("script");
      script.src = SOCIAL_BAR_SRC;
      script.async = true;
      script.dataset.utilihubSocialBar = "1";
      document.body.appendChild(script);
    }, 1800);

    // Detect close clicks on the injected bar (X button, etc.)
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Common close patterns used by social-bar / push widgets
      const isClose =
        target.closest("[class*='close'], [class*='Close'], [id*='close'], [aria-label*='close' i], [aria-label*='cerrar' i], [title*='close' i]") ||
        (target.tagName === "SPAN" && /[×x✕✖]/.test(target.textContent || "")) ||
        (target.tagName === "BUTTON" && /close|cerrar|×|x/i.test(target.textContent || target.getAttribute("aria-label") || ""));

      if (isClose) {
        markClosed();
        injectHideStyle();
        // Re-allow after full cooldown
        window.setTimeout(() => removeHideStyle(), COOLDOWN_MS);
      }
    };

    document.addEventListener("click", onClick, true);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  return null;
}
