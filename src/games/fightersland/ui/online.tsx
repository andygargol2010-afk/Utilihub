/**
 * Online 1v1 screens: create / join menu, the host's waiting room with the code, the code
 * entry, and the connected room (host-editable rules, both picks). They render from
 * `ui.online`; all the networking lives in the GameApp.
 */
import { useState } from "react";
import type { KeyboardEvent } from "react";
import { CHAR_NAMES } from "../core/constants";
import type { PlayerIndex } from "../core/types";
import type { OnlineNotice, OnlineUi, UiState } from "../app/game";
import type { Strings } from "../i18n";
import { ROOM_CODE_LEN, ROOM_MAPS, ROOM_MULS, ROOM_ROUNDS, ROOM_TIMES, cleanRoomCode, isRoomCode } from "../net/protocol";
import type { RoomSettings } from "../net/protocol";
import { CHAR_ACCENT } from "../render/fighters/index";
import { applyIntent } from "./nav";
import { PixelText, useUiScale } from "./PixelText";
import { FlButton, fitTextSize, useApp, useStageSize } from "./components";

const GOLD = "#f5c84a";
const DIM = "#9a8fb8";
const RED = "#ff8a8f";
const P_COLORS = ["#e0434c", "#4aa0e0"] as const;

function noticeText(s: Strings, n: OnlineNotice): string {
  switch (n) {
    case "notFound":
      return s.online.notFound;
    case "failed":
      return s.online.failed;
    case "timeout":
      return s.online.timeout;
    case "disconnected":
      return s.online.disconnected;
    case "desync":
      return s.online.desync;
    case "rivalLeft":
      return s.online.rivalLeft;
  }
}

function useWrap(maxFontPx: number): number {
  const ui = useUiScale();
  const { w } = useStageSize();
  return Math.max(80, Math.min(maxFontPx, Math.floor((w - 48) / ui)));
}

function Notice({ notice }: { notice: OnlineNotice | null }) {
  const app = useApp();
  const wrap = useWrap(240);
  if (!notice) return null;
  const text = noticeText(app.strings, notice);
  return (
    <div role="alert" data-fl-notice={notice}>
      <PixelText text={text} wrap={wrap} align="center" color={RED} />
    </div>
  );
}

/** The page URL with `?room=CODE`, which opens the game straight into joining the room. */
function roomLink(code: string): string {
  try {
    const u = new URL(window.location.href);
    u.searchParams.set("room", code);
    u.hash = "";
    return u.toString();
  } catch {
    return "";
  }
}

function OnlineMenu({ o }: { o: OnlineUi }) {
  const app = useApp();
  const s = app.strings;
  const wrap = useWrap(240);
  return (
    <div className="fl-screen" data-screen="online" data-view="menu">
      <PixelText text={s.online.title} size={1.5} color={GOLD} />
      <PixelText text={s.online.desc} wrap={wrap} align="center" color={DIM} />
      <Notice notice={o.notice} />
      <div className="fl-menu">
        <FlButton label={s.online.create} primary autoFocus onClick={() => app.hostOnline()} />
        <FlButton label={s.online.join} onClick={() => app.joinOnline()} />
        <FlButton label={s.back} back small onClick={() => app.leaveOnline()} />
      </div>
    </div>
  );
}

function HostWaiting({ o }: { o: OnlineUi }) {
  const app = useApp();
  const s = app.strings;
  const uiScale = useUiScale();
  const { w } = useStageSize();
  const wrap = useWrap(240);
  const [copied, setCopied] = useState(false);
  const [manual, setManual] = useState("");
  const canShare = typeof navigator !== "undefined" && typeof navigator.share === "function";
  const ready = o.status === "waiting";
  const spaced = o.code.split("").join(" ");

  const copy = (): void => {
    const link = roomLink(o.code);
    const fallback = (): void => setManual(link);
    try {
      const p = navigator.clipboard?.writeText(link);
      if (!p) fallback();
      else p.then(() => setCopied(true), fallback);
    } catch {
      fallback();
    }
  };
  const share = (): void => {
    try {
      navigator.share({ title: "Fightersland", url: roomLink(o.code) }).catch(() => undefined);
    } catch {
      copy();
    }
  };

  return (
    <div className="fl-screen" data-screen="online" data-view="host">
      <PixelText text={s.online.roomCode} color={DIM} />
      {o.notice ? (
        <Notice notice={o.notice} />
      ) : (
        <div className="fl-code" data-fl-code={ready ? o.code : ""} aria-label={`${s.online.roomCode}: ${o.code}`}>
          <PixelText text={ready ? spaced : "- - - -"} size={fitTextSize(spaced, w - 48, uiScale, 4)} color={GOLD} shadow="#5a1626" />
        </div>
      )}
      {o.notice ? null : (
        <div role="status" className={ready ? "fl-blink" : undefined}>
          <PixelText text={ready ? s.online.waiting : s.online.creating} />
        </div>
      )}
      {ready ? <PixelText text={copied ? s.online.copied : s.online.shareHint} wrap={wrap} align="center" color={copied ? GOLD : DIM} /> : null}
      {manual ? (
        <input className="fl-link-input" readOnly value={manual} aria-label={s.online.copyLink} onFocus={(e) => e.currentTarget.select()} />
      ) : null}
      <div className="fl-menu">
        {o.notice ? <FlButton label={s.online.retry} primary autoFocus onClick={() => app.hostOnline()} /> : null}
        {ready ? <FlButton label={s.online.copyLink} primary autoFocus onClick={copy} /> : null}
        {ready && canShare ? <FlButton label={s.online.share} onClick={share} /> : null}
        <FlButton label={s.online.cancel} back small autoFocus={!ready && !o.notice} onClick={() => app.openOnline()} />
      </div>
    </div>
  );
}

function JoinRoom({ o }: { o: OnlineUi }) {
  const app = useApp();
  const s = app.strings;
  const uiScale = useUiScale();
  const { w } = useStageSize();
  const [code, setCode] = useState(o.code);
  const busy = o.status === "connecting";
  const valid = isRoomCode(code);
  const connect = (): void => {
    if (valid && !busy) app.joinOnline(code);
  };
  const onKey = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      e.preventDefault();
      connect();
    } else if (e.key === "Escape") {
      e.preventDefault();
      app.openOnline();
    } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      const root = e.currentTarget.closest<HTMLElement>(".fl-screen");
      if (root) {
        e.preventDefault();
        applyIntent(root, e.key === "ArrowDown" ? "down" : "up");
      }
    }
  };
  return (
    <div className="fl-screen" data-screen="online" data-view="join">
      <PixelText text={s.online.enterCode} size={fitTextSize(s.online.enterCode, w - 24, uiScale, 1.5)} color={GOLD} />
      <input
        className="fl-code-input"
        value={code}
        onChange={(e) => setCode(cleanRoomCode(e.target.value))}
        onKeyDown={onKey}
        disabled={busy}
        maxLength={ROOM_CODE_LEN + 4}
        size={ROOM_CODE_LEN}
        inputMode="text"
        autoCapitalize="characters"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        enterKeyHint="go"
        placeholder="····"
        aria-label={s.online.roomCode}
        data-fl-nav=""
        data-fl-autofocus=""
      />
      {busy ? (
        <div role="status" className="fl-blink">
          <PixelText text={s.online.connecting} />
        </div>
      ) : (
        <Notice notice={o.notice} />
      )}
      <div className="fl-menu">
        <FlButton label={o.notice && !busy ? s.online.retry : s.online.connect} primary disabled={!valid || busy} onClick={connect} />
        <FlButton label={busy ? s.online.cancel : s.back} back small onClick={() => (busy ? app.cancelJoin() : app.openOnline())} />
      </div>
    </div>
  );
}

function next<T>(list: readonly T[], cur: T): T {
  const j = (list.indexOf(cur) + 1) % list.length;
  // a list entry may itself be null (no time limit), so only fall back when out of range
  return j < list.length ? (list[j] as T) : cur;
}

function mulText(v: number): string {
  return `X${v}`;
}

interface Row {
  key: string;
  label: string;
  value: string;
  /** Player the row belongs to (tints the label). */
  who?: PlayerIndex;
  cycle(): Partial<RoomSettings>;
}

function settingRows(s: Strings, r: RoomSettings, local: PlayerIndex): Row[] {
  const t = s.online.settings;
  const who = (i: PlayerIndex): string => (i === local ? s.online.you : s.online.rival);
  const pair = (cur: [number, number], i: PlayerIndex, v: number): [number, number] => (i === 0 ? [v, cur[1]] : [cur[0], v]);
  const order: PlayerIndex[] = local === 0 ? [0, 1] : [1, 0];
  const rows: Row[] = [
    { key: "map", label: t.map, value: r.map === "random" ? s.map.random : s.map.names[r.map], cycle: () => ({ map: next(ROOM_MAPS, r.map) }) },
    {
      key: "time",
      label: t.time,
      value: r.roundSeconds === null ? "∞" : `${r.roundSeconds} ${t.seconds}`,
      cycle: () => ({ roundSeconds: next(ROOM_TIMES, r.roundSeconds) }),
    },
    { key: "rounds", label: t.rounds, value: String(r.roundsToWin), cycle: () => ({ roundsToWin: next(ROOM_ROUNDS, r.roundsToWin) }) },
    { key: "finisher", label: t.finisher, value: r.finisher ? s.on : s.off, cycle: () => ({ finisher: !r.finisher }) },
  ];
  for (const i of order) {
    rows.push({
      key: `hp${i}`,
      label: `${t.health} - ${who(i)}`,
      value: mulText(r.hpMul[i]),
      who: i,
      cycle: () => ({ hpMul: pair(r.hpMul, i, next(ROOM_MULS, r.hpMul[i])) }),
    });
  }
  for (const i of order) {
    rows.push({
      key: `dmg${i}`,
      label: `${t.damage} - ${who(i)}`,
      value: mulText(r.dmgMul[i]),
      who: i,
      cycle: () => ({ dmgMul: pair(r.dmgMul, i, next(ROOM_MULS, r.dmgMul[i])) }),
    });
  }
  return rows;
}

function Room({ o }: { o: OnlineUi }) {
  const app = useApp();
  const s = app.strings;
  const { w } = useStageSize();
  const uiScale = useUiScale();
  const wrap = useWrap(260);
  const host = o.role === "host";
  const rows = settingRows(s, o.settings, o.local);
  const rival: PlayerIndex = o.local === 0 ? 1 : 0;
  const cols = w / uiScale >= 330 ? "fl-room-grid fl-room-grid-2" : "fl-room-grid";
  return (
    <div className="fl-screen" data-screen="online" data-view="room" data-role={o.role ?? ""} data-starting={o.starting ? "1" : "0"}>
      <PixelText text={`${s.online.room} ${o.code}`} size={1.5} color={GOLD} />
      <div className="fl-row" role="status">
        <PixelText text={`${s.online.you}:`} color={P_COLORS[o.local]} />
        <span data-fl-pick="me">
          <PixelText text={o.myPick ? CHAR_NAMES[o.myPick] : "-"} color={o.myPick ? CHAR_ACCENT[o.myPick] : DIM} />
        </span>
        <PixelText text="/" color={DIM} />
        <PixelText text={`${s.online.rival}:`} color={P_COLORS[rival]} />
        <span data-fl-pick="rival">
          <PixelText text={o.rivalPick ? CHAR_NAMES[o.rivalPick] : s.online.choosing} color={o.rivalPick ? CHAR_ACCENT[o.rivalPick] : DIM} />
        </span>
      </div>
      <div className="fl-panel fl-col" aria-label={s.online.settings.title}>
        <PixelText text={s.online.settings.title} color={DIM} />
        <div className={cols} role={host ? "group" : "list"}>
          {rows.map((r) =>
            host ? (
              <FlButton
                key={r.key}
                label={`${r.label}: ${r.value}`}
                small
                className="fl-btn-row"
                disabled={o.starting}
                onClick={() => app.setRoomSettings(r.cycle())}
              >
                <PixelText text={r.label} {...(r.who !== undefined ? { color: P_COLORS[r.who] } : {})} />
                <PixelText text={r.value} color={GOLD} />
              </FlButton>
            ) : (
              <div key={r.key} className="fl-room-row" role="listitem" aria-label={`${r.label}: ${r.value}`} data-fl-setting={r.key} data-fl-value={r.value}>
                <PixelText text={r.label} {...(r.who !== undefined ? { color: P_COLORS[r.who] } : {})} />
                <PixelText text={r.value} color={GOLD} />
              </div>
            ),
          )}
        </div>
        {host ? null : <PixelText text={s.online.hostSets} color={DIM} wrap={wrap} align="center" />}
      </div>
      <div role="status" className={o.starting ? "fl-blink" : undefined}>
        <PixelText text={o.starting ? s.online.getReady : s.online.waitingPick} wrap={wrap} align="center" color={o.starting ? GOLD : DIM} />
      </div>
      <div className="fl-row">
        <FlButton label={s.online.leaveRoom} back small onClick={() => app.leaveOnline()} />
        <FlButton label={o.myPick ? s.online.change : s.online.choose} primary={!o.myPick} autoFocus disabled={o.starting} onClick={() => app.onlineChoose()} />
      </div>
    </div>
  );
}

export function OnlineScreen({ ui }: { ui: UiState }) {
  const o = ui.online;
  if (!o) return null;
  switch (o.view) {
    case "menu":
      return <OnlineMenu o={o} />;
    case "host":
      return <HostWaiting o={o} />;
    case "join":
      return <JoinRoom key={o.code} o={o} />;
    case "room":
      return <Room o={o} />;
  }
}

/** Small round-trip indicator shown over the fight. */
export function PingBadge({ rtt, top }: { rtt: number; top: number }) {
  const app = useApp();
  const color = rtt < 90 ? "#7fd98a" : rtt < 180 ? GOLD : RED;
  return (
    <div className="fl-ping" style={{ top: `${top}px` }} data-fl-ping={rtt} aria-hidden="true">
      <PixelText text={`${rtt} ${app.strings.online.ping}`} color={color} />
    </div>
  );
}
