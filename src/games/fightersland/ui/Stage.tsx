/**
 * The near-fullscreen stage: a fixed layer under the site header holding the game canvas,
 * the menu screens, the fight overlays and the touch controls.
 */
import { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import type { CSSProperties } from "react";
import type { GameApp, UiState } from "../app/game";
import { computeLayout } from "../app/layout";
import type { StageLayout } from "../app/layout";
import { VIEW_H, VIEW_W } from "../core/constants";
import { TouchControls } from "../input/TouchControls";
import { applyIntent, focusDefault } from "./nav";
import { UiScaleContext } from "./PixelText";
import { AppContext, CornerButton, FlButton, StageSizeContext } from "./components";
import {
  ControlsScreen,
  FirstVisitScreen,
  MapScreen,
  ModeScreen,
  OptionsScreen,
  PauseScreen,
  ResultScreen,
  SelectScreen,
  TitleScreen,
  TutorialCard,
  TutorialDoneScreen,
} from "./screens";

function headerBottom(): number {
  const h = document.querySelector("header.site-header");
  if (!h) return 0;
  const r = h.getBoundingClientRect();
  return Math.max(0, Math.round(r.bottom));
}

function MenuScreen({ ui }: { ui: UiState }) {
  switch (ui.screen) {
    case "title":
      return <TitleScreen />;
    case "firstVisit":
      return <FirstVisitScreen />;
    case "mode":
      return <ModeScreen ui={ui} />;
    case "select":
      return <SelectScreen key={`${ui.mode}-${ui.slot}`} ui={ui} />;
    case "map":
      return <MapScreen ui={ui} />;
    case "options":
      return <OptionsScreen ui={ui} />;
    case "controls":
      return <ControlsScreen />;
    case "result":
      return <ResultScreen ui={ui} />;
    case "tutorialDone":
      return <TutorialDoneScreen />;
    case "fight":
      return ui.paused ? <PauseScreen ui={ui} /> : null;
  }
}

export function Stage({ app, onExit }: { app: GameApp; onExit: () => void }) {
  const ui = useSyncExternalStore(app.subscribe, app.getUi, app.getUi);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const screenRef = useRef<HTMLDivElement | null>(null);
  const [top, setTop] = useState(0);
  const [size, setSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });

  // measure the header and the stage
  useLayoutEffect(() => {
    const measure = (): void => {
      // Short viewports (phones in landscape): the stage covers the site header too, so the
      // whole screen is available; the exit button brings the page back.
      const t = window.innerHeight < 480 ? 0 : headerBottom();
      setTop(t);
      setSize({ w: window.innerWidth, h: Math.max(1, window.innerHeight - t) });
    };
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("orientationchange", measure);
    const header = document.querySelector("header.site-header");
    let ro: ResizeObserver | null = null;
    if (header && typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(measure);
      ro.observe(header);
    }
    const vv = window.visualViewport;
    vv?.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("orientationchange", measure);
      vv?.removeEventListener("resize", measure);
      ro?.disconnect();
    };
  }, []);

  // open / close the game loop with the stage
  useEffect(() => {
    app.open();
    stageRef.current?.focus({ preventScroll: true });
    return () => app.close();
  }, [app]);

  const canvasRef = useCallback((c: HTMLCanvasElement | null) => app.attachCanvas(c), [app]);

  // keyboard / gamepad menu navigation inside the active screen
  useEffect(() => {
    app.setMenuHandler((intent) => {
      const root = screenRef.current?.querySelector<HTMLElement>(".fl-screen") ?? null;
      if (!root) return;
      const r = applyIntent(root, intent);
      if (r === "moved") app.sfx("move");
    });
    return () => app.setMenuHandler(null);
  }, [app]);

  // focus the default item whenever the visible screen changes
  const screenKey = `${ui.screen}|${ui.paused ? "p" : ""}|${ui.pauseView}|${ui.slot}|${ui.mode}`;
  useEffect(() => {
    const root = screenRef.current?.querySelector<HTMLElement>(".fl-screen");
    if (root) focusDefault(root, true);
    else stageRef.current?.focus({ preventScroll: true });
  }, [screenKey]);

  const inFightLayout = ui.screen === "fight" || ui.screen === "result" || ui.screen === "tutorialDone";
  const fightActive = ui.screen === "fight" && !ui.paused;
  const L: StageLayout = computeLayout(size.w, size.h, ui.touch, inFightLayout);
  const s = app.strings;

  const canvasStyle: CSSProperties = { left: `${L.cx}px`, top: `${L.cy}px`, width: `${L.cw}px`, height: `${L.ch}px` };
  const stageStyle = { ["--fl-top" as string]: `${top}px`, ["--fl-z" as string]: top === 0 ? "60" : "40", ["--u" as string]: `${L.ui}px` } as CSSProperties;
  const showTouch = fightActive && L.controls !== "none";
  const menuVisible = !fightActive;
  // overlays sit within the canvas rectangle, below the HUD band
  const hudBottom = L.cy + Math.round(36 * L.scale);

  return (
    <AppContext.Provider value={app}>
      <UiScaleContext.Provider value={L.ui}>
        <StageSizeContext.Provider value={{ w: size.w, h: size.h - L.barH }}>
          <div
            ref={stageRef}
            className={size.h - L.barH < L.ui * 190 ? "fl-root fl-stage fl-compact" : "fl-root fl-stage"}
            style={stageStyle}
            tabIndex={-1}
            role="application"
            aria-label="Fightersland"
            data-screen={ui.screen}
            data-paused={ui.paused ? "1" : "0"}
            onContextMenu={(e) => e.preventDefault()}
          >
            <canvas ref={canvasRef} className="fl-canvas" width={VIEW_W} height={VIEW_H} style={canvasStyle} aria-hidden="true" />
            {menuVisible ? <div className={inFightLayout ? "fl-dim fl-dim-fight" : "fl-dim"} /> : null}

            {ui.screen === "fight" && !ui.paused && ui.mode === "tutorial" ? (
              <TutorialCard ui={ui} top={hudBottom} maxW={Math.min(L.cw, size.w) - 8} />
            ) : null}

            <div
              ref={screenRef}
              className="fl-layer"
              style={{ top: `${L.barH}px`, bottom: "0px", pointerEvents: menuVisible ? "auto" : "none" }}
            >
              <MenuScreen ui={ui} />
            </div>

            {showTouch ? (
              <TouchControls
                state={app.touchState}
                placement={L.controls === "below" ? "below" : "overlay"}
                height={L.controls === "below" ? L.controlsH : Math.min(200, size.h)}
                blockLabel={s.touchButtons.block}
                dodgeLabel={s.touchButtons.dodge}
                rotateHint={L.portrait ? s.rotate : null}
              />
            ) : null}

            <div className="fl-corner fl-corner-l">
              <CornerButton label={s.exit} icon="exit" onClick={onExit} />
            </div>
            <div className="fl-corner fl-corner-r">
              {fightActive && ui.mode === "tutorial" ? (
                <FlButton label={s.tutorial.skip} small onClick={() => app.skipTutorial()} />
              ) : null}
              {fightActive ? (
                <CornerButton label={s.pause} icon="pause" onClick={() => app.pause()} />
              ) : (
                <CornerButton
                  label={`${s.sound}: ${ui.settings.sound ? s.on : s.off}`}
                  icon={ui.settings.sound ? "sound" : "mute"}
                  onClick={() => app.updateSettings({ sound: !ui.settings.sound })}
                />
              )}
            </div>
          </div>
        </StageSizeContext.Provider>
      </UiScaleContext.Provider>
    </AppContext.Provider>
  );
}
