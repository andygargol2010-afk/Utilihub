import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/use-favorites";

type Locale = "en" | "es";

export function FavoriteButton({
  slug,
  name,
  locale = "en",
}: {
  slug: string;
  name: string;
  locale?: Locale;
}) {
  const { favorites, toggle, ready } = useFavorites();
  const active = ready && favorites.includes(slug);
  const copy =
    locale === "es"
      ? {
          active: "En favoritos",
          inactive: "Guardar",
          ariaRemove: `Quitar ${name} de favoritos`,
          ariaSave: `Guardar ${name} en favoritos`,
        }
      : {
          active: "In favorites",
          inactive: "Save",
          ariaRemove: `Remove ${name} from favorites`,
          ariaSave: `Save ${name} to favorites`,
        };
  return (
    <Button
      type="button"
      variant={active ? "default" : "outline"}
      onClick={() => toggle(slug)}
      aria-pressed={active}
      aria-label={active ? copy.ariaRemove : copy.ariaSave}
      className={
        active
          ? "btn-press gap-2 border-amber-500/40 bg-amber-500/15 text-amber-800 hover:bg-amber-500/25 dark:text-amber-200"
          : "btn-press gap-2"
      }
    >
      <StarIcon filled={active} />
      {active ? copy.active : copy.inactive}
    </Button>
  );
}

/**
 * lucide "star", inlined: the shared lucide chunk was one more request (and one
 * more chunk that can fail) on every tool page for a 300-byte icon.
 */
function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-star size-4"
      aria-hidden="true"
    >
      <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
    </svg>
  );
}
