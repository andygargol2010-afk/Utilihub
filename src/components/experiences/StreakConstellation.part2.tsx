"use client";
// Part 2 of 3 — split from StreakConstellation.tsx on 2026-11-04. Edit here; StreakConstellation.tsx re-exports.
import { STORAGE_KEY } from "./StreakConstellation.part1";

export type Star = { x: number; y: number; size: number; born: number; hue?: number };
export type Data = { stars: Star[]; streak: number; lastCheckIn: number; name?: string };

export function load(): Data {
  if (typeof window === "undefined") return { stars: [], streak: 0, lastCheckIn: 0 };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { stars: [], streak: 0, lastCheckIn: 0 };
  } catch {
    return { stars: [], streak: 0, lastCheckIn: 0 };
  }
}

export function save(d: Data) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); } catch {}
}

export function sameDay(a: number, b: number) {
  const da = new Date(a), db = new Date(b);
  return da.getFullYear() === db.getFullYear() && da.getMonth() === db.getMonth() && da.getDate() === db.getDate();
}

export function parseQuery(): Partial<Data> | null {
  if (typeof window === "undefined") return null;
  const p = new URLSearchParams(window.location.search);
  const s = p.get("stars");
  const st = p.get("streak");
  const n = p.get("name");
  if (!s && !st && !n) return null;
  const stars: Star[] = [];
  if (s) {
    s.split(";").forEach((pair) => {
      const [x, y] = pair.split(",").map(Number);
      if (!isNaN(x) && !isNaN(y)) stars.push({ x, y, size: 3 + Math.random() * 2, born: Date.now() });
    });
  }
  return { stars, streak: st ? Number(st) || 0 : stars.length, name: n || undefined };
}

export function toQuery(d: Data): string {
  const stars = d.stars.map((s) => `${s.x.toFixed(3)},${s.y.toFixed(3)}`).join(";");
  const name = d.name ? `&name=${encodeURIComponent(d.name)}` : "";
  return `?stars=${encodeURIComponent(stars)}&streak=${d.streak}${name}`;
}

export function milestoneColor(streak: number, i: number): string {
  if (streak >= 30) return `hsl(${(i * 37) % 360}, 85%, 62%)`;
  if (streak >= 14) return "#c084fc"; // purple
  if (streak >= 7) return "#fbbf24"; // gold
  return "#38bdf8"; // cyan
}

export function nextMilestone(streak: number): { target: number; remaining: number; progress: number; label: string } {
  const targets = [7, 14, 30];
  const next = targets.find(t => t > streak) || 30;
  const prev = targets.filter(t => t <= streak).pop() || 0;
  const span = next - prev;
  const done = streak - prev;
  const progress = Math.min(100, Math.max(0, (done / span) * 100));
  const remaining = Math.max(0, next - streak);
  return { target: next, remaining, progress, label: next === 30 && streak >= 30 ? "max" : `${next}` };
}
