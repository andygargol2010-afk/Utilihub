// Part 2 of 3 — split from TrafficSignalLab.tsx on 2026-11-04. Edit here; TrafficSignalLab.tsx re-exports.
import { SIZE } from "./TrafficSignalLab.part1";

export const CELL = 28;
export const W = SIZE * CELL;
export const H = SIZE * CELL;
export const CENTER = 5;

export type Dir = "N" | "S" | "E" | "W";
export type Car = { id: number; dir: Dir; pos: number; waiting: boolean; waitTime: number };
