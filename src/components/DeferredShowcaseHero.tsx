import { lazy, Suspense, useEffect, useState } from "react";
import type { ToolShowcase } from "@/lib/tool-showcase";

const ToolShowcaseHero = lazy(() =>
  import("@/components/ToolShowcaseHero").then((m) => ({ default: m.ToolShowcaseHero })),
);

/** PNG to JPG hero: 291px at 412px wide, 312px at desktop. Keep the slot at that floor. */
function HeroSlot() {
  return (
    <div
      className="mt-3 min-h-[291px] animate-pulse rounded-[1.5rem] bg-muted/50 lg:min-h-[312px]"
      aria-hidden
    />
  );
}

/**
 * Premium hero copy and component stay out of the tool-route chunk.
 * Call only when hasToolShowcase(slug) is true.
 */
export function DeferredShowcaseHero({
  name,
  slug,
  locale,
}: {
  name: string;
  slug: string;
  locale: "en" | "es";
}) {
  const [showcase, setShowcase] = useState<ToolShowcase | null>(null);

  useEffect(() => {
    let cancelled = false;
    void import("@/lib/tool-showcase").then((mod) => {
      if (!cancelled) setShowcase(mod.getToolShowcase(slug) ?? null);
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (!showcase) return <HeroSlot />;

  return (
    <Suspense fallback={<HeroSlot />}>
      <ToolShowcaseHero name={name} slug={slug} showcase={showcase} locale={locale} />
    </Suspense>
  );
}
