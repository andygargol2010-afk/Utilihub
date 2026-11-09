import { FavoriteButton } from "@/components/FavoriteButton";
import type { ToolShowcase } from "@/lib/tool-showcase";
import { ACCENT_THEME, isFileLabel } from "./ToolShowcaseHero.part1";
import { splitTitle, FileArt, kindFor, ChipArt } from "./ToolShowcaseHero.part2";

export function ToolShowcaseHero({
  name,
  slug,
  showcase,
  locale = "en",
}: {
  name: string;
  slug: string;
  showcase: ToolShowcase;
  locale?: "en" | "es";
}) {
  const es = locale === "es";
  const tagline = es ? showcase.taglineEs : showcase.tagline;
  const badge = es ? showcase.badgeEs : showcase.badge;
  const theme = ACCENT_THEME[showcase.accent] ?? ACCENT_THEME.blue;
  const { lead, accent } = splitTitle(name);
  const from = showcase.fromLabel;
  const to = showcase.toLabel;
  const useFileArt =
    (from && isFileLabel(from)) || (to && isFileLabel(to)) || /pdf|png|jpg|webp|img/i.test(from ?? "") || /pdf|png|jpg|webp|img/i.test(to ?? "");

  return (
    <section
      className="relative mt-3 min-h-[291px] overflow-hidden rounded-[1.5rem] text-white lg:min-h-[312px]"
      aria-labelledby="showcase-title"
      style={{ background: theme.bg }}
    >
      <div
        className="pointer-events-none absolute -right-8 top-0 h-full w-1/2 opacity-40"
        style={{
          background:
            "repeating-linear-gradient(115deg, transparent 0 18px, rgba(255,255,255,0.06) 18px 20px)",
        }}
      />
      <div className={`pointer-events-none absolute -left-10 -top-16 size-48 rounded-full blur-3xl ${theme.glowA}`} />
      <div className={`pointer-events-none absolute -bottom-20 right-10 size-56 rounded-full blur-3xl ${theme.glowB}`} />

      <div className="relative grid gap-8 p-5 sm:p-7 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-6 lg:p-8">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] shadow-sm ${theme.badge}`}
            >
              {badge}
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/65">
              {es ? "En tu navegador" : "In your browser"}
            </span>
          </div>

          <div className="mt-4 flex items-start justify-between gap-3">
            <h1
              id="showcase-title"
              className="text-[2.05rem] font-black leading-[1.05] tracking-tight sm:text-4xl lg:text-[2.85rem]"
            >
              {lead}
              {accent ? <span className={theme.title}>{accent}</span> : null}
            </h1>
            <div className="shrink-0 [&_button]:border-white/30 [&_button]:bg-white/10 [&_button]:text-white [&_button]:hover:bg-white/20">
              <FavoriteButton slug={slug} name={name} locale={locale} />
            </div>
          </div>

          <p className="mt-3 max-w-md text-[15px] leading-6 text-white/85">{tagline}</p>
        </div>

        {(from || to) && (
          <div className="flex items-center justify-center gap-3 sm:gap-5" aria-hidden>
            {from ? useFileArt ? <FileArt label={from} kind={kindFor(from)} /> : <ChipArt label={from} /> : null}
            <div
              className={`relative grid size-12 place-items-center rounded-full bg-gradient-to-br text-xl font-black text-slate-950 ring-4 ring-white/20 ${theme.arrow}`}
            >
              →
            </div>
            {to ? useFileArt ? <FileArt label={to} kind={kindFor(to)} /> : <ChipArt label={to} /> : null}
          </div>
        )}
      </div>
    </section>
  );
}
