// Part 1 of 3 — split from GeneratorTool.tsx on 2026-11-04. Edit here; GeneratorTool.tsx re-exports.

export const randomInt = (min: number, max: number) => {
  if (!Number.isInteger(min) || !Number.isInteger(max) || min > max) throw new Error("Invalid random range.");
  const range = max - min + 1;
  if (range > 0xffffffff) throw new Error("Range too large.");
  const limit = Math.floor(0x100000000 / range) * range;
  const buf = new Uint32Array(1);
  do {
    crypto.getRandomValues(buf);
  } while (buf[0] >= limit);
  return min + (buf[0] % range);
};
export const randomChars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
export const makeCode = (length: number) => Array.from({ length }, () => randomChars[randomInt(0, randomChars.length - 1)]).join("");
export const shuffle = <T,>(items: T[]) => {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = randomInt(0, i);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};
