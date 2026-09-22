import { useEffect, useRef, useState } from "react";

const BANNER = {
  key: "2cc31e1aeb22c19ee96fba8bf47f8fc0",
  width: 728,
  height: 90,
  src: "https://www.highrevenueformat.com/2cc31e1aeb22c19ee96fba8bf47f8fc0/invoke.js",
};

/**
 * Tool/game/finance banner — desktop + mobile.
 * Preview experiment: banner only on mobile (social bar stays desktop-only).
 * Uses the same Adsterra unit; container is responsive so it fits small screens.
 */
export function AdsterraBanner({ label = "Advertisement" }: { label?: string }) {
  const slotRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || !slotRef.current || slotRef.current.dataset.loaded === "true") return;
    const slot = slotRef.current;
    slot.dataset.loaded = "true";
    const previous = (window as Window & { atOptions?: Record<string, unknown> }).atOptions;
    (window as Window & { atOptions?: Record<string, unknown> }).atOptions = {
      key: BANNER.key,
      format: "iframe",
      height: BANNER.height,
      width: BANNER.width,
      params: {},
    };
    const script = document.createElement("script");
    script.async = true;
    script.src = BANNER.src;
    script.dataset.utilihubAd = "banner";
    slot.appendChild(script);
    return () => {
      if (previous) (window as Window & { atOptions?: Record<string, unknown> }).atOptions = previous;
      script.remove();
    };
  }, [ready]);

  if (!ready) return null;

  return (
    <aside
      className="ad-slot my-6 overflow-hidden rounded-xl border border-border/60 bg-surface/35"
      aria-label={label}
    >
      <div className="flex min-h-7 items-center justify-center px-2 pt-1 text-[10px] font-semibold uppercase tracking-[.14em] text-muted-foreground">
        {label}
      </div>
      <div
        ref={slotRef}
        className="flex min-h-[50px] items-center justify-center overflow-x-auto overflow-y-hidden px-0 pb-1 sm:min-h-[90px]"
      />
    </aside>
  );
}
