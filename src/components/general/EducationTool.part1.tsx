// Part 1 of 3 — split from EducationTool.tsx on 2026-11-04. Edit here; EducationTool.tsx re-exports.
import { type EducationLevel } from "@/lib/general/education-engine";

export const LEVELS: Array<[EducationLevel, string]> = [
  ["primaria", "Primary"],
  ["secundaria", "Secondary"],
  ["universidad", "University"],
];
