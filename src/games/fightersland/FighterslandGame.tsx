/**
 * Fightersland root component.
 *
 * The server renders an inline poster card. After mount the game opens a fixed stage that
 * covers the viewport below the site header and locks page scroll; the exit button collapses
 * it back to the poster, whose Play button opens it again.
 */
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Locale } from "./core/types";
import { GameApp } from "./app/game";
import { getStrings } from "./i18n";
import { drawMapThumb, drawSprite } from "./render/menuArt";
import { getPreviewSprite } from "./render/fighters/index";
import { FL_CSS } from "./ui/styles";
import { PixelText, UiScaleContext } from "./ui/PixelText";
import { Stage } from "./ui/Stage";

const POSTER_W = 384;
const POSTER_H = 216;

function PosterArt() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useLayoutEffect(() => {
    const c = ref.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    ctx.imageSmoothingEnabled = false;
    drawMapThumb(ctx, "quay", POSTER_W, POSTER_H);
    drawSprite(ctx, getPreviewSprite("asagiri", "idle", 0), 150, 190, { scale: 1 });
    drawSprite(ctx, getPreviewSprite("grimvald", "idle", 6), 234, 190, { scale: 1, flip: true });
  }, []);
  return <canvas ref={ref} className="fl-px fl-poster-art" width={POSTER_W} height={POSTER_H} aria-hidden="true" />;
}

function lockScroll(): () => void {
  const html = document.documentElement;
  const body = document.body;
  const prev = { html: html.style.overflow, body: body.style.overflow, touch: body.style.touchAction };
  html.style.overflow = "hidden";
  body.style.overflow = "hidden";
  body.style.touchAction = "none";
  return () => {
    html.style.overflow = prev.html;
    body.style.overflow = prev.body;
    body.style.touchAction = prev.touch;
  };
}

export function FighterslandGame({ locale = "en" }: { locale?: Locale }) {
  const [app] = useState(() => new GameApp(locale));
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const playRef = useRef<HTMLButtonElement | null>(null);
  const s = getStrings(locale);

  useEffect(() => {
    app.init();
    setMounted(true);
    setOpen(true);
    return () => app.dispose();
  }, [app]);

  useEffect(() => {
    if (!open) return undefined;
    return lockScroll();
  }, [open]);

  return (
    <div className="fl-root">
      <style>{FL_CSS}</style>
      <UiScaleContext.Provider value={2}>
        <div className="fl-poster">
          {mounted ? <PosterArt /> : null}
          <div className="fl-poster-shade" />
          <div className="fl-poster-body">
            <PixelText text="FIGHTERSLAND" size={2} color="#f5c84a" shadow="#5a1626" label="Fightersland" />
            <PixelText text={s.poster.tagline} color="#e8dcc8" wrap={180} align="center" />
            <button
              ref={playRef}
              type="button"
              className="fl-btn fl-btn-primary"
              aria-label={s.poster.play}
              onClick={() => {
                app.audio.unlock();
                setOpen(true);
              }}
            >
              <PixelText text={s.poster.play} size={1.5} />
            </button>
            <PixelText text={s.poster.hint} color="#9a8fb8" wrap={180} align="center" />
          </div>
        </div>
      </UiScaleContext.Provider>
      {mounted && open
        ? createPortal(
            <Stage
              app={app}
              onExit={() => {
                setOpen(false);
                requestAnimationFrame(() => playRef.current?.focus({ preventScroll: true }));
              }}
            />,
            document.body,
          )
        : null}
    </div>
  );
}
