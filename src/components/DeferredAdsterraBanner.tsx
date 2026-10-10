import { lazy, Suspense } from "react";

const AdsterraBanner = lazy(() =>
  import("./AdsterraBanner").then((m) => ({ default: m.AdsterraBanner })),
);

/**
 * AdsterraBanner pulls consent listeners, matchMedia, and idle script injection.
 * Keep that off the tool-route shell so hydration can paint the calculator first.
 * The fallback reserves the same 728×90 aspect-ratio slot used on first paint.
 */
export function DeferredAdsterraBanner({ label = "Advertisement" }: { label?: string }) {
  return (
    <Suspense fallback={<AdsterraBannerSlot label={label} />}>
      <AdsterraBanner label={label} />
    </Suspense>
  );
}

/** Matches the reserved box in AdsterraBanner so the title area and tool surface do not shift. */
function AdsterraBannerSlot({ label }: { label: string }) {
  return (
    <aside
      className="ad-slot my-6 w-full max-w-full overflow-x-hidden rounded-xl border border-border/60 bg-surface/35"
      aria-label={label}
      aria-hidden
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
