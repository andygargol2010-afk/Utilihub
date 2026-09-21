import { useEffect, useState } from "react";

/**
 * Home banner. Desktop only.
 * Mobile: do not load highrevenueformat invoke.js — that unit was force-redirecting
 * to smartlinks (frs2c.com) with no user interaction.
 */
export function AdBanner() {
  const [desktop, setDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!desktop) return;

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
    script.async = true;
    script.src = config.src;
    container.appendChild(script);
    container.dataset.loaded = "true";
  }, [desktop]);

  if (!desktop) return null;

  return (
    <div
      id="utilihub-ad-banner"
      className="mx-auto flex min-h-[90px] w-full max-w-[728px] items-center justify-center overflow-hidden py-2"
      aria-label="Advertisement"
    />
  );
}
