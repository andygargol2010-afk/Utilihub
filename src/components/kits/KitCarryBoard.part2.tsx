// Part 2 of 3 — split from KitCarryBoard.tsx on 2026-11-04. Edit here; KitCarryBoard.tsx re-exports.
import { publicToolPath } from "@/lib/route-slugs";
import { kitBySlug } from "@/lib/work-kits";
import { kitTools } from "@/lib/work-kits-tools";
import { type KitBoardStep } from "./KitCarryBoard.part1";

export type KitCarryBoardProps = {
  kitSlug: string;
  steps: KitBoardStep[];
  locale?: "en" | "es";
};

export type StoredBoard = { note?: string; done?: string[] };
export type SlipPayload = { note: string; done: string[] };
export type SlipStatus = "idle" | "copied" | "pending" | "imported" | "kept" | "invalid";
export type PaceStatus = "idle" | "running" | "paused" | "done";

export const storageKey = (slug: string) => `utilihub-kit-board:${slug}`;
export const NOTE_LIMIT = 8000;
export const PACE_SECONDS = 25 * 60;

export function stepToolPath(kitSlug: string, stepSlug: string, locale: "en" | "es") {
  const kit = kitBySlug(kitSlug);
  const tool = kit ? kitTools(kit).find((item) => item.slug === stepSlug) : undefined;
  if (!tool) return locale === "es" ? `/es/herramientas/${stepSlug}` : `/tools/${stepSlug}`;
  return publicToolPath(tool, locale);
}

export function toBase64Url(text: string) {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export function fromBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function parseSlip(rawHash: string, allowed: string[]): SlipPayload | null {
  const hash = rawHash.startsWith("#") ? rawHash.slice(1) : rawHash;
  const params = new URLSearchParams(hash);
  const token = params.get("slip");
  if (!token) return null;
  try {
    const parsed = JSON.parse(fromBase64Url(token)) as { note?: unknown; done?: unknown };
    if (typeof parsed.note !== "string" || parsed.note.length > NOTE_LIMIT) return null;
    if (!Array.isArray(parsed.done) || parsed.done.some((item) => typeof item !== "string")) return null;
    const done = parsed.done.filter((item) => allowed.includes(item));
    return { note: parsed.note, done };
  } catch {
    return null;
  }
}

export function slipHashPresent(rawHash: string) {
  const hash = rawHash.startsWith("#") ? rawHash.slice(1) : rawHash;
  return new URLSearchParams(hash).has("slip");
}

export function clearSlipHash() {
  const url = new URL(window.location.href);
  url.hash = "";
  window.history.replaceState(null, "", `${url.pathname}${url.search}`);
}

export function formatPace(seconds: number) {
  const safe = Math.max(0, seconds);
  const minutes = Math.floor(safe / 60);
  const rest = safe % 60;
  return `${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
}
