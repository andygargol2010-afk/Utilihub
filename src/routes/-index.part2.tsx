// Part 2 of 3 — split from index.tsx on 2026-11-04. Edit here; index.tsx re-exports.
import { lazy } from "react";
import { cleanDescription } from "@/lib/seo";
import { loadHomeCatalog } from "./-index.part1";

export const HomeToolCount = lazy(() => loadHomeCatalog().then((m) => ({ default: m.HomeToolCount })));
export const HomeSearch = lazy(() => loadHomeCatalog().then((m) => ({ default: m.HomeSearch })));
export const HomeCatalogRest = lazy(() => loadHomeCatalog().then((m) => ({ default: m.HomeCatalogRest })));

export const ExperienceDiscoveryRail = lazy(() =>
  import("@/components/ExperienceDiscoveryRail").then((m) => ({ default: m.ExperienceDiscoveryRail })),
);

export const HomeValuePath = lazy(() =>
  import("@/components/HomeValuePath").then((m) => ({ default: m.HomeValuePath })),
);

export const DailyExperienceSpotlight = lazy(() =>
  import("@/components/DailyExperienceSpotlight").then((m) => ({ default: m.DailyExperienceSpotlight })),
);

export const RANDOM_EXPERIENCES = [
  "/aurora-particle-playground",
  "/pulse-catch",
  "/studio/prism-trail-composer",
  "/color-cascade-fusion",
  "/solar-system-scale-explorer",
  "/daily-progress-constellation",
  "/return-streak-board",
];

export function goRandomExperience() {
  const path = RANDOM_EXPERIENCES[Math.floor(Math.random() * RANDOM_EXPERIENCES.length)];
  window.location.href = path;
}

export const title = "UtiliHub · Free online tools, 3D studios & games";
export const description = cleanDescription(
  "Free online tools, advanced 3D house modeler, and browser games. Calculate, convert, build, and play — no signup.",
);
