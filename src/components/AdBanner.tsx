"use client";

import { useEffect, useState } from "react";
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

/** Home banner. On mobile, scale down if the network injects a wider creative. */
export function AdBanner() {
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
      // Fit a 728-wide creative into the usable content width (padding ~16px each side).
      const usable = Math.max(280, window.innerWidth - 32);
      setScale(Math.min(1, usable / 728));
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [viewport]);

  useEffect(() => {
    if (!allowed || !viewport) return;
    const container = document.getElementById("utilihub-ad-banner");
    if (!container) return;

    container.replaceChildren();
    delete container.dataset.loaded;

    const config = viewport === "desktop" ? DESKTOP : MOBILE;
    const options = document.createElement("script");
    options.text = `atOptions = {'key':'${config.key}','format':'iframe','height':${config.height},'width':${config.width},'params':{}};`;
    container.appendChild(options);

    const script = document.createElement("script");
    script.src = config.src;
    script.async = true;
    script.dataset.utilihubAd = viewport;
    container.appendChild(script);
    container.dataset.loaded = "true";
  }, [allowed, viewport]);

  if (!allowed || !viewport) return null;

  const isMobile = viewport === "mobile";
  const minH = isMobile ? Math.ceil(90 * scale) : 90;

  return (
    <div
      className="mx-auto w-full max-w-full overflow-x-hidden py-2"
      aria-label="Advertisement"
    >
      <div
        className="mx-auto flex items-center justify-center"
        style={{
          minHeight: minH,
          width: isMobile ? 728 * scale : undefined,
          maxWidth: "100%",
        }}
      >
        <div
          id="utilihub-ad-banner"
          className="flex items-center justify-center [&_iframe]:max-w-none"
          style={{
            width: isMobile ? 728 : 728,
            minHeight: isMobile ? 90 : 90,
            transform: isMobile && scale < 1 ? `scale(${scale})` : undefined,
            transformOrigin: "top center",
          }}
        />
      </div>
    </div>
  );
}
