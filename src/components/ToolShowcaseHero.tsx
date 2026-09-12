import { FavoriteButton } from "@/components/FavoriteButton";
import type { ToolShowcase } from "@/lib/tool-showcase";

function FileArt({
  label,
  kind,
}: {
  label: string;
  kind: "transparent" | "photo" | "generic";
}) {
  return (
    <div className="relative w-[4.5rem] sm:w-[5.25rem]">
      <div className="absolute inset-x-1 top-2 h-full rounded-xl bg-black/25 blur-md" />
      <div className="relative overflow-hidden rounded-xl border border-white/50 bg-white shadow-2xl">
        <div className="absolute right-0 top-0 size-5 bg-gradient-to-bl from-slate-200 to-slate-100" />
        <div className="flex h-11 items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 sm:h-12">
          {kind === "transparent" && (
            <div
              className="size-7 rounded-sm border border-slate-200 sm:size-8"
              style={{
                backgroundImage:
                  "linear-gradient(45deg,#cbd5e1 25%,transparent 25%),linear-gradient(-45deg,#cbd5e1 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#cbd5e1 75%),linear-gradient(-45deg,transparent 75%,#cbd5e1 75%)",
                backgroundSize: "8px 8px",
                backgroundPosition: "0 0,0 4px,4px -4px,-4px 0",
              }}
            />
          )}
          {kind === "photo" && (
            <svg viewBox="0 0 40 32" className="h-7 w-9 text-sky-500 sm:h-8 sm:w-10" aria-hidden>
              <rect x="2" y="2" width="36" height="28" rx="3" fill="currentColor" opacity="0.12" />
              <path d="M4 26 L14 12 L22 20 L28 14 L36 26 Z" fill="currentColor" opacity="0.55" />
              <circle cx="12" cy="10" r="2.5" fill="currentColor" opacity="0.75" />
            </svg>
          )}
          {kind === "generic" && (
            <div className="grid size-7 place-items-center rounded-md bg-primary/15 text-[10px] font-black text-primary sm:size-8">
              {label.slice(0, 3)}
            </div>
          )}
        </div>
        <div className="border-t border-slate-100 px-1.5 py-1.5 text-center text-[10px] font-black tracking-wide text-slate-700 sm:text-[11px]">
          {label}
        </div>
      </div>
    </div>
  );
}

function kindFor(label: string): "transparent" | "photo" | "generic" {
  if (/png|webp|svg|ico|crop|full/i.test(label)) return "transparent";
  if (/jpg|jpeg|img|b&w|new|zip|90/i.test(label)) return "photo";
  return "generic";
}

function splitTitle(name: string): { lead: string; accent: string } {
  const m = name.match(/^(.*?)\s+(to|a|→)\s+(.+)$/i);
  if (m) return { lead: `${m[1]} ${m[2]} `, accent: m[3] };
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return { lead: `${parts.slice(0, -1).join(" ")} `, accent: parts[parts.length - 1]! };
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
  const tagline = es ? showcase.taglineEs : showcase.tagline;
  const badge = es ? showcase.badgeEs : showcase.badge;
  const { lead, accent } = splitTitle(name);

  return (
    <section
      className="relative mt-3 overflow-hidden rounded-[1.5rem] text-white"
      aria-labelledby="showcase-title"
      style={{
        background:
          "radial-gradient(1200px 400px at 90% -10%, rgba(56,189,248,0.35), transparent 55%), radial-gradient(900px 360px at 10% 110%, rgba(99,102,241,0.35), transparent 50%), linear-gradient(135deg, #0b1b3a 0%, #123a7a 45%, #1d4ed8 100%)",
      }}
    >
      <div
        className="pointer-events-none absolute -right-8 top-0 h-full w-1/2 opacity-40"
        style={{
          background:
            "repeating-linear-gradient(115deg, transparent 0 18px, rgba(255,255,255,0.06) 18px 20px)",
        }}
      />
      <div className="pointer-events-none absolute -left-10 -top-16 size-48 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 right-10 size-56 rounded-full bg-indigo-400/25 blur-3xl" />

      <div className="relative grid gap-8 p-5 sm:p-7 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-6 lg:p-8">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-cyan-400 px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-slate-950 shadow-sm">
              {badge}
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/65">
              {es ? "100% local · privado" : "100% local · private"}
            </span>
          </div>

          <div className="mt-4 flex items-start justify-between gap-3">
            <h1
              id="showcase-title"
              className="text-[2.05rem] font-black leading-[1.05] tracking-tight sm:text-4xl lg:text-[2.85rem]"
            >
              {lead}
              {accent ? <span className="text-cyan-300">{accent}</span> : null}
            </h1>
            <div className="shrink-0 [&_button]:border-white/30 [&_button]:bg-white/10 [&_button]:text-white [&_button]:hover:bg-white/20">
              <FavoriteButton slug={slug} name={name} locale={locale} />
            </div>
          </div>

          <p className="mt-3 max-w-md text-[15px] leading-6 text-white/85">{tagline}</p>
        </div>

        {(showcase.fromLabel || showcase.toLabel) && (
          <div className="flex items-center justify-center gap-3 sm:gap-5" aria-hidden>
            {showcase.fromLabel ? (
              <FileArt label={showcase.fromLabel} kind={kindFor(showcase.fromLabel)} />
            ) : null}
            <div className="relative grid size-12 place-items-center rounded-full bg-gradient-to-br from-cyan-300 to-sky-500 text-xl font-black text-slate-950 shadow-[0_10px_30px_-8px_rgba(34,211,238,0.7)] ring-4 ring-white/20">
              →
            </div>
            {showcase.toLabel ? (
              <FileArt label={showcase.toLabel} kind={kindFor(showcase.toLabel)} />
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}
