import { lazy, Suspense } from "react";
import type { Crumb } from "./Breadcrumbs";

const Breadcrumbs = lazy(() => import("./Breadcrumbs").then((m) => ({ default: m.Breadcrumbs })));

type Locale = "en" | "es";

/**
 * Breadcrumbs pulls lucide icons (ArrowLeft, ChevronRight) and router Link.
 * Keep that off the tool-route shell so hydration can paint the calculator first.
 * The slot matches the flex row height (min-h-9) so the title below does not jump.
 */
export function DeferredBreadcrumbs({
  items,
  locale = "en",
  back,
}: {
  items: Crumb[];
  locale?: Locale;
  back?: { label: string; to: string; params?: Record<string, string> };
}) {
  return (
    <Suspense fallback={<div className="h-9 w-full" aria-hidden />}>
      <Breadcrumbs items={items} locale={locale} back={back} />
    </Suspense>
  );
}
