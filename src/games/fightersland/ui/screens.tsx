/**
 * Menu screens (DOM + PixelText). Each screen is a `.fl-screen` root; the stage moves focus to
 * its `data-fl-autofocus` item and routes keyboard / gamepad intents into it.
 */
import { useState } from "react";
import type { CharId, MapId, PlayerIndex, TutorialStepId } from "../core/types";
import { CHAR_IDS, CHAR_NAMES, MAP_IDS } from "../core/constants";
import { CHAR_RATINGS } from "../sim/index";
import { CHAR_ACCENT, getPreviewSprite } from "../render/fighters/index";
import type { Pick, UiState } from "../app/game";
import { controlNames, fill } from "../i18n";
import type { Strings } from "../i18n";
import { PixelText, useUiScale } from "./PixelText";
import { FighterPreview, MapThumb, Portrait, SpriteBox } from "./art";
import { FlButton, RatingBar, Toggle, fitTextSize, useApp, useStageSize } from "./components";

const GOLD = "#f5c84a";
const DIM = "#9a8fb8";

/** Usable text width in font px for wrapped paragraphs. */
function useWrap(maxFontPx: number, margin = 24): number {
  const ui = useUiScale();
  const { w } = useStageSize();
  return Math.max(80, Math.min(maxFontPx, Math.floor((w - margin * 2) / ui)));
}

// ---- title ---------------------------------------------------------------------------------

export function TitleScreen() {
  const app = useApp();
  const s = app.strings;
  const ui = useUiScale();
  const { w } = useStageSize();
  const logo = fitTextSize("FIGHTERSLAND", w * 0.88, ui, 3);
  const wrap = useWrap(260);
  return (
    <div className="fl-screen" data-screen="title">
      <div className="fl-logo">
        <PixelText text="FIGHTERSLAND" size={logo} color={GOLD} shadow="#5a1626" label="Fightersland" />
        <PixelText text={s.tagline} wrap={wrap} align="center" color="#e8dcc8" />
      </div>
      <div className="fl-menu">
        <FlButton label={s.play} onClick={() => app.play()} primary autoFocus size={1.5} />
        <FlButton label={s.controls} onClick={() => app.openSub("controls")} />
        <FlButton label={s.options} onClick={() => app.openSub("options")} />
      </div>
    </div>
  );
}

export function FirstVisitScreen() {
  const app = useApp();
  const s = app.strings.firstVisit;
  const wrap = useWrap(200);
  return (
    <div className="fl-screen" data-screen="firstVisit">
      <div className="fl-panel fl-col">
        <PixelText text={s.title} size={1.5} color={GOLD} />
        <PixelText text={s.text} wrap={wrap} align="center" />
        <div className="fl-menu">
          <FlButton label={s.start} onClick={() => app.startTutorialFlow()} primary autoFocus />
          <FlButton
            label={s.skip}
            back
            onClick={() => {
              app.updateSettings({ tutorialSeen: true });
              app.goto("mode");
            }}
          />
        </div>
      </div>
    </div>
  );
}

// ---- mode ----------------------------------------------------------------------------------

export function ModeScreen({ ui }: { ui: UiState }) {
  const app = useApp();
  const s = app.strings;
  const level = ui.settings.aiLevel;
  return (
    <div className="fl-screen" data-screen="mode">
      <PixelText text={s.mode.title} size={1.5} color={GOLD} />
      <div className="fl-menu">
        <FlButton label={`${s.mode.ai}. ${s.mode.aiDesc}`} onClick={() => app.chooseMode("ai")} primary autoFocus className="fl-mode-card">
          <PixelText text={s.mode.ai} size={1.5} />
          <PixelText text={s.mode.aiDesc} color="#f0d8dc" className="fl-mode-desc" />
        </FlButton>
        <div className="fl-row" role="radiogroup" aria-label={s.mode.difficulty}>
          <PixelText text={s.mode.difficulty} color={DIM} />
          <div className="fl-levels">
            {(["easy", "normal", "hard"] as const).map((l) => (
              <FlButton
                key={l}
                label={`${s.mode.difficulty}: ${s.levels[l]}`}
                text={s.levels[l]}
                small
                pressed={level === l}
                color={level === l ? GOLD : "#f4efe6"}
                onClick={() => app.updateSettings({ aiLevel: l })}
              />
            ))}
          </div>
        </div>
        <FlButton label={`${s.mode.versus}. ${s.mode.versusDesc}`} onClick={() => app.chooseMode("versus")} className="fl-mode-card">
          <PixelText text={s.mode.versus} size={1.5} />
          <PixelText text={s.mode.versusDesc} color={DIM} className="fl-mode-desc" />
        </FlButton>
        <FlButton label={`${s.online.title}. ${s.online.desc}`} onClick={() => app.openOnline()} className="fl-mode-card">
          <PixelText text={s.online.title} size={1.5} />
          <PixelText text={s.online.desc} color={DIM} className="fl-mode-desc" />
        </FlButton>
        <FlButton label={`${s.mode.tutorial}. ${s.mode.tutorialDesc}`} onClick={() => app.chooseMode("tutorial")} className="fl-mode-card">
          <PixelText text={s.mode.tutorial} size={1.5} />
          <PixelText text={s.mode.tutorialDesc} color={DIM} className="fl-mode-desc" />
        </FlButton>
        <FlButton label={s.back} back onClick={() => app.goto("title")} small />
      </div>
    </div>
  );
}

// ---- character select ------------------------------------------------------------------------

function slotLabel(s: Strings, ui: UiState, slot: PlayerIndex): string {
  if (slot === 0) return s.select.player1;
  if (ui.mode === "ai") return s.select.cpu;
  return s.select.player2;
}

function CharInfo({ pick, s, wrap, compact }: { pick: Pick; s: Strings; wrap: number; compact: boolean }) {
  if (pick === "random") {
    return (
      <div className="fl-select-info">
        <PixelText text={s.select.random} size={1.5} color={GOLD} />
        <PixelText text={s.select.randomText} wrap={wrap} />
      </div>
    );
  }
  const r = CHAR_RATINGS[pick];
  const accent = CHAR_ACCENT[pick];
  const t = s.chars[pick];
  const rows: [string, number][] = [
    [s.select.power, r.power],
    [s.select.speed, r.speed],
    [s.select.reach, r.reach],
    [s.select.health, r.health],
  ];
  return (
    <div className="fl-select-info">
      <PixelText text={CHAR_NAMES[pick]} size={1.5} color={accent} />
      {compact ? null : <PixelText text={t.title} color={DIM} />}
      <PixelText text={t.tagline} wrap={wrap} />
      <div className={compact ? "fl-bars fl-bars-2" : "fl-bars"} role="list">
        {rows.map(([name, v]) => (
          <div key={name} role="listitem" aria-label={`${name} ${v}/5`} style={{ display: "contents" }}>
            <PixelText text={name} color={DIM} />
            <RatingBar value={v} color={accent} />
          </div>
        ))}
      </div>
    </div>
  );
}

function RandomPreview({ size, flip }: { size: number; flip: boolean }) {
  return (
    <SpriteBox
      sprite={(t) => getPreviewSprite(CHAR_IDS[Math.floor(t / 20) % CHAR_IDS.length] ?? "asagiri", "idle", t)}
      w={140}
      h={106}
      gx={54}
      gy={103}
      flip={flip}
      size={size}
      every={1}
      style={{ filter: "brightness(0) opacity(.55)" }}
    />
  );
}

export function SelectScreen({ ui }: { ui: UiState }) {
  const app = useApp();
  const s = app.strings;
  const uiScale = useUiScale();
  const { w, h } = useStageSize();
  const slot = ui.slot;
  const initial: Pick = slot === 0 || ui.online ? ui.settings.lastChar : ui.picks[0] ?? "asagiri";
  const [hover, setHover] = useState<Pick>(initial);
  const narrow = w < h * 1.15;
  const lowH = h / uiScale < 190;
  const previewSize = lowH ? 0.5 : 1;
  const wrap = narrow ? Math.max(90, Math.floor((w - 40) / uiScale)) : Math.min(170, Math.floor((w * 0.5) / uiScale));
  const p0 = ui.picks[0];
  const tiles: Pick[] = [...CHAR_IDS, "random"];
  const accent = hover === "random" ? GOLD : CHAR_ACCENT[hover];
  const title = ui.mode === "tutorial" || ui.online ? s.select.title : `${s.select.title} - ${slotLabel(s, ui, slot)}`;

  const preview = (
    <div className="fl-preview">
      {slot === 1 && p0 ? (
        p0 === "random" ? (
          <RandomPreview size={previewSize} flip={false} />
        ) : (
          <FighterPreview char={p0} pose="idle" size={previewSize} />
        )
      ) : null}
      <div className="fl-preview-stage">
        {hover === "random" ? (
          <RandomPreview size={previewSize} flip={slot === 1} />
        ) : (
          <FighterPreview char={hover} pose="attack" flip={slot === 1} size={previewSize} />
        )}
      </div>
    </div>
  );

  return (
    <div className="fl-screen" data-screen="select" data-slot={slot}>
      <div className="fl-row">
        {lowH ? <FlButton label={s.back} back small onClick={() => app.unpick()} /> : null}
        <PixelText text={title} size={fitTextSize(title, w - (lowH ? 140 : 24), uiScale, lowH ? 1 : 1.5)} color={slot === 0 ? "#e0434c" : "#4aa0e0"} />
      </div>
      <div className={narrow ? "fl-select fl-select-portrait" : "fl-select"}>
        {preview}
        <CharInfo pick={hover} s={s} wrap={wrap} compact={lowH} />
      </div>
      <div className={narrow ? "fl-grid fl-grid-3" : "fl-grid"} role="listbox" aria-label={title}>
        {tiles.map((c) => {
          const name = c === "random" ? s.select.random : CHAR_NAMES[c];
          const sel = hover === c;
          return (
            <FlButton
              key={c}
              label={c === "random" ? s.select.random : `${name}. ${s.chars[c].tagline}`}
              onClick={() => app.pick(c)}
              autoFocus={c === initial}
              className={sel ? "fl-tile fl-tile-sel" : "fl-tile"}
              style={{ ["--tile-accent" as string]: c === "random" ? GOLD : CHAR_ACCENT[c] }}
              onFocusItem={() => setHover(c)}
            >
              {c === "random" ? (
                <span className="fl-q">
                  <PixelText text="?" size={1.5} color={GOLD} />
                </span>
              ) : (
                <Portrait char={c} />
              )}
            </FlButton>
          );
        })}
      </div>
      {lowH ? null : (
        <div className="fl-row">
          <FlButton label={s.back} back small onClick={() => app.unpick()} />
          <PixelText text={`${s.select.pick}: ${hover === "random" ? s.select.random : CHAR_NAMES[hover]}`} color={accent} />
        </div>
      )}
    </div>
  );
}

// ---- map select ----------------------------------------------------------------------------

export function MapScreen({ ui }: { ui: UiState }) {
  const app = useApp();
  const s = app.strings;
  const uiScale = useUiScale();
  const { w, h } = useStageSize();
  const thumbSize = h / uiScale < 200 || w / uiScale < 260 ? 0.75 : 1;
  const tw = 112;
  const th = 63;
  return (
    <div className="fl-screen" data-screen="map">
      <PixelText text={s.map.title} size={1.5} color={GOLD} />
      <div className="fl-maps">
        {MAP_IDS.map((m: MapId) => (
          <FlButton key={m} label={`${s.map.names[m]}. ${s.map.descs[m]}`} onClick={() => app.pickMap(m)} autoFocus={m === ui.settings.lastMap} className="fl-map-btn">
            <MapThumb map={m} w={tw} h={th} size={thumbSize} />
            <PixelText text={s.map.names[m]} />
          </FlButton>
        ))}
      </div>
      <div className="fl-row">
        <FlButton label={s.back} back small onClick={() => app.goto("select")} />
        <FlButton label={s.map.random} small onClick={() => app.pickMap("random")} />
      </div>
    </div>
  );
}

// ---- options / controls ---------------------------------------------------------------------

export function SettingsList({ ui }: { ui: UiState }) {
  const app = useApp();
  const s = app.strings;
  return (
    <>
      <Toggle label={s.sound} value={ui.settings.sound} onText={s.on} offText={s.off} onChange={(v) => app.updateSettings({ sound: v })} />
      <Toggle label={s.music} value={ui.settings.music} onText={s.on} offText={s.off} onChange={(v) => app.updateSettings({ music: v })} />
      <Toggle
        label={s.reducedFlash}
        value={ui.settings.reducedFlash}
        onText={s.on}
        offText={s.off}
        onChange={(v) => app.updateSettings({ reducedFlash: v })}
      />
    </>
  );
}

export function OptionsScreen({ ui }: { ui: UiState }) {
  const app = useApp();
  const s = app.strings;
  return (
    <div className="fl-screen" data-screen="options">
      <PixelText text={s.options} size={1.5} color={GOLD} />
      <div className="fl-menu">
        <SettingsList ui={ui} />
        <FlButton label={s.back} back autoFocus onClick={() => app.closeSub()} />
      </div>
    </div>
  );
}

export function ControlsTable() {
  const app = useApp();
  const s = app.strings;
  const c = s.controlsScreen;
  const ui = useUiScale();
  const { w } = useStageSize();
  const wrap = Math.max(90, Math.min(240, Math.floor((w - 48) / ui)));
  const rows: [string, string, string][] = [
    [c.move, "A / D", "← / →"],
    [c.jump, "W", "↑"],
    [c.block, "S", "↓"],
    [c.light, "F", "J / 1"],
    [c.medium, "G", "K / 2"],
    [c.heavy, "H", "L / 3"],
    [c.dodge, "E", "U / 0"],
    [c.pause, "ESC / P", "ESC / P"],
  ];
  const pad = controlNames("pad", s);
  const touch = controlNames("touch", s);
  return (
    <div className="fl-col">
      <div className="fl-controls-table" role="table" aria-label={c.title}>
        <PixelText text={c.keyboard} color={DIM} />
        <PixelText text={c.p1} color="#e0434c" />
        <PixelText text={c.p2} color="#4aa0e0" />
        {rows.map(([a, k1, k2]) => (
          <div key={a} role="row" aria-label={`${a}: ${k1}, ${k2}`} style={{ display: "contents" }}>
            <PixelText text={a} />
            <PixelText text={k1} color={GOLD} />
            <PixelText text={k2} color={GOLD} />
          </div>
        ))}
      </div>
      <PixelText
        text={`${c.gamepad}: ${c.light} ${pad["light"] ?? ""}, ${c.medium} ${pad["medium"] ?? ""}, ${c.heavy} ${pad["heavy"] ?? ""}, ${c.jump} ${pad["jump"] ?? ""}, ${c.block} ${pad["block"] ?? ""}, ${c.dodge} ${pad["dodge"] ?? ""}`}
        wrap={wrap}
        align="center"
        color={DIM}
      />
      <PixelText
        text={`${c.touch}: ${touch["move"] ?? ""} ${touch["jump"] ?? ""}, L / M / H, ${touch["block"] ?? ""}, ${touch["dodge"] ?? ""}`}
        wrap={wrap}
        align="center"
        color={DIM}
      />
      {c.tips.map((t) => (
        <PixelText key={t} text={t} wrap={wrap} align="center" />
      ))}
    </div>
  );
}

export function ControlsScreen() {
  const app = useApp();
  const s = app.strings;
  return (
    <div className="fl-screen fl-screen-top" data-screen="controls">
      <div className="fl-row">
        <FlButton label={s.back} back autoFocus small onClick={() => app.closeSub()} />
        <PixelText text={s.controlsScreen.title} size={1.5} color={GOLD} />
      </div>
      <ControlsTable />
    </div>
  );
}

// ---- fight overlays ------------------------------------------------------------------------

export function PauseScreen({ ui }: { ui: UiState }) {
  const app = useApp();
  const s = app.strings;
  if (ui.pauseView === "controls") {
    return (
      <div className="fl-screen fl-screen-top" data-screen="pause-controls">
        <div className="fl-row">
          <FlButton label={s.back} back autoFocus small onClick={() => app.setPauseView("main")} />
          <PixelText text={s.controlsScreen.title} size={1.5} color={GOLD} />
        </div>
        <ControlsTable />
      </div>
    );
  }
  if (ui.online) {
    // an online match cannot be paused: this is only the leave confirmation
    return (
      <div className="fl-screen" data-screen="pause" data-online="1">
        <PixelText text={s.online.leaveAsk} size={1.5} color={GOLD} />
        <div className="fl-menu fl-pause">
          <FlButton label={s.online.keepFighting} primary autoFocus back silent onClick={() => app.resume()} />
          <SettingsList ui={ui} />
          <FlButton label={s.online.leave} onClick={() => app.leaveOnline()} />
        </div>
      </div>
    );
  }
  return (
    <div className="fl-screen" data-screen="pause">
      <PixelText text={s.paused.title} size={1.5} color={GOLD} />
      <div className="fl-menu fl-pause">
        <FlButton label={s.paused.resume} primary autoFocus back silent onClick={() => app.resume()} />
        <FlButton label={s.controls} onClick={() => app.setPauseView("controls")} />
        <SettingsList ui={ui} />
        {ui.mode === "tutorial" ? (
          <FlButton label={s.tutorial.skip} onClick={() => app.skipTutorial()} />
        ) : (
          <FlButton label={s.paused.restart} onClick={() => app.restartFight()} />
        )}
        <FlButton label={s.paused.quit} onClick={() => app.toMenu()} />
      </div>
    </div>
  );
}

export function ResultScreen({ ui }: { ui: UiState }) {
  const app = useApp();
  const s = app.strings;
  const r = ui.result;
  const uiScale = useUiScale();
  const { w } = useStageSize();
  if (!r) return null;
  const winnerChar = r.chars[r.winner];
  const name = CHAR_NAMES[winnerChar];
  const headline = `${name} ${s.result.wins}`;
  let sub: string;
  const o = ui.online;
  const lost = o ? r.winner !== o.local : r.mode === "ai" && r.winner === 1;
  if (o) sub = lost ? s.result.defeat : s.result.victory;
  else if (r.mode === "ai") sub = r.winner === 0 ? s.result.victory : s.result.defeat;
  else sub = r.winner === 0 ? s.select.player1 : s.select.player2;
  return (
    <div className="fl-screen" data-screen="result">
      <div className="fl-result-card">
        <PixelText text={sub} size={1.5} color={lost ? DIM : GOLD} />
        <PixelText text={headline} size={fitTextSize(headline, w - 24, uiScale, 2)} color={CHAR_ACCENT[winnerChar]} label={headline} />
        <PixelText text={`${s.result.rounds} ${r.wins[0]} - ${r.wins[1]}`} color={DIM} />
      </div>
      {o ? (
        <>
          <div role="status" data-fl-rematch={`${o.rematchMe ? 1 : 0}${o.rematchRival ? 1 : 0}`} className={o.rematchMe || o.rematchRival ? "fl-blink" : undefined}>
            <PixelText
              text={o.starting ? s.online.getReady : o.rematchMe ? s.online.rematchWait : o.rematchRival ? s.online.rematchAsk : " "}
              color={GOLD}
            />
          </div>
          <div className="fl-menu">
            <FlButton label={s.result.rematch} primary autoFocus disabled={o.rematchMe || o.starting} onClick={() => app.rematch()} />
            <FlButton label={s.online.leaveRoom} back onClick={() => app.leaveOnline()} />
          </div>
        </>
      ) : (
        <div className="fl-menu">
          <FlButton label={s.result.rematch} primary autoFocus onClick={() => app.rematch()} />
          <FlButton label={s.result.change} onClick={() => app.changeFighters()} />
          <FlButton label={s.result.menu} back onClick={() => app.toMenu()} />
        </div>
      )}
    </div>
  );
}

export function TutorialDoneScreen() {
  const app = useApp();
  const s = app.strings.tutorial;
  const wrap = useWrap(220);
  return (
    <div className="fl-screen" data-screen="tutorialDone">
      <div className="fl-panel fl-col">
        <PixelText text={s.done} size={1.5} color={GOLD} />
        <PixelText text={s.doneText} wrap={wrap} align="center" />
        <div className="fl-menu">
          <FlButton label={s.fightCpu} primary autoFocus onClick={() => app.tutorialToCpu()} />
          <FlButton label={s.menu} back onClick={() => app.toMenu()} />
        </div>
      </div>
    </div>
  );
}

/** Lesson card shown over the canvas during the tutorial. */
export function TutorialCard({ ui, top, maxW }: { ui: UiState; top: number; maxW: number }) {
  const app = useApp();
  const s = app.strings;
  const uiScale = useUiScale();
  const t = ui.tutorial;
  if (!t || t.index >= t.total) return null;
  const steps: readonly TutorialStepId[] = ["move", "jump", "light", "medium", "heavy", "charge", "block", "dodge", "combo", "free"];
  const id = steps[t.index] ?? "free";
  const st = s.tutorial.steps[id];
  const names = controlNames(ui.device, s);
  const quoted: Record<string, string> = {};
  for (const k of Object.keys(names)) quoted[k] = `"${names[k] ?? ""}"`;
  const text = fill(st.text, quoted);
  const head = `${s.tutorial.step} ${t.index + 1}/${t.total} - ${st.title}`;
  const wrap = Math.max(90, Math.floor((maxW - 16) / uiScale));
  return (
    <div className="fl-tut" style={{ top: `${top}px` }} role="status" aria-live="polite" aria-label={`${head}. ${text}`}>
      <PixelText text={head} color={GOLD} />
      <PixelText text={text} wrap={wrap} align="center" />
      <div className="fl-progress" aria-hidden="true">
        <i style={{ width: `${Math.round(t.progress * 100)}%` }} />
      </div>
    </div>
  );
}
