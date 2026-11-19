import type { ReactNode } from "react";
import type { GameLocale } from "@/lib/games/catalog";
import { gamePath } from "@/lib/games/catalog";
export { GameShell } from "./GameShell.part2";

export function GamePrimaryButton({
  children,
  onClick,
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="inline-flex min-h-10 items-center justify-center rounded-full bg-gradient-to-b from-emerald-400 to-emerald-600 px-4 text-sm font-bold text-emerald-950 shadow-[0_4px_14px_rgba(16,185,129,0.35)] transition hover:from-emerald-300 hover:to-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {children}
    </button>
  );
}

export function GameSecondaryButton({
  children,
  onClick,
  active,
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={
        active
          ? "inline-flex min-h-10 items-center justify-center rounded-full bg-gradient-to-b from-slate-800 to-slate-950 px-3 text-sm font-semibold text-white ring-2 ring-emerald-400/50 shadow-md focus-visible:outline-none focus-visible:ring-emerald-300 focus-visible:ring-offset-2"
          : "inline-flex min-h-10 items-center justify-center rounded-full border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      }
    >
      {children}
    </button>
  );
}

export function gameHubPath(locale: GameLocale) {
  return locale === "es" ? "/es/juegos" : "/games";
}

export { gamePath };
