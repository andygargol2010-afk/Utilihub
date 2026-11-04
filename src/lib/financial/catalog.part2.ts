// Part 2 of 3 — split from catalog.ts on 2026-11-04. Edit here; catalog.ts re-exports.
import { type FinancialMeta } from "./catalog.part1";

export const m=(slug:string,name:string,summary:string):FinancialMeta=>({slug,name,summary,description:`${summary} Free UtiliHub financial calculator.`,keywords:[name.toLowerCase(),"financial calculator","finance"]});
