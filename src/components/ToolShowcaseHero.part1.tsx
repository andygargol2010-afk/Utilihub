// Part 1 of 3 — split from ToolShowcaseHero.tsx on 2026-11-04. Edit here; ToolShowcaseHero.tsx re-exports.
import type { ToolShowcase } from "@/lib/tool-showcase";

export const ACCENT_THEME: Record<
  ToolShowcase["accent"],
  { bg: string; badge: string; title: string; glowA: string; glowB: string; arrow: string }
> = {
  blue: {
    bg: "radial-gradient(1200px 400px at 90% -10%, rgba(56,189,248,0.35), transparent 55%), radial-gradient(900px 360px at 10% 110%, rgba(99,102,241,0.35), transparent 50%), linear-gradient(135deg, #0b1b3a 0%, #123a7a 45%, #1d4ed8 100%)",
    badge: "bg-cyan-400 text-slate-950",
    title: "text-cyan-300",
    glowA: "bg-cyan-400/20",
    glowB: "bg-indigo-400/25",
    arrow: "from-cyan-300 to-sky-500 shadow-[0_10px_30px_-8px_rgba(34,211,238,0.7)]",
  },
  violet: {
    bg: "radial-gradient(1200px 400px at 90% -10%, rgba(196,181,253,0.4), transparent 55%), radial-gradient(900px 360px at 10% 110%, rgba(167,139,250,0.3), transparent 50%), linear-gradient(135deg, #1e1033 0%, #4c1d95 45%, #7c3aed 100%)",
    badge: "bg-violet-300 text-violet-950",
    title: "text-violet-200",
    glowA: "bg-violet-400/25",
    glowB: "bg-fuchsia-400/20",
    arrow: "from-violet-300 to-purple-500 shadow-[0_10px_30px_-8px_rgba(167,139,250,0.7)]",
  },
  emerald: {
    bg: "radial-gradient(1200px 400px at 90% -10%, rgba(110,231,183,0.35), transparent 55%), radial-gradient(900px 360px at 10% 110%, rgba(52,211,153,0.25), transparent 50%), linear-gradient(135deg, #052e1c 0%, #065f46 45%, #059669 100%)",
    badge: "bg-emerald-300 text-emerald-950",
    title: "text-emerald-200",
    glowA: "bg-emerald-400/25",
    glowB: "bg-teal-400/20",
    arrow: "from-emerald-300 to-teal-500 shadow-[0_10px_30px_-8px_rgba(52,211,153,0.7)]",
  },
  amber: {
    bg: "radial-gradient(1200px 400px at 90% -10%, rgba(252,211,77,0.35), transparent 55%), radial-gradient(900px 360px at 10% 110%, rgba(251,191,36,0.25), transparent 50%), linear-gradient(135deg, #2a1800 0%, #92400e 45%, #d97706 100%)",
    badge: "bg-amber-300 text-amber-950",
    title: "text-amber-200",
    glowA: "bg-amber-400/25",
    glowB: "bg-orange-400/20",
    arrow: "from-amber-300 to-orange-500 shadow-[0_10px_30px_-8px_rgba(251,191,36,0.7)]",
  },
  rose: {
    bg: "radial-gradient(1200px 400px at 90% -10%, rgba(251,113,133,0.35), transparent 55%), radial-gradient(900px 360px at 10% 110%, rgba(244,63,94,0.25), transparent 50%), linear-gradient(135deg, #2a0a14 0%, #9f1239 45%, #e11d48 100%)",
    badge: "bg-rose-300 text-rose-950",
    title: "text-rose-200",
    glowA: "bg-rose-400/25",
    glowB: "bg-pink-400/20",
    arrow: "from-rose-300 to-pink-500 shadow-[0_10px_30px_-8px_rgba(244,63,94,0.7)]",
  },
  cyan: {
    bg: "radial-gradient(1200px 400px at 90% -10%, rgba(103,232,249,0.35), transparent 55%), radial-gradient(900px 360px at 10% 110%, rgba(34,211,238,0.25), transparent 50%), linear-gradient(135deg, #042f2e 0%, #0e7490 45%, #0891b2 100%)",
    badge: "bg-cyan-300 text-cyan-950",
    title: "text-cyan-200",
    glowA: "bg-cyan-400/25",
    glowB: "bg-sky-400/20",
    arrow: "from-cyan-300 to-teal-500 shadow-[0_10px_30px_-8px_rgba(34,211,238,0.7)]",
  },
};

/** True when from/to labels look like file types (image/PDF suite). */
export function isFileLabel(label: string) {
  return /^(png|jpg|jpeg|webp|svg|ico|pdf|img|zip|txt|ico|page|info|pdfs)$/i.test(label.trim());
}
