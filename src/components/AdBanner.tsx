import { useEffect, useState } from "react";
import { CONSENT_EVENT, hasMarketingConsent } from "@/lib/cookie-consent";

const DESKTOP = {
  key: "2cc31e1aeb22c19ee96fba8bf47f8fc0",
  width: 728,
  height: 90,
  src: "https://www.highrevenueformat.com/2cc31e1aeb22c19ee96fba8bf47f8fc0/invoke.js",
};

/** Prefer a mobile-sized unit; if the network still serves 728×90, CSS scales it down. */
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

  const isMobile = viewport === "mobile";
  const minH = isMobile ? 50 : 90;

  return (
    <div
      className={
        isMobile
          ? "mx-auto w-full max-w-full overflow-x-hidden py-2"
          : "mx-auto flex w-full max-w-[728px] items-center justify-center overflow-hidden py-2"
      }
      aria-label="Advertisement"
    >
      <div
        id="utilihub-ad-banner"
        className={
          isMobile
            ? "mx-auto flex w-full max-w-[320px] items-center justify-center [&_iframe]:max-w-full [&_iframe]:!h-auto"
            : "flex w-full items-center justify-center"
        }
        style={{ minHeight: minH }}
      />
    </div>
  );
}
