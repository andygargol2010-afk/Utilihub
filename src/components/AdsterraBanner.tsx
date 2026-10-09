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
 * The 728×90 box is in the first paint (same as the home banner) so consent/viewport
 * effects cannot insert it later. Desktop: 728×90 · Mobile: scales the reserved box.
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
      const usable = Math.max(280, window.innerWidth - 48);
      setScale(Math.min(1, usable / 728));
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [viewport]);

  useEffect(() => {
    if (!allowed || !viewport || !slotRef.current || slotRef.current.dataset.loaded === "true") return;
    const slot = slotRef.current;
    let cancelled = false;
    let script: HTMLScriptElement | null = null;
    const previous = (window as Window & { atOptions?: Record<string, unknown> }).atOptions;

    const inject = () => {
      if (cancelled || slot.dataset.loaded === "true") return;
      slot.dataset.loaded = "true";
      const config = viewport === "desktop" ? DESKTOP : MOBILE;
      (window as Window & { atOptions?: Record<string, unknown> }).atOptions = {
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

    // invoke.js does layout and timer work on the main thread. The 728×90 slot is
    // already in the first paint, so wait for idle (or 2s) before competing with
    // hydration and the first click on the tool shell.
    const idle = window.requestIdleCallback;
    const idleId = typeof idle === "function" ? idle(inject, { timeout: 2000 }) : 0;
    const timer = typeof idle === "function" ? 0 : window.setTimeout(inject, 1500);

    return () => {
      cancelled = true;
      if (idleId) window.cancelIdleCallback?.(idleId);
      if (timer) window.clearTimeout(timer);
      if (previous) (window as Window & { atOptions?: Record<string, unknown> }).atOptions = previous;
      script?.remove();
      if (slot.dataset.loaded) delete slot.dataset.loaded;
      slot.replaceChildren();
    };
  }, [allowed, viewport]);

  return (
    <aside
      className="ad-slot my-6 w-full max-w-full overflow-x-hidden rounded-xl border border-border/60 bg-surface/35"
      aria-label={label}
    >
      <div className="flex min-h-7 items-center justify-center px-2 pt-1 text-[10px] font-semibold uppercase tracking-[.14em] text-muted-foreground">
        {label}
      </div>
      <div
        className="relative mx-auto w-full max-w-[728px] overflow-hidden pb-2"
        style={{ aspectRatio: "728 / 90" }}
      >
        <div
          ref={slotRef}
          className="flex h-[90px] w-[728px] items-center justify-center [&_iframe]:max-w-none"
          style={{
            transform: viewport === "mobile" && scale < 1 ? `scale(${scale})` : undefined,
            transformOrigin: "top center",
          }}
        />
      </div>
    </aside>
  );
}
