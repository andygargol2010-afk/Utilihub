import type { ReactNode } from "react";
import type { SimTheme } from "@/lib/simulators/catalog";
import { THEME } from "./SimShell.part1";
export { SimShell } from "./SimShell.part2";

export function SimPrimaryButton({
  children,
  onClick,
  disabled,
  theme = "lab",
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  theme?: SimTheme;
}) {
  const t = THEME[theme];
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex min-h-10 items-center justify-center rounded-full px-4 text-sm font-bold transition disabled:opacity-50 ${t.btnPrimary}`}
    >
      {children}
    </button>
  );
}

export function SimSecondaryButton({
  children,
  onClick,
  active,
  title,
  theme = "lab",
}: {
  children: ReactNode;
  onClick?: () => void;
  active?: boolean;
  title?: string;
  theme?: SimTheme;
}) {
  const t = THEME[theme];
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={
        active
          ? `inline-flex min-h-10 items-center justify-center rounded-full px-3 text-sm font-semibold shadow-md ${t.btnActive}`
          : "inline-flex min-h-10 items-center justify-center rounded-full border border-white/15 bg-white/10 px-3 text-sm font-semibold text-white/90 backdrop-blur-sm hover:bg-white/15"
      }
    >
      {children}
    </button>
  );
}
