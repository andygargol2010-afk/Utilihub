import { lazy, Suspense } from "react";
import type { Crumb } from "./Breadcrumbs";

function BreadcrumbsSlot() {
  return <div className="h-9 w-full" aria-hidden />;
}

// Also used on category/index pages, so it does not pull LazyBoundary: a failed
// chunk resolves to the empty slot instead of reaching the root error boundary.
const Breadcrumbs = lazy(() =>
  import("./Breadcrumbs")
    .then((m) => ({ default: m.Breadcrumbs }))
    .catch(() => ({ default: BreadcrumbsSlot })),
);

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
    <Suspense fallback={<BreadcrumbsSlot />}>
      <Breadcrumbs items={items} locale={locale} back={back} />
    </Suspense>
  );
}
