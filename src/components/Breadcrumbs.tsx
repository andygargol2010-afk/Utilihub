import { Link } from "@tanstack/react-router";
import { ChevronRight, ArrowLeft } from "lucide-react";

export interface Crumb {
  label: string;
  to?: string;
  params?: Record<string, string>;
}

type Locale = "en" | "es";

/**
 * Interactive breadcrumbs.
 * Optional `back` = explicit "Back to category" (or any parent) CTA.
 * Linked crumbs get a light hover surface; the current page is not a link.
 */
export function Breadcrumbs({
  items,
  locale = "en",
  back,
}: {
  items: Crumb[];
  locale?: Locale;
  /** Explicit back control, usually the category crumb. */
  back?: { label: string; to: string; params?: Record<string, string> };
}) {
  const aria = locale === "es" ? "Migas de pan" : "Breadcrumb";
  const backLabel =
    back?.label ??
    (locale === "es" ? "Volver a la categoría" : "Back to category");

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      {back?.to ? (
        <Link
          to={back.to}
          params={back.params as never}
          className="btn-press inline-flex min-h-9 items-center gap-1.5 rounded-full border border-border/80 bg-card px-3 text-xs font-bold text-foreground shadow-sm transition hover:border-primary/40 hover:bg-accent hover:text-primary"
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          {backLabel}
        </Link>
      ) : null}
      <nav aria-label={aria} className="text-sm">
        <ol className="flex flex-wrap items-center gap-0.5 text-muted-foreground">
          {items.map((item, i) => {
            const isLast = i === items.length - 1;
            return (
              <li key={`${item.label}-${i}`} className="flex items-center gap-0.5">
                {item.to && !isLast ? (
                  <Link
                    to={item.to}
                    params={item.params as never}
                    className="rounded-md px-1.5 py-0.5 font-medium transition hover:bg-accent hover:text-primary"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    aria-current={isLast ? "page" : undefined}
                    className={isLast ? "px-1.5 py-0.5 font-semibold text-foreground" : "px-1.5 py-0.5"}
                  >
                    {item.label}
                  </span>
                )}
                {!isLast ? (
                  <ChevronRight className="size-3.5 shrink-0 opacity-60" aria-hidden="true" />
                ) : null}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
