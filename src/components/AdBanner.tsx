"use client";

import { useEffect, useRef, useState } from "react";
import { CONSENT_EVENT, hasMarketingConsent } from "@/lib/cookie-consent";

/**
 * Adsterra banner scripts ON for retest (2026-10-15).
 * Previous note: same zone once redirected (pixelmeshweb → 1xbet).
 * If redirect returns, set false again and swap DESKTOP/MOBILE key+src.
 */
const ADS_SCRIPTS_ENABLED = true;

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

type AtWindow = Window & { atOptions?: Record<string, unknown> };

/** Home banner. The 728×90 box is in the first paint so the script cannot shift the page. */
export function AdBanner() {
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
    const mq = window.matchMedia("(min-width: 768px)");
    const apply = () => setViewport(mq.matches ? "desktop" : "mobile");
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (!ADS_SCRIPTS_ENABLED) return;
    if (!allowed || !viewport || !slotRef.current || slotRef.current.dataset.loaded === "true") return;
    const slot = slotRef.current;
    let cancelled = false;
    let script: HTMLScriptElement | null = null;
    const previous = (window as AtWindow).atOptions;

    const inject = () => {
      if (cancelled || slot.dataset.loaded === "true") return;
      slot.dataset.loaded = "true";
      const config = viewport === "desktop" ? DESKTOP : MOBILE;
      (window as AtWindow).atOptions = {
        key: config.key,
        format: "iframe",
        height: config.height,
        width: config.width,
        params: {},
      };
      script = document.createElement("script");
      script.async = true;
      script.src = config.src;
      script.dataset.utilihubAd = viewport;
      slot.appendChild(script);
    };

    const idle = window.requestIdleCallback;
    const idleId = typeof idle === "function" ? idle(inject, { timeout: 2000 }) : 0;
    const timer = typeof idle === "function" ? 0 : window.setTimeout(inject, 1500);

    return () => {
      cancelled = true;
      if (idleId) window.cancelIdleCallback?.(idleId);
      if (timer) window.clearTimeout(timer);
      if (previous) (window as AtWindow).atOptions = previous;
      script?.remove();
      if (slot.dataset.loaded) delete slot.dataset.loaded;
      slot.replaceChildren();
    };
  }, [allowed, viewport]);

  return (
    <aside
      className="ad-slot my-6 w-full max-w-full overflow-x-hidden rounded-xl border border-border/60 bg-surface/35"
      aria-label="Advertisement"
    >
      <div className="flex min-h-7 items-center justify-center px-2 pt-1 text-[10px] font-semibold uppercase tracking-[.14em] text-muted-foreground">
        Advertisement
      </div>
      <div
        className="relative mx-auto w-full max-w-[728px] overflow-hidden pb-2"
        style={{ aspectRatio: "728 / 90" }}
      >
        <div
          ref={slotRef}
          className="flex h-[90px] w-[728px] items-center justify-center [&_iframe]:max-w-none"
        />
      </div>
    </aside>
  );
}
