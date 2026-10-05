"use client";

import { useEffect, useRef, useState } from "react";
import { CONSENT_EVENT, hasMarketingConsent } from "@/lib/cookie-consent";

const DESKTOP = {
  key: "2cc31e1aeb22c19ee96fba8bf47f8fc0",
  width: 728,
  height: 90,
  src: "https://www.highrevenueformat.com/2cc31e1aeb22c19ee96fba8bf47f8fc0/invoke.js",
};

const MOBILE = {
  key: "2cc31e1aeb22c19ee96fba8bf47f8fc0",
  width: 320,
  height: 50,
  src: "https://www.highrevenueformat.com/2cc31e1aeb22c19ee96fba8bf47f8fc0/invoke.js",
};

/**
 * Tool/game/finance banner.
 * Desktop: 728×90 · Mobile: requests 320×50; if network serves 728×90, scales to fit.
 */
export function AdsterraBanner({ label = "Advertisement" }: { label?: string }) {
  const slotRef = useRef<HTMLDivElement>(null);
  const [viewport, setViewport] = useState<"mobile" | "desktop" | null>(null);
  const [allowed, setAllowed] = useState(false);
  const [scale, setScale] = useState(1);

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
    if (viewport !== "mobile") {
      setScale(1);
      return;
    }
    const updateScale = () => {
      // Use a narrow 8px mobile gutter while keeping desktop sizing unchanged.
      const usable = Math.max(280, window.innerWidth - 16);
      setScale(Math.min(1, usable / 728));
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [viewport]);

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

  const isMobile = viewport === "mobile";
  const minH = isMobile ? Math.ceil(90 * scale) : 90;

  return (
    <aside
      className="ad-slot my-6 w-full max-w-full overflow-x-hidden rounded-xl border border-border/60 bg-surface/35"
      aria-label={label}
    >
      <div className="flex min-h-7 items-center justify-center px-2 pt-1 text-[10px] font-semibold uppercase tracking-[.14em] text-muted-foreground">
        {label}
      </div>
      <div
        className="mx-auto flex items-center justify-center overflow-x-hidden pb-2"
        style={{
          minHeight: minH,
          height: isMobile ? minH : 90,
          width: isMobile ? 728 * scale : undefined,
          maxWidth: "100%",
        }}
      >
        <div
          ref={slotRef}
          className="flex items-center justify-center"
          style={{
            width: 728,
            minHeight: 90,
            transform: isMobile && scale < 1 ? `scale(${scale})` : undefined,
            transformOrigin: "top center",
          }}
        />
      </div>
    </aside>
  );
}
