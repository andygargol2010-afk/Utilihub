import { Link } from "@tanstack/react-router";
import { ArrowRight, Gamepad2, Sparkles } from "lucide-react";
import { ALL_TOOLS } from "@/lib/all-tools";
import { GAMES, gameName, gamePath, gameSummary } from "@/lib/games/catalog";
import { englishToolSlug } from "@/lib/route-slugs";
import { spanishToolName, spanishToolPath } from "@/lib/i18n/es";
import { spanishToolSummary } from "@/lib/i18n/es-summaries";

type Locale = "en" | "es";

const FEATURED_TOOL_SLUGS = [
  "pixelihub",
  "modelador-casas-3d",
  "modelador-3d",
  "png-a-jpg",
  "unir-pdf",
  "generador-de-contrasenas",
];

export function HomeFeaturedSection({ locale = "en" }: { locale?: Locale }) {
  const es = locale === "en" ? false : locale === "es";
  const tools = FEATURED_TOOL_SLUGS.map((slug) => ALL_TOOLS.find((t) => t.slug === slug)).filter(
    (t): t is NonNullable<typeof t> => Boolean(t),
  );
  const games = GAMES.slice(0, 3);

  return (
    <section className="pt-10 pb-4 sm:pt-12" aria-labelledby={es ? "es-featured-title" : "featured-title"}>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.14em] text-primary">
            {es ? "Destacados" : "Featured"}
          </p>
          <h2 id={es ? "es-featured-title" : "featured-title"} className="mt-1 text-2xl font-black sm:text-3xl">
            {es ? "Studios avanzados y juegos" : "Advanced studios and games"}
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            {es
              ? "Herramientas avanzadas, studios 3D y juegos gratis en el navegador — sin registro."
              : "Advanced tools, 3D studios, and free browser games — no signup."}
          </p>
        </div>
        <Link
          to={es ? "/es/herramientas" : "/tools"}
          className="hidden min-h-11 items-center gap-1 rounded-lg px-3 text-sm font-bold text-primary hover:bg-accent sm:inline-flex"
        >
          {es ? "Ver catálogo" : "View catalog"} <ArrowRight className="size-4" />
        </Link>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border/70 bg-card/80 p-4 shadow-sm sm:p-5">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="size-4 text-primary" aria-hidden />
            <h3 className="text-sm font-black uppercase tracking-wide text-primary">
              {es ? "Herramientas avanzadas" : "Advanced tools"}
            </h3>
          </div>
          <ul className="grid gap-2 sm:grid-cols-2">
            {tools.map((tool) => {
              const name = es ? spanishToolName(tool) : tool.name;
              const href = es ? spanishToolPath(tool) : undefined;
              const isPixel = tool.slug === "pixelihub";
              return (
                <li key={tool.slug}>
                  {href ? (
                    <Link
                      to={href as never}
                      className={
                        isPixel
                          ? "card-hover group block rounded-xl border border-rose-500/35 bg-gradient-to-br from-rose-500/10 via-card to-card p-3 hover:-translate-y-0.5 hover:border-rose-500/50"
                          : "card-hover group block rounded-xl border border-border/70 bg-background p-3 hover:-translate-y-0.5 hover:border-primary/25"
                      }
                    >
                      <span className={`text-[10px] font-bold uppercase tracking-wide ${isPixel ? "text-rose-500" : "text-primary"}`}>
                        {isPixel ? "Pixel art" : "Studio"}
                      </span>
                      <p className="mt-1 font-bold group-hover:text-primary">{name}</p>
                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">{es ? spanishToolSummary(tool) : tool.summary}</p>
                    </Link>
                  ) : (
                    <Link
                      to={tool.category === "finanzas" ? "/finance/$slug" : "/tools/$slug"}
                      params={{ slug: englishToolSlug(tool) }}
                      className="card-hover group block rounded-xl border border-border/70 bg-background p-3 hover:-translate-y-0.5 hover:border-primary/25"
                    >
                      <span className="text-[10px] font-bold uppercase tracking-wide text-primary">Studio</span>
                      <p className="mt-1 font-bold group-hover:text-primary">{name}</p>
                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">{tool.summary}</p>
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="rounded-2xl border border-violet-500/25 bg-violet-500/5 p-4 shadow-sm sm:p-5">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Gamepad2 className="size-4 text-violet-700 dark:text-violet-300" aria-hidden />
              <h3 className="text-sm font-black uppercase tracking-wide text-violet-800 dark:text-violet-200">
                {es ? "Juegos" : "Games"}
              </h3>
            </div>
            <a
              href={es ? "/es/juegos" : "/games"}
              className="text-xs font-bold text-violet-700 hover:underline dark:text-violet-300"
            >
              {es ? "Ver todos" : "See all"}
            </a>
          </div>
          <ul className="grid gap-2">
            {games.map((game) => (
              <li key={game.slug}>
                <a
                  href={gamePath(game, es ? "es" : "en")}
                  className="card-hover group flex items-start gap-3 rounded-xl border border-violet-500/20 bg-card/90 p-3 hover:-translate-y-0.5 hover:border-violet-500/40"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-violet-500/15 text-sm font-black text-violet-800 dark:text-violet-200">
                    {gameName(game, es ? "es" : "en").slice(0, 1)}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-bold group-hover:text-violet-700 dark:group-hover:text-violet-200">
                      {gameName(game, es ? "es" : "en")}
                    </span>
                    <span className="mt-0.5 block line-clamp-2 text-xs text-muted-foreground">
                      {gameSummary(game, es ? "es" : "en")}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
