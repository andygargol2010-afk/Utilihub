// Part 2 of 3 — split from es.index.tsx on 2026-11-04. Edit here; es.index.tsx re-exports.
import { lazy } from "react";
import { loadHomeCatalog } from "./-es.index.part1";

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

export const RANDOM_EXPERIENCES_ES = [
  "/es/aurora-particle-playground",
  "/es/pulse-catch",
  "/es/studio/compositor-estela-prisma",
  "/es/color-cascade-fusion",
  "/es/solar-system-scale-explorer",
  "/es/daily-progress-constellation",
  "/es/return-streak-board",
];

export function goRandomExperienceEs() {
  const path = RANDOM_EXPERIENCES_ES[Math.floor(Math.random() * RANDOM_EXPERIENCES_ES.length)];
  window.location.href = path;
}

export const titleEs = "UtiliHub · Herramientas online, studios 3D y juegos";
export const descriptionEs =
  "Herramientas online gratis, modelador de casas 3D y juegos en el navegador. Calculá, convertí, diseñá y jugá — sin registro.";
