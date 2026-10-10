import { lazy, Suspense } from "react";

const FavoriteButton = lazy(() =>
  import("./FavoriteButton").then((m) => ({ default: m.FavoriteButton })),
);

type Locale = "en" | "es";

/**
 * Favorite button uses the favorites context and lucide Star.
 * Keep it off the tool-route shell so hydration paints the title and calculator first.
 * The slot matches the outline button (min-h-9, ~w-24).
 */
export function DeferredFavoriteButton({
  slug,
  name,
  locale = "en",
}: {
  slug: string;
  name: string;
  locale?: Locale;
}) {
  return (
    <Suspense
      fallback={
        <div
          className="h-9 w-24 shrink-0 rounded-md border border-input bg-background"
          aria-hidden
        />
      }
    >
      <FavoriteButton slug={slug} name={name} locale={locale} />
    </Suspense>
  );
}
