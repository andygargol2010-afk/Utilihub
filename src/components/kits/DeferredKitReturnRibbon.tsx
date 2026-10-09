import { useEffect, useState } from "react";
import type { KitReturnRibbon as KitReturnRibbonType } from "@/components/kits/KitReturnRibbon";

type RibbonComponent = typeof KitReturnRibbonType;

/**
 * Tool shells must not statically import the ribbon: work-kits pulls all-tools.
 * First paint matches the ribbon's own pending state (null). The chunk loads on idle.
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
      void import("@/components/kits/KitReturnRibbon").then((mod) => {
        if (!cancelled) setRibbon(() => mod.KitReturnRibbon);
      });
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

  if (!Ribbon) return null;
  return <Ribbon toolSlug={toolSlug} locale={locale} />;
}
