import { GAMES, gamePath, gameName } from "@/lib/games/catalog";
import { SIMULATORS, simPath, simName } from "@/lib/simulators/catalog";
import { TARGETS, type Target } from "./targets";
import { VALID, type Goal, type Locale, type Output, type Time } from "./taxonomy";

export type Answers = { g: Goal | null; t: Time | null; o: Output | null };

export type Match = {
  target: Target;
  score: number;
  name: string;
  path: string;
  reason: string;
};

function resolve(target: Target, locale: Locale): { name: string; path: string } | null {
  if (target.kind === "game") {
    const game = GAMES.find((x) => x.slug === target.slug);
    return game ? { name: gameName(game, locale), path: gamePath(game, locale) } : null;
  }
  if (target.kind === "sim") {
    const sim = SIMULATORS.find((x) => x.slug === target.slug);
    return sim ? { name: simName(sim, locale), path: simPath(sim, locale) } : null;
  }
  const name = locale === "es" ? target.nameEs : target.nameEn;
  const path = locale === "es" ? target.pathEs : target.pathEn;
  return name && path ? { name, path } : null;
}

/** Goal counts most, then output, then time. First listed value is the primary one. */
export function scoreTarget(target: Target, a: Answers): number {
  let n = 0;
  if (a.g) n += target.goals[0] === a.g ? 6 : target.goals.includes(a.g) ? 4 : 0;
  if (a.o) n += target.outputs[0] === a.o ? 4 : target.outputs.includes(a.o) ? 3 : 0;
  if (a.t) n += target.times.includes(a.t) ? 3 : 0;
  return n;
}

/** Deterministic ranking: score desc, then catalog order. Unresolvable targets are dropped. */
export function rank(a: Answers, locale: Locale): Match[] {
  const out: Match[] = [];
  TARGETS.forEach((target, i) => {
    const r = resolve(target, locale);
    if (!r) return;
    out.push({
      target,
      score: scoreTarget(target, a) * 100 - i,
      name: r.name,
      path: r.path,
      reason: locale === "es" ? target.reasonEs : target.reasonEn,
    });
  });
  return out.sort((p, q) => q.score - p.score);
}

/** Page of 3 results; `round` rotates to the next three for "try something different". */
export function pickTop(a: Answers, locale: Locale, round: number): Match[] {
  const all = rank(a, locale);
  const good = all.filter((m) => m.score >= 600);
  const pool = good.length >= 3 ? good : all;
  const start = (round * 3) % Math.max(pool.length, 1);
  const page = pool.slice(start, start + 3);
  return page.length === 3 ? page : [...page, ...pool.slice(0, 3 - page.length)];
}

export function parseAnswers(search: string): Answers {
  const p = new URLSearchParams(search);
  const g = p.get("g") as Goal | null;
  const t = p.get("t") as Time | null;
  const o = p.get("o") as Output | null;
  return {
    g: g && VALID.g.includes(g) ? g : null,
    t: t && VALID.t.includes(t) ? t : null,
    o: o && VALID.o.includes(o) ? o : null,
  };
}

export function buildQuery(a: Answers): string {
  const p = new URLSearchParams();
  if (a.g) p.set("g", a.g);
  if (a.t) p.set("t", a.t);
  if (a.o) p.set("o", a.o);
  const s = p.toString();
  return s ? `?${s}` : "";
}
