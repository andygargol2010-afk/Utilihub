// Part 2 of 3 — split from CodeTypeRaceGame.tsx on 2026-11-04. Edit here; CodeTypeRaceGame.tsx re-exports.
import { type Lang } from "./CodeTypeRaceGame.part1";

export type Phase = "idle" | "running" | "done";

export type Snippet = { lang: Lang; id: string; code: string };

export const SNIPPETS: Snippet[] = [
  { lang: "js", id: "js-map", code: "const doubled = nums.map((n) => n * 2);" },
  { lang: "js", id: "js-filter", code: "const active = users.filter((u) => u.active);" },
  { lang: "js", id: "js-reduce", code: "const total = items.reduce((sum, item) => sum + item.price, 0);" },
  { lang: "js", id: "js-fetch", code: "const data = await fetch(url).then((r) => r.json());" },
  { lang: "js", id: "js-destruct", code: "const { id, name, email } = user;" },
  {
    lang: "js",
    id: "js-loop",
    code: "for (const item of list) {\n  if (!item) continue;\n  process(item);\n}",
  },
  {
    lang: "js",
    id: "js-class",
    code: "class Counter {\n  constructor() { this.n = 0; }\n  inc() { this.n += 1; }\n}",
  },
  { lang: "python", id: "py-comp", code: "squares = [n * n for n in range(10)]" },
  { lang: "python", id: "py-dict", code: "counts = {k: v for k, v in pairs}" },
  { lang: "python", id: "py-fstring", code: 'msg = f"Hello, {name}! You have {n} items."' },
  {
    lang: "python",
    id: "py-def",
    code: "def greet(name: str) -> str:\n    return f\"Hi, {name}\"",
  },
  {
    lang: "python",
    id: "py-with",
    code: "with open(path, \"r\", encoding=\"utf-8\") as f:\n    text = f.read()",
  },
  {
    lang: "python",
    id: "py-sort",
    code: "items.sort(key=lambda x: x[\"score\"], reverse=True)",
  },
];

export const HS_KEY = "utilihub-code-type-race-best-wpm";

export function pickSnippet(lang: Lang | "all", avoidId?: string): Snippet {
  const pool = SNIPPETS.filter((s) => (lang === "all" ? true : s.lang === lang) && s.id !== avoidId);
  const list = pool.length ? pool : SNIPPETS;
  return list[Math.floor(Math.random() * list.length)]!;
}

export function readBest(): number {
  try {
    const raw = localStorage.getItem(HS_KEY);
    const n = raw ? Number(raw) : 0;
    return Number.isFinite(n) && n > 0 ? n : 0;
  } catch {
    return 0;
  }
}

export function writeBest(wpm: number) {
  try {
    const prev = readBest();
    if (wpm > prev) localStorage.setItem(HS_KEY, String(Math.round(wpm)));
  } catch {
    /* ignore */
  }
}
