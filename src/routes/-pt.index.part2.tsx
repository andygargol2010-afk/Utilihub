// Part 2 of 3 — split from pt.index.tsx on 2026-11-04. Edit here; pt.index.tsx re-exports.
import { lazy } from "react";
import { loadHomeCatalog } from "./-pt.index.part1";

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

export const RANDOM_EXPERIENCES_PT = [
  "/pt/aurora-particle-playground",
  "/pt/pulse-catch",
  "/studio/prism-trail-composer",
  "/pt/color-cascade-fusion",
  "/pt/solar-system-scale-explorer",
  "/pt/daily-progress-constellation",
  "/pt/return-streak-board",
];

export function goRandomExperiencePt() {
  const path = RANDOM_EXPERIENCES_PT[Math.floor(Math.random() * RANDOM_EXPERIENCES_PT.length)];
  window.location.href = path;
}

export const titlePt = "UtiliHub · Ferramentas online, estúdios 3D e jogos";
export const descriptionPt =
  "Ferramentas online grátis, modelador de casas 3D e jogos no navegador. Calcule, converta, projete e jogue — sem cadastro.";
