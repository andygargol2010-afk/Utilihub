import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import {
  playgroundBlurb,
  playgroundName,
  playgroundPath,
  relatedPlaygrounds,
  type PlaygroundLocale,
} from "@/lib/playgrounds/next-step";
import { trackEvent } from "@/lib/analytics";

type Props = {
  /** Catalog id of the current playground / experience */
  currentId: string;
  locale?: PlaygroundLocale;
};

/**
 * Retention block: primary next step + three more related playgrounds.
 * Place after the main interactive surface, before ads.
 */
export function PlaygroundNextStep({ currentId, locale = "en" }: Props) {
  const related = relatedPlaygrounds(currentId);
  if (related.length === 0) return null;

  const next = related[0];
  const es = locale === "es";
  const nextHref = playgroundPath(next, locale);

  const onNextClick = (toId: string) => {
    trackEvent("next_step_click", { from: currentId, to: toId, locale });
  };

  return (
    <section
      className="mt-8 rounded-2xl border border-primary/20 bg-accent/40 p-4 sm:p-5"
      aria-labelledby={`pg-next-${currentId}`}
    >
      <p className="text-xs font-bold uppercase tracking-[.14em] text-primary">
        {es ? "Siguiente experiencia recomendada" : "Recommended next experience"}
      </p>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h2 id={`pg-next-${currentId}`} className="text-base font-black text-foreground">
            {es ? (
              <>
                Seguí con <span className="text-primary">{playgroundName(next, locale)}</span>
              </>
            ) : (
              <>
                Continue with <span className="text-primary">{playgroundName(next, locale)}</span>
              </>
            )}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{playgroundBlurb(next, locale)}</p>
        </div>
        <Link
          to={nextHref}
          onClick={() => onNextClick(next.id)}
          className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground hover:opacity-90"
        >
          {es ? "Abrir siguiente" : "Open next"}
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {related.map((p) => (
          <li key={p.id}>
            <Link
              to={playgroundPath(p, locale)}
              onClick={() => onNextClick(p.id)}
              className="flex min-h-11 items-center gap-2 rounded-xl border border-border/80 bg-background/80 px-3 py-2 text-sm font-semibold text-foreground hover:border-primary/40"
            >
              <span aria-hidden>{p.emoji}</span>
              <span className="truncate">{playgroundName(p, locale)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
