// Part 2 of 3 — split from ColorCascadeFusionGame.tsx on 2026-11-04. Edit here; ColorCascadeFusionGame.tsx re-exports.

export const H = 520;
export const COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#a855f7"];
export const ORB_R = 18;
export const COMBO_WINDOW_MS = 2800;

export type Power = "none" | "bomb" | "freeze" | "multi";
export type Orb = { id: number; x: number; y: number; vy: number; color: string; size: number; fused: boolean; power: Power };
export type Particle = { x: number; y: number; vx: number; vy: number; life: number; color: string };
export type ScorePopup = { x: number; y: number; text: string; life: number; color: string };

export function playTone(ctx: AudioContext, freq: number, dur: number, type: OscillatorType = "sine", vol = 0.12) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  gain.gain.setValueAtTime(vol, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + dur);
}
