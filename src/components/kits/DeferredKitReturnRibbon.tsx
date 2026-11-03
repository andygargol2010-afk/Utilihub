import { useEffect, useState } from "react";
import type { KitReturnRibbon as KitReturnRibbonType } from "@/components/kits/KitReturnRibbon";
import { WORK_KITS } from "@/lib/work-kits";

type RibbonComponent = typeof KitReturnRibbonType;

/**
 * Tool shells must not statically import the ribbon: work-kits pulls all-tools.
 * First paint matches the ribbon's own pending state (null). The chunk loads on idle.
 * Tools that belong to a kit reserve the ribbon line on first paint (avoids a
 * 28px layout shift above the H1 when the ribbon mounts). work-kits is data only.
 */
export function DeferredKitReturnRibbon({
  toolSlug,
  locale,
}: {
  toolSlug: string;
  locale: "en" | "es";
}) {
  const [Ribbon, setRibbon] = useState<RibbonComponent | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = () => {
      import("@/components/kits/KitReturnRibbon")
        .then((mod) => {
          if (!cancelled) setRibbon(() => mod.KitReturnRibbon);
        })
        .catch(() => {});
    };
    const idle = window.requestIdleCallback;
    if (typeof idle === "function") {
      const id = idle(load, { timeout: 1500 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback?.(id);
      };
    }
    const id = window.setTimeout(load, 1);
    return () => {
      cancelled = true;
      window.clearTimeout(id);
    };
  }, []);

  if (!Ribbon) {
    const inKit = WORK_KITS.some((kit) => kit.toolSlugs.includes(toolSlug));
    return inKit ? <div className="mt-3 min-h-4" aria-hidden /> : null;
  }
  return <Ribbon toolSlug={toolSlug} locale={locale} />;
}
