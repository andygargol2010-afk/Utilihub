// Part 1 of 3 — split from SimShell.tsx on 2026-11-04. Edit here; SimShell.tsx re-exports.
import type { ReactNode } from "react";
import type { SimDef, SimLocale, SimTheme } from "@/lib/simulators/catalog";

export type Props = {
  sim: SimDef;
  locale?: SimLocale;
  children: ReactNode;
};

export const THEME: Record<
  SimTheme,
  {
    page: string;
    accent: string;
    frame: string;
    glowA: string;
    glowB: string;
    wash: string;
    btnPrimary: string;
    btnActive: string;
  }
> = {
  lab: {
    page: "from-teal-50/90 via-cyan-50/40 to-background",
    accent: "text-teal-700",
    frame:
      "border-teal-400/25 bg-gradient-to-b from-[#0a1620] via-[#071018] to-[#03080c] shadow-[0_28px_70px_-24px_rgba(20,184,166,0.55),0_0_0_1px_rgba(45,212,191,0.12)]",
    glowA: "bg-teal-400/15",
    glowB: "bg-cyan-500/10",
    wash: "bg-[radial-gradient(ellipse_at_top,_rgba(45,212,191,0.14),_transparent_55%)]",
    btnPrimary:
      "bg-gradient-to-b from-teal-300 to-teal-600 text-teal-950 shadow-[0_4px_16px_rgba(20,184,166,0.4)] hover:from-teal-200 hover:to-teal-500",
    btnActive: "ring-2 ring-teal-400/60 bg-gradient-to-b from-teal-900 to-slate-950 text-teal-50",
  },
  cosmos: {
    page: "from-indigo-50/90 via-violet-50/40 to-background",
    accent: "text-violet-700",
    frame:
      "border-violet-400/25 bg-gradient-to-b from-[#0c0a1a] via-[#080614] to-[#030208] shadow-[0_28px_70px_-24px_rgba(139,92,246,0.55),0_0_0_1px_rgba(167,139,250,0.12)]",
    glowA: "bg-violet-500/15",
    glowB: "bg-fuchsia-500/10",
    wash: "bg-[radial-gradient(ellipse_at_top,_rgba(139,92,246,0.16),_transparent_55%)]",
    btnPrimary:
      "bg-gradient-to-b from-violet-300 to-violet-600 text-violet-950 shadow-[0_4px_16px_rgba(139,92,246,0.4)] hover:from-violet-200 hover:to-violet-500",
    btnActive: "ring-2 ring-violet-400/60 bg-gradient-to-b from-violet-900 to-slate-950 text-violet-50",
  },
  clockwork: {
    page: "from-amber-50/90 via-orange-50/30 to-background",
    accent: "text-amber-800",
    frame:
      "border-amber-500/30 bg-gradient-to-b from-[#1a1208] via-[#120c06] to-[#080502] shadow-[0_28px_70px_-24px_rgba(245,158,11,0.45),0_0_0_1px_rgba(251,191,36,0.14)]",
    glowA: "bg-amber-500/15",
    glowB: "bg-orange-600/10",
    wash: "bg-[radial-gradient(ellipse_at_top,_rgba(245,158,11,0.14),_transparent_55%)]",
    btnPrimary:
      "bg-gradient-to-b from-amber-300 to-amber-600 text-amber-950 shadow-[0_4px_16px_rgba(245,158,11,0.4)] hover:from-amber-200 hover:to-amber-500",
    btnActive: "ring-2 ring-amber-400/60 bg-gradient-to-b from-amber-900 to-stone-950 text-amber-50",
  },
};
