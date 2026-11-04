"use client";
// Part 2 of 3 — split from DailyProgressConstellation.tsx on 2026-11-04. Edit here; DailyProgressConstellation.tsx re-exports.
import { STORAGE_KEY } from "./DailyProgressConstellation.part1";

export type Star = { x: number; y: number; lit: boolean; id: number; size?: number; litAt?: number };
export type ConstellationData = {
  stars: Star[];
  lastVisit: number;
  totalDays: number;
  name?: string;
};

export function loadData(): ConstellationData {
  if (typeof window === "undefined") return { stars: [], lastVisit: 0, totalDays: 0 };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { stars: [], lastVisit: 0, totalDays: 0 };
    return JSON.parse(raw);
  } catch {
    return { stars: [], lastVisit: 0, totalDays: 0 };
  }
}

export function saveData(data: ConstellationData) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

export function isSameDay(a: number, b: number) {
  const da = new Date(a);
  const db = new Date(b);
  return da.getFullYear() === db.getFullYear() && da.getMonth() === db.getMonth() && da.getDate() === db.getDate();
}

export function suggestName(days: number, es: boolean): string {
  if (days >= 21) return es ? "Constelación del Habitante" : "Habitant's Constellation";
  if (days >= 14) return es ? "Constelación del Viajero" : "Traveler's Constellation";
  if (days >= 7) return es ? "Constelación de la Semana" : "Week's Constellation";
  if (days >= 3) return es ? "Constelación Naciente" : "Rising Constellation";
  return es ? "Mi Constelación" : "My Constellation";
}

export function isMilestone(days: number): boolean {
  return [3, 7, 14, 21, 30].includes(days);
}
