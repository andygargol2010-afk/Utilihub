import type { GameDef, GameLocale } from "@/lib/games/catalog";
import { gameFaq } from "@/lib/games/seo";

type Props = {
  game: GameDef;
  locale?: GameLocale;
};

/** Visible FAQ for SEO + players — matches JSON-LD on the game page. */
export function GameSeoFaq({ game, locale = "en" }: Props) {
  const isEs = locale === "es";
  const items = gameFaq(game, locale);
  if (!items.length) return null;

  return (
    <section className="mt-8 rounded-2xl border border-border/70 bg-card p-5 sm:p-6" aria-labelledby="game-faq-title">
      <h2 id="game-faq-title" className="text-lg font-black">
        {isEs ? "Preguntas frecuentes" : "Frequently asked questions"}
      </h2>
      <dl className="mt-4 space-y-4">
        {items.map((item) => (
          <div key={item.q}>
            <dt className="text-sm font-bold text-foreground">{item.q}</dt>
            <dd className="mt-1 text-sm leading-6 text-muted-foreground">{item.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
