"use client";
// Part 2 of 3 — split from ReturnStreakBoard.tsx on 2026-11-04. Edit here; ReturnStreakBoard.tsx re-exports.
import { PLAYGROUNDS } from "@/lib/playgrounds/next-step";
import { STORAGE_KEY } from "./ReturnStreakBoard.part1";

export type StreakData = {
  lastVisit: number;
  streak: number;
  longestStreak: number;
  totalVisits: number;
  visits: Record<string, number>; // id -> last timestamp
  visitDates: string[]; // YYYY-MM-DD, recent days
};

export const POPULAR = PLAYGROUNDS.slice(0, 10);

export const MILESTONES = [3, 7, 14, 30] as const;

export function todayKey(): string {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

export function loadData(): StreakData {
  if (typeof window === "undefined")
    return { lastVisit: 0, streak: 0, longestStreak: 0, totalVisits: 0, visits: {}, visitDates: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { lastVisit: 0, streak: 0, longestStreak: 0, totalVisits: 0, visits: {}, visitDates: [] };
    const parsed = JSON.parse(raw);
    return {
      lastVisit: parsed.lastVisit ?? 0,
      streak: parsed.streak ?? 0,
      longestStreak: parsed.longestStreak ?? parsed.streak ?? 0,
      totalVisits: parsed.totalVisits ?? 0,
      visits: parsed.visits ?? {},
      visitDates: Array.isArray(parsed.visitDates) ? parsed.visitDates : [],
    };
  } catch {
    return { lastVisit: 0, streak: 0, longestStreak: 0, totalVisits: 0, visits: {}, visitDates: [] };
  }
}

export function saveData(data: StreakData) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

export function isSameDay(a: number, b: number) {
  const da = new Date(a);
  const db = new Date(b);
  return da.getFullYear() === db.getFullYear() && da.getMonth() === db.getMonth() && da.getDate() === db.getDate();
}

export function daysBetween(a: number, b: number) {
  return Math.floor(Math.abs(a - b) / 86400000);
}

export function nextMilestone(streak: number): number | null {
  for (const m of MILESTONES) {
    if (streak < m) return m;
  }
  return null;
}

export function getWeekDays(): Date[] {
  const days: Date[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(d);
  }
  return days;
}
