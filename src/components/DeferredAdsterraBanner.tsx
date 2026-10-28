import { Suspense } from "react";
import { useAdFormat } from "@/lib/ads-config";
import { LazyBoundary, retryableLazy } from "@/components/LazyBoundary";

const AdsterraBanner = retryableLazy(() =>
  import("./AdsterraBanner").then((m) => ({ default: m.AdsterraBanner })),
);

/**
 * Lazy Adsterra banner. When Edge Config has banner off, renders nothing
 * (no reserved slot) so the page does not keep empty ad chrome.
 */
export function DeferredAdsterraBanner({ label = "Advertisement" }: { label?: string }) {
  const bannerOn = useAdFormat("banner");
  if (!bannerOn) return null;

  // A failed ad chunk hides the slot silently; it must never take the page down.
  return (
    <LazyBoundary fallback={null}>
      <Suspense fallback={<AdsterraBannerSlot label={label} />}>
        <AdsterraBanner label={label} />
      </Suspense>
    </LazyBoundary>
  );
}

/** Matches the reserved box in AdsterraBanner while the chunk loads (only when ads on). */
function AdsterraBannerSlot({ label }: { label: string }) {
  return (
    <aside
      className="ad-slot my-6 w-full max-w-full overflow-x-hidden rounded-xl border border-border/60 bg-surface/35"
      aria-label={label}
    >
      <div className="flex min-h-7 items-center justify-center px-2 pt-1 text-[10px] font-semibold uppercase tracking-[.14em] text-muted-foreground">
        {label}
      </div>
      <div
        className="relative mx-auto w-full max-w-[728px] overflow-hidden pb-2"
        style={{ aspectRatio: "728 / 90" }}
      >
        <div className="flex h-[90px] w-[728px] items-center justify-center" />
      </div>
    </aside>
  );
}
