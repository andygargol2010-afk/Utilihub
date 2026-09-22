import { useEffect } from "react";

/**
 * Home banner — desktop + mobile (preview: banner-only monetization on mobile).
 * Social bar remains desktop-only in AdsterraSocialBar.
 */
export function AdBanner() {
  useEffect(() => {
    const config = {
      key: "2cc31e1aeb22c19ee96fba8bf47f8fc0",
      width: 728,
      height: 90,
      src: "https://www.highrevenueformat.com/2cc31e1aeb22c19ee96fba8bf47f8fc0/invoke.js",
    };

    const container = document.getElementById("utilihub-ad-banner");
    if (!container || container.dataset.loaded) return;

    const options = document.createElement("script");
    options.text = `atOptions = {'key':'${config.key}','format':'iframe','height':${config.height},'width':${config.width},'params':{}};`;
    container.appendChild(options);

    const script = document.createElement("script");
    script.src = config.src;
    script.async = true;
    container.appendChild(script);
    container.dataset.loaded = "true";
  }, []);

  return (
    <div
      id="utilihub-ad-banner"
      className="mx-auto flex min-h-[50px] w-full max-w-[728px] items-center justify-center overflow-x-auto overflow-y-hidden py-2 sm:min-h-[90px]"
      aria-label="Advertisement"
    />
  );
}
