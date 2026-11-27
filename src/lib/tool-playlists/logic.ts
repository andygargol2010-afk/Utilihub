import { GAMES, gamePath, gameName } from "@/lib/games/catalog";
import { SIMULATORS, simPath, simName } from "@/lib/simulators/catalog";
import { TARGETS, type Target } from "@/lib/tool-matchmaker/targets";
import { PLAYLISTS, type Playlist } from "./playlists";

export type Locale = "en" | "es";

export type ResolvedStep = { target: string; name: string; path: string; why: string };
export type ResolvedPlaylist = { id: string; emoji: string; title: string; goal: string; steps: ResolvedStep[] };

function resolveTarget(t: Target, locale: Locale): { name: string; path: string } | null {
  if (t.kind === "game") {
    const g = GAMES.find((x) => x.slug === t.slug);
    return g ? { name: gameName(g, locale), path: gamePath(g, locale) } : null;
  }
  if (t.kind === "sim") {
    const s = SIMULATORS.find((x) => x.slug === t.slug);
    return s ? { name: simName(s, locale), path: simPath(s, locale) } : null;
  }
  const name = locale === "es" ? t.nameEs : t.nameEn;
  const path = locale === "es" ? t.pathEs : t.pathEn;
  return name && path ? { name, path } : null;
}

/** Steps whose target cannot be resolved are dropped; a playlist needs at least 2 steps left. */
export function resolvePlaylist(p: Playlist, locale: Locale): ResolvedPlaylist | null {
  const steps: ResolvedStep[] = [];
  for (const s of p.steps) {
    const t = TARGETS.find((x) => x.id === s.target);
    const r = t ? resolveTarget(t, locale) : null;
    if (r) steps.push({ target: s.target, name: r.name, path: r.path, why: locale === "es" ? s.whyEs : s.whyEn });
  }
  if (steps.length < 2) return null;
  return {
    id: p.id,
    emoji: p.emoji,
    title: locale === "es" ? p.titleEs : p.titleEn,
    goal: locale === "es" ? p.goalEs : p.goalEn,
    steps,
  };
}

export function resolveAll(locale: Locale): ResolvedPlaylist[] {
  return PLAYLISTS.map((p) => resolvePlaylist(p, locale)).filter((p): p is ResolvedPlaylist => p !== null);
}

export function findPlaylist(id: string | null, locale: Locale): ResolvedPlaylist | null {
  if (!id) return null;
  return resolveAll(locale).find((p) => p.id === id) ?? null;
}
