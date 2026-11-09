// Part 2 of 3 — split from education-bank-a.ts on 2026-11-04. Edit here; education-bank-a.ts re-exports.
import type { EducationDifficulty, EducationLevel } from "./education-engine";
import { type Q } from "./education-bank-a.part1";

export const q=(text:string,options:string[],answer:string,levels?:EducationLevel[],difficulty?:EducationDifficulty):Q=>({text,options,answer,levels,difficulty});
