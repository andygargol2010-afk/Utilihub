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

/** Home banner — only after marketing cookie consent. */
export function AdBanner() {
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

  const minH = viewport === "desktop" ? 90 : 50;

  return (
    <div
      id="utilihub-ad-banner"
      className="mx-auto flex w-full max-w-[728px] items-center justify-center overflow-hidden py-2"
      style={{ minHeight: minH }}
      aria-label="Advertisement"
    />
  );
}
