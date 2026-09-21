import { useEffect, useRef, useState } from "react";

const DESKTOP = {
  key: "2cc31e1aeb22c19ee96fba8bf47f8fc0",
  width: 728,
  height: 90,
  src: "https://www.highrevenueformat.com/2cc31e1aeb22c19ee96fba8bf47f8fc0/invoke.js",
};

/**
 * Tool/game/finance banner — desktop only.
 * On mobile we render nothing and never inject highrevenueformat (redirects).
 */
export function AdsterraBanner({ label = "Advertisement" }: { label?: string }) {
  const slotRef = useRef<HTMLDivElement>(null);
  const [desktop, setDesktop] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const update = () => setDesktop(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!desktop || !slotRef.current || slotRef.current.dataset.loaded === "true") return;
    const slot = slotRef.current;
    slot.dataset.loaded = "true";
    const previous = (window as Window & { atOptions?: Record<string, unknown> }).atOptions;
    (window as Window & { atOptions?: Record<string, unknown> }).atOptions = {
      key: DESKTOP.key,
      format: "iframe",
      height: DESKTOP.height,
      width: DESKTOP.width,
      params: {},
    };
    const script = document.createElement("script");
    script.async = true;
    script.src = DESKTOP.src;
    script.dataset.utilihubAd = "desktop";
    slot.appendChild(script);
    return () => {
      if (previous) (window as Window & { atOptions?: Record<string, unknown> }).atOptions = previous;
      script.remove();
    };
  }, [desktop]);

  if (!desktop) return null;

  return (
    <aside className="ad-slot my-6 overflow-hidden rounded-xl border border-border/60 bg-surface/35" aria-label={label}>
      <div className="flex min-h-7 items-center justify-center px-2 pt-1 text-[10px] font-semibold uppercase tracking-[.14em] text-muted-foreground">
        {label}
      </div>
      <div ref={slotRef} className="flex min-h-[90px] items-center justify-center overflow-hidden px-0 pb-1" />
    </aside>
  );
}
