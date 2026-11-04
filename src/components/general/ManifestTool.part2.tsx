// Part 2 of 3 — split from ManifestTool.tsx on 2026-11-04. Edit here; ManifestTool.tsx re-exports.
import { type ManifestDisplay, type ManifestOrientation } from "@/lib/general/manifest";

export const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
export const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

export const EXAMPLE = {
  name: "UtiliHub",
  shortName: "Hub",
  description: "Browser tools",
  startUrl: "/",
  scope: "/",
  display: "standalone" as ManifestDisplay,
  orientation: "" as ManifestOrientation,
  themeColor: "#0f766e",
  backgroundColor: "#f8fafc",
  lang: "en",
  iconSrc: "",
  iconSizes: "",
};

export const EMPTY = {
  name: "",
  shortName: "",
  description: "",
  startUrl: "/",
  scope: "",
  display: "standalone" as ManifestDisplay,
  orientation: "" as ManifestOrientation,
  themeColor: "",
  backgroundColor: "",
  lang: "",
  iconSrc: "",
  iconSizes: "",
};
