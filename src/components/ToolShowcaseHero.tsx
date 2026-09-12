import { FavoriteButton } from "@/components/FavoriteButton";
import type { ToolShowcase } from "@/lib/tool-showcase";

const ACCENT: Record<ToolShowcase["accent"], { badge: string; glow: string; from: string; to: string }> = {
  blue: { badge: "bg-sky-400 text-sky-950", glow: "from-sky-500/30 via-blue-600/20 to-indigo-900/40", from: "from-sky-400", to: "to-blue-600" },
  violet: { badge: "bg-violet-300 text-violet-950", glow: "from-violet-500/30 via-purple-600/20 to-indigo-900/40", from: "from-violet-400", to: "to-purple-600" },
  emerald: { badge: "bg-emerald-300 text-emerald-950", glow: "from-emerald-500/30 via-teal-600/20 to-slate-900/40", from: "from-emerald-400", to: "to-teal-600" },
  amber: { badge: "bg-amber-300 text-amber-950", glow: "from-amber-400/30 via-orange-500/20 to-rose-900/30", from: "from-amber-400", to: "to-orange-600" },
  rose: { badge: "bg-rose-300 text-rose-950", glow: "from-rose-400/30 via-pink-600/20 to-purple-900/40", from: "from-rose-400", to: "to-pink-600" },
  cyan: { badge: "bg-cyan-300 text-cyan-950", glow: "from-cyan-400/30 via-sky-600/20 to-slate-900/40", from: "from-cyan-400", to: "to-sky-600" },
};

function FormatCard({ label, tone }: { label: string; tone: "from" | "to" }) {
  return (
    <div
      className={`relative grid size-20 place-items-center rounded-2xl border border-white/25 shadow-xl sm:size-24 ${
        tone === "from" ? "bg-white/15" : "bg-white/25"
      }`}
    >
      <div className="absolute inset-2 rounded-xl border border-dashed border-white/30" />
      <span className="relative text-sm font-black tracking-wide text-white sm:text-base">{label}</span>
    </div>
  );
}

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
  const accent = ACCENT[showcase.accent];
  const tagline = es ? showcase.taglineEs : showcase.tagline;
  const badge = es ? showcase.badgeEs : showcase.badge;

  return (
    <section
      className={`relative mt-3 overflow-hidden rounded-2xl border border-white/10 bg-slate-950 text-white shadow-lift`}
      aria-labelledby="showcase-title"
    >
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accent.glow}`} />
      <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 left-10 size-48 rounded-full bg-sky-400/20 blur-3xl" />

      <div className="relative grid gap-6 p-5 sm:p-7 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:gap-8 lg:p-8">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.14em] ${accent.badge}`}>
              {badge}
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-wide text-white/60">
              {es ? "100% local · privado" : "100% local · private"}
            </span>
          </div>
          <div className="mt-3 flex items-start justify-between gap-3">
            <h1 id="showcase-title" className="text-3xl font-black tracking-tight sm:text-4xl lg:text-[2.6rem] lg:leading-[1.1]">
              {name}
            </h1>
            <FavoriteButton slug={slug} name={name} />
          </div>
          <p className="mt-3 max-w-xl text-sm leading-6 text-white/80 sm:text-base">{tagline}</p>
        </div>

        {(showcase.fromLabel || showcase.toLabel) && (
          <div className="flex items-center justify-center gap-3 sm:gap-4 lg:justify-end" aria-hidden>
            {showcase.fromLabel && <FormatCard label={showcase.fromLabel} tone="from" />}
            <div className={`grid size-10 place-items-center rounded-full bg-gradient-to-r ${accent.from} ${accent.to} text-lg font-black text-white shadow-lg`}>
              →
            </div>
            {showcase.toLabel && <FormatCard label={showcase.toLabel} tone="to" />}
          </div>
        )}
      </div>
    </section>
  );
}
