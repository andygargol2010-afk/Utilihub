import { createFileRoute, notFound } from "@tanstack/react-router";
import { GamePlayer } from "@/components/games/registry";
import { embedGame, embedLabel, embedSourcePath, parseEmbedLocale, parseEmbedTheme } from "@/lib/embed/whitelist";
import { absoluteUrl } from "@/lib/seo";

type EmbedSearch = { lang?: "es"; theme?: "dark"; badge?: 0 };

export const Route = createFileRoute("/embed/$slug")({
  // Only non-default values are kept so plain /embed/{slug} URLs never redirect inside an iframe.
  validateSearch: (s: Record<string, unknown>): EmbedSearch => ({
    ...(parseEmbedLocale(s["lang"]) === "es" ? { lang: "es" as const } : {}),
    ...(parseEmbedTheme(s["theme"]) === "dark" ? { theme: "dark" as const } : {}),
    ...(String(s["badge"]) === "0" || s["badge"] === false ? { badge: 0 as const } : {}),
  }),
  loader: ({ params }) => {
    const game = embedGame(params.slug);
    if (!game) throw notFound();
    return { game };
  },
  head: ({ loaderData, params }) => {
    const game = loaderData?.game;
    return {
      meta: [
        { title: game ? `${embedLabel(game, "en")} — embed | UtiliHub` : "Embed not found | UtiliHub" },
        { name: "robots", content: "noindex, follow" },
      ],
      links: game ? [{ rel: "canonical", href: absoluteUrl(embedSourcePath(game, "en")) }] : [{ rel: "canonical", href: absoluteUrl(`/embed/${params.slug}`) }],
    };
  },
  component: EmbedPage,
});

function EmbedPage() {
  const { game } = Route.useLoaderData();
  const search = Route.useSearch();
  const lang = parseEmbedLocale(search.lang);
  const badge = search.badge !== 0;
  const dark = search.theme === "dark";
  const es = lang === "es";
  const href = absoluteUrl(embedSourcePath(game, lang));
  return (
    <div
      data-embed={game.slug}
      className={`games-skin flex min-h-screen flex-col ${dark ? "bg-slate-900 text-slate-100" : "bg-white text-slate-900"}`}
    >
      <div className="flex-1 px-2 py-3 sm:px-4">
        <GamePlayer game={game} locale={lang} />
      </div>
      {badge ? (
        <footer className={`border-t px-3 py-2 text-center text-xs ${dark ? "border-slate-700 text-slate-300" : "border-slate-200 text-slate-600"}`}>
          {es ? "Con tecnología de " : "Powered by "}
          <a
            href={href}
            target="_blank"
            rel="noopener"
            className="font-semibold underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            UtiliHub
          </a>
          {" · "}
          {embedLabel(game, lang)}
        </footer>
      ) : null}
    </div>
  );
}
