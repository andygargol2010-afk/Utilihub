// Adaptive render resolution: when the frame rate stays low, step the renderer pixel ratio down
// (2 -> 1.5 -> 1 -> 0.75) so phones and weak GPUs stay interactive. Never steps back up (avoids flicker).
const STEPS = [2, 1.5, 1, 0.75];
const WINDOW_MS = 2500;
const LOW_FPS = 28;

export type AdaptiveQuality = {
  /** Call once per rendered frame; returns the new pixel ratio when it should change, else null. */
  tick: (now: number) => number | null;
};

export function createAdaptiveQuality(initialRatio: number): AdaptiveQuality {
  let idx = 0;
  while (idx < STEPS.length - 1 && STEPS[idx] > initialRatio) idx++;
  let frames = 0;
  let start = 0;
  let skip = 20; // ignore warm-up frames (shader compile, texture upload)
  return {
    tick(now) {
      if (skip > 0) {
        skip--;
        start = now;
        return null;
      }
      frames++;
      const dt = now - start;
      if (dt < WINDOW_MS) return null;
      const fps = (frames * 1000) / dt;
      frames = 0;
      start = now;
      if (fps < LOW_FPS && idx < STEPS.length - 1) {
        idx++;
        skip = 5;
        return STEPS[idx];
      }
      return null;
    },
  };
}
