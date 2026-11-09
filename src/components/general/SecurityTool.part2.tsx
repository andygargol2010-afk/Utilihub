// Part 2 of 3 — split from SecurityTool.tsx on 2026-11-04. Edit here; SecurityTool.tsx re-exports.

export const entropy = (text: string) => {
  let pool = 0;
  if (/[a-z]/.test(text)) pool += 26;
  if (/[A-Z]/.test(text)) pool += 26;
  if (/[0-9]/.test(text)) pool += 10;
  if (/[^A-Za-z0-9]/.test(text)) pool += 33;
  return pool ? text.length * Math.log2(pool) : 0;
};
export const secureRandomInt = (max: number) => {
  if (!Number.isInteger(max) || max <= 0) throw new Error("Invalid random range.");
  const range = max;
  const limit = Math.floor(0x100000000 / range) * range;
  const buf = new Uint32Array(1);
  do {
    crypto.getRandomValues(buf);
  } while (buf[0] >= limit);
  return buf[0] % range;
};
