import { lazy, Suspense } from "react";

const ShareAndExportActions = lazy(() =>
  import("./ShareAndExportActions").then((m) => ({ default: m.ShareAndExportActions })),
);

type Locale = "en" | "es";

/**
 * Share/export registers document input listeners and pulls lucide icons.
 * Keep that off the tool-route shell so hydration can paint the calculator first.
 * The slot matches the button row (mt-4 border-t pt-4 + one control line).
 */
export function DeferredShareAndExport({
  title,
  locale = "en",
}: {
  title: string;
  locale?: Locale;
}) {
  return (
    <Suspense fallback={<div className="mt-4 min-h-[4.5rem] border-t pt-4" aria-hidden />}>
      <ShareAndExportActions title={title} locale={locale} />
    </Suspense>
  );
}
