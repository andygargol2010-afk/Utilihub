// Part 2 of 3 — split from SiteHeader.tsx on 2026-11-04. Edit here; SiteHeader.tsx re-exports.

export const activeClass = {
  className: "bg-secondary text-foreground",
};
export const mobileLink = "min-h-11 rounded-md px-3 py-2.5 text-[15px] font-semibold hover:bg-secondary";
export const mobileMuted =
  "min-h-11 rounded-lg px-3 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-accent hover:text-foreground";

/** Sections that live under "More" on desktop (all of them stay in the mobile menu). */
export const MORE = [
  { href: "/kits", label: "Kits" },
  { href: "/playgrounds", label: "Playgrounds" },
  { href: "/experiences", label: "Experiences" },
] as const;

/** Primary category shortcuts in the Browse dropdown */
export const BROWSE = [
  { href: "/category/advanced-tools", label: "Advanced tools" },
  { href: "/category/math", label: "Math" },
  { href: "/category/text", label: "Text" },
  { href: "/category/developer", label: "Developer" },
  { href: "/finance", label: "Finance" },
] as const;
