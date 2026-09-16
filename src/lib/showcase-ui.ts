import type { ToolShowcase } from "@/lib/tool-showcase";

export type ShowcaseAccent = ToolShowcase["accent"];

/** Shared premium field / button / output classes keyed by showcase accent. */
export function showcaseUi(accent?: ShowcaseAccent | null) {
  if (!accent) return null;
  const themes: Record<
    ShowcaseAccent,
    { field: string; fieldTall: string; select: string; btn: string; out: string; drop: string; display: string; btnSecondary: string }
  > = {
    blue: {
      field:
        "h-12 w-full rounded-2xl border-2 border-sky-200/80 bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_60%)] px-4 shadow-inner transition focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-100",
      fieldTall:
        "min-h-44 w-full rounded-2xl border-2 border-sky-200/80 bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_60%)] p-4 text-[15px] shadow-inner transition focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-100",
      select: "h-12 rounded-2xl border-2 border-sky-200/80 bg-white px-3 shadow-sm",
      btn: "inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 px-8 py-3.5 text-sm font-bold text-white shadow-[0_12px_28px_-10px_rgba(37,99,235,0.55)] transition hover:brightness-105 disabled:opacity-50",
      out: "border-sky-100 bg-sky-50/50",
      drop: "border-sky-300/80 bg-[linear-gradient(180deg,#f0f9ff_0%,#ffffff_55%)] hover:border-sky-400 hover:bg-sky-50/40",
      display:
        "rounded-2xl border-2 border-sky-100 bg-[linear-gradient(180deg,#f0f9ff_0%,#ffffff_70%)] p-6 text-center font-mono font-bold tabular-nums text-slate-800 shadow-inner",
      btnSecondary:
        "inline-flex min-h-12 items-center justify-center rounded-full border-2 border-sky-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-sky-50",
    },
    violet: {
      field:
        "h-12 w-full rounded-2xl border-2 border-violet-200/80 bg-[linear-gradient(180deg,#faf5ff_0%,#ffffff_60%)] px-4 shadow-inner transition focus:border-violet-400 focus:outline-none focus:ring-4 focus:ring-violet-100",
      fieldTall:
        "min-h-44 w-full rounded-2xl border-2 border-violet-200/80 bg-[linear-gradient(180deg,#faf5ff_0%,#ffffff_60%)] p-4 text-[15px] shadow-inner transition focus:border-violet-400 focus:outline-none focus:ring-4 focus:ring-violet-100",
      select: "h-12 rounded-2xl border-2 border-violet-200/80 bg-white px-3 shadow-sm",
      btn: "inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 px-8 py-3.5 text-sm font-bold text-white shadow-[0_12px_28px_-10px_rgba(124,58,237,0.55)] transition hover:brightness-105 disabled:opacity-50",
      out: "border-violet-100 bg-violet-50/50",
      drop: "border-violet-300/80 bg-[linear-gradient(180deg,#f5f3ff_0%,#ffffff_55%)] hover:border-violet-400 hover:bg-violet-50/40",
      display:
        "rounded-2xl border-2 border-violet-100 bg-[linear-gradient(180deg,#f5f3ff_0%,#ffffff_70%)] p-6 text-center font-mono font-bold tabular-nums text-slate-800 shadow-inner",
      btnSecondary:
        "inline-flex min-h-12 items-center justify-center rounded-full border-2 border-violet-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-violet-50",
    },
    emerald: {
      field:
        "h-12 w-full rounded-2xl border-2 border-emerald-200/80 bg-[linear-gradient(180deg,#ecfdf5_0%,#ffffff_60%)] px-4 shadow-inner transition focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-100",
      fieldTall:
        "min-h-44 w-full rounded-2xl border-2 border-emerald-200/80 bg-[linear-gradient(180deg,#ecfdf5_0%,#ffffff_60%)] p-4 text-[15px] shadow-inner transition focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-100",
      select: "h-12 rounded-2xl border-2 border-emerald-200/80 bg-white px-3 shadow-sm",
      btn: "inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 px-8 py-3.5 text-sm font-bold text-white shadow-[0_12px_28px_-10px_rgba(16,185,129,0.55)] transition hover:brightness-105 disabled:opacity-50",
      out: "border-emerald-100 bg-emerald-50/50",
      drop: "border-emerald-300/80 bg-[linear-gradient(180deg,#ecfdf5_0%,#ffffff_55%)] hover:border-emerald-400 hover:bg-emerald-50/40",
      display:
        "rounded-2xl border-2 border-emerald-100 bg-[linear-gradient(180deg,#ecfdf5_0%,#ffffff_70%)] p-6 text-center font-mono font-bold tabular-nums text-slate-800 shadow-inner",
      btnSecondary:
        "inline-flex min-h-12 items-center justify-center rounded-full border-2 border-emerald-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-emerald-50",
    },
    amber: {
      field:
        "h-12 w-full rounded-2xl border-2 border-amber-200/80 bg-[linear-gradient(180deg,#fffbeb_0%,#ffffff_60%)] px-4 shadow-inner transition focus:border-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-100",
      fieldTall:
        "min-h-44 w-full rounded-2xl border-2 border-amber-200/80 bg-[linear-gradient(180deg,#fffbeb_0%,#ffffff_60%)] p-4 text-[15px] shadow-inner transition focus:border-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-100",
      select: "h-12 rounded-2xl border-2 border-amber-200/80 bg-white px-3 shadow-sm",
      btn: "inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 px-8 py-3.5 text-sm font-bold text-white shadow-[0_12px_28px_-10px_rgba(245,158,11,0.55)] transition hover:brightness-105 disabled:opacity-50",
      out: "border-amber-100 bg-amber-50/50",
      drop: "border-amber-300/80 bg-[linear-gradient(180deg,#fffbeb_0%,#ffffff_55%)] hover:border-amber-400 hover:bg-amber-50/40",
      display:
        "rounded-2xl border-2 border-amber-100 bg-[linear-gradient(180deg,#fffbeb_0%,#ffffff_70%)] p-6 text-center font-mono font-bold tabular-nums text-slate-800 shadow-inner",
      btnSecondary:
        "inline-flex min-h-12 items-center justify-center rounded-full border-2 border-amber-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-amber-50",
    },
    rose: {
      field:
        "h-12 w-full rounded-2xl border-2 border-rose-200/80 bg-[linear-gradient(180deg,#fff1f2_0%,#ffffff_60%)] px-4 shadow-inner transition focus:border-rose-400 focus:outline-none focus:ring-4 focus:ring-rose-100",
      fieldTall:
        "min-h-44 w-full rounded-2xl border-2 border-rose-200/80 bg-[linear-gradient(180deg,#fff1f2_0%,#ffffff_60%)] p-4 text-[15px] shadow-inner transition focus:border-rose-400 focus:outline-none focus:ring-4 focus:ring-rose-100",
      select: "h-12 rounded-2xl border-2 border-rose-200/80 bg-white px-3 shadow-sm",
      btn: "inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 px-8 py-3.5 text-sm font-bold text-white shadow-[0_12px_28px_-10px_rgba(244,63,94,0.55)] transition hover:brightness-105 disabled:opacity-50",
      out: "border-rose-100 bg-rose-50/50",
      drop: "border-rose-300/80 bg-[linear-gradient(180deg,#fff1f2_0%,#ffffff_55%)] hover:border-rose-400 hover:bg-rose-50/40",
      display:
        "rounded-2xl border-2 border-rose-100 bg-[linear-gradient(180deg,#fff1f2_0%,#ffffff_70%)] p-6 text-center font-mono font-bold tabular-nums text-slate-800 shadow-inner",
      btnSecondary:
        "inline-flex min-h-12 items-center justify-center rounded-full border-2 border-rose-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-rose-50",
    },
    cyan: {
      field:
        "h-12 w-full rounded-2xl border-2 border-cyan-200/80 bg-[linear-gradient(180deg,#ecfeff_0%,#ffffff_60%)] px-4 shadow-inner transition focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-100",
      fieldTall:
        "min-h-44 w-full rounded-2xl border-2 border-cyan-200/80 bg-[linear-gradient(180deg,#ecfeff_0%,#ffffff_60%)] p-4 text-[15px] shadow-inner transition focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-100",
      select: "h-12 rounded-2xl border-2 border-cyan-200/80 bg-white px-3 shadow-sm",
      btn: "inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-teal-600 px-8 py-3.5 text-sm font-bold text-white shadow-[0_12px_28px_-10px_rgba(6,182,212,0.55)] transition hover:brightness-105 disabled:opacity-50",
      out: "border-cyan-100 bg-cyan-50/50",
      drop: "border-cyan-300/80 bg-[linear-gradient(180deg,#ecfeff_0%,#ffffff_55%)] hover:border-cyan-400 hover:bg-cyan-50/40",
      display:
        "rounded-2xl border-2 border-cyan-100 bg-[linear-gradient(180deg,#ecfeff_0%,#ffffff_70%)] p-6 text-center font-mono font-bold tabular-nums text-slate-800 shadow-inner",
      btnSecondary:
        "inline-flex min-h-12 items-center justify-center rounded-full border-2 border-cyan-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-cyan-50",
    },
  };
  return themes[accent];
}
