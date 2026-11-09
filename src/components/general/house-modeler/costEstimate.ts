import type { AreaStats } from "./areaStats";

/** Very rough USD build prices: per m2 for floor/wall/roof, per piece for everything else. */
const PER_PIECE: Record<string, number> = {
  door: 900,
  window: 600,
  stairs: 1800,
  column: 250,
  beam: 300,
  railing: 400,
  chimney: 2500,
  foundation: 600,
  pergola: 1500,
  fence: 300,
  path: 200,
  planter: 150,
  bench: 250,
  lamp: 200,
};
const PER_M2 = { floor: 120, walls: 90, roof: 140 };

export function estimateCost(a: AreaStats, kinds: string[]): number {
  let total = a.floor * PER_M2.floor + a.walls * PER_M2.walls + a.roof * PER_M2.roof;
  for (const k of kinds) total += PER_PIECE[k] ?? 0;
  return total;
}

/** Rounded to the nearest 100 so it never looks falsely precise; empty when nothing costs anything. */
export function formatCost(total: number, es: boolean): string {
  const r = Math.round(total / 100) * 100;
  if (r <= 0) return "";
  return `${es ? "Coste aprox." : "Est. cost"} $${r.toLocaleString(es ? "es-ES" : "en-US")}`;
}
