import { useEffect, useState, type ComponentType } from "react";

type ReviewsProps = { locale?: "en" | "es" };

/**
 * Home reviews hit the server function and then paint up to 12 cards.
 * That work lands in the first interaction window on / and /es.
 * Keep a reserved section and load the module on idle.
 */
export function DeferredHomeReviews({ locale = "en" }: ReviewsProps) {
  const [Reviews, setReviews] = useState<ComponentType<ReviewsProps> | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = () => {
      void import("@/components/HomeReviews").then((mod) => {
        if (!cancelled) setReviews(() => mod.HomeReviews);
      });
    };

    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      const id = window.requestIdleCallback(load, { timeout: 2000 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback(id);
      };
    }

    const timer = window.setTimeout(load, 1200);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);

  if (!Reviews) return <ReviewsSlot locale={locale} />;
  return <Reviews locale={locale} />;
}

function ReviewsSlot({ locale }: { locale: "en" | "es" }) {
  const es = locale === "es";
  return (
    <section className="mt-10 border-t border-border/70 py-10" aria-labelledby="reviews-title" aria-busy="true">
      <div>
        <p className="text-xs font-bold uppercase tracking-[.14em] text-primary">{es ? "Comunidad" : "Community"}</p>
        <h2 id="reviews-title" className="mt-1 text-2xl font-black sm:text-3xl">
          {es ? "Qué dicen de UtiliHub" : "What people say about UtiliHub"}
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          {es
            ? "Dejá tu opinión sin crear cuenta. Nombre opcional, solo estrellas y un comentario."
            : "Leave feedback with no account. Name optional — just stars and a short comment."}
        </p>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="grid min-h-36 gap-3 sm:grid-cols-2">
          <div className="h-36 rounded-xl border border-border/70 bg-muted/30" aria-hidden />
          <div className="hidden h-36 rounded-xl border border-border/70 bg-muted/30 sm:block" aria-hidden />
        </div>
        <div className="min-h-[22rem] rounded-2xl border border-primary/20 bg-accent/40" aria-hidden />
      </div>
    </section>
  );
}
