// Part 1 of 3 — split from ExperienceDiscoveryRail.tsx on 2026-11-04. Edit here; ExperienceDiscoveryRail.tsx re-exports.

export interface Experience {
  id: string;
  pathEn: string;
  pathEs: string;
  pathPt: string;
  titleEn: string;
  titleEs: string;
  titlePt: string;
  descEn: string;
  descEs: string;
  descPt: string;
  category: "playgrounds" | "studios" | "games" | "simulators";
}
