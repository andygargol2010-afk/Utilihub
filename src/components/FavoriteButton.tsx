import { Star } from "lucide-react";
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
      <Star className="size-4" fill={active ? "currentColor" : "none"} />
      {active ? copy.active : copy.inactive}
    </Button>
  );
}
