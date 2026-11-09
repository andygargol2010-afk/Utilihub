// Part 2 of 3 — split from HomeRenovationBoard.tsx on 2026-11-04. Edit here; HomeRenovationBoard.tsx re-exports.

export const STORAGE_KEY = "utilihub-kit-home-renovation";

export type Props = { locale?: "en" | "es" };

export type State = {
  length: number;
  width: number;
  height: number;
  floorPrice: number;
  paintPrice: number;
  coverage: number;
  wastePct: number;
  completed: string[];
  startDate: string;
  days: number;
  notes: string[];
  floorColor: string;
  wallColor: string;
  budget: number;
  bought: string[];
};

export const DEFAULT: State = {
  length: 4,
  width: 3.5,
  height: 2.5,
  floorPrice: 25,
  paintPrice: 12,
  coverage: 10,
  wastePct: 10,
  completed: [],
  startDate: new Date().toISOString().slice(0, 10),
  days: 14,
  notes: [],
  floorColor: "#a8a29e",
  wallColor: "#e7e5e4",
  budget: 1000,
  bought: [],
};
