// Part 1 of 3 — split from geometria.ts on 2026-11-04. Edit here; geometria.ts re-exports.
import type { EducationDifficulty, EducationLevel } from "../education-engine";

export type Q={text:string;options:string[];answer:string;levels?:EducationLevel[];difficulty?:EducationDifficulty};
