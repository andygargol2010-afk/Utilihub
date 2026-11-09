// Part 2 of 3 — split from SiteHeader.tsx on 2026-11-04. Edit here; SiteHeader.tsx re-exports.

export const activeClass = {
  className: "bg-accent text-primary ring-1 ring-primary/70",
};
export const mobileLink = "min-h-11 rounded-lg px-3 py-2.5 text-sm font-bold hover:bg-accent";
export const mobileMuted =
  "min-h-11 rounded-lg px-3 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-accent hover:text-foreground";

/** Primary category shortcuts in the Browse dropdown */
export const BROWSE = [
  { href: "/category/advanced-tools", label: "Advanced tools" },
  { href: "/category/math", label: "Math" },
  { href: "/category/text", label: "Text" },
  { href: "/category/developer", label: "Developer" },
  { href: "/finance", label: "Finance" },
] as const;
