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
    const media = window.matchMedia("(min-width: 768px)");
    const update = () => setViewport(media.matches ? "desktop" : "mobile");
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

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

  return (
    <div className="mx-auto w-full max-w-full overflow-x-hidden py-2" aria-label="Advertisement">
      <div
        className="relative mx-auto w-full max-w-[728px] overflow-hidden"
        style={{ aspectRatio: "728 / 90", containerType: "inline-size" }}
      >
        <div
          ref={slotRef}
          className="flex h-[90px] w-[728px] items-center justify-center [&_iframe]:max-w-none"
          style={{ transform: "scale(min(1, 100cqw / 728))", transformOrigin: "top left" }}
        />
      </div>
    </div>
  );
}
