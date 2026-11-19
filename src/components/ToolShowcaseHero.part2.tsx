// Part 2 of 3 — split from ToolShowcaseHero.tsx on 2026-11-04. Edit here; ToolShowcaseHero.tsx re-exports.

export function FileArt({
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

/** Compact chip for non-file labels (text, math, timers…). */
export function ChipArt({ label }: { label: string }) {
  return (
    <div className="relative min-w-[4.5rem] max-w-[7rem] rounded-2xl border border-white/40 bg-white/15 px-3 py-3 text-center shadow-lg backdrop-blur-sm">
      <span className="block truncate text-sm font-black tracking-tight text-white">{label}</span>
    </div>
  );
}

export function kindFor(label: string): "transparent" | "photo" | "generic" {
  if (/png|webp|svg|ico|crop|full/i.test(label)) return "transparent";
  if (/jpg|jpeg|img|b&w|new|zip|90/i.test(label)) return "photo";
  return "generic";
}

/** Prefer splitting on conversion words; avoid highlighting last word of long Spanish titles. */
export function splitTitle(name: string): { lead: string; accent: string } {
  const m = name.match(/^(.*?)\s+(to|a|→|en|into)\s+(.+)$/i);
  if (m) return { lead: `${m[1]} ${m[2]} `, accent: m[3] };
  // Converter-style: "PNG to JPG", "RGB to HEX"
  const conv = name.match(/^([A-Za-z0-9.#°]+)\s+(to|a)\s+([A-Za-z0-9.#°]+)$/i);
  if (conv) return { lead: `${conv[1]} ${conv[2]} `, accent: conv[3] };
  const parts = name.trim().split(/\s+/);
  // Only accent last token if title is short (≤3 words)
  if (parts.length >= 2 && parts.length <= 3) {
    return { lead: `${parts.slice(0, -1).join(" ")} `, accent: parts[parts.length - 1]! };
  }
  return { lead: name, accent: "" };
}
