import { FavoriteButton } from "./FavoriteButton";

type Locale = "en" | "es";

/**
 * Favorite button is tiny (~1 KB) and always visible next to the H1, so it is
 * imported statically: one less chunk request on every tool page, and one less
 * chunk that can fail to load for a crawler renderer. The name is kept so the
 * tool routes do not change.
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
  return <FavoriteButton slug={slug} name={name} locale={locale} />;
}
