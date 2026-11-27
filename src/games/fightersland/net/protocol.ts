/**
 * Online wire protocol: compact JSON arrays over one ordered, reliable RTCDataChannel.
 * Everything received is validated (the other peer is untrusted input).
 */
import type { CharId, FightConfig, InputFrame, MapId } from "../core/types";
import { CHAR_IDS, MAP_IDS } from "../core/constants";
import { BUTTONS } from "../input/bindings";

/** Room rules chosen by the host. Index 0 of the per-player pairs is the host, 1 the guest. */
export interface RoomSettings {
  map: MapId | "random";
  hpMul: [number, number];
  dmgMul: [number, number];
  /** Seconds per round; null = no time limit. */
  roundSeconds: number | null;
  roundsToWin: number;
  finisher: boolean;
}

export const ROOM_MULS: readonly number[] = [0.5, 1, 2, 3];
export const ROOM_TIMES: readonly (number | null)[] = [30, 60, 120, null];
export const ROOM_ROUNDS: readonly number[] = [1, 2, 3];
export const ROOM_MAPS: readonly (MapId | "random")[] = [...MAP_IDS, "random"];

export function defaultRoomSettings(map: MapId | "random"): RoomSettings {
  return { map, hpMul: [1, 1], dmgMul: [1, 1], roundSeconds: 60, roundsToWin: 2, finisher: true };
}

export type NetMsg =
  | { t: "input"; frame: number; bits: number }
  | { t: "pick"; char: CharId }
  | { t: "settings"; settings: RoomSettings }
  /** `settings.map` is always a concrete arena here. */
  | { t: "start"; chars: [CharId, CharId]; map: MapId; seed: number; startInMs: number; settings: RoomSettings }
  /** `seed` names the match the hash belongs to (a late hash of the previous match is ignored). */
  | { t: "hash"; frame: number; hash: number; seed: number }
  | { t: "rematch" }
  | { t: "leave" }
  | { t: "ping"; id: number }
  | { t: "pong"; id: number };

export const ROOM_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export const ROOM_CODE_LEN = 4;

export function randomRoomCode(): string {
  let out = "";
  for (let i = 0; i < ROOM_CODE_LEN; i++) out += ROOM_ALPHABET[Math.floor(Math.random() * ROOM_ALPHABET.length)] ?? "A";
  return out;
}

/** Uppercase and drop everything that is not a room-code character (0/O/1/I never appear in codes). */
export function cleanRoomCode(raw: string): string {
  let out = "";
  for (const ch of raw.toUpperCase()) {
    if (ROOM_ALPHABET.includes(ch)) out += ch;
    if (out.length >= ROOM_CODE_LEN) break;
  }
  return out;
}

export function isRoomCode(code: string): boolean {
  return code.length === ROOM_CODE_LEN && cleanRoomCode(code) === code;
}

export function roomPeerId(code: string): string {
  return `fightersland-${code}`;
}

export function packInput(f: InputFrame): number {
  let bits = 0;
  for (let i = 0; i < BUTTONS.length; i++) {
    const b = BUTTONS[i];
    if (b && f[b]) bits |= 1 << i;
  }
  return bits;
}

export function unpackInput(bits: number, out: InputFrame): void {
  for (let i = 0; i < BUTTONS.length; i++) {
    const b = BUTTONS[i];
    if (b) out[b] = (bits & (1 << i)) !== 0;
  }
}

export function encodeMsg(m: NetMsg): string {
  switch (m.t) {
    case "input":
      return JSON.stringify(["i", m.frame, m.bits]);
    case "pick":
      return JSON.stringify(["k", m.char]);
    case "settings":
      return JSON.stringify(["g", ...packSettings(m.settings)]);
    case "start":
      return JSON.stringify(["s", m.chars[0], m.chars[1], m.map, m.seed, m.startInMs, ...packSettings({ ...m.settings, map: m.map })]);
    case "hash":
      return JSON.stringify(["h", m.frame, m.hash, m.seed]);
    case "rematch":
      return '["r"]';
    case "leave":
      return '["l"]';
    case "ping":
      return JSON.stringify(["p", m.id]);
    case "pong":
      return JSON.stringify(["q", m.id]);
  }
}

function packSettings(r: RoomSettings): (string | number)[] {
  return [r.map, r.hpMul[0], r.hpMul[1], r.dmgMul[0], r.dmgMul[1], r.roundSeconds ?? 0, r.roundsToWin, r.finisher ? 1 : 0];
}

/** Read the 8 values written by packSettings starting at `v[at]`; only the offered choices are accepted. */
function readSettings(v: unknown[], at: number): RoomSettings | null {
  const map = ROOM_MAPS.find((m) => m === v[at]);
  const mul = (x: unknown): number | null => ROOM_MULS.find((m) => m === x) ?? null;
  const h0 = mul(v[at + 1]);
  const h1 = mul(v[at + 2]);
  const d0 = mul(v[at + 3]);
  const d1 = mul(v[at + 4]);
  const secs = v[at + 5] === 0 ? null : ROOM_TIMES.find((t) => t !== null && t === v[at + 5]);
  const rounds = ROOM_ROUNDS.find((r) => r === v[at + 6]);
  const fin = v[at + 7];
  if (!map || h0 === null || h1 === null || d0 === null || d1 === null || secs === undefined || rounds === undefined) return null;
  if (fin !== 0 && fin !== 1) return null;
  return { map, hpMul: [h0, h1], dmgMul: [d0, d1], roundSeconds: secs, roundsToWin: rounds, finisher: fin === 1 };
}

function uint(v: unknown, max: number): number | null {
  return typeof v === "number" && Number.isInteger(v) && v >= 0 && v <= max ? v : null;
}

function charId(v: unknown): CharId | null {
  return CHAR_IDS.find((c) => c === v) ?? null;
}

function mapId(v: unknown): MapId | null {
  return MAP_IDS.find((m) => m === v) ?? null;
}

export function decodeMsg(raw: unknown): NetMsg | null {
  if (typeof raw !== "string" || raw.length > 256) return null;
  let a: unknown;
  try {
    a = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!Array.isArray(a)) return null;
  const v = a as unknown[];
  switch (v[0]) {
    case "i": {
      const frame = uint(v[1], 1e7);
      const bits = uint(v[2], 255);
      return frame === null || bits === null ? null : { t: "input", frame, bits };
    }
    case "k": {
      const char = charId(v[1]);
      return char ? { t: "pick", char } : null;
    }
    case "s": {
      const c0 = charId(v[1]);
      const c1 = charId(v[2]);
      const map = mapId(v[3]);
      const seed = uint(v[4], 0xffffffff);
      const startInMs = uint(v[5], 10000);
      const settings = readSettings(v, 6);
      if (!c0 || !c1 || !map || seed === null || startInMs === null || !settings || settings.map !== map) return null;
      return { t: "start", chars: [c0, c1], map, seed, startInMs, settings };
    }
    case "g": {
      const settings = readSettings(v, 1);
      return settings ? { t: "settings", settings } : null;
    }
    case "h": {
      const frame = uint(v[1], 1e7);
      const hash = uint(v[2], 0xffffffff);
      const seed = uint(v[3], 0xffffffff);
      return frame === null || hash === null || seed === null ? null : { t: "hash", frame, hash, seed };
    }
    case "r":
      return { t: "rematch" };
    case "l":
      return { t: "leave" };
    case "p":
    case "q": {
      const id = uint(v[1], 1e9);
      return id === null ? null : { t: v[0] === "p" ? "ping" : "pong", id };
    }
    default:
      return null;
  }
}

/** The FightConfig both peers build from the same `start` message. */
export function onlineFightConfig(m: Extract<NetMsg, { t: "start" }>): FightConfig {
  const r = m.settings;
  return {
    chars: [m.chars[0], m.chars[1]],
    map: m.map,
    mode: "online",
    aiLevel: "normal",
    seed: m.seed,
    roundsToWin: r.roundsToWin,
    rules: {
      hpMul: [r.hpMul[0], r.hpMul[1]],
      dmgMul: [r.dmgMul[0], r.dmgMul[1]],
      roundSeconds: r.roundSeconds,
      finisher: r.finisher,
    },
  };
}
