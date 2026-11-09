import { Suspense } from "react";
import { LazyBoundary, retryableLazy } from "@/components/LazyBoundary";

const ShareAndExportActions = retryableLazy(() =>
  import("./ShareAndExportActions").then((m) => ({ default: m.ShareAndExportActions })),
);

type Locale = "en" | "es";

/**
 * Share/export registers document input listeners and pulls lucide icons.
 * Keep that off the tool-route shell so hydration can paint the calculator first.
 * The slot matches the button row (mt-4 border-t pt-4 + one control line; two lines below sm, where the buttons wrap).
 */
export function DeferredShareAndExport({
  title,
  locale = "en",
}: {
  title: string;
  locale?: Locale;
}) {
  return (
    <LazyBoundary locale={locale} onRetry={ShareAndExportActions.retry} className="mt-4">
      <Suspense fallback={<div className="mt-4 min-h-[6.3125rem] border-t pt-4 sm:min-h-[4.5rem]" aria-hidden />}>
        <ShareAndExportActions title={title} locale={locale} />
      </Suspense>
    </LazyBoundary>
  );
}
