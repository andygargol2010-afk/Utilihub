import { useEffect, useRef, useState } from "react";

type AdSize = "desktop" | "mobile";

const CONFIG: Record<AdSize, { key: string; width: number; height: number; src: string }> = {
  desktop: { key: "2cc31e1aeb22c19ee96fba8bf47f8fc0", width: 728, height: 90, src: "https://www.highrevenueformat.com/2cc31e1aeb22c19ee96fba8bf47f8fc0/invoke.js" },
  mobile: { key: "d69308706000e4e2ad37dd09b4ef2be6", width: 320, height: 50, src: "https://www.highrevenueformat.com/d69308706000e4e2ad37dd09b4ef2be6/invoke.js" },
};

/** Non-intrusive banner: loads a single variant, reserves space, and does not touch tool controls. */
export function AdsterraBanner({ label = "Advertisement" }: { label?: string }) {
  const slotRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<AdSize | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const update = () => setSize(media.matches ? "desktop" : "mobile");
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!size || !slotRef.current || slotRef.current.dataset.loaded === "true") return;
    const config = CONFIG[size];
    const slot = slotRef.current;
    slot.dataset.loaded = "true";
    const previous = (window as Window & { atOptions?: Record<string, unknown> }).atOptions;
    (window as Window & { atOptions?: Record<string, unknown> }).atOptions = { key: config.key, format: "iframe", height: config.height, width: config.width, params: {} };
    const script = document.createElement("script");
    script.async = true;
    script.src = config.src;
    script.dataset.utilihubAd = size;
    slot.appendChild(script);
    return () => {
      if (previous) (window as Window & { atOptions?: Record<string, unknown> }).atOptions = previous;
      script.remove();
    };
  }, [size]);

  return <aside className="ad-slot my-6 overflow-hidden rounded-xl border border-border/60 bg-surface/35" aria-label={label}>
    <div className="flex min-h-7 items-center justify-center px-2 pt-1 text-[10px] font-semibold uppercase tracking-[.14em] text-muted-foreground">{label}</div>
    <div ref={slotRef} className="flex min-h-[50px] items-center justify-center overflow-hidden px-0 pb-1 md:min-h-[90px]" />
  </aside>;
}
