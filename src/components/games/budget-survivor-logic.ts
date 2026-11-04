export { START, DAYS } from "./budget-survivor-logic.part1";
export type { Difficulty, EventKind, GameEvent } from "./budget-survivor-logic.part1";
export { buildMonth } from "./budget-survivor-logic.part2";

export function money(n: number, es: boolean) {
  const sign = n < 0 ? "-" : n > 0 ? "+" : "";
  const abs = Math.abs(n).toLocaleString(es ? "es-AR" : "en-US");
  return `${sign}$${abs}`;
}
