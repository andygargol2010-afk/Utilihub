// Part 1 of 3 — split from GeneralTool.tsx on 2026-11-04. Edit here; GeneralTool.tsx re-exports.

export const nums=(s:string)=>s.split(/[\n,;\s]+/).map(x=>Number(x.trim().replace(",","."))).filter(Number.isFinite);
