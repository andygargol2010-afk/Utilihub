import { FavoriteButton } from "@/components/FavoriteButton";
import type { ToolShowcase } from "@/lib/tool-showcase";

/** Hero palette inspired by high-conversion converter landing pages */
const THEMES: Record<
  ToolShowcase["accent"],
  { badge: string; glow: string; chip: string; arrow: string; highlight: string }
> = {
  blue: {
    badge: "bg-cyan-400 text-slate-950",
    glow: "from-[#0b1d4a] via-[#123a7a] to-[#0ea5e9]",
    chip: "from-sky-400 to-blue-600",
    arrow: "from-cyan-300 to-sky-500",
    highlight: "text-cyan-300",
  },
  violet: {
    badge: "bg-cyan-400 text-slate-950",
    glow: "from-[#1a0b4a] via-[#3b1d7a] to-[#7c3aed]",
    chip: "from-violet-400 to-purple-600",
    arrow: "from-fuchsia-300 to-violet-500",
    highlight: "text-fuchsia-300",
  },
  emerald: {
    badge: "bg-emerald-400 text-slate-950",
    glow: "from-[#042f2e] via-[#0f766e] to-[#10b981]",
    chip: "from-emerald-400 to-teal-600",
    arrow: "from-lime-300 to-emerald-500",
    highlight: "text-lime-300",
  },
  amber: {
    badge: "bg-amber-400 text-slate-950",
    glow: "from-[#422006] via-[#b45309] to-[#f59e0b]",
    chip: "from-amber-400 to-orange-600",
    arrow: "from-yellow-300 to-amber-500",
    highlight: "text-amber-200",
  },
  rose: {
    badge: "bg-rose-400 text-slate-950",
    glow: "from-[#4c0519] via-[#9f1239] to-[#fb7185]",
    chip: "from-rose-400 to-pink-600",
    arrow: "from-pink-300 to-rose-500",
    highlight: "text-rose-200",
  },
  cyan: {
    badge: "bg-cyan-400 text-slate-950",
    glow: "from-[#083344] via-[#0e7490] to-[#22d3ee]",
    chip: "from-cyan-400 to-sky-600",
    arrow: "from-sky-300 to-cyan-500",
    highlight: "text-cyan-200",
  },
};

function FormatIllustration({
  label,
  tone,
  chip,
}: {
  label: string;
  tone: "from" | "to";
  chip: string;
}) {
  const isPhoto = /jpg|jpeg|webp|img|ico|b&w|new|crop|90/i.test(label);
  return (
    <div className="relative">
      <div
        className={`relative flex h-[4.75rem] w-[4.25rem] flex-col overflow-hidden rounded-2xl border-2 border-white/40 shadow-2xl sm:h-[5.5rem] sm:w-[5rem] ${
          tone === "from" ? "bg-white/95" : "bg-white"
        }`}
      >
        <div className={`h-2.5 bg-gradient-to-r ${chip}`} />
        <div className="relative flex flex-1 items-center justify-center bg-slate-50">
          {isPhoto ? (
            <svg viewBox="0 0 48 40" className="h-9 w-10 text-sky-500 sm:h-10 sm:w-11" aria-hidden>
              <rect x="4" y="6" width="40" height="28" rx="4" fill="currentColor" opacity="0.15" />
              <path d="M8 28 L18 16 L26 24 L32 18 L40 28 Z" fill="currentColor" opacity="0.55" />
              <circle cx="16" cy="14" r="3" fill="currentColor" opacity="0.7" />
            </svg>
          ) : (
            <div
              className="h-9 w-9 rounded-md border border-slate-200 sm:h-10 sm:w-10"
              style={{
                backgroundImage:
                  "linear-gradient(45deg,#e2e8f0 25%,transparent 25%),linear-gradient(-45deg,#e2e8f0 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#e2e8f0 75%),linear-gradient(-45deg,transparent 75%,#e2e8f0 75%)",
                backgroundSize: "10px 10px",
                backgroundPosition: "0 0,0 5px,5px -5px,-5px 0",
              }}
            />
          )}
        </div>
        <div className="border-t border-slate-100 bg-white px-1 py-1 text-center text-[10px] font-black tracking-wide text-slate-700 sm:text-[11px]">
          {label}
        </div>
      </div>
      {tone === "to" && (
        <span className="pointer-events-none absolute -right-1 -top-1 size-3 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.9)]" />
      )}
    </div>
  );
}

function splitTitle(name: string): { lead: string; accent: string } {
  const m = name.match(/^(.*?)\s+(to|a|→)\s+(.+)$/i);
  if (m) return { lead: `${m[1]} ${m[2]} `, accent: m[3] };
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return { lead: parts.slice(0, -1).join(" ") + " ", accent: parts[parts.length - 1] };
  }
  return { lead: name, accent: "" };
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
  const theme = THEMES[showcase.accent];
  const tagline = es ? showcase.taglineEs : showcase.tagline;
  const badge = es ? showcase.badgeEs : showcase.badge;
  const { lead, accent } = splitTitle(name);

  return (
    <section
      className={`relative mt-3 overflow-hidden rounded-[1.35rem] text-white shadow-[0_20px_50px_-20px_rgba(15,23,42,0.55)]`}
      aria-labelledby="showcase-title"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${theme.glow}`} />
      <div className="pointer-events-none absolute -right-10 -top-16 size-56 rounded-full bg-cyan-300/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-0 size-64 rounded-full bg-blue-400/15 blur-3xl" />
      <div className="pointer-events-none absolute right-8 top-4 h-32 w-32 rotate-12 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.25)_0%,transparent_65%)] opacity-70" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

      <div className="relative grid gap-6 p-5 sm:p-7 lg:grid-cols-[minmax(0,1.15fr)_auto] lg:items-center lg:gap-10 lg:p-8">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] shadow-sm ${theme.badge}`}
            >
              {badge}
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/70">
              {es ? "100% local · privado" : "100% local · private"}
            </span>
          </div>

          <div className="mt-3 flex items-start justify-between gap-3">
            <h1
              id="showcase-title"
              className="text-[2rem] font-black leading-[1.05] tracking-tight sm:text-4xl lg:text-[2.75rem]"
            >
              {lead}
              {accent ? <span className={theme.highlight}>{accent}</span> : null}
            </h1>
            <div className="shrink-0 pt-1">
              <FavoriteButton slug={slug} name={name} />
            </div>
          </div>

          <p className="mt-3 max-w-lg text-sm leading-6 text-white/85 sm:text-[15px]">{tagline}</p>
        </div>

        {(showcase.fromLabel || showcase.toLabel) && (
          <div className="flex items-center justify-center gap-3 sm:gap-4 lg:justify-end" aria-hidden>
            {showcase.fromLabel && (
              <FormatIllustration label={showcase.fromLabel} tone="from" chip={theme.chip} />
            )}
            <div
              className={`grid size-11 place-items-center rounded-full bg-gradient-to-br ${theme.arrow} text-lg font-black text-slate-950 shadow-lg ring-4 ring-white/15`}
            >
              →
            </div>
            {showcase.toLabel && (
              <FormatIllustration label={showcase.toLabel} tone="to" chip={theme.chip} />
            )}
          </div>
        )}
      </div>
    </section>
  );
}
