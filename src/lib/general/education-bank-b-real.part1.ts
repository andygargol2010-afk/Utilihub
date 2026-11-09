// Part 1 of 3 — split from education-bank-b-real.ts on 2026-11-04. Edit here; education-bank-b-real.ts re-exports.
import type { EducationDifficulty, EducationLevel } from "./education-engine";

export type Q={text:string;options:string[];answer:string;levels:EducationLevel[];difficulty:EducationDifficulty};
