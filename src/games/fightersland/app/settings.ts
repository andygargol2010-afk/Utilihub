/**
 * Persistent player settings (localStorage). Every access is guarded: storage can be missing,
 * full or blocked (private mode, embedded frames), and the game must work without it.
 */
import type { AiLevel, CharId, MapId, Settings } from "../core/types";
import { CHAR_IDS, MAP_IDS } from "../core/constants";

const KEY = "fightersland.settings.v1";

export function defaultSettings(): Settings {
  return {
    version: 1,
    sound: true,
    music: true,
    aiLevel: "normal",
    reducedFlash: false,
    tutorialSeen: false,
    lastChar: "asagiri",
    lastMap: "quay",
  };
}

function isLevel(v: unknown): v is AiLevel {
  return v === "easy" || v === "normal" || v === "hard";
}

function isChar(v: unknown): v is CharId {
  return typeof v === "string" && (CHAR_IDS as readonly string[]).includes(v);
}

function isMap(v: unknown): v is MapId {
  return typeof v === "string" && (MAP_IDS as readonly string[]).includes(v);
}

/** Read the stored settings, falling back to defaults field by field. Browser only. */
export function loadSettings(): Settings {
  const d = defaultSettings();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return d;
    const o: unknown = JSON.parse(raw);
    if (!o || typeof o !== "object") return d;
    const r = o as Record<string, unknown>;
    const sound = r["sound"];
    const music = r["music"];
    const aiLevel = r["aiLevel"];
    const reducedFlash = r["reducedFlash"];
    const tutorialSeen = r["tutorialSeen"];
    const lastChar = r["lastChar"];
    const lastMap = r["lastMap"];
    return {
      version: 1,
      sound: typeof sound === "boolean" ? sound : d.sound,
      music: typeof music === "boolean" ? music : d.music,
      aiLevel: isLevel(aiLevel) ? aiLevel : d.aiLevel,
      reducedFlash: typeof reducedFlash === "boolean" ? reducedFlash : d.reducedFlash,
      tutorialSeen: typeof tutorialSeen === "boolean" ? tutorialSeen : d.tutorialSeen,
      lastChar: isChar(lastChar) ? lastChar : d.lastChar,
      lastMap: isMap(lastMap) ? lastMap : d.lastMap,
    };
  } catch {
    return d;
  }
}

export function saveSettings(s: Settings): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    // storage unavailable: settings simply last for this visit
  }
}
