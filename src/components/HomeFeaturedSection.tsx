import { Link } from "@tanstack/react-router";
import { ArrowRight, Gamepad2, Boxes } from "lucide-react";
import { ALL_TOOLS } from "@/lib/all-tools";
import { GAMES, gameName, gamePath, gameSummary } from "@/lib/games/catalog";
import { englishToolSlug } from "@/lib/route-slugs";
import { spanishToolName, spanishToolPath } from "@/lib/i18n/es";

/** Hero product picks — advanced studios + browser games. */
const FEATURED_ADVANCED_SLUGS = ["modelador-casas-3d", "modelador-3d", "pixelihub"] as const;
const FEATURED_GAME_COUNT = 3;

type Locale = "en" | "es";

export function HomeFeaturedSection({ locale = "en" }: { locale?: Locale }) {
  const es = locale === "en" ? false : locale === "es";
  const advanced = FEATURED_ADVANCED_SLUGS.map((s) => ALL_TOOLS.find((t) => t.slug === s)).filter(
    Boolean,
  ) as typeof ALL_TOOLS;
  const games = GAMES.slice(0, FEATURED_GAME_COUNT);

  const copy = es
    ? {
        kicker: "Destacados",
        title: "Studios avanzados y juegos",
        blurb: "Más que calculadoras: modelado 3D en el navegador y juegos gratis sin instalar nada.",
        studioBadge: "Studio",
        playBadge: "Jugar",
        allAdvanced: "Ver herramientas avanzadas",
        allGames: "Ver todos los juegos",
        advancedHref: "/es/categoria/herramientas-avanzadas",
        gamesHref: "/es/juegos",
      }
    : {
        kicker: "Featured",
        title: "Advanced studios and games",
        blurb: "Beyond calculators: browser 3D modeling and free games — no install, no signup.",
        studioBadge: "Studio",
        playBadge: "Play",
        allAdvanced: "Browse advanced tools",
        allGames: "Browse all games",
        advancedHref: "/category/advanced-tools",
        gamesHref: "/games",
      };

  return (
    <section className="pt-14 pb-4 sm:pt-16" aria-labelledby="home-featured-title">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[.14em] text-primary">{copy.kicker}</p>
          <h2 id="home-featured-title" className="mt-1 text-2xl font-black sm:text-3xl">
            {copy.title}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">{copy.blurb}</p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Advanced */}
        <div className="rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/8 via-card to-card p-4 shadow-lift sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="grid size-9 place-items-center rounded-xl bg-primary/15 text-primary">
                <Boxes className="size-4.5" aria-hidden />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[.12em] text-primary">
                  {copy.studioBadge}
                </p>
                <p className="text-sm font-black">{es ? "Herramientas avanzadas" : "Advanced tools"}</p>
              </div>
            </div>
            <a
              href={copy.advancedHref}
              className="inline-flex min-h-10 items-center gap-1 rounded-lg px-2.5 text-xs font-bold text-primary hover:bg-accent"
            >
              {copy.allAdvanced} <ArrowRight className="size-3.5" />
            </a>
          </div>
          <div className="grid gap-2.5">
            {advanced.map((tool) => {
              const name = es ? spanishToolName(tool) : tool.name;
              const href = es ? spanishToolPath(tool) : undefined;
              const enSlug = englishToolSlug(tool);
              /* pixelihub-card-v1 */
              const isPixel = tool.slug === "pixelihub";
              const body = (
                <>
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wide ${isPixel ? "text-rose-500" : "text-primary"}`}>
                      {isPixel ? (es ? "Pixel art" : "Pixel art") : copy.studioBadge}
                    </span>
                    {isPixel ? (
                      <span className="font-mono text-[9px] text-rose-400/80" aria-hidden>
                        ▦ 32×32
                      </span>
                    ) : null}
                  </div>
                  <h3 className={`mt-1 font-bold group-hover:text-primary ${isPixel ? "group-hover:text-rose-500" : ""}`}>{name}</h3>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">{tool.summary}</p>
                </>
              );
              const className = isPixel
                ? "card-hover group block rounded-xl border border-rose-500/35 bg-gradient-to-br from-rose-500/10 via-background/90 to-background/80 p-3.5 hover:-translate-y-0.5 hover:border-rose-500/50 hover:shadow-md"
                : "card-hover group block rounded-xl border border-border/60 bg-background/80 p-3.5 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md";
              if (es) {
                return (
                  <Link key={tool.slug} to={href as never} className={className}>
                    {body}
                  </Link>
                );
              }
              return (
                <Link key={tool.slug} to="/tools/$slug" params={{ slug: enSlug }} className={className}>
                  {body}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Games */}
        <div className="rounded-2xl border border-violet-500/25 bg-gradient-to-br from-violet-500/8 via-card to-card p-4 shadow-lift sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="grid size-9 place-items-center rounded-xl bg-violet-500/15 text-violet-600 dark:text-violet-400">
                <Gamepad2 className="size-4.5" aria-hidden />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[.12em] text-violet-600 dark:text-violet-400">
                  {copy.playBadge}
                </p>
                <p className="text-sm font-black">{es ? "Juegos" : "Games"}</p>
              </div>
            </div>
            <a
              href={copy.gamesHref}
              className="inline-flex min-h-10 items-center gap-1 rounded-lg px-2.5 text-xs font-bold text-violet-600 hover:bg-accent dark:text-violet-400"
            >
              {copy.allGames} <ArrowRight className="size-3.5" />
            </a>
          </div>
          <div className="grid gap-2.5">
            {games.map((game) => {
              const name = gameName(game, es ? "es" : "en");
              const href = gamePath(game, es ? "es" : "en");
              const body = (
                <>
                  <span className="text-[10px] font-bold uppercase tracking-wide text-violet-600 dark:text-violet-400">
                    {copy.playBadge}
                  </span>
                  <h3 className="mt-1 font-bold group-hover:text-violet-600 dark:group-hover:text-violet-400">{name}</h3>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
                    {gameSummary(game, es ? "es" : "en")}
                  </p>
                </>
              );
              return (
                <a key={game.slug} href={href} className="card-hover group block rounded-xl border border-border/60 bg-background/80 p-3.5 hover:-translate-y-0.5 hover:border-violet-500/30 hover:shadow-md">
                  {body}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
