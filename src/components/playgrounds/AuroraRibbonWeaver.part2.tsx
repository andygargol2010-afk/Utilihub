"use client";
// Part 2 of 3 — split from AuroraRibbonWeaver.tsx on 2026-11-04. Edit here; AuroraRibbonWeaver.tsx re-exports.

export type Point = { x: number; y: number };
export type Path = { points: Point[]; hueBase: number };

export interface Particle {
  pathIndex: number;
  ribbonIndex: number;
  t: number;
  speed: number;
  size: number;
  hueOffset: number;
}

export const AURORA_HUES = [180, 200, 220, 260, 300, 320, 140, 160];
export const STORAGE_KEY = "utilihub_aurora_ribbon_weaver_v1";
