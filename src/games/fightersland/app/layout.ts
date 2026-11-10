/**
 * Stage layout: where the 384x216 canvas goes, how big the pixel UI is, and where the touch
 * controls sit, for a given stage size.
 */
import { VIEW_H, VIEW_W } from "../core/constants";

export interface StageLayout {
  /** Canvas rectangle in stage CSS px. */
  cx: number;
  cy: number;
  cw: number;
  ch: number;
  /** Canvas pixels per logical pixel. */
  scale: number;
  /** Integer scale for the DOM pixel UI (PixelText). */
  ui: number;
  portrait: boolean;
  /** Touch controls placement. */
  controls: "none" | "below" | "overlay";
  /** Height of the band reserved for the controls below the canvas (portrait touch). */
  controlsH: number;
  /** Height of the top band reserved for the stage buttons (0 = they float over the letterbox). */
  barH: number;
}

const BAR = 44;

/** Largest integer scale when it fills at least 82 % of the space, otherwise fractional. */
export function fitScale(aw: number, ah: number): number {
  const s = Math.max(0.25, Math.min(aw / VIEW_W, ah / VIEW_H));
  const i = Math.floor(s);
  if (i >= 1 && i / s >= 0.82) return i;
  return s;
}

export function computeLayout(w: number, h: number, touch: boolean, fight: boolean): StageLayout {
  const W = Math.max(1, w);
  const H = Math.max(1, h);
  const portrait = H > W * 1.1;
  const ui = Math.max(2, Math.min(5, Math.floor(Math.min(W / 400, H / 220))));
  let barH = 0;
  let controls: StageLayout["controls"] = "none";
  let controlsH = 0;
  let aw = W;
  let ah = H;
  let top = 0;

  if (touch && portrait) {
    // canvas right under the button bar, every remaining pixel goes to the controls
    barH = BAR;
    controls = "below";
    top = barH;
    const minControls = 210;
    const sc = fitScale(W, Math.max(60, H - barH - minControls));
    const chp = Math.round(VIEW_H * sc);
    ah = chp;
    controlsH = Math.max(minControls, H - barH - chp);
  } else if (touch) {
    controls = "overlay";
  } else {
    // keep room for the corner buttons when the letterbox is too thin for them
    const s0 = fitScale(W, H);
    const sideGap = (W - VIEW_W * s0) / 2;
    const topGap = (H - VIEW_H * s0) / 2;
    if (sideGap < 56 && topGap < BAR) {
      barH = BAR;
      top = barH;
      ah = Math.max(60, H - barH * 2);
    }
  }

  const scale = fitScale(aw, ah);
  const cw = Math.round(VIEW_W * scale);
  const ch = Math.round(VIEW_H * scale);
  const cx = Math.round((W - cw) / 2);
  const cy = Math.round(top + (ah - ch) / 2);

  if (!fight) {
    // menus: the canvas becomes a full-bleed animated backdrop
    const cover = Math.max(W / VIEW_W, H / VIEW_H);
    const bw = Math.ceil(VIEW_W * cover);
    const bh = Math.ceil(VIEW_H * cover);
    return {
      cx: Math.round((W - bw) / 2),
      cy: Math.round((H - bh) / 2),
      cw: bw,
      ch: bh,
      scale: cover,
      ui,
      portrait,
      controls: "none",
      controlsH: 0,
      barH,
    };
  }
  return { cx, cy, cw, ch, scale, ui, portrait, controls, controlsH, barH };
}
