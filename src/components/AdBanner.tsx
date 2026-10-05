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

type AtWindow = Window & { atOptions?: Record<string, unknown> };
const MOBILE_HEIGHT_SCALE = 1.35;

/** Home banner. On mobile, scale down if the network injects a wider creative. */
export function AdBanner() {
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
    if (!allowed || !viewport || !slotRef.current) return;
    const slot = slotRef.current;
    if (slot.dataset.loaded === "true") return;

    slot.replaceChildren();
    slot.dataset.loaded = "true";

    const config = viewport === "desktop" ? DESKTOP : MOBILE;
    const w = window as AtWindow;
    const previous = w.atOptions;
    w.atOptions = {
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
    script.onerror = () => {
      slot.dataset.loaded = "error";
    };
    slot.appendChild(script);

    return () => {
      if (previous) w.atOptions = previous;
      else delete w.atOptions;
      script.remove();
      delete slot.dataset.loaded;
      slot.replaceChildren();
    };
  }, [allowed, viewport]);

  if (!allowed || !viewport) return null;

  const isMobile = viewport === "mobile";
  const minH = isMobile ? Math.ceil(90 * scale * MOBILE_HEIGHT_SCALE) : 90;

  return (
    <div className="mx-auto w-full max-w-full overflow-x-hidden py-2" aria-label="Advertisement">
      <div
        className="mx-auto flex items-center justify-center"
        style={{
          minHeight: minH,
          height: isMobile ? minH : 90,
          width: isMobile ? 728 * scale : undefined,
          maxWidth: "100%",
        }}
      >
        <div
          ref={slotRef}
          className="flex items-center justify-center [&_iframe]:max-w-none"
          style={{
            width: 728,
            minHeight: 90,
            transform: isMobile && scale < 1 ? `scale(${scale}) scaleY(${MOBILE_HEIGHT_SCALE})` : undefined,
            transformOrigin: "top center",
          }}
        />
      </div>
    </div>
  );
}
