import type { CatalogTool } from "@/lib/all-tools";
import { CATEGORY_GUIDES } from "@/lib/category-guides";
import { spanishToolName } from "@/lib/i18n/es";
import { englishToolPath, spanishToolPath } from "@/lib/route-slugs";

/** Written guide and recommended tools for a category hub. Server-rendered, unlike the tool list. */
export function CategoryGuide({
  categorySlug,
  categoryName,
  tools,
  locale,
}: {
  categorySlug: string;
  categoryName: string;
  tools: CatalogTool[];
  locale: "en" | "es";
}) {
  const guide = CATEGORY_GUIDES[categorySlug];
  if (!guide) return null;
  const es = locale === "es";
  const bySlug = new Map(tools.map((t) => [t.slug, t]));
  const picks = guide.picks.map((slug) => bySlug.get(slug)).filter((t): t is CatalogTool => Boolean(t));
  const paragraphs = es ? guide.es : guide.en;

  return (
    <section className="mt-8 max-w-3xl border-t border-border/70 pt-6" aria-labelledby="category-guide">
      <h2 id="category-guide" className="text-lg font-bold">
        {es ? `Sobre las herramientas de ${categoryName.toLowerCase()}` : `About the ${categoryName.toLowerCase()} tools`}
      </h2>
      {paragraphs.map((text) => (
        <p key={text.slice(0, 32)} className="mt-3 text-sm leading-6 text-muted-foreground">
          {text}
        </p>
      ))}
      {picks.length > 0 && (
        <>
          <h3 className="mt-5 text-sm font-bold">{es ? "Para empezar" : "Good places to start"}</h3>
          <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
            {picks.map((tool) => (
              <li key={tool.slug}>
                <a
                  href={es ? spanishToolPath(tool) : englishToolPath(tool)}
                  className="text-sm font-semibold text-primary underline-offset-2 hover:underline"
                >
                  {es ? spanishToolName(tool) : tool.name}
                </a>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
