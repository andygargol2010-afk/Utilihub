import { Link } from "@tanstack/react-router";
import { ToolCard } from "@/components/ToolCard";
import type { CatalogTool } from "@/lib/all-tools";
import { englishToolSlug } from "@/lib/route-slugs";
import { journeyLabel, journeyTools } from "@/lib/discovery";

function FinanceNextLink({ tool }: { tool: CatalogTool }) {
  const slug = englishToolSlug(tool);
  const className =
    "inline-flex min-h-11 items-center rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground";
  if (tool.category === "finanzas") {
    return (
      <Link to="/finance/$slug" params={{ slug }} className={className}>
        Open next
      </Link>
    );
  }
  return (
    <Link to="/tools/$slug" params={{ slug }} className={className}>
      Open next
    </Link>
  );
}

/** Below-fold related calculators. Imports discovery → all-tools; keep off the finance route chunk. */
export function FinanceJourney({ tool }: { tool: CatalogTool }) {
  const journey = journeyTools({ slug: tool.slug, category: "finanzas" });
  const next = journey[0];

  if (!next && journey.length === 0) return null;

  return (
    <>
      {next && (
        <section className="mt-6 rounded-2xl border border-primary/20 bg-accent/50 p-4 sm:p-5">
          <p className="text-xs font-bold uppercase tracking-[.14em] text-primary">Recommended next step</p>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-black">{journeyLabel({ slug: tool.slug, category: "finanzas" }, "en")}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Continue with {next.name} to compare or complete the analysis.
              </p>
            </div>
            <FinanceNextLink tool={next} />
          </div>
        </section>
      )}
      {journey.length > 0 && (
        <section className="mt-8" aria-labelledby="financial-journey">
          <div className="mb-2">
            <h2 id="financial-journey" className="text-xl font-black">
              Continue your analysis
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">Related calculators to explore more financial scenarios.</p>
          </div>
          <div className="divide-y divide-border/70 rounded-xl border border-border/70 bg-card px-3">
            {journey.map((item) => (
              <ToolCard key={item.slug} tool={item} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
