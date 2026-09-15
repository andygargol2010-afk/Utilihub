import { useEffect } from "react";

const SOCIAL_BAR_SRC =
  "https://pl31267070.profitableratecpmnetwork.com/f1/17/ce/f117cedd42d7966755f026d95f77eb99.js";

/**
 * Adsterra / Profitableratecpm Social Bar (floating overlay).
 * - Desktop: bottom-right (network default, least intrusive for tool UIs).
 * - Mobile: must not cover the sticky top navbar; CSS forces top safe-zone.
 * Loads once per session after a short delay to avoid competing with first paint.
 */
export function AdsterraSocialBar() {
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.querySelector(`script[data-utilihub-social-bar="1"]`)) return;

    const timer = window.setTimeout(() => {
      const script = document.createElement("script");
      script.src = SOCIAL_BAR_SRC;
      script.async = true;
      script.dataset.utilihubSocialBar = "1";
      document.body.appendChild(script);
    }, 1800);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  return null;
}
