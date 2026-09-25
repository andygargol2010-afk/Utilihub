import { useEffect, useRef, useState } from "react";
import { CONSENT_EVENT, hasMarketingConsent } from "@/lib/cookie-consent";

const DESKTOP = {
  key: "2cc31e1aeb22c19ee96fba8bf47f8fc0",
  width: 728,
  height: 90,
  src: "https://www.highrevenueformat.com/2cc31e1aeb22c19ee96fba8bf47f8fc0/invoke.js",
};

/** Mobile banner unit — same placement key, 320×50 size for small screens. */
const MOBILE = {
  key: "2cc31e1aeb22c19ee96fba8bf47f8fc0",
  width: 320,
  height: 50,
  src: "https://www.highrevenueformat.com/2cc31e1aeb22c19ee96fba8bf47f8fc0/invoke.js",
};

/**
 * Tool/game/finance banner.
 * Desktop: 728×90 · Mobile: 320×50 banner only (no Social Bar on mobile).
 * Only loads after marketing cookie consent.
 */
export function AdsterraBanner({ label = "Advertisement" }: { label?: string }) {
  const slotRef = useRef<HTMLDivElement>(null);
  const [viewport, setViewport] = useState<"mobile" | "desktop" | null>(null);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    setAllowed(hasMarketingConsent());
    const onConsent = () => setAllowed(hasMarketingConsent());
    window.addEventListener(CONSENT_EVENT, onConsent);
    return () => window.removeEventListener(CONSENT_EVENT, onConsent);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const update = () => setViewport(media.matches ? "desktop" : "mobile");
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!allowed || !viewport || !slotRef.current || slotRef.current.dataset.loaded === "true") return;
    const slot = slotRef.current;
    slot.dataset.loaded = "true";
    const config = viewport === "desktop" ? DESKTOP : MOBILE;
    const previous = (window as Window & { atOptions?: Record<string, unknown> }).atOptions;
    (window as Window & { atOptions?: Record<string, unknown> }).atOptions = {
      key: config.key,
      format: "iframe",
      height: config.height,
      width: config.width,
      params: {},
    };
    const script = document.createElement("script");
    script.async = true;
    script.src = config.src;
    script.dataset.utilihubAd = viewport;
    slot.appendChild(script);
    return () => {
      if (previous) (window as Window & { atOptions?: Record<string, unknown> }).atOptions = previous;
      script.remove();
      if (slot.dataset.loaded) delete slot.dataset.loaded;
      slot.replaceChildren();
    };
  }, [allowed, viewport]);

  if (!allowed || !viewport) return null;

  const minH = viewport === "desktop" ? 90 : 50;

  return (
    <aside className="ad-slot my-6 overflow-hidden rounded-xl border border-border/60 bg-surface/35" aria-label={label}>
      <div className="flex min-h-7 items-center justify-center px-2 pt-1 text-[10px] font-semibold uppercase tracking-[.14em] text-muted-foreground">
        {label}
      </div>
      <div
        ref={slotRef}
        className="flex items-center justify-center overflow-hidden px-0 pb-1"
        style={{ minHeight: minH }}
      />
    </aside>
  );
}
