import { useEffect, useState } from "react";

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

/** Home banner — desktop 728×90, mobile 320×50. Social Bar stays desktop-only. */
export function AdBanner() {
  const [viewport, setViewport] = useState<"mobile" | "desktop" | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const update = () => setViewport(media.matches ? "desktop" : "mobile");
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!viewport) return;
    const container = document.getElementById("utilihub-ad-banner");
    if (!container) return;

    // Reset when switching breakpoints so the right unit can load
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
  }, [viewport]);

  if (!viewport) return null;

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
